import { MenuItemType } from "../../types/menu"

export const MENU_ITEM_TYPES = {
  STARTERS: {
    title: "Starters",
    type: "starters",
    description:
      "Think of these like an appetizer — small, easy-to-digest actions that give you a quick win and set the tone for what’s next. Examples: making a cup of tea or coffee, opening a window for fresh air, or doing a quick stretch.",
    subtitle: "Quick, low-effort actions to get things going",
  },
  MAINS: {
    title: "Mains",
    type: "mains",
    subtitle: "Hearty, satisfying activities that engage your mind",
    description:
      "These are your core dishes — they take more time and attention, but leave you feeling full and genuinely satisfied. Examples: going for a walk, writing, coding a side project, or reading a few chapters of a book.",
  },
  SIDES: {
    title: "Sides",
    type: "sides",
    subtitle: "Add flavor to your mundane tasks",
    description:
      "Just like fries or a salad on the side, these aren’t the main attraction — but they make the experience better. Pair them with boring chores to make them more enjoyable. Examples: listening to music while doing the dishes, playing a podcast while folding laundry. (Though remember: sometimes a little boredom is good too — it creates space for new ideas.)",
  },
  DESSERTS: {
    title: "Desserts",
    type: "desserts",
    description:
      "Desserts are sweet, comforting, and often the most tempting — but best enjoyed in small servings. These activities feel great in the short term, but can lead to overstimulation if overdone. Examples: watching a Netflix episode, scrolling social media, or snacking on something you love.",
    subtitle: "Little indulgences to enjoy in moderation",
  },
  SPECIALS: {
    title: "Specials",
    type: "specials",
    description:
      "Think of these like the chef’s specials — they require more planning, time, or money, but they’re worth savoring. Examples: going on a vacation, attending a concert, booking a massage, or even a solo café day. These aren’t daily habits, but they nourish your joy in a big way when they do happen.",
    subtitle: "Occasional, high-reward experiences",
  },
}

export type MenuItemTypeKey = keyof typeof MENU_ITEM_TYPES
export type DisplayMenuItem = {
  title: string
  type: MenuItemType
  description: string
  subtitle: string
}
