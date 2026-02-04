import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DonateButton } from './DonateButton';
import { Heart, Mail, HelpCircle, Newspaper } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/76a583e0-eef3-4167-a87b-ed0504940bdc.png" 
                alt="HubVillage Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline', 'Connecting communities, one neighborhood at a time.')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news-page" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <Newspaper className="h-4 w-4 mr-2" />
                  {t('navigation.news', 'News')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {t('navigation.faq', 'FAQ')}
                </Link>
              </li>
              <li>
                <Link to="/contact-admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('navigation.contactAdmin', 'Contact Us')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Us */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.supportUs', 'Support Us')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.supportMessage', 'Help us keep this community resource running.')}
            </p>
            <DonateButton size="sm" />
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.contact', 'Contact')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.contactMessage', 'Have questions or suggestions? We\'d love to hear from you.')}
            </p>
            <Link 
              to="/contact-admin" 
              className="text-sm text-logo-vibrant-blue hover:underline"
            >
              {t('footer.getInTouch', 'Get in touch →')}
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} HubVillage. {t('footer.allRightsReserved', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground flex items-center">
              {t('footer.madeWith', 'Made with')} <Heart className="h-4 w-4 mx-1 text-logo-coral-orange" /> {t('footer.forCommunity', 'for the community')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
