

import { useCallback, useEffect, useState } from 'react';

import { Service } from '../types/Service';
// import { DEFAULT_SERVICES } from '../data/services';
import { getServices, saveServices } from '../storage/storage';
import { DEFAULT_SERVICES } from '../data/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services from local storage
  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        let storedServices = await getServices();

        // First installation: seed default services
        if (storedServices === null) {
          storedServices = DEFAULT_SERVICES;
          await saveServices(storedServices);
        }

        if (mounted) {
          setServices(storedServices);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load tailoring services.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  // Select / deselect
  const toggleService = useCallback((id: string) => {
    setSelectedIds(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id],
    );
  }, []);

  // Update service price
  const updateServicePrice = useCallback(
    async (id: string, newPrice: number): Promise<boolean> => {
      if (!Number.isFinite(newPrice) || newPrice < 0) {
        return false;
      }

      const updatedServices = services.map(service =>
        service.id === id
          ? { ...service, price: newPrice }
          : service,
      );

      try {
        await saveServices(updatedServices);
        setServices(updatedServices);
        return true;
      } catch (err) {
        setError('Unable to save the updated price.');
        return false;
      }
    },
    [services],
  );


  const addCustomService = useCallback(
  async (description: string, price: number): Promise<boolean> => {
    const trimmedDescription = description.trim();

    if (!trimmedDescription || !Number.isFinite(price) || price < 0) {
      return false;
    }

    const newService: Service = {
      id: `custom-${Date.now()}`,
      name: trimmedDescription,
      category: 'Custom',
      price,
    };

    const updatedServices = [...services, newService];

    try {
      await saveServices(updatedServices);
      setServices(updatedServices);
      return true;
    } catch (err) {
      setError('Unable to save custom item.');
      return false;
    }
  },
  [services],
);

  const selectedServices = services.filter(service =>
    selectedIds.includes(service.id),
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    services,
    selectedServices,
    addCustomService,
    selectedCount: selectedIds.length,
    isLoading,
    error,
    toggleService,
    isSelected,
    updateServicePrice,
    clearSelection,
  };
};
