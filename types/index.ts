



export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


// types.ts
export interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  stock: number;
  categoryId?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  shippingAddress?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}