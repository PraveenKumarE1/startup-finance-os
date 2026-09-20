'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  Save,
  Globe,
  Lock,
  CreditCard,
  Users,
  Bell,
  Palette,
  Cloud,
  Download,
  RefreshCw,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { currentStartup, updateStartup } = useAppStore();
  const [companyForm, setCompanyForm] = React.useState({
    name: currentStartup?.name || '',
    industry: currentStartup?.industry || '',
    stage: currentStartup?.stage || 'seed',
    website: currentStartup?.website || '',
    founded_date: currentStartup?.founded_date?.split('T')[0] || '',
    description: currentStartup?.description || '',
  });
  const [savedToast, setSavedToast] = React.useState(false);

  const saveCompany = () => {
    if (currentStartup) {
      updateStartup(currentStartup.id, {
        name: companyForm.name,
        industry: companyForm.industry,
        stage: companyForm.stage as 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth',
        website: companyForm.website,
        founded_date: companyForm.founded_date,
        description: companyForm.description,
      });
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const toggleIntegration = (updates: Record<string, boolean>) => {
    // Placeholder for integration toggling
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground">Configure your company profile and workspace preferences</p>
        </div>
        {savedToast && (
          <Badge variant="success"><Check className="h-3 w-3 mr-1" />Saved</Badge>
        )}
      </div>

      <Tabs defaultValue="company" className="w-full">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <TabsList className="flex-col h-auto items-stretch bg-transparent p-0 space-y-1">
              <TabsTrigger value="company" className="justify-start"><Building2 className="h-4 w-4 mr-2" />Company Profile</TabsTrigger>
              <TabsTrigger value="billing" className="justify-start"><CreditCard className="h-4 w-4 mr-2" />Billing & Plan</TabsTrigger>
              <TabsTrigger value="integrations" className="justify-start"><Cloud className="h-4 w-4 mr-2" />Integrations</TabsTrigger>
              <TabsTrigger value="team-settings" className="justify-start"><Users className="h-4 w-4 mr-2" />Team Settings</TabsTrigger>
              <TabsTrigger value="appearance" className="justify-start"><Palette className="h-4 w-4 mr-2" />Appearance</TabsTrigger>
              <TabsTrigger value="security" className="justify-start"><Lock className="h-4 w-4 mr-2" />Security</TabsTrigger>
            </TabsList>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Basic information about your startup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <Button variant="outline" size="sm">Change Logo</Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name</Label>
                      <Input id="name" value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Input id="website" value={companyForm.website} onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={companyForm.industry} onValueChange={(v) => setCompanyForm({...companyForm, industry: v})}>
                        <SelectTrigger id="industry"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FinTech / B2B SaaS">FinTech / B2B SaaS</SelectItem>
                          <SelectItem value="B2B SaaS">B2B SaaS</SelectItem>
                          <SelectItem value="FinTech">FinTech</SelectItem>
                          <SelectItem value="HealthTech">HealthTech</SelectItem>
                          <SelectItem value="AI / ML">AI / ML</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                          <SelectItem value="Developer Tools">Developer Tools</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stage">Stage</Label>
                      <Select value={companyForm.stage} onValueChange={(v) => setCompanyForm({...companyForm, stage: v as typeof companyForm.stage})}>
                        <SelectTrigger id="stage"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idea">Idea</SelectItem>
                          <SelectItem value="pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="seed">Seed</SelectItem>
                          <SelectItem value="series-a">Series A</SelectItem>
                          <SelectItem value="series-b">Series B</SelectItem>
                          <SelectItem value="growth">Growth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="founded_date">Founded Date</Label>
                      <Input id="founded_date" type="date" value={companyForm.founded_date} onChange={(e) => setCompanyForm({...companyForm, founded_date: e.target.value})} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="description">Company Description</Label>
                      <textarea id="description" className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={companyForm.description} onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})} placeholder="Brief description of what your company does" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveCompany}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your startup finance operating system plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 rounded-lg border-2 border-primary bg-primary/5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold">Startup Pro</h3>
                          <Badge variant="success">Active</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          $49/month per founder • $99/month for teams
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                        <p className="text-sm text-muted-foreground">Billed annually</p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-2 sm:grid-cols-3">
                      {['Unlimited investors', 'Advanced models', 'Cap table'].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" /> {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline">Upgrade to Scale</Button>
                    <Button variant="ghost">Manage Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold text-xs">VISA</div>
                      <div>
                        <p className="font-medium">Visa •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Update</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Connections</CardTitle>
                  <CardDescription>Connect your financial and productivity tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Gmail', desc: 'Send investor updates via email', icon: '✉️', connected: true, dimmed: true },
                    { name: 'Slack', desc: 'Get notified of investor activity', icon: '💬', connected: true, dimmed: true },
                    { name: 'QuickBooks', desc: 'Pull expenses & accounting data', icon: '📊', connected: false, dimmed: true },
                    { name: 'Stripe', desc: 'Import revenue & subscription data', icon: '💳', connected: false, dimmed: true },
                    { name: 'Xero', desc: 'Sync accounting & bank data', icon: '🏦', connected: false, dimmed: true },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.desc}</p>
                        </div>
                      </div>
                      <Button disabled className="opacity-50" variant={integration.connected ? 'outline' : 'default'}>
                        {integration.connected ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Workspace Preferences</CardTitle>
                  <CardDescription>Theme, notifications and defaults</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Default Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="SGD">SGD (S$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Email Notifications</Label>
                    <div className="space-y-2">
                      {[
                        { name: 'Investor pipeline changes', enabled: true },
                        { name: 'Weekly financial summaries', enabled: true },
                        { name: 'Runway alerts (below 6 months)', enabled: true },
                        { name: 'Product announcements', enabled: false },
                      ].map((notif) => (
                        <label key={notif.name} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
                          <span className="text-sm">{notif.name}</span>
                          <span className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', notif.enabled ? 'bg-primary' : 'bg-muted')}>
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', notif.enabled ? 'translate-x-6' : 'translate-x-1')} />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Density</Label>
                      <Select defaultValue="comfortable">
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Protect your financial data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button disabled className="opacity-50">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">3 sessions: Chrome (Mac), Chrome (Windows), Safari (iPhone)</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-destructive mb-2">Danger Zone</p>
                    <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium">Export / Delete Workspace</p>
                          <p className="text-sm text-muted-foreground">Download all your data or permanently delete it</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}