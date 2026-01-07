import type { ProductsResponse } from "../types/Products";

import { getBackendUrl } from "../config/env";

const API_BASE_URL = getBackendUrl("api");

export async function GetShowcaseProducts(): Promise<ProductsResponse> {
  try {
    const url = `${API_BASE_URL}/products?filters[active][$eq]=true&filters[isOnline][$eq]=true&populate=*&sort=createdAt:desc&pagination[pageSize]=20`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching showcase products:', error);
    return {
      data: [],
      meta: { 
        pagination: { 
          page: 1, 
          pageSize: 20, 
          pageCount: 1, 
          total: 0 
        } 
      },
    };
  }
}
