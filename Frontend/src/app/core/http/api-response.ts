export interface ApiResponse<T = any> {
  success?: boolean;
  succeeded?: boolean;
  message?: string;
  messages?: string[];
  data?: T;
  errors?: any;
  bookingDate?: any[];
  fromTime?: any[];
  toTime?: any[];
  serviceId?: any[];
}
