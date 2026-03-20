"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, Maximize, LayoutDashboard, Inbox, Settings, Users, BarChart3, HelpCircle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent as SidebarContentSlot,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarInset,
} from "@/components/ui/sidebar";

const TABLE_ROWS = [
  { name: "Alice Martin", role: "Admin", status: "Active", joined: "Jan 2024" },
  { name: "Bob Chen", role: "Editor", status: "Active", joined: "Mar 2024" },
  { name: "Carol White", role: "Viewer", status: "Inactive", joined: "Jun 2024" },
  { name: "David Kim", role: "Editor", status: "Active", joined: "Aug 2024" },
];

export function PreviewCanvas() {
  const activeMode = useThemeStore((state) => state.activeMode);
  const [zoom, setZoom] = React.useState(1);

  return (
    <div className="flex flex-col h-full bg-background flex-1 relative min-w-0">
      <header className="sticky top-0 z-20 flex items-center justify-between h-10 px-4 shrink-0 border-b border-border bg-background backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Preview</span>
          <span className="text-[10px] uppercase font-mono bg-popover text-muted-foreground px-1.5 py-0.5 rounded leading-none">
            {activeMode}
          </span>
        </div>
        <div className="flex items-center bg-card border border-border rounded">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-10 text-center text-xs font-mono text-foreground">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-muted mx-1" />
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <ScrollArea className="flex-1 min-h-0 w-full bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]">
        <div className="flex items-start justify-center p-8 min-h-full">
          <div
            id="theme-preview"
            className={cn(
              "w-full max-w-4xl min-h-[500px] p-8 md:p-12 mb-12 shadow-2xl rounded-xl border border-input dark:border-border bg-background text-foreground transition-all duration-200",
              activeMode === "dark" ? "dark" : ""
            )}
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <div className="grid gap-12">

              {/* ── Sidebar ─────────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Sidebar</h3>
                <SidebarProvider
                  defaultOpen
                  className="min-h-0 h-80 rounded-lg overflow-hidden border border-border items-stretch"
                >
                  <Sidebar collapsible="none" className="border-r border-sidebar-border">
                    <SidebarHeader className="p-3">
                      <div className="flex items-center gap-2 px-1 py-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold shrink-0">
                          A
                        </div>
                        <span className="font-semibold text-sm text-sidebar-foreground truncate">Acme Inc</span>
                      </div>
                    </SidebarHeader>
                    <SidebarSeparator />
                    <SidebarContentSlot>
                      <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarMenu>
                          {[
                            { icon: LayoutDashboard, label: "Dashboard", active: true },
                            { icon: Inbox, label: "Inbox", badge: "4" },
                            { icon: BarChart3, label: "Analytics" },
                            { icon: Users, label: "Team" },
                          ].map(({ icon: Icon, label, active, badge }) => (
                            <SidebarMenuItem key={label}>
                              <SidebarMenuButton isActive={active}>
                                <Icon />
                                <span>{label}</span>
                              </SidebarMenuButton>
                              {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroup>
                      <SidebarGroup>
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>
                        <SidebarMenu>
                          {[
                            { icon: Settings, label: "Settings" },
                            { icon: HelpCircle, label: "Help & Support" },
                          ].map(({ icon: Icon, label }) => (
                            <SidebarMenuItem key={label}>
                              <SidebarMenuButton>
                                <Icon />
                                <span>{label}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroup>
                    </SidebarContentSlot>
                    <SidebarSeparator />
                    <SidebarFooter className="p-3">
                      <div className="flex items-center gap-2 px-1">
                        <div className="h-7 w-7 rounded-full bg-muted shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-sidebar-foreground truncate">John Doe</span>
                          <span className="text-[10px] text-sidebar-foreground/60 truncate">john@acme.com</span>
                        </div>
                      </div>
                    </SidebarFooter>
                  </Sidebar>
                  <SidebarInset className="flex flex-col p-4 gap-3 bg-background overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-foreground">Dashboard</p>
                        <p className="text-xs text-muted-foreground">Welcome back, here's an overview.</p>
                      </div>
                      <Button size="sm">New Report</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      {[
                        { label: "Total Users", value: "12,482" },
                        { label: "Revenue", value: "$48.2k" },
                        { label: "Active Now", value: "3,291" },
                      ].map(({ label, value }) => (
                        <Card key={label} className="p-3">
                          <p className="text-[11px] text-muted-foreground">{label}</p>
                          <p className="text-lg font-bold text-foreground">{value}</p>
                        </Card>
                      ))}
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </section>

              {/* ── Buttons ─────────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </section>

              {/* ── Form Controls ───────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Form Controls</h3>
                <div className="grid grid-cols-2 gap-8 max-w-2xl">
                  {/* Left column */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pc-email">Email</Label>
                      <Input id="pc-email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pc-role">Role</Label>
                      <Select>
                        <SelectTrigger id="pc-role">
                          <SelectValue placeholder="Select a role…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pc-bio">Bio</Label>
                      <Textarea id="pc-bio" placeholder="Tell us about yourself…" rows={3} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Volume</Label>
                      <Slider defaultValue={[60]} max={100} />
                    </div>
                  </div>
                  {/* Right column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <RadioGroup defaultValue="pro">
                        {[
                          { value: "free", label: "Free" },
                          { value: "pro", label: "Pro" },
                          { value: "enterprise", label: "Enterprise" },
                        ].map(({ value, label }) => (
                          <div key={value} className="flex items-center gap-2">
                            <RadioGroupItem value={value} id={`plan-${value}`} />
                            <Label htmlFor={`plan-${value}`}>{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="pc-terms" />
                        <Label htmlFor="pc-terms">Accept terms</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="pc-mkt" defaultChecked />
                        <Label htmlFor="pc-mkt">Marketing emails</Label>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pc-notif">Notifications</Label>
                        <Switch id="pc-notif" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pc-2fa">Two-factor auth</Label>
                        <Switch id="pc-2fa" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Tabs ────────────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Tabs</h3>
                <Tabs defaultValue="account" className="max-w-lg">
                  <TabsList className="w-full">
                    <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                    <TabsTrigger value="billing" className="flex-1">Billing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your display name and username.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1.5">
                          <Label>Display name</Label>
                          <Input placeholder="John Doe" />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Username</Label>
                          <Input placeholder="@johndoe" />
                        </div>
                      </CardContent>
                      <CardFooter className="justify-end gap-2">
                        <Button variant="outline" size="sm">Cancel</Button>
                        <Button size="sm">Save changes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="security" className="mt-4">
                    <Card>
                      <CardContent className="pt-6 text-sm text-muted-foreground">
                        Manage your password and two-factor authentication settings here.
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="billing" className="mt-4">
                    <Card>
                      <CardContent className="pt-6 text-sm text-muted-foreground">
                        View invoices, update payment methods, and manage your subscription.
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              {/* ── Table ───────────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Table</h3>
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team and their roles.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {TABLE_ROWS.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>{row.role}</TableCell>
                            <TableCell>
                              <Badge variant={row.status === "Active" ? "default" : "secondary"}>
                                {row.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{row.joined}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </section>

              {/* ── Badges ──────────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Badges</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </section>

              {/* ── Alerts ──────────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Alerts</h3>
                <div className="grid gap-4 max-w-lg">
                  <Alert>
                    <AlertTitle>Payment confirmed</AlertTitle>
                    <AlertDescription>Your payment has been successfully processed.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Request failed</AlertTitle>
                    <AlertDescription>There was a problem processing your request. Please try again.</AlertDescription>
                  </Alert>
                </div>
              </section>

              {/* ── Typography ──────────────────────────────────────── */}
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Typography</h3>
                <div className="space-y-5">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Heading One
                  </h1>
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                    Heading Two
                  </h2>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Heading Three</h3>
                  <p className="leading-7">
                    Body paragraph text spanning multiple lines to show off line height and the configured
                    font family, font size, and spacing tokens.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Muted text for secondary information and captions.
                  </p>
                  <div className="flex flex-wrap gap-4 items-baseline">
                    <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      inline code
                    </code>
                    <span className="text-xs text-muted-foreground font-mono">xs / mono</span>
                    <span className="text-sm">sm</span>
                    <span className="text-base">base</span>
                    <span className="text-lg">lg</span>
                    <span className="text-xl font-semibold">xl</span>
                    <span className="text-2xl font-bold">2xl</span>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
