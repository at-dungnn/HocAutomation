export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  district: string;
  ward: string;
  postalCode?: string;
  coordinates?: Coordinates;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface PackageDetails {
  description: string;
  weight: number;
  dimensions: Dimensions;
  value: number;
}

export interface RecipientInfo {
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  status: OrderStatus;
  userId: string;
  shipperId?: string;
  pickupAddress: Address | string;
  deliveryAddress: Address | string;
  packageDetails?: PackageDetails;
  recipientInfo?: RecipientInfo;
  deliveryInstructions?: string;
  requestedPickupTime?: Date | string;
  requestedDeliveryTime?: Date | string;
  estimatedPickupTime?: Date | string;
  estimatedDeliveryTime?: Date | string;
  actualPickupTime?: Date | string;
  actualDeliveryTime?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  assignedAt?: Date | string;

  // Computed/flattened fields for display
  senderName?: string;
  senderPhone?: string;
  recipientName?: string;
  recipientPhone?: string;
  packageType?: string;
  weight?: number;
  shippingFee?: number;
  packageDescription?: string;
  specialInstructions?: string;
}

export interface CreateOrderRequest {
  pickupAddress: Address;
  deliveryAddress: Address;
  packageDetails: PackageDetails;
  recipientInfo: RecipientInfo;
  deliveryInstructions?: string;
  requestedPickupTime?: string;
  requestedDeliveryTime?: string;
}

export interface AcceptOrderRequest {
  estimatedPickupTime?: string;
  estimatedDeliveryTime?: string;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
