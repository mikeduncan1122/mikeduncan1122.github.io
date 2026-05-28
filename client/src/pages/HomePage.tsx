import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [, navigate] = useLocation();
  const contentQuery = trpc.public.getContent.useQuery();
  const settingsQuery = trpc.public.getSettings.useQuery();
  const checkAuthQuery = trpc.owner.checkAuth.useQuery();

  if (contentQuery.isLoading || settingsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const content = contentQuery.data;
  const settings = settingsQuery.data;

  if (!content || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load page content</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        fontFamily: settings.fontFamily,
      }}
    >
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: settings.primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: settings.primaryColor }}>
            YouEnvy.me
          </h1>
          <div className="flex gap-4">
            {checkAuthQuery.data?.isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Admin
              </Button>
            )}
            {!checkAuthQuery.data?.isAuthenticated && (
              <Button
                onClick={() => navigate('/login')}
              >
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {settings.showHero && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1
              className="text-5xl md:text-6xl font-bold"
              style={{ color: settings.primaryColor }}
            >
              {content.heroHeadline}
            </h1>
            <p
              className="text-xl md:text-2xl"
              style={{ color: settings.secondaryColor }}
            >
              {content.heroSubheadline}
            </p>
            <p className="text-lg max-w-2xl mx-auto">
              {content.heroDescription}
            </p>
            <div>
              <Button
                size="lg"
                style={{
                  backgroundColor: settings.accentColor,
                  color: settings.backgroundColor,
                }}
                onClick={() => {
                  if (content.heroCTALink && content.heroCTALink !== '#') {
                    window.location.href = content.heroCTALink;
                  }
                }}
              >
                {content.heroCTAText}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {settings.showFeatures && (
        <section
          className="py-20 px-4"
          style={{ backgroundColor: settings.secondaryColor }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ color: settings.accentColor }}
              >
                {content.featuresTitle}
              </h2>
              <p className="text-lg" style={{ color: settings.backgroundColor }}>
                {content.featuresDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {settings.showCTA && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2
              className="text-4xl font-bold"
              style={{ color: settings.accentColor }}
            >
              {content.ctaTitle}
            </h2>
            <p className="text-lg">
              {content.ctaDescription}
            </p>
            <div>
              <Button
                size="lg"
                style={{
                  backgroundColor: settings.primaryColor,
                  color: settings.backgroundColor,
                }}
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className="border-t py-8 px-4 text-center"
        style={{ borderColor: settings.primaryColor }}
      >
        <p style={{ color: settings.secondaryColor }}>
          © 2026 YouEnvy.me. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
