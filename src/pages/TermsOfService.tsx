import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TermsOfService = () => {
  const { t } = useTranslation();
  const lastUpdated = "February 5, 2026";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('legal.termsTitle', 'Terms of Service')}</h1>
        <p className="text-muted-foreground mb-6">{t('legal.lastUpdated', 'Last updated')}: {lastUpdated}</p>
        
        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[70vh] pr-4">
              <div className="prose prose-sm max-w-none space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.acceptance', '1. Acceptance of Terms')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.acceptanceText', 'By accessing and using HubVillage ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.description', '2. Description of Service')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.descriptionText', 'HubVillage is a community platform that connects neighbors through local events, businesses, news, and resources. We provide tools for community engagement and information sharing.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.userConduct', '3. User Conduct')}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t('legal.terms.userConductIntro', 'You agree to use the Platform only for lawful purposes. You shall not:')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('legal.terms.conduct1', 'Post false, misleading, or fraudulent content')}</li>
                    <li>{t('legal.terms.conduct2', 'Harass, abuse, or harm other users')}</li>
                    <li>{t('legal.terms.conduct3', 'Violate any applicable laws or regulations')}</li>
                    <li>{t('legal.terms.conduct4', 'Attempt to gain unauthorized access to the Platform')}</li>
                    <li>{t('legal.terms.conduct5', 'Use the Platform for spam or commercial solicitation without permission')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.userContent', '4. User-Generated Content')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.userContentText', 'You retain ownership of content you submit. By posting content, you grant HubVillage a non-exclusive, royalty-free license to use, display, and distribute your content on the Platform. You are solely responsible for the content you post.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.accounts', '5. User Accounts')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.accountsText', 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.disclaimer', '6. Disclaimer of Warranties')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.disclaimerText', 'The Platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any content posted by users or third parties. We are not responsible for events, businesses, or services listed on the Platform.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.liability', '7. Limitation of Liability')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.liabilityText', 'HubVillage shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid us, if any, in the past twelve months.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.modifications', '8. Modifications to Terms')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.modificationsText', 'We reserve the right to modify these terms at any time. We will notify users of significant changes. Your continued use of the Platform after changes constitutes acceptance of the new terms.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.terms.contact', '9. Contact Information')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.terms.contactText', 'For questions about these Terms of Service, please contact us through our Contact page or email us directly.')}
                  </p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TermsOfService;
