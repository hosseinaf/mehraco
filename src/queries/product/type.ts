import { QueryKey } from "@/type/base";
import { Nullable } from "@/type/utility";

export interface GetProductsPayload {
  page?: number;
  limit?: number;
  q?: string;

  // additional filters (not yet implemented on server side)
  sort?: string;
  category?: Nullable<string>;
  brand?: Nullable<string>;
  price?: string;
  inStock?: boolean;
}

export type GetProductsQuery = QueryKey<"products", GetProductsPayload>;

export interface ProductItem {
  id: number;
  title: string;
  description: string;
  category: Nullable<string>;
  price: string;
  discountPercentage: string;
  rating: string;
  stock: number;
  tags: string[];
  brand: Nullable<string>;
  sku: string;
  weight: number;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

export interface GetProductsResponse {
  products: ProductItem[];
  total: number;
  skip: number;
  limit: number;
}
