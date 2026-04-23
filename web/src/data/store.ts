export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tagline: string;
  replacementLikelihood: number;
  collection: string;
  image: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  image: string;
}

export const products: Product[] = [
  {
    id: "automated-mug",
    name: "This Could've Been Automated Mug",
    price: 28,
    category: "Mugs",
    tagline: "Your morning ritual, soon to be optimized.",
    replacementLikelihood: 87,
    collection: "ai-does-it-better",
    image: "/product-mug.png",
  },
  {
    id: "pixels-hoodie",
    name: "I Used to Move Pixels Hoodie",
    price: 65,
    category: "Apparel",
    tagline: "A warm reminder of manual labor.",
    replacementLikelihood: 73,
    collection: "legacy-skills",
    image: "/product-pixels-hoodie.png",
  },
  {
    id: "deprecated-tote",
    name: "Human Touch (Deprecated) Tote",
    price: 34,
    category: "Bags",
    tagline: "Carry your emotional baggage in style.",
    replacementLikelihood: 62,
    collection: "existential-crisis",
    image: "/product-deprecated-tote.png",
  },
  {
    id: "research-notebook",
    name: "User Research Said Nothing Notebook",
    price: 22,
    category: "Notebooks",
    tagline: "192 pages of unvalidated assumptions.",
    replacementLikelihood: 91,
    collection: "ai-does-it-better",
    image: "/product-notebook.png",
  },
  {
    id: "pivot-pack",
    name: "Career Pivot Starter Pack",
    price: 48,
    category: "Kits",
    tagline: "Everything you need to start over. Again.",
    replacementLikelihood: 95,
    collection: "career-pivot",
    image: "/product-career-pivot-pack.png",
  },
  {
    id: "thinking-bottle",
    name: "Design Thinking™ Water Bottle",
    price: 32,
    category: "Bottles",
    tagline: "Stay hydrated through the ideation phase.",
    replacementLikelihood: 44,
    collection: "denial-phase",
    image: "/product-water-bottle.png",
  },
  {
    id: "replace-stickers",
    name: "Replace Me Gently Sticker Pack",
    price: 18,
    category: "Stickers",
    tagline: "Apply to laptop. Apply to life.",
    replacementLikelihood: 56,
    collection: "existential-crisis",
    image: "/product-sticker-pack.png",
  },
  {
    id: "prompt-tee",
    name: "Prompt Engineer (Emotionally) Tee",
    price: 42,
    category: "Apparel",
    tagline: "You've been re-titled, not replaced.",
    replacementLikelihood: 79,
    collection: "career-pivot",
    image: "/product-prompt-tee.png",
  },
];

export const collections: Collection[] = [
  {
    id: "ai-does-it-better",
    name: "For When AI Does It Better",
    description: "Tools for accepting the inevitable.",
    itemCount: 12,
    image: "/product-pixels-hoodie.png",
  },
  {
    id: "legacy-skills",
    name: "Legacy Skills",
    description: "Celebrating the crafts that got us here.",
    itemCount: 8,
    image: "/product-notebook.png",
  },
  {
    id: "existential-crisis",
    name: "For Your Existential Crisis",
    description: "Because you're more than your Figma files.",
    itemCount: 15,
    image: "/product-deprecated-tote.png",
  },
  {
    id: "career-pivot",
    name: "Career Pivot Essentials",
    description: "New chapter. Same anxiety.",
    itemCount: 6,
    image: "/product-career-pivot-pack.png",
  },
  {
    id: "denial-phase",
    name: "Denial Phase",
    description: "Everything is fine. This is fine.",
    itemCount: 10,
    image: "/product-water-bottle.png",
  },
];

export const brandCopy = {
  tagline: "Replace me gently.",
  subtitle: "Tools and objects for designers coping with the age of AI.",
  microcopy: "Designed by humans. For now.",
  editorial: {
    headline: "Handcrafted intelligence.",
    body: "Human-made objects for the age of synthetic creativity. Each piece is designed, produced, and shipped by actual people — while that still means something.",
  },
  announcement: "Free shipping on orders over $75. Humans still ship faster than AI.",
  newsletter: {
    heading: "Stay relevant.",
    description: "Occasional updates from the human side.",
  },
};
