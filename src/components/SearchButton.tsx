import { useState, useEffect, useRef } from "react";
import { GetShowcaseProducts } from "../api/GetShowcaseProducts";

interface Product {
  id: number;
  name: string;
  slug: string;
  mainImage: {
    url: string;
  };
}

const SearchButton = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Fetch productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await GetShowcaseProducts();
        if (Array.isArray(response?.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error al obtener productos", error);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts([]);
      return;
    }

    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, products]);

  // Click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-wrapper" ref={searchRef}>
      {/* Inyección de Estilos */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .search-wrapper {
          position: relative;
          display: inline-block;
        }

        .search-trigger {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--color-charcoal, #333);
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }

        .search-trigger:hover {
          color: var(--color-gold, #d4af37);
        }

        .search-dropdown {
          position: absolute;
          top: calc(100% + 1rem);
          right: 0;
          width: 360px;
          background: var(--color-white, #fff);
          border: 1px solid var(--color-gold-light, #f1e5c2);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          opacity: 0;
          transform: translateY(-8px) scale(0.98);
          pointer-events: none;
          transition: all 0.25s ease;
          z-index: 2000;
        }

        .search-dropdown.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .search-input-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-bottom: 1px solid var(--color-gold-light, #f1e5c2);
        }

        .search-input-row svg {
          color: var(--color-gold, #d4af37);
        }

        .search-input-row input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.85rem;
          background: transparent;
          color: var(--color-charcoal, #333);
        }

        .clear-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-gray, #999);
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .clear-btn:hover {
          color: var(--color-charcoal, #333);
        }

        .search-results {
          max-height: 280px;
          overflow-y: auto;
        }

        .search-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--color-charcoal, #333);
          transition: background 0.2s ease;
        }

        .search-item:hover {
          background: rgba(0,0,0,0.04);
        }

        .search-item img {
          width: 42px;
          height: 42px;
          object-fit: cover;
          border-radius: 8px;
        }

        .search-empty {
          padding: 2rem 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--color-gray, #999);
        }
      `,
        }}
      />

      {/* ICONO HEADER */}
      <button
        type="button"
        className="search-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Buscar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* DROPDOWN */}
      <div className={`search-dropdown ${isOpen ? "open" : ""}`}>
        <div className="search-input-row">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            autoFocus={isOpen}
          />

          {search && (
            <button
              className="clear-btn"
              onClick={() => setSearch("")}
              aria-label="Limpiar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="search-results">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <a
                key={product.id}
                href={`/productos/${product.slug}`}
                className="search-item"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={product.mainImage?.url || "/placeholder.svg"}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </a>
            ))
          ) : search ? (
            <div className="search-empty">No se encontraron productos</div>
          ) : (
            <div className="search-empty">Escribe para buscar</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchButton;
