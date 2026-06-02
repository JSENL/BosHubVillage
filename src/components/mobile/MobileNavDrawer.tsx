import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminPendingCounts } from '@/hooks/useAdminPendingCounts';
import { useBusinessOwnership } from '@/hooks/useBusinessOwnership';
import { AdminPendingBadge } from '@/components/admin/AdminPendingBadge';
import { DonateButton } from '@/components/common/DonateButton';
import { WeeklyEmailModal } from '@/components/common/WeeklyEmailModal';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import {
  Menu,
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
  Bird,
  Info,
  Shield,
  ScrollText,
  Sparkles,
  Mail,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { OPEN_ONBOARDING_EVENT } from '@/constants/appEvents';
import { BRAND_LOGO_SRC } from '@/constants/brand';

const linkClass = (active: boolean) =>
  `flex items-center min-h-[44px] px-3 py-2.5 rounded-lg transition-colors text-sm ${
    active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
  }`;

export const MobileNavDrawer = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { total: adminPendingTotal } = useAdminPendingCounts();
  const { ownedBusinesses } = useBusinessOwnership();
  const location = useLocation();
  const { t } = useTranslation();
  const hasOwnedBusinesses = ownedBusinesses && ownedBusinesses.length > 0;
  const isHomePage = location.pathname === '/';

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setOpen(false);
  };

  const isActive = (path: string) =>
    path === '/search' ? location.pathname.startsWith('/search') : location.pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 lg:hidden"
          aria-label={t('navigation.openMenu', 'Open menu')}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[min(100vw,20rem)] flex-col gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="shrink-0 space-y-0 border-b px-4 py-3 text-left">
          <SheetTitle className="flex items-center justify-between gap-2">
            <Link to="/" onClick={handleLinkClick} className="flex items-center">
              <img src={BRAND_LOGO_SRC} alt="HubVillage Logo" className="h-8 w-auto" />
            </Link>
            {user && (
              <div className="flex items-center gap-1">
                <NotificationBell />
              </div>
            )}
          </SheetTitle>
          {user && (
            <p className="truncate text-xs text-muted-foreground pt-1">{user.email}</p>
          )}
        </SheetHeader>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-1">
          {!isHomePage && (
            <Link to="/" onClick={handleLinkClick} className={linkClass(false)}>
              <ArrowLeft className="h-5 w-5 mr-3 shrink-0" />
              {t('navigation.backToHome')}
            </Link>
          )}

          <Link to="/" onClick={handleLinkClick} className={linkClass(isActive('/'))}>
            <Home className="h-5 w-5 mr-3 shrink-0" />
            {t('navigation.home', 'Home')}
          </Link>

          <Link to="/news-page" onClick={handleLinkClick} className={linkClass(isActive('/news-page'))}>
            <Newspaper className="h-5 w-5 mr-3 shrink-0" />
            {t('navigation.news', 'Culture')}
          </Link>

          <Link to="/search" onClick={handleLinkClick} className={linkClass(isActive('/search'))}>
            <Search className="h-5 w-5 mr-3 shrink-0" />
            {t('navigation.search', 'Search')}
          </Link>

          <Link to="/faq" onClick={handleLinkClick} className={linkClass(isActive('/faq'))}>
            <HelpCircle className="h-5 w-5 mr-3 shrink-0" />
            {t('navigation.faq')}
          </Link>

          <Button
            type="button"
            variant="ghost"
            className={`w-full justify-start min-h-[44px] px-3 py-2.5 h-auto font-normal text-left text-sm ${linkClass(false)}`}
            onClick={() => {
              window.dispatchEvent(new Event(OPEN_ONBOARDING_EVENT));
              setOpen(false);
            }}
          >
            <Sparkles className="h-5 w-5 mr-3 shrink-0" />
            <span className="text-left leading-snug">{t('navigation.firstTimeQuestion')}</span>
          </Button>

          <Link to="/about" onClick={handleLinkClick} className={linkClass(isActive('/about'))}>
            <Info className="h-5 w-5 mr-3 shrink-0" />
            {t('navigation.about', 'About')}
          </Link>

          <div className="pt-3 mt-2 border-t space-y-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('footer.quickLinks', 'Quick Links')}
            </p>
            <Link to="/terms" onClick={handleLinkClick} className={linkClass(isActive('/terms'))}>
              <ScrollText className="h-4 w-4 mr-3 shrink-0" />
              {t('legal.termsTitle', 'Terms of Service')}
            </Link>
            <Link to="/privacy" onClick={handleLinkClick} className={linkClass(isActive('/privacy'))}>
              <Shield className="h-4 w-4 mr-3 shrink-0" />
              {t('legal.privacyTitle', 'Privacy Policy')}
            </Link>
          </div>

          <div className="pt-3 mt-2 border-t space-y-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {user ? t('navigation.submit') : t('navigation.submit', 'Submit')}
            </p>
            {user ? (
              <>
                <Link to="/submit-event" onClick={handleLinkClick} className={linkClass(false)}>
                  <Calendar className="h-4 w-4 mr-3 shrink-0 text-logo-bright-orange" />
                  {t('navigation.submitEvent')}
                </Link>
                <Link to="/submit-business" onClick={handleLinkClick} className={linkClass(false)}>
                  <Building className="h-4 w-4 mr-3 shrink-0 text-logo-bright-orange" />
                  {t('navigation.submitBusiness')}
                </Link>
                <Link to="/submit-news" onClick={handleLinkClick} className={linkClass(false)}>
                  <Newspaper className="h-4 w-4 mr-3 shrink-0 text-logo-bright-orange" />
                  {t('navigation.submitNews', 'Submit Culture')}
                </Link>
                <Link to="/submit-local-resource" onClick={handleLinkClick} className={linkClass(false)}>
                  <Bird className="h-4 w-4 mr-3 shrink-0 text-logo-bright-orange" />
                  {t('navigation.submitLocalService')}
                </Link>
              </>
            ) : (
              <Link to="/auth" onClick={handleLinkClick} className={linkClass(false)}>
                <Plus className="h-4 w-4 mr-3 shrink-0 text-logo-bright-orange" />
                {t('navigation.signInToSubmit', 'Sign in to submit')}
              </Link>
            )}
          </div>

          {user && (
            <div className="pt-3 mt-2 border-t space-y-1">
              <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </p>
              <Link
                to={`/user/${user.id}`}
                onClick={handleLinkClick}
                className={linkClass(location.pathname === `/user/${user.id}`)}
              >
                <User className="h-4 w-4 mr-3 shrink-0" />
                My Profile
              </Link>
              <Link to="/contact-admin" onClick={handleLinkClick} className={linkClass(isActive('/contact-admin'))}>
                <MessageCircle className="h-4 w-4 mr-3 shrink-0" />
                {t('navigation.contactAdmin')}
              </Link>
              <Link to="/my-messages" onClick={handleLinkClick} className={linkClass(isActive('/my-messages'))}>
                <MessageCircle className="h-4 w-4 mr-3 shrink-0" />
                {t('navigation.myMessages')}
              </Link>
              <Link to="/my-submissions" onClick={handleLinkClick} className={linkClass(isActive('/my-submissions'))}>
                <FileText className="h-4 w-4 mr-3 shrink-0" />
                {t('navigation.mySubmissions')}
              </Link>
              {hasOwnedBusinesses && (
                <Link
                  to="/business-dashboard"
                  onClick={handleLinkClick}
                  className={linkClass(isActive('/business-dashboard'))}
                >
                  <Building className="h-4 w-4 mr-3 shrink-0" />
                  {t('navigation.businessDashboard')}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={handleLinkClick} className={linkClass(isActive('/admin'))}>
                  <Settings className="h-4 w-4 mr-3 shrink-0" />
                  <span className="flex-1">{t('navigation.adminDashboard')}</span>
                  <AdminPendingBadge count={adminPendingTotal} className="ml-auto" />
                </Link>
              )}
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t bg-muted/30 p-4 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <WeeklyEmailModal
            trigger={
              <Button variant="outline" className="w-full justify-start min-h-[44px]" type="button">
                <Mail className="h-4 w-4 mr-2 shrink-0" />
                {t('navigation.weeklyEmail', 'Weekly Email')}
              </Button>
            }
          />

          <DonateButton className="w-full min-h-[44px]" />

          {user ? (
            <Button
              variant="outline"
              className="w-full justify-start min-h-[44px]"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2 shrink-0" />
              {t('navigation.signOut')}
            </Button>
          ) : (
            <Link to="/auth" onClick={handleLinkClick} className="block">
              <Button className="w-full min-h-[44px]">{t('navigation.signIn')}</Button>
            </Link>
          )}
            </div>
      </SheetContent>
    </Sheet>
  );
};
