

import { useCallback, useEffect, useRef, useState } from 'react';
import { Order, CheckoutBill } from '../types/Order';
import { getOrders, saveOrders } from '../storage/storage';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const savingRef = useRef(false);

  const refreshOrders = useCallback(async () => {
    try {
      const storedOrders = await getOrders();
      setOrders(storedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const saveOrder = useCallback(
    async (bill: CheckoutBill): Promise<boolean> => {
      if (savingRef.current || bill.items.length === 0) {
        return false;
      }

      savingRef.current = true;
      setIsSaving(true);

      try {
        const existingOrders = await getOrders();

        const newOrder: Order = {
          ...bill,
          id: `VR-${Date.now()}`,
          createdAt: new Date().toISOString(),
          items: bill.items.map(item => ({ ...item })),
        };

        const updatedOrders = [newOrder, ...existingOrders];

        await saveOrders(updatedOrders);
        setOrders(updatedOrders);

        return true;
      } catch (error) {
        console.error('Failed to save order:', error);
        return false;
      } finally {
        savingRef.current = false;
        setIsSaving(false);
      }
    },
    [],
  );

  return {
    orders,
    isLoading,
    isSaving,
    saveOrder,
    refreshOrders,
  };
};
