import type React from "react";
import { useCart } from "../hooks/useCart";

interface CartIconProps {
  isMobile?: boolean;
}

const CartButton: React.FC<CartIconProps> = () => {
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .cart-button-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .cart-trigger {
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
        
        .cart-trigger:hover {
          color: var(--color-gold, #d4af37);
        }
        
        .cart-badge {
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

      <div className="cart-button-wrapper">
        <a href="/carrito" className="cart-trigger" aria-label="Ver carrito">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </a>
      </div>
    </>
  );
};

export default CartButton;