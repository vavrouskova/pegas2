import { useEffect } from 'react';

import { createImageGalleryNavigation } from '@/utils/imageGalleryNavigation';

interface UseImageKeyboardNavigationProps {
  isOpen: boolean;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
}

export const useImageKeyboardNavigation = ({
  isOpen,
  currentIndex,
  totalImages,
  onClose,
  onNavigateNext,
  onNavigatePrev,
}: UseImageKeyboardNavigationProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const navigation = createImageGalleryNavigation(currentIndex, totalImages);

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape': {
          onClose();
          break;
        }
        case 'ArrowLeft': {
          if (navigation.canNavigatePrev()) {
            onNavigatePrev();
          }
          break;
        }
        case 'ArrowRight': {
          if (navigation.canNavigateNext()) {
            onNavigateNext();
          }
          break;
        }
        default: {
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, totalImages, onClose, onNavigateNext, onNavigatePrev]);
};
