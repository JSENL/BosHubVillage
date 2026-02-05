import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const lastUpdated = "February 5, 2026";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('legal.privacyTitle', 'Privacy Policy')}</h1>
        <p className="text-muted-foreground mb-6">{t('legal.lastUpdated', 'Last updated')}: {lastUpdated}</p>
        
        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[70vh] pr-4">
              <div className="prose prose-sm max-w-none space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.intro', '1. Introduction')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.privacy.introText', 'HubVillage ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our community platform.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.collection', '2. Information We Collect')}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t('legal.privacy.collectionIntro', 'We collect information you provide directly to us:')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('legal.privacy.collect1', 'Account information (name, email address)')}</li>
                    <li>{t('legal.privacy.collect2', 'Profile information you choose to share')}</li>
                    <li>{t('legal.privacy.collect3', 'Content you post (events, comments, submissions)')}</li>
                    <li>{t('legal.privacy.collect4', 'Communications with us')}</li>
                    <li>{t('legal.privacy.collect5', 'Usage data and preferences')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.usage', '3. How We Use Your Information')}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t('legal.privacy.usageIntro', 'We use the information we collect to:')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('legal.privacy.use1', 'Provide, maintain, and improve our services')}</li>
                    <li>{t('legal.privacy.use2', 'Send you updates about events and community news')}</li>
                    <li>{t('legal.privacy.use3', 'Respond to your comments and questions')}</li>
                    <li>{t('legal.privacy.use4', 'Protect against fraud and abuse')}</li>
                    <li>{t('legal.privacy.use5', 'Analyze usage patterns to improve user experience')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sharing', '4. Information Sharing')}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t('legal.privacy.sharingIntro', 'We do not sell your personal information. We may share information:')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('legal.privacy.share1', 'With your consent')}</li>
                    <li>{t('legal.privacy.share2', 'To comply with legal obligations')}</li>
                    <li>{t('legal.privacy.share3', 'To protect our rights and safety')}</li>
                    <li>{t('legal.privacy.share4', 'With service providers who assist our operations')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.cookies', '5. Cookies and Tracking')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.privacy.cookiesText', 'We use cookies and similar technologies to enhance your experience, analyze usage, and remember your preferences. You can control cookies through your browser settings, though some features may not function properly without them.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.security', '6. Data Security')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.privacy.securityText', 'We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.rights', '7. Your Rights')}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t('legal.privacy.rightsIntro', 'You have the right to:')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('legal.privacy.right1', 'Access and update your personal information')}</li>
                    <li>{t('legal.privacy.right2', 'Delete your account and associated data')}</li>
                    <li>{t('legal.privacy.right3', 'Opt out of marketing communications')}</li>
                    <li>{t('legal.privacy.right4', 'Request a copy of your data')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.children', '8. Children\'s Privacy')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.privacy.childrenText', 'Our Platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.changes', '9. Changes to This Policy')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.privacy.changesText', 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.contact', '10. Contact Us')}</h2>
                  <p className="text-muted-foreground">
                    {t('legal.privacy.contactText', 'If you have questions about this Privacy Policy or your personal data, please contact us through our Contact page.')}
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

export default PrivacyPolicy;
