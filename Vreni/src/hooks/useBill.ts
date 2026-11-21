

import { useState, useMemo, useCallback } from 'react';

import { Service } from '../types/Service';
import { BillItem, CheckoutBill } from '../types/Order';

export const useBill = (services: Service[]) => {

  // Selected services converted into bill items
  const [items, setItems] = useState<BillItem[]>(() =>
    services.map(service => ({
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      quantity: 1,
      amount: service.price,
    })),
  );

  // Customer information
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Increase item quantity
  const increaseQuantity = useCallback((serviceId: string) => {
    setItems(previous =>
      previous.map(item => {
        if (item.serviceId !== serviceId) {
          return item;
        }

        const quantity = item.quantity + 1;

        return {
          ...item,
          quantity,
          amount: item.price * quantity,
        };
      }),
    );
  }, []);

  // Decrease item quantity (minimum 1)
  const decreaseQuantity = useCallback((serviceId: string) => {
    setItems(previous =>
      previous.map(item => {
        if (item.serviceId !== serviceId) {
          return item;
        }

        const quantity = Math.max(1, item.quantity - 1);

        return {
          ...item,
          quantity,
          amount: item.price * quantity,
        };
      }),
    );
  }, []);

  // Remove individual item from bill
  const removeItem = useCallback((serviceId: string) => {
    setItems(previous =>
      previous.filter(item => item.serviceId !== serviceId),
    );
  }, []);

  // Calculate grand total automatically
  const totalAmount = useMemo(
    () => items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
    [items],
  );

  // Calculate total quantity
  const totalQuantity = useMemo(
    () => items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    [items],
  );

  // Checkout validation
  const canCheckout = useMemo(
    () =>
      items.length > 0 &&
      customerName.trim().length > 0,
    [items, customerName],
  );

  // Prepare final bill data
  const getCheckoutData = useCallback((): CheckoutBill | null => {

    if (!canCheckout) {
      return null;
    }

    return {
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),

      items: items.map(item => ({
        ...item,
        amount: item.price * item.quantity,
      })),

      totalAmount,
    };

  }, [
    canCheckout,
    customerName,
    phoneNumber,
    items,
    totalAmount,
  ]);

  return {
    items,

    customerName,
    phoneNumber,

    totalAmount,
    totalQuantity,

    canCheckout,

    setCustomerName,
    setPhoneNumber,

    increaseQuantity,
    decreaseQuantity,
    removeItem,

    getCheckoutData,
  };
};
