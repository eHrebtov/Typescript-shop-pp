import { Category } from './category/category.model';
import { Order } from './order/order.model';
import { Product } from './product/product.model';
import { Review } from './review/review.model';
import { User } from './users/users.model';

export type PaginatedUsers = {
  pages: number;
  page: number;
  users: User[];
};

export type PaginatedProducts = {
  pages: number;
  page: number;
  products: Product[];
};

export type PaginatedReviews = {
  pages: number;
  page: number;
  reviews: Review[];
};

export type PaginatedOrders = {
  pages: number;
  page: number;
  orders: Order[];
};

export type PaginatedCategories = {
  pages: number;
  page: number;
  categories: Category[];
};

export interface OrderItem {
  name: string;

  qty: number;

  image: string;

  price: number;

  productId: number;
}

export interface ShippingAddress {
  address: string;

  city: string;

  postalCode: string;

  country: string;
}

export interface PaymentResult {
  status: string;

  update_time: string;

  email_address: string;
}

export interface TokensAndUser {
  user: UserDTO;
  access_token: string;
  refresh_token: string;
}

export class UserDTO {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.isActivated = user.isActivated;
    this.strategy = user.strategy;
  }
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActivated: boolean;
  strategy: string;
}

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export type AuthProvider = 'google' | 'facebook';

export type GoogleProfile = {
  googleId: string;
  imageUrl: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
};
