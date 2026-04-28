import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Building2, Newspaper, Heart, Target, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: '1,000+', label: t('about.stats.members', 'Community Members') },
    { icon: Calendar, value: '500+', label: t('about.stats.events', 'Events Hosted') },
    { icon: Building2, value: '200+', label: t('about.stats.businesses', 'Local Businesses') },
    { icon: Newspaper, value: '300+', label: t('about.stats.articles', 'Culture Articles') },
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.values.community.title', 'Community First'),
      description: t('about.values.community.description', 'Everything we do is designed to strengthen the bonds within our neighborhoods and bring people together.'),
    },
    {
      icon: Target,
      title: t('about.values.transparency.title', 'Transparency'),
      description: t('about.values.transparency.description', 'We believe in open communication and honest practices. What you see is what you get.'),
    },
    {
      icon: Globe,
      title: t('about.values.inclusivity.title', 'Inclusivity'),
      description: t('about.values.inclusivity.description', 'Our platform welcomes everyone. We support multiple languages and strive to be accessible to all.'),
    },
    {
      icon: Shield,
      title: t('about.values.trust.title', 'Trust & Safety'),
      description: t('about.values.trust.description', 'We verify businesses and moderate content to ensure a safe, reliable experience for all users.'),
    },
  ];

  const testimonials = [
    {
      quote: t('about.testimonials.quote1', "HubVillage has completely changed how I discover local events. I've met so many neighbors through community gatherings I found here!"),
      author: 'Maria S.',
      role: t('about.testimonials.role1', 'Community Member'),
    },
    {
      quote: t('about.testimonials.quote2', "As a small business owner, this platform has been invaluable for connecting with local customers. The support from the community is amazing."),
      author: 'James L.',
      role: t('about.testimonials.role2', 'Local Business Owner'),
    },
    {
      quote: t('about.testimonials.quote3', "I love how easy it is to stay informed about what's happening in my neighborhood. The weekly digest keeps me connected."),
      author: 'Sarah K.',
      role: t('about.testimonials.role3', 'Neighborhood Resident'),
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            {t('about.title', 'About HubVillage')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle', 'Connecting communities, one neighborhood at a time. We believe strong communities start with informed, engaged neighbors.')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {t('about.mission.title', 'Our Mission')}
            </h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              {t('about.mission.description', 'HubVillage was created with a simple vision: to help neighbors connect, local businesses thrive, and communities flourish. In an increasingly digital world, we believe there\'s still immense value in knowing your neighbors, supporting local businesses, and being an active part of your community. Our platform makes it easy to discover what\'s happening nearby, find trusted local resources, and stay informed about matters that affect your neighborhood.')}
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t('about.values.title', 'Our Values')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t('about.testimonials.title', 'What Our Community Says')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-6">
                  <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t('about.cta.title', 'Join Our Community')}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t('about.cta.description', 'Whether you\'re looking to discover local events, promote your business, or simply stay connected with your neighbors, HubVillage is here for you.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link to="/auth">{t('about.cta.getStarted', 'Get Started')}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact-admin">{t('about.cta.contactUs', 'Contact Us')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default About;
