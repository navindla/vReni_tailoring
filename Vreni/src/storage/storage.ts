

// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { Service } from '../types/Service';

// const SERVICES_KEY = '@vreni_services';
// const ORDERS_KEY = '@vreni_orders';

// export const saveServices = async (
//   services: Service[],
// ): Promise<void> => {
//   await AsyncStorage.setItem(
//     SERVICES_KEY,
//     JSON.stringify(services),
//   );
// };

// export const getServices = async (): Promise<Service[] | null> => {
//   const data = await AsyncStorage.getItem(SERVICES_KEY);

//   return data ? JSON.parse(data) as Service[] : null;
// };

// export const saveOrders = async (orders: unknown[]): Promise<void> => {
//   await AsyncStorage.setItem(
//     ORDERS_KEY,
//     JSON.stringify(orders),
//   );
// };

// export const getOrders = async (): Promise<unknown[]> => {
//   const data = await AsyncStorage.getItem(ORDERS_KEY);

//   return data ? JSON.parse(data) as unknown[] : [];
// };




import AsyncStorage from '@react-native-async-storage/async-storage';
import { Service } from '../types/Service';
import { Order } from '../types/Order';

const SERVICES_KEY = '@vreni_services';
const ORDERS_KEY = '@vreni_orders';

export const saveServices = async (
  services: Service[],
): Promise<void> => {
  await AsyncStorage.setItem(
    SERVICES_KEY,
    JSON.stringify(services),
  );
};

export const getServices = async (): Promise<Service[] | null> => {
  const data = await AsyncStorage.getItem(SERVICES_KEY);
  return data ? JSON.parse(data) as Service[] : null;
};

export const saveOrders = async (
  orders: Order[],
): Promise<void> => {
  await AsyncStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders),
  );
};

export const getOrders = async (): Promise<Order[]> => {
  const data = await AsyncStorage.getItem(ORDERS_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data) as Order[];
};
