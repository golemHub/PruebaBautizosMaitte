import type { CategoriesResponse } from "../types/Products";

import { getBackendUrl } from "../config/env";

const API_BASE_URL = getBackendUrl("api");

export async function GetCategories(): Promise<CategoriesResponse> {
  try {
    const url = `${API_BASE_URL}/categories?populate=*&sort=name:asc`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      data: [],
      meta: { 
        pagination: { 
          page: 1, 
          pageSize: 25, 
          pageCount: 1, 
          total: 0 
        } 
      },
    };
  }
}
