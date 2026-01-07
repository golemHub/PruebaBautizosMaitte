// Tipos base para la API de Strapi
export type StrapiResponse<T> = {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiCollectionResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// Tipos de datos principales
export type Image = {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: Image;
    small?: Image;
    medium?: Image;
    large?: Image;
  };
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: Image;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: Image;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type ProductVariant = {
  id: number;
  name: string;
  slug: string;
  image?: Image;
  count: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  barcode?: string;
  active: boolean;
  isFeatured: boolean;
  isDiscount: boolean;
  isOnline?: boolean;
  price: number;
  priceDiscount: number;
  count: number;
  mainImage: Image;
  images: Image[];
  categories?: Category[];
  brand?: Brand;
  product_variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// Tipos para el carrito
export type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceDiscount?: number;
  isDiscount: boolean;
  mainImage: Image;
  selectedVariant?: ProductVariant;
  quantity: number;
  cartItemId: string; // ID único para el carrito
};

// Tipos para ventas
export type SaleProduct = {
  name: string;
  quantity: number;
  unit_price: number;
};

export type SaleData = {
  name: string;
  lastName: string;
  mail: string;
  phone: string;
  adress: string;
  postalCode: string;
  region: string;
  products: SaleProduct[];
  others?: string;
  type: "online";
};

export type Sale = {
  id: number;
  TotalPrice?: number;
  date?: string;
  name?: string;
  lastName?: string;
  mail?: string;
  adress?: string;
  others?: string;
  postalCode?: string;
  region?: string;
  phone?: string;
  products?: any; // JSON
  state?: 'PorPagar' | 'Reservado' | 'Enviado' | 'Entregado' | 'Cancelado';
  transactionId?: string;
  type?: 'online' | 'presencial';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// Tipos para filtros
export type ProductFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isDiscount?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

// Tipos de respuesta de la API
export type ProductsResponse = StrapiCollectionResponse<Product>;
export type ProductResponse = StrapiResponse<Product>;
export type CategoriesResponse = StrapiCollectionResponse<Category>;
export type BrandsResponse = StrapiCollectionResponse<Brand>;
export type SaleResponse = StrapiResponse<Sale>;

// Tipos legacy para compatibilidad (se pueden eliminar gradualmente)
export type ProductType = Product;
export type MainImage = Image;
export type Variant = ProductVariant;
