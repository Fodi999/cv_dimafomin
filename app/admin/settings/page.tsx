"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Key, Lock, Save, RotateCcw, Settings, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

type SettingsTab = "general" | "email" | "notifications" | "api" | "security";

interface GeneralSettings {
  appName: string;
  appDescription: string;
  timezone: string;
  language: 'pl' | 'en' | 'ru';
  theme: string;
}

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    appName: "Sushi Chef",
    appDescription: "Make sushi at home - step by step",
    timezone: "Europe/Warsaw",
    language: language,
    theme: "dark",
  });

  const handleSave = () => {
    // TODO: Save settings to backend
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setGeneralSettings({
      appName: "Sushi Chef",
      appDescription: "Make sushi at home - step by step",
      timezone: "Europe/Warsaw",
      language: "pl",
      theme: "dark",
    });
    setLanguage("pl");
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t.admin.settings.title}
        </h2>
        <p className="text-muted-foreground">
          {t.admin.settings.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            {t.admin.settings.tabs.general}
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            {t.admin.settings.tabs.email}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            {t.admin.settings.tabs.notifications}
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            {t.admin.settings.tabs.api}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            {t.admin.settings.tabs.security}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.admin.settings.general.title}</CardTitle>
              <CardDescription>Configure your application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">{t.admin.settings.general.appName}</Label>
                  <Input
                    id="appName"
                    value={generalSettings.appName}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, appName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">{t.admin.settings.general.timezone}</Label>
                  <Input
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="appDescription">{t.admin.settings.general.appDescription}</Label>
                  <Textarea
                    id="appDescription"
                    value={generalSettings.appDescription}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        appDescription: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t.admin.settings.general.language}</Label>
                  <Select
                    value={language}
                    onValueChange={(value) => {
                      const newLang = value as 'pl' | 'en' | 'ru';
                      setLanguage(newLang);
                      setGeneralSettings({ ...generalSettings, language: newLang });
                    }}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pl">Polski</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">{t.admin.settings.general.theme}</Label>
                  <Select
                    value={generalSettings.theme}
                    onValueChange={(value) =>
                      setGeneralSettings({ ...generalSettings, theme: value })
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs - placeholder */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure SMTP and email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Email settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">API settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
