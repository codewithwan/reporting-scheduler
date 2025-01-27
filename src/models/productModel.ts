export interface Product {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  serialNumber: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
