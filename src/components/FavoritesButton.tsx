import type React from "react";
import { useFavorites } from "../hooks/useFavorites";

interface FavoritesButtonProps {
  isMobile?: boolean;
}

const FavoritesButton: React.FC<FavoritesButtonProps> = () => {
  const totalItems = useFavorites((state) => state.getTotalItems());

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .favorites-button-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .favorites-trigger {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--color-charcoal, #333);
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .favorites-trigger:hover {
          color: var(--color-gold, #d4af37);
        }
        
        .favorites-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-gold, #d4af37);
          color: var(--color-white, #fff);
          font-size: 0.65rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `,
        }}
      />

      <div className="favorites-button-wrapper">
        <a href="/favoritos" className="favorites-trigger" aria-label="Ver favoritos">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {totalItems > 0 && <span className="favorites-badge">{totalItems}</span>}
        </a>
      </div>
    </>
  );
};

export default FavoritesButton;