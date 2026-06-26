import { Product } from "@/components/ProductCard";

export const products: Product[] = [
  { id: 1, name: "Pro Running Shoes X9", price: 129, originalPrice: 179, rating: 4.5, reviews: 234, category: "Footwear", badge: "Best Seller", emoji: "👟" },
  { id: 2, name: "Elite Football", price: 49, originalPrice: 69, rating: 4.8, reviews: 187, category: "Football", badge: "Sale", emoji: "⚽" },
  { id: 3, name: "Carbon Tennis Racket", price: 199, rating: 4.7, reviews: 98, category: "Tennis", emoji: "🎾" },
  { id: 4, name: "Speed Basketball", price: 65, originalPrice: 85, rating: 4.6, reviews: 143, category: "Basketball", badge: "New", emoji: "🏀" },
  { id: 5, name: "Compression Jersey", price: 39, rating: 4.3, reviews: 312, category: "Apparel", emoji: "👕" },
  { id: 6, name: "Swim Goggles Pro", price: 28, originalPrice: 42, rating: 4.4, reviews: 76, category: "Swimming", badge: "Sale", emoji: "🥽" },
  { id: 7, name: "Yoga Mat Ultra Grip", price: 55, rating: 4.9, reviews: 421, category: "Fitness", badge: "Top Rated", emoji: "🧘" },
  { id: 8, name: "Cycling Helmet R3", price: 145, originalPrice: 195, rating: 4.6, reviews: 89, category: "Cycling", emoji: "⛑️" },
];

export const categories = ["All", "Footwear", "Football", "Tennis", "Basketball", "Apparel", "Swimming", "Fitness", "Cycling"];
