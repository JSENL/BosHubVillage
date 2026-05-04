import { useEffect, useMemo, useState } from "react";
import { BellRing } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const ITEM_TYPES = [
  { key: "event", label: "Events" },
  { key: "news", label: "Culture" },
  { key: "local-resource", label: "Local Resources" },
] as const;

const NEIGHBORHOODS = ["Mattapan", "Roxbury", "Hyde Park", "Dorchester", "Jamaica Plain"] as const;

export const NotificationSettings = () => {
  const { preferences, defaults, isLoading, isUpdating, updatePreferences } = useNotificationPreferences();
  const [keywordsInput, setKeywordsInput] = useState("");

  const effective = useMemo(
    () => ({
      ...defaults,
      ...preferences,
    }),
    [defaults, preferences],
  );

  useEffect(() => {
    setKeywordsInput(effective.keywords.join(", "));
  }, [effective.keywords]);

  const toggleType = (type: string, checked: boolean) => {
    const next = checked
      ? [...effective.subscribed_item_types, type]
      : effective.subscribed_item_types.filter((x) => x !== type);
    updatePreferences({ subscribed_item_types: Array.from(new Set(next)) });
  };

  const toggleNeighborhood = (value: string, checked: boolean) => {
    const next = checked
      ? [...effective.neighborhoods, value]
      : effective.neighborhoods.filter((x) => x !== value);
    updatePreferences({ neighborhoods: Array.from(new Set(next)) });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Smart Alerts
        </CardTitle>
        <CardDescription>
          Get timely alerts for new events, culture, and local resources that match your interests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="instant-email" className="font-medium">Instant email alerts</Label>
            <p className="text-sm text-muted-foreground">Only for content that matches your preferences.</p>
          </div>
          <Switch
            id="instant-email"
            checked={effective.instant_email}
            disabled={isLoading || isUpdating}
            onCheckedChange={(checked) => updatePreferences({ instant_email: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="instant-app" className="font-medium">In-app alerts</Label>
            <p className="text-sm text-muted-foreground">See new recommendations directly in your activity feed.</p>
          </div>
          <Switch
            id="instant-app"
            checked={effective.instant_in_app}
            disabled={isLoading || isUpdating}
            onCheckedChange={(checked) => updatePreferences({ instant_in_app: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="recommendations" className="font-medium">"Because you viewed/bookmarked" suggestions</Label>
            <p className="text-sm text-muted-foreground">Discover similar content users like you tend to open.</p>
          </div>
          <Switch
            id="recommendations"
            checked={effective.recommendations_enabled}
            disabled={isLoading || isUpdating}
            onCheckedChange={(checked) => updatePreferences({ recommendations_enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Content types</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ITEM_TYPES.map((type) => (
              <div key={type.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.key}`}
                  checked={effective.subscribed_item_types.includes(type.key)}
                  onCheckedChange={(checked) => toggleType(type.key, Boolean(checked))}
                  disabled={isLoading || isUpdating}
                />
                <Label htmlFor={`type-${type.key}`}>{type.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Neighborhood focus (optional)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NEIGHBORHOODS.map((n) => (
              <div key={n} className="flex items-center space-x-2">
                <Checkbox
                  id={`hood-${n}`}
                  checked={effective.neighborhoods.includes(n)}
                  onCheckedChange={(checked) => toggleNeighborhood(n, Boolean(checked))}
                  disabled={isLoading || isUpdating}
                />
                <Label htmlFor={`hood-${n}`}>{n}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords" className="font-medium">Keywords (comma-separated)</Label>
          <p className="text-sm text-muted-foreground">
            Interests from your profile are included automatically. Use keywords here for extra phrases.
          </p>
          <Input
            id="keywords"
            disabled={isLoading || isUpdating}
            value={keywordsInput}
            onBlur={(e) => {
              const next = e.target.value
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean);
              updatePreferences({ keywords: Array.from(new Set(next)) });
            }}
            onChange={(e) => setKeywordsInput(e.target.value)}
            placeholder="free, family, live music, health"
          />
        </div>
      </CardContent>
    </Card>
  );
};

