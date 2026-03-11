import { TokenGroup, Token } from "./schema";
import { TOKEN_DEFINITIONS } from "./defaults";

export const TOKEN_GROUPS: Array<{
  id: TokenGroup;
  label: string;
  description: string;
  icon: string;
  defaultOpen: boolean;
  tokens: Token[];
}> = [
  {
    id: "semantic-colors",
    label: "Semantic Colors",
    description: "Core UI colors heavily utilized throughout shadcn components.",
    icon: "Palette",
    defaultOpen: true,
    tokens: TOKEN_DEFINITIONS.filter((t) => t.group === "semantic-colors"),
  },
  {
    id: "extended-palette",
    label: "Extended Palette",
    description: "Additional informative and branded colors for full systems.",
    icon: "Layers",
    defaultOpen: false,
    tokens: TOKEN_DEFINITIONS.filter((t) => t.group === "extended-palette"),
  },
  {
    id: "radius",
    label: "Radius",
    description: "Border radiuses applying to cards, popovers, buttons, etc.",
    icon: "Box",
    defaultOpen: false,
    tokens: TOKEN_DEFINITIONS.filter((t) => t.group === "radius"),
  },
  {
    id: "typography",
    label: "Typography",
    description: "Global typography scale, font weight, line height, and fonts.",
    icon: "Type",
    defaultOpen: false,
    tokens: TOKEN_DEFINITIONS.filter((t) => t.group === "typography"),
  },
  {
    id: "shadows",
    label: "Shadows",
    description: "Elevation and depth configurations.",
    icon: "BoxSelect",
    defaultOpen: false,
    tokens: TOKEN_DEFINITIONS.filter((t) => t.group === "shadows"),
  },
  {
    id: "spacing",
    label: "Spacing",
    description: "Primitive spacing scales for layout structures.",
    icon: "LayoutGrid",
    defaultOpen: false,
    tokens: TOKEN_DEFINITIONS.filter((t) => t.group === "spacing"),
  },
  {
    id: "custom",
    label: "Custom Tokens",
    description: "Project specific design tokens you add manually.",
    icon: "Wand2",
    defaultOpen: true,
    tokens: [], // Starts empty, pushed to dynamically by UI
  },
];
