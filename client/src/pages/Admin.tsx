import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2, LogOut } from 'lucide-react';

export default function Admin() {
  const [, navigate] = useLocation();
  const [isSaving, setIsSaving] = useState(false);

  // Queries
  const checkAuthQuery = trpc.owner.checkAuth.useQuery();
  const contentQuery = trpc.admin.getContent.useQuery();
  const settingsQuery = trpc.admin.getSettings.useQuery();

  // Mutations
  const updateContentMutation = trpc.admin.updateContent.useMutation();
  const updateSettingsMutation = trpc.admin.updateSettings.useMutation();
  const logoutMutation = trpc.owner.logout.useMutation();

  // Content state
  const [content, setContent] = useState({
    heroHeadline: '',
    heroSubheadline: '',
    heroDescription: '',
    heroCTAText: '',
    heroCTALink: '',
    featuresTitle: '',
    featuresDescription: '',
    ctaTitle: '',
    ctaDescription: '',
  });

  // Settings state
  const [settings, setSettings] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#1f2937',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'sans-serif',
    backgroundStyle: 'solid',
    showHero: true,
    showFeatures: true,
    showCTA: true,
  });

  // Check auth on mount
  useEffect(() => {
    if (checkAuthQuery.data && !checkAuthQuery.data.isAuthenticated) {
      navigate('/login');
    }
  }, [checkAuthQuery.data?.isAuthenticated, navigate]);

  // Load content
  useEffect(() => {
    if (contentQuery.data) {
      setContent({
        heroHeadline: contentQuery.data.heroHeadline || '',
        heroSubheadline: contentQuery.data.heroSubheadline || '',
        heroDescription: contentQuery.data.heroDescription || '',
        heroCTAText: contentQuery.data.heroCTAText || '',
        heroCTALink: contentQuery.data.heroCTALink || '',
        featuresTitle: contentQuery.data.featuresTitle || '',
        featuresDescription: contentQuery.data.featuresDescription || '',
        ctaTitle: contentQuery.data.ctaTitle || '',
        ctaDescription: contentQuery.data.ctaDescription || '',
      });
    }
  }, [contentQuery.data]);

  // Load settings
  useEffect(() => {
    if (settingsQuery.data) {
      setSettings({
        primaryColor: settingsQuery.data.primaryColor || '#3b82f6',
        secondaryColor: settingsQuery.data.secondaryColor || '#1f2937',
        accentColor: settingsQuery.data.accentColor || '#f59e0b',
        backgroundColor: settingsQuery.data.backgroundColor || '#ffffff',
        textColor: settingsQuery.data.textColor || '#000000',
        fontFamily: settingsQuery.data.fontFamily || 'sans-serif',
        backgroundStyle: settingsQuery.data.backgroundStyle || 'solid',
        showHero: settingsQuery.data.showHero !== false,
        showFeatures: settingsQuery.data.showFeatures !== false,
        showCTA: settingsQuery.data.showCTA !== false,
      });
    }
  }, [settingsQuery.data]);

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      await updateContentMutation.mutateAsync(content);
      toast.success('Content saved successfully!');
      contentQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettingsMutation.mutateAsync(settings);
      toast.success('Settings saved successfully!');
      settingsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (checkAuthQuery.isLoading || contentQuery.isLoading || settingsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">YouEnvy.me Admin</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Edit your hero section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Headline</Label>
                    <Input
                      value={content.heroHeadline}
                      onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
                      placeholder="Enter headline"
                    />
                  </div>
                  <div>
                    <Label>Subheadline</Label>
                    <Input
                      value={content.heroSubheadline}
                      onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })}
                      placeholder="Enter subheadline"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={content.heroDescription}
                      onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>CTA Button Text</Label>
                      <Input
                        value={content.heroCTAText}
                        onChange={(e) => setContent({ ...content, heroCTAText: e.target.value })}
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label>CTA Button Link</Label>
                      <Input
                        value={content.heroCTALink}
                        onChange={(e) => setContent({ ...content, heroCTALink: e.target.value })}
                        placeholder="#"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features Section</CardTitle>
                  <CardDescription>Edit features section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={content.featuresTitle}
                      onChange={(e) => setContent({ ...content, featuresTitle: e.target.value })}
                      placeholder="Features"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={content.featuresDescription}
                      onChange={(e) => setContent({ ...content, featuresDescription: e.target.value })}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CTA Section</CardTitle>
                  <CardDescription>Edit call-to-action section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={content.ctaTitle}
                      onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })}
                      placeholder="Ready to Get Started?"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={content.ctaDescription}
                      onChange={(e) => setContent({ ...content, ctaDescription: e.target.value })}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveContent} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Content'
                )}
              </Button>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Customize your color scheme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Accent Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          value={settings.backgroundColor}
                          onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          value={settings.textColor}
                          onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Choose your font family</CardDescription>
                </CardHeader>
                <CardContent>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Section Visibility</CardTitle>
                  <CardDescription>Show or hide sections on your home page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Hero Section</Label>
                    <Switch
                      checked={settings.showHero}
                      onCheckedChange={(checked) => setSettings({ ...settings, showHero: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Features Section</Label>
                    <Switch
                      checked={settings.showFeatures}
                      onCheckedChange={(checked) => setSettings({ ...settings, showFeatures: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show CTA Section</Label>
                    <Switch
                      checked={settings.showCTA}
                      onCheckedChange={(checked) => setSettings({ ...settings, showCTA: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Design'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See changes in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg overflow-hidden border border-gray-200"
                style={{
                  backgroundColor: settings.backgroundColor,
                  color: settings.textColor,
                  fontFamily: settings.fontFamily,
                }}
              >
                <div className="p-6 space-y-4">
                  {settings.showHero && (
                    <div>
                      <h2
                        className="text-2xl font-bold mb-2"
                        style={{ color: settings.primaryColor }}
                      >
                        {content.heroHeadline}
                      </h2>
                      <p
                        className="text-sm mb-2"
                        style={{ color: settings.secondaryColor }}
                      >
                        {content.heroSubheadline}
                      </p>
                      <p className="text-xs mb-4">{content.heroDescription}</p>
                      <button
                        className="px-4 py-2 rounded text-white text-sm"
                        style={{ backgroundColor: settings.accentColor }}
                      >
                        {content.heroCTAText}
                      </button>
                    </div>
                  )}

                  {settings.showFeatures && (
                    <div className="border-t pt-4">
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: settings.primaryColor }}
                      >
                        {content.featuresTitle}
                      </h3>
                      <p className="text-xs">{content.featuresDescription}</p>
                    </div>
                  )}

                  {settings.showCTA && (
                    <div className="border-t pt-4">
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: settings.accentColor }}
                      >
                        {content.ctaTitle}
                      </h3>
                      <p className="text-xs">{content.ctaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
