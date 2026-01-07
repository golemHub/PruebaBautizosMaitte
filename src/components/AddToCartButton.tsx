import React from "react";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types/Products";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  disabled = false,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  // Definimos las clases para el estado "Agotado" vs "Disponible"
  const isOutOfStock = product.count === 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isOutOfStock}
      className={`
        w-full py-4 px-8 
        font-semibold uppercase tracking-widest text-sm
        transition-all duration-300 ease-in-out
        ${
          isOutOfStock
            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-none"
            : "bg-[#2c2c2c] text-white hover:bg-[#c9a96e] hover:shadow-lg active:scale-95"
        }
      `}
      style={{ 
        fontFamily: "var(--font-body, 'Montserrat', sans-serif)",
        letterSpacing: "0.15em"
      }}
    >
      <div className="flex items-center justify-center gap-2">
        {!isOutOfStock && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        )}
        {isOutOfStock ? "Producto Agotado" : "Añadir al Carrito"}
      </div>
    </button>
  );
};

export default AddToCartButton;
