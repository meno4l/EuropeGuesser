export const practiceRegions = [
  {
    id: "balkans",
    label: "Balkans",
    title: "Balkans Practice",
    description: "Focus on the southeastern cluster where country borders get dense fast.",
    countryIds: ["si", "hr", "ba", "rs", "me", "xk", "al", "mk", "bg", "gr", "ro"],
  },
  {
    id: "nordics",
    label: "Nordics",
    title: "Nordics Practice",
    description: "Practice the northern countries across Scandinavia and the North Atlantic.",
    countryIds: ["dk", "no", "se", "fi", "is"],
  },
  {
    id: "baltics",
    label: "Baltics",
    title: "Baltics Practice",
    description: "Lock in Estonia, Latvia, and Lithuania without the rest of Europe competing for attention.",
    countryIds: ["ee", "lv", "lt"],
  },
  {
    id: "western-europe",
    label: "Western Europe",
    title: "Western Europe Practice",
    description: "Work through the western edge of Europe, from Ireland to Monaco.",
    countryIds: ["ie", "gb", "fr", "be", "nl", "lu", "mc"],
  },
  {
    id: "microstates",
    label: "Microstates",
    title: "Microstate Practice",
    description: "Zoom into Europe's smallest countries and sharpen the tiny-target clicks.",
    countryIds: ["ad", "li", "lu", "mc", "mt", "sm", "va"],
  },
  {
    id: "islands",
    label: "Islands",
    title: "Island Practice",
    description: "Practice Europe's island countries and island-heavy targets in one short run.",
    countryIds: ["gb", "ie", "is", "mt", "cy"],
  },
];

export const practiceRegionById = Object.fromEntries(practiceRegions.map((region) => [region.id, region]));
