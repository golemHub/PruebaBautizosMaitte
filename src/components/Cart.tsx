import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { createTransaction } from "../services/ventipay";
import { getBackendUrl } from "../config/env";
import type { CartItem } from "../types/Products";
import "../styles/cart.css";

// Función auxiliar para obtener la URL de la imagen
const getImageUrl = (image: any): string => {
  if (!image) return "/placeholder.svg?height=280&width=240";
  
  let url: string | undefined;
  
  // Si es un objeto con data (Strapi 5 formato anidado)
  if (image.data) {
    url = image.data.url || image.data.attributes?.url;
  } 
  // Si es un objeto directo con url
  else if (image.url) {
    url = image.url;
  }
  
  if (!url) return "/placeholder.svg?height=280&width=240";
  
  // Si la URL ya es absoluta, retornarla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es relativa, construir la URL completa del backend
  const backendBase = getBackendUrl('').replace('/api', '');
  return url.startsWith('/') ? `${backendBase}${url}` : `${backendBase}/${url}`;
};

const Cart: React.FC = () => {
  const { items, quantities, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 0 : 0; 
  const tax = subtotal * 0.19; // IVA 19%
  const total = subtotal + shipping + tax;

  // Formatear precio
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "CLP",
  });

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (totalItems === 0) {
      setError("El carrito está vacío");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Preparar los datos de la orden
      const orderData = {
        amount: Math.round(total * 100), // Convertir a centavos
        currency: "CLP",
        description: `Pedido de ${totalItems} artículo${totalItems > 1 ? 's' : ''}`,
        customerEmail: "", // Se puede obtener de un formulario
        callbackUrl: `${window.location.origin}/carrito/callback`,
        returnUrl: `${window.location.origin}/carrito/exito`,
        cancelUrl: `${window.location.origin}/carrito`,
      };

      // Crear la transacción en VentiPay
      const result = await createTransaction(orderData);

      if (result.paymentUrl) {
        // Redirigir al usuario a la página de pago de VentiPay
        window.location.href = result.paymentUrl;
      } else {
        throw new Error("No se recibió la URL de pago");
      }
    } catch (err: any) {
      console.error("Error al procesar el pago:", err);
      setError(err.message || "Error al procesar el pago. Por favor, intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para comenzar tu compra</p>
        <a href="/productos" className="btn-continue-shopping">
          Continuar Comprando
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {items.map((item: CartItem) => {
            const quantity = quantities[item.cartItemId] || 0;
            const itemTotal = item.price * quantity;
            const variantInfo = item.selectedVariant
              ? `Talla: ${item.selectedVariant.size || "N/A"} | Color: ${item.selectedVariant.color || "N/A"}`
              : "";

            return (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={getImageUrl(item.mainImage)}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h3 className="cart-item-title">{item.name}</h3>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.cartItemId)}
                      aria-label="Eliminar producto"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  {variantInfo && (
                    <div className="cart-item-info">
                      <p>{variantInfo}</p>
                    </div>
                  )}
                  <div className="cart-item-footer">
                    <div className="quantity-selector">
                      <button
                        onClick={() => handleQuantityChange(item.cartItemId, quantity - 1)}
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cartItemId, quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">
                      {formatter.format(itemTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h3>Resumen del Pedido</h3>

          <div className="summary-row">
            <span>Subtotal ({totalItems} artículo{totalItems > 1 ? 's' : ''})</span>
            <span className="value">{formatter.format(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span className="value">
              {shipping > 0 ? formatter.format(shipping) : "Gratis"}
            </span>
          </div>
          <div className="summary-row">
            <span>IVA (19%)</span>
            <span className="value">{formatter.format(tax)}</span>
          </div>

          <div className="promo-code">
            <input
              type="text"
              placeholder="Código de descuento"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button type="button">Aplicar Código</button>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span className="value">{formatter.format(total)}</span>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Finalizar Compra"}
          </button>
          <a href="/productos" className="continue-shopping">
            ← Continuar Comprando
          </a>
        </div>
      </div>
    </>
  );
};

export default Cart;

