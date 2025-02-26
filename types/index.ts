export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ItemRequest {
  name: string;
  description: string;
  price: number;
}