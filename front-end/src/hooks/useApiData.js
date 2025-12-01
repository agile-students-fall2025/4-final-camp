import { useCallback, useEffect, useState, useMemo } from 'react';
import { api } from '../services/api.js';

/**
 * Hook to fetch data from the backend API
 * @param {string} resourceKey - The API method to call
 * @param {object} options - Options including params and transform function
 */
export function useApiData(resourceKey, options = {}) {
  const { initialData, transform, params } = options;
  const [data, setData] = useState(initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stringify params to create a stable dependency
  const paramsKey = useMemo(() => JSON.stringify(params), [params?.userId, params?.facility, params?.date]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        let result;
        // Call the appropriate API method
        if (resourceKey === 'dashboard' && params?.userId) {
          result = await api.dashboard(params.userId);
        } else if (resourceKey === 'borrowals' && params?.userId) {
          result = await api.borrowals(params.userId);
        } else if (resourceKey === 'fines' && params?.userId) {
          result = await api.fines(params.userId);
        } else if (resourceKey === 'paymentHistory' && params?.userId) {
          result = await api.paymentsHistory(params.userId);
        } else if (resourceKey === 'profile' && params?.userId) {
          result = await api.profile(params.userId);
        } else if (resourceKey === 'items') {
          result = await api.items();
        } else if (resourceKey === 'reservationSlots') {
          result = await api.reservationSlots(params);
        } else if (resourceKey === 'reservations') {
          result = await api.reservations();
        } else if (resourceKey === 'staffDashboard') {
          result = await api.staffDashboard();
        } else if (resourceKey === 'staffInventory') {
          result = await api.staffInventory();
        } else if (resourceKey === 'staffReservations') {
          result = await api.staffReservations();
        } else if (resourceKey === 'staffOverdue') {
          result = await api.staffOverdue();
        } else if (resourceKey === 'students') {
          result = await api.students();
        } else {
          throw new Error(`Unknown resource key: ${resourceKey}`);
        }

        if (!isMounted) return;
        
        const nextData = typeof transform === 'function' ? transform(result) : result;
        setData(nextData);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Unknown data load error'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [resourceKey, paramsKey]); // Only re-run when resourceKey or params values actually change

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (resourceKey === 'dashboard' && params?.userId) {
        result = await api.dashboard(params.userId);
      } else if (resourceKey === 'borrowals' && params?.userId) {
        result = await api.borrowals(params.userId);
      } else if (resourceKey === 'fines' && params?.userId) {
        result = await api.fines(params.userId);
      } else if (resourceKey === 'paymentHistory' && params?.userId) {
        result = await api.paymentsHistory(params.userId);
      } else if (resourceKey === 'profile' && params?.userId) {
        result = await api.profile(params.userId);
      } else if (resourceKey === 'items') {
        result = await api.items();
      } else if (resourceKey === 'reservationSlots') {
        result = await api.reservationSlots(params);
      } else if (resourceKey === 'reservations') {
        result = await api.reservations();
      } else if (resourceKey === 'staffDashboard') {
        result = await api.staffDashboard();
      } else if (resourceKey === 'staffInventory') {
        result = await api.staffInventory();
      } else if (resourceKey === 'staffReservations') {
        result = await api.staffReservations();
      } else if (resourceKey === 'staffOverdue') {
        result = await api.staffOverdue();
      } else if (resourceKey === 'students') {
        result = await api.students();
      } else {
        throw new Error(`Unknown resource key: ${resourceKey}`);
      }

      const nextData = typeof transform === 'function' ? transform(result) : result;
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown data load error'));
    } finally {
      setLoading(false);
    }
  }, [resourceKey, paramsKey]);

  return {
    data,
    loading,
    error,
    refetch
  };
}
