
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Lock, User, Calendar, Check, X, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cleanupAuthState } from '@/utils/authCleanup';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation helpers
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
    
    return {
      hasMinLength,
      hasUppercase,
      hasSymbol,
      isValid: hasMinLength && hasUppercase && hasSymbol
    };
  };

  const passwordValidation = validatePassword(password);

  useEffect(() => {
    // Check if user is already logged in and session is valid
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          navigate('/');
          return;
        }
        // Stale/invalid session - clean it up
        cleanupAuthState();
      }
    };
    checkUser();
  }, [navigate]);


  // Ensure we have a valid recovery session when arriving from email link
  const ensureRecoverySessionFromUrl = async () => {
    try {
      console.log('🔐 Checking for recovery tokens in URL...');
      const hash = window.location.hash.replace('#', '');
      const hashParams = new URLSearchParams(hash);
      const params = new URLSearchParams(window.location.search);
      
      // Check for recovery tokens in hash (most common) or query params
      const access_token = hashParams.get('access_token') || params.get('access_token');
      const refresh_token = hashParams.get('refresh_token') || params.get('refresh_token');
      const type = hashParams.get('type') || params.get('type');
      
      console.log('🔐 Found tokens:', { access_token: !!access_token, refresh_token: !!refresh_token, type });
      
      if (access_token && refresh_token && type === 'recovery') {
        console.log('🔐 Setting recovery session...');
        const { data, error } = await supabase.auth.setSession({ 
          access_token, 
          refresh_token 
        });
        if (error) {
          console.error('❌ Session setup failed:', error);
          throw error;
        }
        console.log('✅ Recovery session established:', data.session?.user?.email);
        
        // Clear the hash to clean up the URL
        window.history.replaceState({}, document.title, '/auth?tab=reset-password');
        setActiveTab('reset-password');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Recovery session setup failed:', error);
      return false;
    }
  };

  // Listen for auth events and handle recovery on page load
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth event:', event, session?.user?.email);
      if (event === 'PASSWORD_RECOVERY' || event === 'TOKEN_REFRESHED') {
        console.log('🔐 Password recovery event detected, switching to reset tab');
        setActiveTab('reset-password');
      }
    });
    
    // Check for recovery tokens immediately on component mount
    const checkRecoveryOnLoad = async () => {
      const recoveryDetected = await ensureRecoverySessionFromUrl();
      if (!recoveryDetected) {
        // Check if we're already on a recovery-related tab from URL params
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam && ['signin', 'signup', 'recovery', 'reset-password'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      }
    };
    
    checkRecoveryOnLoad();
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password complexity
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    const attemptSignUp = async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      if (data.user) {
        toast.success('Account created successfully! You can now sign in.');
        setEmail('');
        setPassword('');
        setFullName('');
      }
    };

    try {
      await attemptSignUp();
    } catch (error: any) {
      const msg = (error?.message || '').toLowerCase();
      // If email already registered, try freeing orphaned auth user then retry
      if (msg.includes('already') && (msg.includes('registered') || msg.includes('exists'))) {
        try {
          toast.message('Email already registered. Checking for orphaned account...');
          // Clean up any stale auth state and sign out globally
          try { cleanupAuthState(); await supabase.auth.signOut({ scope: 'global' }); } catch {}

          const { data: fnData, error: fnError } = await supabase.functions.invoke('allow-reregister', {
            body: { email },
          });

          if (fnError) {
            throw new Error(fnError.message || 'Failed to check orphaned account');
          }

          if (fnData?.action === 'deleted') {
            toast.success('Previous orphaned account removed. Please complete sign up again.');
            await attemptSignUp();
          } else {
            throw new Error('An account already exists for this email. Try Sign In or Reset Password.');
          }
        } catch (innerErr: any) {
          setError(innerErr.message);
          toast.error(innerErr.message);
        }
      } else {
        setError(error.message);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean up any stale auth state before signing in
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch {}

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Welcome back!');
        // Hard refresh to avoid limbo states
        window.location.href = '/';
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setError('');

    try {
      // Use our custom edge function for sending password reset emails
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: { email: recoveryEmail }
      });

      if (error) throw error;

      toast.success('Password reset email sent! Check your inbox.');
      setRecoveryEmail('');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetting(true);
    setError('');

    const resetValidation = validatePassword(newPassword);
    if (!resetValidation.isValid) {
      const msg = 'Password does not meet requirements';
      setError(msg);
      toast.error(msg);
      setResetting(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      const msg = 'Passwords do not match';
      setError(msg);
      toast.error(msg);
      setResetting(false);
      return;
    }

    try {
      console.log('🔐 Starting password reset...');
      
      // Check current session first
      let { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 Current session:', session?.user?.email || 'none');
      
      if (!session) {
        console.log('🔐 No session found, attempting recovery from URL...');
        const recoverySuccess = await ensureRecoverySessionFromUrl();
        if (recoverySuccess) {
          ({ data: { session } } = await supabase.auth.getSession());
          console.log('🔐 Recovery session established:', session?.user?.email || 'failed');
        }
      }
      
      if (!session) {
        const errorMsg = 'Auth session missing. Please click the password reset link from your email again.';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('🔐 Updating password for user:', session.user.email);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success('Password updated. You can now sign in.');
      setNewPassword('');
      setConfirmNewPassword('');
      // Clear URL params/hash and go to Sign In
      window.history.replaceState({}, document.title, window.location.pathname);
      setActiveTab('signin');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setResetting(false);
    }
  };

  const handleForgotUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setError('');

    try {
      // Call edge function to send username recovery email
      const { error } = await supabase.functions.invoke('recover-username', {
        body: { email: recoveryEmail }
      });

      if (error) throw error;

      toast.success('If an account exists with this email, we\'ve sent your username.');
      setRecoveryEmail('');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yelp-light-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 yelp-gradient rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-yelp-gray">
              HubVillage
            </h1>
          </div>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${activeTab === 'reset-password' ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              {activeTab === 'reset-password' && (
                <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                 <Button
                  type="submit"
                  className="w-full yelp-gradient hover:opacity-90 text-white"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setActiveTab('recovery')}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
            </TabsContent>
            

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password requirements */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      {passwordValidation.hasMinLength ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={passwordValidation.hasMinLength ? 'text-green-700' : 'text-red-600'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.hasUppercase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={passwordValidation.hasUppercase ? 'text-green-700' : 'text-red-600'}>
                        At least one uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.hasSymbol ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={passwordValidation.hasSymbol ? 'text-green-700' : 'text-red-600'}>
                        At least one symbol (!@#$%^&* etc.)
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full yelp-gradient hover:opacity-90 text-white"
                  disabled={loading || !passwordValidation.isValid}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="recovery">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Reset Your Password</h3>
                  <p className="text-sm text-gray-600">
                    Enter your email address and we'll send you a secure link to reset your password.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recovery-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="recovery-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full yelp-gradient hover:opacity-90 text-white"
                  disabled={recoveryLoading}
                >
                  {recoveryLoading ? 'Sending...' : 'Send Password Reset'}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setActiveTab('signin')}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="reset-password">
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Reset Your Password</h3>
                  <p className="text-sm text-gray-600">
                    Enter your new password below
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="new-password"
                      type={showResetPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showResetPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password requirements for reset */}
                  {newPassword && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        {validatePassword(newPassword).hasMinLength ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={validatePassword(newPassword).hasMinLength ? 'text-green-700' : 'text-red-600'}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {validatePassword(newPassword).hasUppercase ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={validatePassword(newPassword).hasUppercase ? 'text-green-700' : 'text-red-600'}>
                          At least one uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {validatePassword(newPassword).hasSymbol ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={validatePassword(newPassword).hasSymbol ? 'text-green-700' : 'text-red-600'}>
                          At least one symbol (!@#$%^&* etc.)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full yelp-gradient hover:opacity-90 text-white"
                  disabled={resetting || !validatePassword(newPassword).isValid || newPassword !== confirmNewPassword}
                >
                  {resetting ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
