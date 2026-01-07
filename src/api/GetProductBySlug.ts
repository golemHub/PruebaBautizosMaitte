import type { ProductResponse } from "../types/Products";

import { getBackendUrl } from "../config/env";

const API_BASE_URL = getBackendUrl("api");

export async function GetProductBySlug(slug: string): Promise<ProductResponse | null> {
  try {
    const url = `${API_BASE_URL}/products?filters[slug][$eq]=${slug}&filters[active][$eq]=true&filters[isOnline][$eq]=true&populate=*`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Retornar el primer producto si existe
    if (data.data && data.data.length > 0) {
      return {
        data: data.data[0],
        meta: data.meta
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}
