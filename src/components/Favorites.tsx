import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import { getBackendUrl } from "../config/env";
import type { FavoriteItem } from "../hooks/useFavorites";
import "../styles/favorites.css";

// Función auxiliar para obtener la URL de la imagen
const getImageUrl = (image: any): string => {
  if (!image) return "/placeholder.svg?height=400&width=300";
  
  let url: string | undefined;
  
  // Si es un objeto con data (Strapi 5 formato anidado)
  if (image.data) {
    url = image.data.url || image.data.attributes?.url;
  } 
  // Si es un objeto directo con url
  else if (image.url) {
    url = image.url;
  }
  
  if (!url) return "/placeholder.svg?height=400&width=300";
  
  // Si la URL ya es absoluta, retornarla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es relativa, construir la URL completa del backend
  const backendBase = getBackendUrl('').replace('/api', '');
  return url.startsWith('/') ? `${backendBase}${url}` : `${backendBase}/${url}`;
};

const Favorites: React.FC = () => {
  const { items, removeItem, getTotalItems } = useFavorites();
  const { addItem } = useCart();

  const totalItems = getTotalItems();

  // Formatear precio
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "CLP",
  });

  const handleAddToCart = (item: FavoriteItem) => {
    // Convertir FavoriteItem a Product para añadir al carrito
    const product = {
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      priceDiscount: item.priceDiscount,
      isDiscount: item.isDiscount,
      mainImage: item.mainImage,
      count: 999, // Asumir stock disponible
      active: true,
      isFeatured: false,
      images: [],
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
    };
    addItem(product);
  };

  if (totalItems === 0) {
    return (
      <div className="favorites-empty">
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2>No tienes favoritos aún</h2>
        <p>Agrega productos a tus favoritos para verlos aquí</p>
        <a href="/productos" className="btn-primary">
          Explorar Productos
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="favorites-header-info">
        <p>{totalItems} producto{totalItems > 1 ? 's' : ''} guardado{totalItems > 1 ? 's' : ''}</p>
      </div>

      <div className="favorites-grid">
        {items.map((item: FavoriteItem) => (
          <div key={item.id} className="favorite-product-card">
            <div className="favorite-product-image">
              <a href={`/productos/${item.slug}`}>
                <img
                  src={getImageUrl(item.mainImage)}
                  alt={item.name}
                />
              </a>
              <button
                className="favorite-btn active"
                onClick={() => removeItem(item.id)}
                aria-label="Eliminar de favoritos"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="favorite-product-actions">
                <a
                  href={`/productos/${item.slug}`}
                  className="favorite-product-action-btn"
                >
                  Ver Detalles
                </a>
                <button
                  className="favorite-product-action-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Añadir
                </button>
              </div>
            </div>
            <div className="favorite-product-info">
              <h4 className="favorite-product-name">{item.name}</h4>
              <p className="favorite-product-price">
                {item.isDiscount && item.priceDiscount ? (
                  <>
                    <span className="old-price">
                      {formatter.format(item.price)}
                    </span>{" "}
                    {formatter.format(item.priceDiscount)}
                  </>
                ) : (
                  formatter.format(item.price)
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Favorites;

