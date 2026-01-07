import type { Product, ProductVariant, CartItem } from "../types/Products";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Tipo para identificar de manera única un item en el carrito
type CartItemId = string;

interface CartContextData {
  items: CartItem[];
  quantities: { [cartItemId: CartItemId]: number };
  addItem: (
    product: Product,
    selectedVariant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (cartItemId: CartItemId) => void;
  updateQuantity: (cartItemId: CartItemId, quantity: number) => void;
  removeAll: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (cartItemId: CartItemId) => number;
}

// Función para generar un ID único para el carrito
const generateCartItemId = (
  productId: number,
  variantId?: number
): CartItemId => {
  if (variantId) {
    return `${productId}-${variantId}`;
  }
  return `${productId}`;
};

export const useCart = create(
  persist<CartContextData>(
    (set, get) => ({
      items: [],
      quantities: {},

      addItem: (product: Product, selectedVariant?: ProductVariant, quantity = 1) => {
        const { items, quantities } = get();

        // Generar un ID único para este item del carrito
        const cartItemId = generateCartItemId(product.id, selectedVariant?.id);

        // Verificar stock disponible
        const availableStock = selectedVariant ? selectedVariant.count : product.count;
        const currentQuantity = quantities[cartItemId] || 0;
        
        if (currentQuantity + quantity > availableStock) {
          console.error(`No hay suficiente stock. Disponible: ${availableStock}`);
          return;
        }

        // Verificar si el producto ya existe en el carrito con la misma variante
        const existingItemIndex = items.findIndex(
          (item) => item.cartItemId === cartItemId
        );

        if (existingItemIndex >= 0) {
          // Si el producto ya existe, incrementar la cantidad
          const newQuantities = { ...quantities };
          newQuantities[cartItemId] = currentQuantity + quantity;

          set({ quantities: newQuantities });

        } else {
          // Si es un producto nuevo, añadirlo al carrito
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.isDiscount && product.priceDiscount ? product.priceDiscount : product.price,
            priceDiscount: product.isDiscount ? product.priceDiscount : undefined,
            isDiscount: product.isDiscount,
            mainImage: product.mainImage,
            selectedVariant,
            quantity: 0, // Se maneja en quantities
            cartItemId,
          };

          const newQuantities = { ...quantities };
          newQuantities[cartItemId] = quantity;

          set({
            items: [...items, newItem],
            quantities: newQuantities,
          });

        }
      },

      updateQuantity: (cartItemId: CartItemId, quantity: number) => {
        const { items, quantities } = get();
        
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        const item = items.find(item => item.cartItemId === cartItemId);
        if (!item) return;

        const availableStock = item.selectedVariant ? item.selectedVariant.count : 999; // Asumir stock infinito si no hay variante
        
        if (quantity > availableStock) {
          console.error(`No hay suficiente stock. Disponible: ${availableStock}`);
          return;
        }

        const newQuantities = { ...quantities };
        newQuantities[cartItemId] = quantity;

        set({ quantities: newQuantities });
      },

      removeItem: (cartItemId: CartItemId) => {
        const { items, quantities } = get();

        const product = items.find((item) => item.cartItemId === cartItemId);

        if (!product) return;

        // Eliminar el producto del carrito
        const newItems = items.filter(
          (item) => item.cartItemId !== cartItemId
        );

        const newQuantities = { ...quantities };
        delete newQuantities[cartItemId];

        set({
          items: newItems,
          quantities: newQuantities,
        });

      },

      removeAll: () => {
        set({ items: [], quantities: {} });
      },

      getTotalItems: () => {
        const { quantities } = get();
        return Object.values(quantities).reduce((total, quantity) => total + quantity, 0);
      },

      getTotalPrice: () => {
        const { items, quantities } = get();
        return items.reduce((total, item) => {
          const quantity = quantities[item.cartItemId] || 0;
          return total + (item.price * quantity);
        }, 0);
      },

      getItemQuantity: (cartItemId: CartItemId) => {
        const { quantities } = get();
        return quantities[cartItemId] || 0;
      },
    }),
    {
      name: "cartStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
