import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useAdminPendingCounts } from '@/hooks/useAdminPendingCounts';
import { useBusinessOwnership } from '@/hooks/useBusinessOwnership';
import { AdminPendingBadge } from '@/components/admin/AdminPendingBadge';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { DonateButton } from '@/components/common/DonateButton';
import { WeeklyEmailModal } from '@/components/common/WeeklyEmailModal';
import { MobileNavDrawer } from '@/components/mobile/MobileNavDrawer';
import {
  Plus,
  Calendar,
  Building,
  Newspaper,
  User,
  LogOut,
  Settings,
  Bird,
  MessageCircle,
  ArrowLeft,
  FileText,
  HelpCircle,
  Mail,
  Sparkles,
} from 'lucide-react';
import { OPEN_ONBOARDING_EVENT } from '@/constants/appEvents';
import { BRAND_LOGO_SRC } from '@/constants/brand';

export const Navigation = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { total: adminPendingTotal } = useAdminPendingCounts();
  const { ownedBusinesses } = useBusinessOwnership();
  const location = useLocation();
  const { t } = useTranslation();
  const isHomePage = location.pathname === '/';
  const hasOwnedBusinesses = ownedBusinesses && ownedBusinesses.length > 0;

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <MobileNavDrawer />

            <Link to="/" className="flex items-center shrink-0">
              <img
                src={BRAND_LOGO_SRC}
                alt="HubVillage Logo"
                className="h-7 w-auto sm:h-9 md:h-10 max-w-[7.5rem] sm:max-w-none object-contain"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1 xl:gap-3 min-w-0 ml-1">
              {!isHomePage && (
                <>
                  <Link
                    to="/"
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap px-2 py-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5 shrink-0" />
                    {t('navigation.backToHome')}
                  </Link>
                  <div className="h-5 w-px bg-border shrink-0" aria-hidden />
                </>
              )}

              <Link
                to="/news-page"
                className="flex items-center text-gray-700 hover:text-caribbean-teal transition-colors font-medium text-sm whitespace-nowrap px-2 py-1"
              >
                <Newspaper className="h-4 w-4 mr-1.5 shrink-0" />
                {t('navigation.news', 'Culture')}
              </Link>

              <Link
                to="/faq"
                className="flex items-center text-gray-700 hover:text-caribbean-teal transition-colors font-medium text-sm whitespace-nowrap px-2 py-1"
              >
                <HelpCircle className="h-4 w-4 mr-1.5 shrink-0" />
                {t('navigation.faq')}
              </Link>

              <Button
                type="button"
                variant="ghost"
                className="flex items-center text-gray-700 hover:text-caribbean-teal font-medium h-9 px-2 text-sm whitespace-nowrap"
                onClick={() => window.dispatchEvent(new Event(OPEN_ONBOARDING_EVENT))}
              >
                <Sparkles className="h-4 w-4 mr-1.5 shrink-0" />
                <span className="hidden xl:inline">{t('navigation.firstTimeQuestion')}</span>
                <span className="xl:hidden">{t('navigation.firstTimeShort', 'New here?')}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <DonateButton size="sm" className="hidden lg:flex" />
            <WeeklyEmailModal
              trigger={
                <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-1.5 h-9">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="hidden xl:inline">{t('navigation.weeklyEmail', 'Weekly Email')}</span>
                </Button>
              }
            />
            {user && (
              <div className="shrink-0">
                <NotificationBell />
              </div>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-logo-bright-orange hover:bg-logo-bright-orange/90 text-white h-9 w-9 sm:w-auto sm:px-3 p-0 sm:py-2 shrink-0"
                    aria-label={t('navigation.submit')}
                  >
                    <Plus className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline text-xs sm:text-sm">{t('navigation.submit')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild data-tour="submit-event">
                    <Link to="/submit-event" className="cursor-pointer">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('navigation.submitEvent')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-tour="submit-business">
                    <Link to="/submit-business" className="cursor-pointer">
                      <Building className="h-4 w-4 mr-2" />
                      {t('navigation.submitBusiness')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/submit-news" className="cursor-pointer">
                      <Newspaper className="h-4 w-4 mr-2" />
                      {t('navigation.submitNews', 'Submit Culture')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-tour="submit-resource">
                    <Link to="/submit-local-resource" className="cursor-pointer">
                      <Bird className="h-4 w-4 mr-2" />
                      {t('navigation.submitLocalService')}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-logo-bright-orange hover:bg-logo-bright-orange/90 text-white h-9 w-9 sm:w-auto sm:px-3 p-0 sm:py-2 shadow-md shrink-0"
              >
                <Link to="/auth" data-guest-submit-target="submit" aria-label={t('navigation.submit')}>
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline text-xs sm:text-sm">{t('navigation.submit')}</span>
                </Link>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 sm:w-auto sm:px-2 p-0 shrink-0"
                    aria-label={t('navigation.account', 'Account')}
                  >
                    <User className="h-4 w-4 sm:mr-1" />
                    <span className="hidden lg:inline text-sm">{t('navigation.account', 'Account')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={`/user/${user.id}`} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/contact-admin" className="cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('navigation.contactAdmin')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-messages" className="cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('navigation.myMessages')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-submissions" className="cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('navigation.mySubmissions')}
                    </Link>
                  </DropdownMenuItem>
                  {hasOwnedBusinesses && (
                    <DropdownMenuItem asChild>
                      <Link to="/business-dashboard" className="cursor-pointer">
                        <Building className="h-4 w-4 mr-2" />
                        {t('navigation.businessDashboard')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          {t('navigation.adminDashboard')}
                          {adminPendingTotal > 0 ? (
                            <AdminPendingBadge count={adminPendingTotal} />
                          ) : (
                            <Badge variant="secondary" className="ml-2">
                              Admin
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('navigation.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="shrink-0">
                <Button variant="outline" size="sm" className="h-9 w-9 sm:w-auto sm:px-3 p-0 sm:py-2">
                  <User className="h-4 w-4 sm:hidden" aria-hidden />
                  <span className="hidden sm:inline text-xs sm:text-sm">{t('navigation.signIn')}</span>
                  <span className="sr-only sm:hidden">{t('navigation.signIn')}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
