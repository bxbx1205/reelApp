"use client";

import { useEffect, useRef, useState, RefObject } from "react";

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.6, rootMargin = "0px", root = null } = options;
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, rootMargin, root]);

  return [elementRef, isVisible];
}
