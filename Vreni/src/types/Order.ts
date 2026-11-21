

export interface BillItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  amount: number;
}

export interface CheckoutBill {
  customerName: string;
  phoneNumber: string;
  items: BillItem[];
  totalAmount: number;
}

export interface Order extends CheckoutBill {
  id: string;
  createdAt: string;
}
