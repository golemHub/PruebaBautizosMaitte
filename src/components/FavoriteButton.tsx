import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import type { Product } from "../types/Products";

interface FavoriteButtonProps {
  product: Product;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ product, className = "" }) => {
  const { toggleItem, isFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <button
      className={`favorite-btn ${isFav ? "active" : ""} ${className}`}
      onClick={handleToggle}
      aria-label={isFav ? "Eliminar de favoritos" : "Añadir a favoritos"}

    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={isFav ? "currentColor" : "none"}
          stroke={isFav ? "none" : "currentColor"}
        />
      </svg>
      
    </button>
  );
};

export default FavoriteButton;

