import type { SaleData, SaleResponse } from "../types/Products";

import { getBackendUrl } from "../config/env";

const API_BASE_URL = getBackendUrl("api");

export interface CreateSaleResponse {
  url: string;
  saleId?: number;
}

export async function CreateSale(saleData: SaleData): Promise<CreateSaleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
}

export async function GetSaleById(saleId: number): Promise<SaleResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${saleId}?populate=*`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sale:', error);
    return null;
  }
}

export async function UpdateSaleStatus(saleId: number, status: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${saleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          state: status
        }
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating sale status:', error);
    return false;
  }
}
