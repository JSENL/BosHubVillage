import { NavigateFunction } from 'react-router-dom';

// Utility to safely navigate programmatically with React Router
export const navigateTo = (navigate: NavigateFunction, path: string, options?: { replace?: boolean }) => {
  navigate(path, options);
};

// Utility to handle external links safely
export const openExternalLink = (url: string, target: string = '_blank') => {
  const link = document.createElement('a');
  link.href = url;
  link.target = target;
  link.rel = 'noopener noreferrer';
  link.click();
};

// Utility to check if URL is external
export const isExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
};

// Utility to format URL properly
export const formatUrl = (url: string): string => {
  if (!url) return '';
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};