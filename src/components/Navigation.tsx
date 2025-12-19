
import { useState } from 'react';
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
import { useBusinessOwnership } from '@/hooks/useBusinessOwnership';
import { LanguageSelector } from '@/components/LanguageSelector';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { 
  Plus, 
  Calendar, 
  Building, 
  Newspaper, 
  User, 
  LogOut, 
  Settings,
  CheckSquare,
  Heart,
  MessageCircle,
  ArrowLeft,
  FileText,
  HelpCircle
} from 'lucide-react';

export const Navigation = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { ownedBusinesses } = useBusinessOwnership();
  const location = useLocation();
  const { t } = useTranslation();
  const isHomePage = location.pathname === '/';
  const hasOwnedBusinesses = ownedBusinesses && ownedBusinesses.length > 0;

  return (
    <nav className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/76a583e0-eef3-4167-a87b-ed0504940bdc.png" 
                alt="HubVillage Logo" 
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
            
            {/* Back to Home Button - Hidden on home page */}
            {!isHomePage && (
              <Link 
                to="/" 
                className="hidden sm:flex items-center text-gray-700 hover:text-caribbean-teal transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">{t('navigation.backToHome')}</span>
                <span className="sm:inline md:hidden">Back</span>
              </Link>
            )}
            
            {/* News Page Link */}
            <Link 
              to="/news-page" 
              className="flex items-center text-gray-700 hover:text-caribbean-teal transition-colors font-medium"
            >
              <Newspaper className="h-4 w-4 mr-2" />
              {t('navigation.news')}
            </Link>
            
            {/* FAQ Link */}
            <Link 
              to="/faq" 
              className="flex items-center text-gray-700 hover:text-caribbean-teal transition-colors font-medium"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* <LanguageSelector /> */}
            {user && <NotificationBell />}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-logo-bright-orange hover:bg-logo-bright-orange/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('navigation.submit')}
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
                        {t('navigation.submitNews')}
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuItem asChild data-tour="submit-resource">
                     <Link to="/submit-local-resource" className="cursor-pointer">
                        <Heart className="h-4 w-4 mr-2" />
                        {t('navigation.submitLocalService')}
                     </Link>
                   </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                   <div className="px-3 py-2 border-b">
                     <p className="text-sm font-medium text-gray-900">{user.user_metadata?.full_name || user.user_metadata?.name || 'User'}</p>
                     <p className="text-xs text-gray-500">{user.email}</p>
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
                        <Link to="/admin" className="cursor-pointer">
                           <Settings className="h-4 w-4 mr-2" />
                           {t('navigation.adminDashboard')}
                          <Badge variant="secondary" className="ml-2">Admin</Badge>
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
              <Link to="/auth">
                <Button variant="outline">{t('navigation.signIn')}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
