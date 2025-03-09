'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to animate elements when they enter the viewport
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Once it's in view, we don't need to observe anymore
        if (element) observer.unobserve(element);
      }
    }, options);
    
    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);
  
  return { ref, isInView };
}

/**
 * Hook to stagger animations of multiple elements
 */
export function useStaggeredAnimation(
  count: number, 
  options = { staggerDelay: 100, initialDelay: 0 }
) {
  const [animatedItems, setAnimatedItems] = useState<boolean[]>(Array(count).fill(false));
  
  useEffect(() => {
    const { staggerDelay, initialDelay } = options;
    
    // Animate each item with a delay
    const timers = animatedItems.map((_, index) => {
      return setTimeout(() => {
        setAnimatedItems(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, initialDelay + index * staggerDelay);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [count, options, animatedItems.length]);
  
  return animatedItems;
}

/**
 * Hook to create an animated counter
 */
export function useAnimatedCounter(
  targetValue: number,
  duration = 1000,
  startOnMount = true
) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = useCallback(() => {
    setIsAnimating(true);
    
    const startTime = Date.now();
    const initialValue = count;
    const valueChange = targetValue - initialValue;
    
    const animation = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutQuad for smoother animation
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      
      setCount(Math.round(initialValue + valueChange * easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        setCount(targetValue);
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animation);
  }, [count, targetValue, duration]);
  
  useEffect(() => {
    if (startOnMount && !isAnimating && count !== targetValue) {
      animate();
    }
  }, [startOnMount, animate, isAnimating, count, targetValue]);
  
  return { count, animate, isAnimating };
}

/**
 * Hook to create a typing animation
 */
export function useTypingAnimation(
  text: string,
  options = { typingSpeed: 50, startDelay: 0, cursor: true }
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const startTyping = useCallback(() => {
    setIsTyping(true);
    setIsComplete(false);
    setDisplayedText('');
    
    let i = 0;
    
    setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, options.typingSpeed);
      
      return () => clearInterval(typingInterval);
    }, options.startDelay);
  }, [text, options.typingSpeed, options.startDelay]);
  
  return {
    displayedText,
    isTyping,
    isComplete,
    startTyping,
    cursor: options.cursor && !isComplete ? '|' : '',
  };
} 