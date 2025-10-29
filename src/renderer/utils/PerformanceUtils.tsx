/**
 * Performance Utilities
 * 
 * This module provides utilities for performance optimization including
 * memoization, debouncing, throttling, and performance monitoring.
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Debounce function
 * 
 * Delays the execution of a function until after a specified delay
 * has passed since the last time it was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 * 
 * Limits the execution of a function to at most once per specified interval.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Memoize function
 * 
 * Caches the result of a function call based on its arguments.
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Performance monitoring hook
 * 
 * Monitors component performance and provides metrics.
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        timeSinceLastRender: `${timeSinceLastRender}ms`,
        totalTime: `${now - startTime.current}ms`
      });
    }
  });

  return {
    renderCount: renderCount.current,
    timeSinceStart: Date.now() - startTime.current
  };
}

/**
 * Optimized search hook
 * 
 * Provides debounced search functionality with memoized results.
 */
export function useOptimizedSearch<T>(
  data: T[],
  searchFunction: (item: T, searchTerm: string) => boolean,
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setIsSearching(false);
    }, delay),
    [delay]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    setIsSearching(true);
    return data.filter(item => searchFunction(item, searchTerm));
  }, [data, searchTerm, searchFunction]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    filteredData,
    isSearching
  };
}

/**
 * Optimized sorting hook
 * 
 * Provides memoized sorting functionality.
 */
export function useOptimizedSort<T>(
  data: T[],
  sortFunction: (a: T, b: T) => number,
  dependencies: any[] = []
) {
  return useMemo(() => {
    return [...data].sort(sortFunction);
  }, [data, ...dependencies]);
}

/**
 * Virtual scrolling hook
 * 
 * Provides virtual scrolling functionality for large lists.
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

/**
 * Lazy loading hook
 * 
 * Provides lazy loading functionality for components and data.
 */
export function useLazyLoading<T>(
  loadFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (loading || data) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loadFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loadFunction, loading, data]);

  useEffect(() => {
    load();
  }, dependencies);

  return {
    data,
    loading,
    error,
    reload: load
  };
}

/**
 * Intersection observer hook
 * 
 * Provides intersection observer functionality for lazy loading.
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * Performance metrics hook
 * 
 * Collects and reports performance metrics.
 */
export function usePerformanceMetrics(componentName: string) {
  const metrics = useRef({
    renderCount: 0,
    totalRenderTime: 0,
    averageRenderTime: 0,
    lastRenderTime: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      metrics.current.renderCount += 1;
      metrics.current.totalRenderTime += renderTime;
      metrics.current.averageRenderTime = 
        metrics.current.totalRenderTime / metrics.current.renderCount;
      metrics.current.lastRenderTime = renderTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance Metrics] ${componentName}:`, metrics.current);
      }
    };
  });

  return metrics.current;
}

/**
 * Optimized callback hook
 * 
 * Creates a memoized callback that only changes when dependencies change.
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T {
  return useCallback(callback, dependencies);
}

/**
 * Optimized memo hook
 * 
 * Creates a memoized value that only recalculates when dependencies change.
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  dependencies: any[]
): T {
  return useMemo(factory, dependencies);
}

/**
 * Batch updates hook
 * 
 * Batches multiple state updates to prevent unnecessary re-renders.
 */
export function useBatchedUpdates() {
  const [, forceUpdate] = useState({});
  const updates = useRef<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: () => void) => {
    updates.current.push(update);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      updates.current.forEach(update => update());
      updates.current = [];
      forceUpdate({});
    }, 0);
  }, []);

  return batchUpdate;
}

/**
 * Performance profiler component
 * 
 * Wraps components to profile their performance.
 */
export function withPerformanceProfiler<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return function ProfiledComponent(props: P) {
    const name = componentName || Component.displayName || Component.name;
    const metrics = usePerformanceMetrics(name);
    
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance Profiler] ${name}:`, metrics);
      }
    }, [name, metrics]);

    return <Component {...props} />;
  };
}

// Import React hooks
import { useState, useRef, useEffect } from 'react';