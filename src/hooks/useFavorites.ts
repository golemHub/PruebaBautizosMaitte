import type { Product } from "../types/Products";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Tipo para un producto favorito (más simple que CartItem)
export type FavoriteItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceDiscount?: number;
  isDiscount: boolean;
  mainImage: any; // Image type
};

interface FavoritesContextData {
  items: FavoriteItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  removeAll: () => void;
  getTotalItems: () => number;
  isFavorite: (productId: number) => boolean;
}

export const useFavorites = create(
  persist<FavoritesContextData>(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const { items } = get();

        // Verificar si el producto ya está en favoritos
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Ya está en favoritos, no hacer nada
          return;
        }

        // Agregar el producto a favoritos
        const newItem: FavoriteItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.isDiscount && product.priceDiscount ? product.priceDiscount : product.price,
          priceDiscount: product.isDiscount ? product.priceDiscount : undefined,
          isDiscount: product.isDiscount,
          mainImage: product.mainImage,
        };

        set({ items: [...items, newItem] });
      },

      removeItem: (productId: number) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== productId);
        set({ items: newItems });
      },

      toggleItem: (product: Product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Si ya está en favoritos, eliminarlo
          get().removeItem(product.id);
        } else {
          // Si no está en favoritos, agregarlo
          get().addItem(product);
        }
      },

      removeAll: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.length;
      },

      isFavorite: (productId: number) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },
    }),
    {
      name: "favoritesStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

