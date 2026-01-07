import type { BrandsResponse } from "../types/Products";
import { getBrandsApiUrl } from "../config/env";

export async function GetBrands(): Promise<BrandsResponse> {
  try {
    const baseUrl = getBrandsApiUrl();
    // Corregir el formato de la URL para Strapi v4
    const url = `${baseUrl}?populate=*&sort=name:asc`;
    
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error fetching brands: ${response.status} ${response.statusText}`);
      // Retornar respuesta vacía en lugar de lanzar error
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching brands:', error);
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
