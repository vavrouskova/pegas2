import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';

export class ImageGalleryNavigation {
  private currentImageIndex: number;
  private totalImageCount: number;

  constructor(currentIndex: number, totalImages: number) {
    this.currentImageIndex = currentIndex;
    this.totalImageCount = totalImages;
  }

  canNavigatePrev(): boolean {
    if (!IMAGE_GALLERY_CONFIG.navigation.enableBoundaries) {
      return true;
    }
    return this.currentImageIndex > 0;
  }

  canNavigateNext(): boolean {
    if (!IMAGE_GALLERY_CONFIG.navigation.enableBoundaries) {
      return true;
    }
    return this.currentImageIndex < this.totalImageCount - 1;
  }

  getNextIndex(): number | null {
    if (!this.canNavigateNext()) {
      return null;
    }
    return (this.currentImageIndex + 1) % this.totalImageCount;
  }

  getPrevIndex(): number | null {
    if (!this.canNavigatePrev()) {
      return null;
    }
    return (this.currentImageIndex - 1 + this.totalImageCount) % this.totalImageCount;
  }

  hasMultipleImages(): boolean {
    return this.totalImageCount > 1;
  }

  getCounterText(): string {
    return `${this.currentImageIndex + 1} / ${this.totalImageCount}`;
  }

  isValidIndex(): boolean {
    return this.currentImageIndex >= 0 && this.currentImageIndex < this.totalImageCount;
  }
}

export const createImageGalleryNavigation = (currentIndex: number, totalImages: number) => {
  return new ImageGalleryNavigation(currentIndex, totalImages);
};
