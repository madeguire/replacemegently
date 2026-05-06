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
