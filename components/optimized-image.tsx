import Image from 'next/image';
import { ComponentProps } from 'react';

type OptimizedImageProps = ComponentProps<typeof Image> & {
  /**
   * Alternative loading strategy for images outside viewport
   * @default "lazy"
   */
  loading?: 'lazy' | 'eager';
  /**
   * Quality of the optimized image (1-100)
   * @default 85
   */
  quality?: number;
};

/**
 * OptimizedImage component with automatic lazy loading and WebP conversion
 *
 * Features:
 * - Automatic lazy loading for images outside viewport
 * - WebP format with fallback
 * - Blur placeholder for better UX
 * - Optimized quality (85% default)
 * - Responsive sizing
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/screenshots/dashboard.png"
 *   alt="Ahorrin Dashboard"
 *   width={1200}
 *   height={800}
 * />
 * ```
 */
export function OptimizedImage({
  loading = 'lazy',
  quality = 85,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      loading={loading}
      quality={quality}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
    />
  );
}
