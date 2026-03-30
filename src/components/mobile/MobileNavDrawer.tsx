import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessOwnership } from '@/hooks/useBusinessOwnership';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DonateButton } from '@/components/common/DonateButton';
import { 
  Menu,
  X,
  Plus, 
  Calendar, 
  Building, 
  Newspaper, 
  User, 
  LogOut, 
  Settings,
  MessageCircle,
  FileText,
  HelpCircle,
  Home,
  Heart,
  Info,
  Shield,
  ScrollText
} from 'lucide-react';

export const MobileNavDrawer = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { ownedBusinesses } = useBusinessOwnership();
  const location = useLocation();
  const { t } = useTranslation();
  const hasOwnedBusinesses = ownedBusinesses && ownedBusinesses.length > 0;

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <Link to="/" onClick={handleLinkClick} className="flex items-center">
              <img 
                src="/lovable-uploads/76a583e0-eef3-4167-a87b-ed0504940bdc.png" 
                alt="HubVillage Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive('/') ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              {t('navigation.backToHome')}
            </Link>

            <Link
              to="/news-page"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive('/news-page') ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`}
            >
              <Newspaper className="h-5 w-5 mr-3" />
              {t('navigation.news', 'Culture')}
            </Link>

            <Link
              to="/faq"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive('/faq') ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              FAQ
            </Link>

            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive('/about') ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`}
            >
              <Info className="h-5 w-5 mr-3" />
              {t('navigation.about', 'About')}
            </Link>

            {/* Legal Links */}
            <div className="pt-4 border-t mt-4">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('footer.quickLinks', 'Quick Links')}
              </p>
              <Link
                to="/terms"
                onClick={handleLinkClick}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <ScrollText className="h-4 w-4 mr-3" />
                {t('legal.termsTitle', 'Terms of Service')}
              </Link>
              <Link
                to="/privacy"
                onClick={handleLinkClick}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 mr-3" />
                {t('legal.privacyTitle', 'Privacy Policy')}
              </Link>
            </div>

            {/* Submit Section */}
            {user && (
              <div className="pt-4 border-t mt-4">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Submit Content
                </p>
                <Link
                  to="/submit-event"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-3 text-logo-bright-orange" />
                  {t('navigation.submitEvent')}
                </Link>
                <Link
                  to="/submit-business"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Building className="h-4 w-4 mr-3 text-logo-bright-orange" />
                  {t('navigation.submitBusiness')}
                </Link>
                <Link
                  to="/submit-news"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Newspaper className="h-4 w-4 mr-3 text-logo-bright-orange" />
                  {t('navigation.submitNews', 'Submit Culture')}
                </Link>
                <Link
                  to="/submit-local-resource"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Heart className="h-4 w-4 mr-3 text-logo-bright-orange" />
                  {t('navigation.submitLocalService')}
                </Link>
              </div>
            )}

            {/* Account Section */}
            {user && (
              <div className="pt-4 border-t mt-4">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </p>
                <Link
                  to={`/user/${user.id}`}
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  My Profile
                </Link>
                <Link
                  to="/contact-admin"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-3" />
                  {t('navigation.contactAdmin')}
                </Link>
                <Link
                  to="/my-messages"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-3" />
                  {t('navigation.myMessages')}
                </Link>
                <Link
                  to="/my-submissions"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  {t('navigation.mySubmissions')}
                </Link>
                {hasOwnedBusinesses && (
                  <Link
                    to="/business-dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Building className="h-4 w-4 mr-3" />
                    {t('navigation.businessDashboard')}
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    {t('navigation.adminDashboard')}
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Language</span>
              <LanguageSelector />
            </div>
            
            <DonateButton className="w-full" />
            
            {user ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('navigation.signOut')}
              </Button>
            ) : (
              <Link to="/auth" onClick={handleLinkClick}>
                <Button className="w-full">
                  {t('navigation.signIn')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
