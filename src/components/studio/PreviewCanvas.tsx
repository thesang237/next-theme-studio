"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, Maximize, Plus, Copy, AlertTriangle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

// ── StyleOverview ─────────────────────────────────────────────────────────────

function StyleOverview() {
  const colors = [
    "--background",
    "--foreground",
    "--primary",
    "--secondary",
    "--muted",
    "--accent",
    "--border",
    "--chart-1",
    "--chart-2",
    "--chart-3",
    "--chart-4",
    "--chart-5",
  ];
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-medium">Theme Studio</div>
          <div className="text-base text-muted-foreground line-clamp-2">
            Designers love packing quirky glyphs into test phrases. This is a
            preview of the current theme token styles.
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {colors.map((variable) => (
            <div key={variable} className="flex flex-col items-center gap-2">
              <div
                className="relative aspect-square w-full rounded-lg after:absolute after:inset-0 after:rounded-lg after:border after:border-black/10 dark:after:border-white/10"
                style={{ backgroundColor: `hsl(var(${variable}))` }}
              />
              <div className="hidden max-w-14 truncate font-mono text-[0.60rem] text-muted-foreground md:block">
                {variable.replace("--", "")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── TypographySpecimen ────────────────────────────────────────────────────────

function TypographySpecimen() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 pt-6">
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Heading — Body
        </div>
        <p className="text-2xl font-medium">
          Designing with rhythm and hierarchy.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A strong body style keeps long-form content readable and balances the
          visual weight of headings.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Thoughtful spacing and cadence help paragraphs scan quickly without
          feeling dense.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Sample Button
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── EnvironmentVariables ──────────────────────────────────────────────────────

function EnvironmentVariables() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>Production · 8 variables</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {[
          { key: "DATABASE_URL", masked: true },
          { key: "NEXT_PUBLIC_API", masked: false },
          { key: "STRIPE_SECRET", masked: true },
        ].map((env) => (
          <div
            key={env.key}
            className="flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs ring-1 ring-border"
          >
            <span className="font-medium">{env.key}</span>
            <span className="ml-auto text-muted-foreground">
              {env.masked ? "••••••••" : "https://api.example.com"}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button size="sm" className="ml-auto">
          Deploy
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── UIElements ────────────────────────────────────────────────────────────────

function UIElements() {
  const [sliderValue, setSliderValue] = React.useState([500]);
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 pt-6">
        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button>Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">
                Verify via email or phone number.
              </p>
            </div>
            <Button size="sm" variant="secondary" className="hidden md:flex">
              Enable
            </Button>
          </div>
        </div>
        {/* Slider */}
        <Slider
          value={sliderValue}
          onValueChange={(v) =>
            setSliderValue(Array.isArray(v) ? [...v] : [v as number])
          }
          max={1000}
          min={0}
          step={10}
          aria-label="Slider"
        />
        {/* Input + Textarea */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Input placeholder="Search…" className="pr-8" />
          </div>
          <Textarea placeholder="Message" className="resize-none" rows={2} />
        </div>
        {/* Badges + Radio + Checkbox */}
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <RadioGroup defaultValue="a" className="ml-auto flex gap-3">
            <RadioGroupItem value="a" />
            <RadioGroupItem value="b" />
          </RadioGroup>
          <div className="flex gap-3">
            <Checkbox defaultChecked />
            <Checkbox />
          </div>
        </div>
        {/* Switch */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Alert Dialog
          </Button>
          <Button variant="outline" size="sm">
            Button Group
          </Button>
          <Switch defaultChecked className="ml-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── InviteTeam ────────────────────────────────────────────────────────────────

function InviteTeam() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team</CardTitle>
        <CardDescription>Add members to your workspace</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {[
            { email: "alex@example.com", role: "editor" },
            { email: "sam@example.com", role: "viewer" },
          ].map((invite) => (
            <div key={invite.email} className="flex items-center gap-2">
              <Input defaultValue={invite.email} className="flex-1" />
              <Select defaultValue={invite.role}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add another
        </Button>
        <Separator />
        <div className="space-y-1.5">
          <Label htmlFor="invite-link">Or share invite link</Label>
          <div className="flex items-center gap-2">
            <Input
              id="invite-link"
              defaultValue="https://app.co/invite/x8f2k"
              readOnly
              className="flex-1"
            />
            <Button variant="outline" size="icon" aria-label="Copy link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Send Invites</Button>
      </CardFooter>
    </Card>
  );
}

// ── ShippingAddress ───────────────────────────────────────────────────────────

function ShippingAddress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
        <CardDescription>Where should we deliver?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="street">Street address</Label>
          <Input id="street" placeholder="123 Main Street" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apt">Apt / Suite</Label>
          <Input id="apt" placeholder="Apt 4B" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="San Francisco" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Select defaultValue="CA">
              <SelectTrigger id="state" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input id="zip" placeholder="94102" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Select defaultValue="US">
              <SelectTrigger id="country" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Checkbox id="save-address" defaultChecked />
          <Label htmlFor="save-address" className="font-normal">
            Save as default address
          </Label>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" className="ml-auto">
          Save Address
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── SkeletonLoading ───────────────────────────────────────────────────────────

function SkeletonLoading() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── FeedbackForm ──────────────────────────────────────────────────────────────

function FeedbackForm() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div className="space-y-1.5">
          <Label htmlFor="topic">Topic</Label>
          <Select>
            <SelectTrigger id="topic">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">AI</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="cdn">CDN (Firewall, Caching)</SelectItem>
              <SelectItem value="ci-cd">CI/CD (Builds, Deployments)</SelectItem>
              <SelectItem value="dashboard">
                Dashboard Interface (Navigation, UI)
              </SelectItem>
              <SelectItem value="domains">Domains</SelectItem>
              <SelectItem value="frameworks">Frameworks</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="feedback">Feedback</Label>
          <Textarea
            id="feedback"
            placeholder="Your feedback helps us improve..."
            className="min-h-24 resize-none"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}

// ── BookAppointment ───────────────────────────────────────────────────────────

function BookAppointment() {
  const [selected, setSelected] = React.useState("9:00 AM");
  const slots = ["9:00 AM", "10:30 AM", "11:00 AM", "1:30 PM"];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Appointment</CardTitle>
        <CardDescription>Dr. Sarah Chen · Cardiology</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Available on March 18, 2026
          </Label>
          <div className="flex flex-wrap gap-2">
            {slots.map((time) => (
              <Button
                key={time}
                size="sm"
                variant={selected === time ? "default" : "outline"}
                onClick={() => setSelected(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        <Alert>
          <AlertTitle>New patient?</AlertTitle>
          <AlertDescription>Please arrive 15 minutes early.</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book Appointment</Button>
      </CardFooter>
    </Card>
  );
}

// ── ReportBug ─────────────────────────────────────────────────────────────────

function ReportBug() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Bug</CardTitle>
        <CardDescription>Help us fix issues faster.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="bug-title">Title</Label>
          <Input id="bug-title" placeholder="Brief description of the issue" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bug-severity">Severity</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="bug-severity" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bug-component">Component</Label>
            <Select defaultValue="dashboard">
              <SelectTrigger id="bug-component" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bug-steps">Steps to reproduce</Label>
          <Textarea
            id="bug-steps"
            placeholder={"1. Go to\n2. Click on\n3. Observe..."}
            className="min-h-24 resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Attach File</Button>
        <Button className="ml-auto">Submit Bug</Button>
      </CardFooter>
    </Card>
  );
}

// ── GithubProfile ─────────────────────────────────────────────────────────────

function GithubProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile information.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="gh-name">Name</Label>
          <Input id="gh-name" placeholder="shadcn" />
          <p className="text-xs text-muted-foreground">
            Your name may appear where you contribute or are mentioned.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gh-email">Public Email</Label>
          <Select>
            <SelectTrigger id="gh-email">
              <SelectValue placeholder="m@shadcn.com" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m@shadcn.com">m@shadcn.com</SelectItem>
              <SelectItem value="m@gmail.com">m@gmail.com</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            You can manage verified emails in your email settings.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gh-bio">Bio</Label>
          <Textarea
            id="gh-bio"
            placeholder="Tell us a little bit about yourself"
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Profile</Button>
      </CardFooter>
    </Card>
  );
}

// ── NoTeamMembers ─────────────────────────────────────────────────────────────

function NoTeamMembers() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-center">
          <div className="flex -space-x-2">
            {["A", "B", "C"].map((initial) => (
              <div
                key={initial}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground grayscale"
              >
                {initial}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium">No Team Members</p>
            <p className="text-xs text-muted-foreground">
              Invite your team to collaborate on this project.
            </p>
          </div>
          <Button size="sm">Invite Members</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Shortcuts ─────────────────────────────────────────────────────────────────

const SHORTCUTS = [
  { label: "Search", keys: ["⌘", "K"] },
  { label: "Quick Actions", keys: ["⌘", "J"] },
  { label: "New File", keys: ["⌘", "N"] },
  { label: "Save", keys: ["⌘", "S"] },
  { label: "Toggle Sidebar", keys: ["⌘", "B"] },
] as const;

function Shortcuts() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">Shortcuts</div>
          <div className="flex flex-col gap-0.5">
            {SHORTCUTS.map(({ label, keys }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-center py-1">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <div className="ml-auto flex gap-1">
                    {keys.map((key) => (
                      <kbd
                        key={key}
                        className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── UsageCard ─────────────────────────────────────────────────────────────────

const USAGE_ITEMS = [
  { name: "Edge Requests", value: "$1.83K", percentage: 67 },
  { name: "Fast Data Transfer", percentage: 52, value: "$952.51" },
  { name: "Monitoring data points", percentage: 89, value: "$901.20" },
  { name: "Web Analytics Events", percentage: 45, value: "$603.71" },
  { name: "ISR Writes", percentage: 26, value: "524.52K / 2M" },
  { name: "Function Duration", percentage: 5, value: "5.11 GB Hrs / 1K" },
];

function UsageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          5 days remaining in cycle
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {USAGE_ITEMS.map((item, i) => (
          <React.Fragment key={item.name}>
            {i > 0 && <Separator />}
            <div className="flex items-center gap-3 py-2">
              <CircularGauge percentage={item.percentage} />
              <span className="flex-1 truncate text-sm">{item.name}</span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {item.value}
              </span>
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

function CircularGauge({ percentage }: { percentage: number }) {
  const r = 42.5;
  const circumference = 2 * Math.PI * r;
  const dash = (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;
  return (
    <svg
      aria-hidden
      fill="none"
      height="16"
      width="16"
      strokeWidth="2"
      viewBox="0 0 100 100"
      className="-rotate-90 shrink-0 text-primary"
    >
      <circle
        cx="50" cy="50" r={r} strokeWidth="12" stroke="currentColor"
        className="opacity-20"
        strokeDasharray={`${circumference} ${circumference}`}
      />
      <circle
        cx="50" cy="50" r={r} strokeWidth="12" stroke="currentColor"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
      />
    </svg>
  );
}

// ── AnomalyAlert ──────────────────────────────────────────────────────────────

function AnomalyAlert() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Get alerted for anomalies</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Automatically monitor your projects for anomalies and get
              notified.
            </p>
          </div>
          <Button size="sm">Upgrade to Observability Plus</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Contributors ──────────────────────────────────────────────────────────────

const CONTRIBUTOR_INITIALS = [
  "SC", "VE", "NX", "TW", "TS", "ES", "PT", "BB",
  "WP", "RL", "PC", "VT", "RE", "VU", "AN", "SO",
];

function Contributors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Contributors <Badge variant="secondary">312</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {CONTRIBUTOR_INITIALS.map((initials) => (
            <div
              key={initials}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
            >
              {initials}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <a href="#" className="text-sm underline underline-offset-4">
          + 810 contributors
        </a>
      </CardFooter>
    </Card>
  );
}

// ── PreviewCanvas ─────────────────────────────────────────────────────────────

export function PreviewCanvas() {
  const activeMode = useThemeStore((state) => state.activeMode);
  const [zoom, setZoom] = React.useState(0.75);

  return (
    <div className="flex flex-col h-full bg-background flex-1 relative min-w-0">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between h-10 px-4 shrink-0 border-b border-border bg-background backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Preview</span>
          <span className="text-[10px] uppercase font-mono bg-popover text-muted-foreground px-1.5 py-0.5 rounded leading-none">
            {activeMode}
          </span>
        </div>
        <div className="flex items-center bg-card border border-border rounded">
          <button
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
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
            onClick={() => setZoom(0.75)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Preview area */}
      <div className="flex-1 min-h-0 overflow-auto bg-muted dark:bg-background">
        <div
          id="theme-preview"
          className={cn(activeMode === "dark" ? "dark" : "")}
          style={{ zoom, transformOrigin: "top left" }}
        >
          <div
            className="grid items-start gap-4 p-4 bg-muted dark:bg-background"
            style={{
              gridTemplateColumns: "repeat(5, 360px)",
              width: "max-content",
            }}
          >
            {/* ── Column 1 ─ */}
            <div className="flex flex-col gap-4">
              <StyleOverview />
              <TypographySpecimen />
              <EnvironmentVariables />
            </div>

            {/* ── Column 2 ─ */}
            <div className="flex flex-col gap-4">
              <UIElements />
              <InviteTeam />
            </div>

            {/* ── Column 3 ─ */}
            <div className="flex flex-col gap-4">
              <SkeletonLoading />
              <FeedbackForm />
              <BookAppointment />
            </div>

            {/* ── Column 4 ─ */}
            <div className="flex flex-col gap-4">
              <ShippingAddress />
              <ReportBug />
            </div>

            {/* ── Column 5 ─ */}
            <div className="flex flex-col gap-4">
              <NoTeamMembers />
              <Contributors />
              <Shortcuts />
              <UsageCard />
              <AnomalyAlert />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
