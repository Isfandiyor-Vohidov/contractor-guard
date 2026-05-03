export const plans = {
  free: {
    name: "Free",
    price: 0,
    creditsPerMonth: 10,
    maxPagesPerDoc: 10,
    model: "gemini-flash",
    exports: false,
    maxAuditsPerMonth: 3,
  },
  pro: {
    name: "Pro",
    price: 1500,
    creditsPerMonth: 1000,
    maxPagesPerDoc: 100,
    model: "claude-3.5-sonnet",
    exports: true,
    maxAuditsPerMonth: 100,
  },
} as const;

export type Tier = keyof typeof plans;