import { useState, useEffect, useCallback } from "react";
import type { ProductFilters } from "../types/Products";

interface UseDynamicFiltersProps {
  initialFilters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  debounceMs?: number;
}

export function useDynamicFilters({
  initialFilters = {},
  onFiltersChange,
  debounceMs = 500,
}: UseDynamicFiltersProps) {
  const [localFilters, setLocalFilters] =
    useState<ProductFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Debounce para búsqueda de texto
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Actualizar filtros locales cuando cambien los iniciales
  useEffect(() => {
    setLocalFilters(initialFilters);
    setHasUnsavedChanges(false);
  }, [initialFilters]);

  // Función para aplicar filtros con debounce
  const applyFilters = useCallback(
    (filters: ProductFilters) => {
      setIsLoading(true);
      onFiltersChange(filters);

      // Simular un pequeño delay para mostrar el loading
      setTimeout(() => {
        setIsLoading(false);
        setHasUnsavedChanges(false);
      }, 300);
    },
    [onFiltersChange],
  );

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback(
    (key: keyof ProductFilters, value: any) => {
      const newFilters = { ...localFilters, [key]: value, page: 1 };
      setLocalFilters(newFilters);
      setHasUnsavedChanges(true);

      // Si es búsqueda de texto, usar debounce
      if (key === "search") {
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
          applyFilters(newFilters);
        }, debounceMs);

        setSearchTimeout(timeout);
      } else {
        // Para otros filtros, aplicar inmediatamente
        applyFilters(newFilters);
      }
    },
    [localFilters, applyFilters, debounceMs, searchTimeout],
  );

  // Función para aplicar filtros manualmente
  const applyFiltersNow = useCallback(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    applyFilters(localFilters);
  }, [localFilters, applyFilters, searchTimeout]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters: ProductFilters = {
      page: 1,
      pageSize: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setLocalFilters(clearedFilters);
    setHasUnsavedChanges(false);
    applyFilters(clearedFilters);
  }, [applyFilters]);

  // Función para resetear a filtros iniciales
  const resetFilters = useCallback(() => {
    setLocalFilters(initialFilters);
    setHasUnsavedChanges(false);
  }, [initialFilters]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.keys(localFilters).some((key) => {
    const value = localFilters[key as keyof ProductFilters];
    return (
      value !== undefined &&
      value !== "" &&
      value !== 1 &&
      value !== 12 &&
      value !== "createdAt" &&
      value !== "desc"
    );
  });

  return {
    localFilters,
    isLoading,
    hasUnsavedChanges,
    hasActiveFilters,
    handleFilterChange,
    applyFiltersNow,
    clearFilters,
    resetFilters,
  };
}
