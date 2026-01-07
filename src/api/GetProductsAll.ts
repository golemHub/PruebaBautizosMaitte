import type { ProductFilters, ProductsResponse } from "../types/Products";
import { getBackendUrl } from "../config/env";

const API_BASE_URL = getBackendUrl("api");

export async function GetProductsAll(filters: ProductFilters = {}): Promise<ProductsResponse> {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      isFeatured,
      isDiscount,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 12
    } = filters;

    let url = `${API_BASE_URL}/products?filters[active][$eq]=true&filters[isOnline][$eq]=true`;

    // Filtro por categoría
    if (category && category !== "todos") {
      url += `&filters[categories][slug][$eq]=${category}`;
    }

    // Filtro por marca
    if (brand && brand !== "todas") {
      url += `&filters[brand][slug][$eq]=${brand}`;
    }

    // Filtro por precio mínimo
    if (minPrice) {
      url += `&filters[price][$gte]=${minPrice}`;
    }

    // Filtro por precio máximo
    if (maxPrice) {
      url += `&filters[price][$lte]=${maxPrice}`;
    }

    // Filtro por productos destacados
    if (isFeatured) {
      url += `&filters[isFeatured][$eq]=true`;
    }

    // Filtro por productos con descuento
    if (isDiscount) {
      url += `&filters[isDiscount][$eq]=true`;
    }

    // Búsqueda por nombre
    if (search) {
      url += `&filters[name][$containsi]=${encodeURIComponent(search)}`;
    }

    // Ordenamiento
    url += `&sort=${sortBy}:${sortOrder}`;

    // Paginación
    url += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    // Poblar relaciones
    url += `&populate=*`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      data: [],
      meta: { 
        pagination: { 
          page: 1, 
          pageSize: 12, 
          pageCount: 1, 
          total: 0 
        } 
      },
    };
  }
}
