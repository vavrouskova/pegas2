import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';

export class ImageGalleryNavigation {
  constructor(
    private currentIndex: number,
    private totalImages: number
  ) {}

  canNavigatePrev(): boolean {
    if (!IMAGE_GALLERY_CONFIG.navigation.enableBoundaries) {
      return true;
    }
    return this.currentIndex > 0;
  }

  canNavigateNext(): boolean {
    if (!IMAGE_GALLERY_CONFIG.navigation.enableBoundaries) {
      return true;
    }
    return this.currentIndex < this.totalImages - 1;
  }

  getNextIndex(): number | null {
    if (!this.canNavigateNext()) {
      return null;
    }
    return (this.currentIndex + 1) % this.totalImages;
  }

  getPrevIndex(): number | null {
    if (!this.canNavigatePrev()) {
      return null;
    }
    return (this.currentIndex - 1 + this.totalImages) % this.totalImages;
  }

  hasMultipleImages(): boolean {
    return this.totalImages > 1;
  }

  getCounterText(): string {
    return `${this.currentIndex + 1} / ${this.totalImages}`;
  }

  isValidIndex(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.totalImages;
  }
}

export const createImageGalleryNavigation = (currentIndex: number, totalImages: number) => {
  return new ImageGalleryNavigation(currentIndex, totalImages);
};
