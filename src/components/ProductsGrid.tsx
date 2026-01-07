import React, { useState, useEffect, useMemo } from "react";
import type { Product, ProductFilters, Category } from "../types/Products";
import { GetProductsAll } from "../api/GetProductsAll";
import { useDynamicFilters } from "../hooks/useDynamicFilters";
import { useCart } from "../hooks/useCart";
import { getBackendUrl } from "../config/env";
import FavoriteButton from "./FavoriteButton";

export default function ShopCollection({
  initialProducts = [],
  initialFilters = {},
  categories = [], // Categorías que vienen de Strapi
}: any) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // 1. MEMOIZE FILTERS: Esto detiene el error "Maximum update depth exceeded"
  const stableInitialFilters = useMemo(
    () => ({
      page: 1,
      pageSize: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...initialFilters,
    }),
    [],
  ); // Solo se crea una vez

  const handleFiltersChange = async (newFilters: ProductFilters) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await GetProductsAll(newFilters);
      setProducts(response.data || []);
    } catch (error) {
      console.error("❌ Error en petición:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { localFilters, handleFilterChange } = useDynamicFilters({
    initialFilters: stableInitialFilters,
    onFiltersChange: handleFiltersChange,
  });

  // Cargar productos al inicio si no hay productos iniciales
  useEffect(() => {
    if (!hasLoadedInitial) {
      setHasLoadedInitial(true);
      if (initialProducts.length > 0) {
        setProducts(initialProducts);
      } else {
        handleFiltersChange(stableInitialFilters);
      }
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  // Función auxiliar para obtener la URL de la imagen
  const getImageUrl = (image: any): string => {
    if (!image) return "/placeholder.svg?height=600&width=450";
    
    let url: string | undefined;
    
    // Si es un objeto con data (Strapi 5 formato anidado)
    if (image.data) {
      url = image.data.url || image.data.attributes?.url;
    } 
    // Si es un objeto directo con url
    else if (image.url) {
      url = image.url;
    }
    
    if (!url) return "/placeholder.svg?height=600&width=450";
    
    // Si la URL ya es absoluta, retornarla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es relativa, construir la URL completa del backend
    const backendBase = getBackendUrl('').replace('/api', '');
    return url.startsWith('/') ? `${backendBase}${url}` : `${backendBase}/${url}`;
  };
  return (
    <>
      {/* INYECTAMOS EL CSS COMO GLOBAL 
         Esto asegura que las variables var(--color-gold), etc., funcionen 
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --color-gold: #d4af37;
          --color-gold-light: #f4ece1;
          --color-charcoal: #2c2c2c;
          --color-white: #ffffff;
          --color-gray: #666666;
          --color-gray-light: #999999;
          --font-heading: serif;
          --font-body: sans-serif;
        }

        .filters-section { padding: 2rem; border-top: 1px solid var(--color-gold-light); border-bottom: 1px solid var(--color-gold-light); background: var(--color-white); position: sticky; top: 84px; z-index: 50; }
        .filters-inner { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; }
        .filter-buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
        .filter-btn { padding: 0.75rem 1.5rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid var(--color-gold-light); background: transparent; color: var(--color-charcoal); cursor: pointer; transition: all 0.3s ease; font-family: var(--font-body); }
        .filter-btn:hover, .filter-btn.active { border-color: var(--color-gold); color: var(--color-gold); }
        .filter-btn.active { background: var(--color-charcoal); color: var(--color-white); border-color: var(--color-charcoal); }
        .sort-container { display: flex; align-items: center; gap: 1rem; }
        .sort-container label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gray); }
        .sort-container select { padding: 0.75rem 1rem; font-size: 0.7rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid var(--color-gold-light); background: var(--color-white); color: var(--color-charcoal); font-family: var(--font-body); cursor: pointer; }

        .products-section { padding: 4rem 2rem; }
        .products-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
        .product-card { background: var(--color-white); border: 1px solid var(--color-gold-light); overflow: hidden; cursor: pointer; position: relative; }
        .product-image { position: relative; overflow: hidden; aspect-ratio: 3 / 4; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .product-card:hover .product-image img { transform: scale(1.05); }
        .product-overlay { position: absolute; inset: 0; background: rgba(44, 44, 44, 0.2); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.3s ease; }
        .product-card:hover .product-overlay { opacity: 1; }
        .product-action { width: 48px; height: 48px; background: var(--color-white); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .product-action:hover { background: var(--color-gold); color: var(--color-white); }
        .product-badge { position: absolute; top: 1rem; left: 1rem; background: var(--color-gold); color: var(--color-white); padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; z-index: 10; }
        .product-info { padding: 1.5rem; }
        .product-category { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gray-light); margin-bottom: 0.5rem; }
        .product-name { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-charcoal); }
        .product-footer { display: flex; justify-content: space-between; align-items: center; }
        .product-price { font-size: 1.25rem; font-weight: 600; color: var(--color-gold); }
        .add-btn { padding: 0.75rem 1.5rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; background: var(--color-charcoal); color: var(--color-white); border: none; cursor: pointer; transition: background 0.3s ease; font-family: var(--font-body); }
        .add-btn:hover:not(:disabled) { background: var(--color-gold); }
        .add-btn:disabled { background: var(--color-gray-light); cursor: not-allowed; opacity: 0.6; }
        
        .loading-state { opacity: 0.5; pointer-events: none; transition: opacity 0.3s; }
      `,
        }}
      />

      <section
        className="hero"
        style={{
          textAlign: "center",
          padding: "10rem 2rem 4rem",
          background: "linear-gradient(to bottom, #fcfaf7 0%, #ffffff 100%)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 400,
          }}
        >
          Nuestra{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-gold)" }}>
            Colección
          </em>
        </h1>
        <p
          style={{
            color: "var(--color-gray)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Descubre todos nuestros productos premium para el bautizo perfecto
        </p>
      </section>

      {/* FILTROS IDÉNTICOS A TU DISEÑO */}
      <section className="filters-section">
        <div className="filters-inner">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${!localFilters?.category ? "active" : ""}`}
              onClick={() => handleFilterChange("category", undefined)}
            >
              Todos
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                className={`filter-btn ${localFilters?.category === cat.slug ? "active" : ""}`}
                onClick={() => handleFilterChange("category", cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="sort-container">
            <label>Ordenar:</label>
            <select
              value={`${localFilters?.sortBy}-${localFilters?.sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-");
                handleFilterChange("sortBy", sort);
                handleFilterChange("sortOrder", order);
              }}
            >
              <option value="createdAt-desc">Más Recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="popularity-desc">Más Populares</option>
            </select>
          </div>
        </div>
      </section>

      {/* GRID DE PRODUCTOS IDENTICA A TU DISEÑO */}
      <section
        className={`products-section ${isLoading ? "loading-state" : ""}`}
      >
        <div className="products-grid">
          {products.map((product: any) => (
            <a 
              href={`/productos/${product.slug}`}
              className="product-card" 
              key={product.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="product-image">
                <img
                  src={getImageUrl(product.mainImage)}
                  alt={product.name}
                />
                <div className="product-overlay">
                  <div onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton product={product} className="product-action" />
                  </div>
                  <a
                    href={`/productos/${product.slug}`}
                    className="product-action"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </a>
                </div>
                {product.isFeatured && (
                  <span className="product-badge">Nuevo</span>
                )}
              </div>

              <div className="product-info">
                <div className="product-category">
                  {product.categories?.[0]?.name || "Colección"}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-footer">
                  <span className="product-price">
                    ${(product.isDiscount && product.priceDiscount ? product.priceDiscount : product.price)?.toLocaleString("es-CL")}
                  </span>
                  <button 
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.count === 0}
                  >
                    {product.count === 0 ? "Agotado" : "Agregar"}
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
