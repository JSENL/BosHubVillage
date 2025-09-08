/**
 * Utility functions for creating sponsored/special markers with visual effects
 */

export interface SponsoredMarkerOptions {
  isSponsored?: boolean;
  size?: number;
  color?: string;
  glowColor?: string;
}

/**
 * Creates a custom HTML marker element with visual effects for sponsored items
 */
export const createSponsoredMarkerElement = (options: SponsoredMarkerOptions = {}) => {
  const {
    isSponsored = false,
    size = 30,
    color = '#dc2626',
    glowColor = '#fbbf24'
  } = options;

  const el = document.createElement('div');
  
  if (isSponsored) {
    // Sponsored marker with glow and pulse effects
    el.innerHTML = `
      <div class="sponsored-marker-container" style="
        position: relative;
        width: ${size + 10}px;
        height: ${size + 10}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Glowing ring animation -->
        <div class="glow-ring" style="
          position: absolute;
          width: ${size + 20}px;
          height: ${size + 20}px;
          border: 2px solid ${glowColor};
          border-radius: 50%;
          animation: pulse-glow 2s infinite ease-in-out;
          opacity: 0.7;
        "></div>
        
        <!-- Pulsing ring -->
        <div class="pulse-ring" style="
          position: absolute;
          width: ${size + 10}px;
          height: ${size + 10}px;
          border: 3px solid ${glowColor};
          border-radius: 50%;
          animation: pulse-ring 1.5s infinite ease-out;
        "></div>
        
        <!-- Main marker -->
        <div class="main-marker" style="
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(45deg, ${color}, #f59e0b);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 
            0 0 20px rgba(251, 191, 36, 0.8),
            0 0 40px rgba(251, 191, 36, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.3);
          animation: marker-pulse 1s infinite ease-in-out;
          cursor: pointer;
          position: relative;
          z-index: 10;
        ">
          <!-- Star icon for sponsored -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: ${size * 0.4}px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          ">⭐</div>
        </div>
        
        <!-- Sparkle effects -->
        <div class="sparkle sparkle-1" style="
          position: absolute;
          width: 4px;
          height: 4px;
          background: ${glowColor};
          border-radius: 50%;
          top: 0;
          right: 10%;
          animation: sparkle 3s infinite ease-in-out;
        "></div>
        <div class="sparkle sparkle-2" style="
          position: absolute;
          width: 3px;
          height: 3px;
          background: ${glowColor};
          border-radius: 50%;
          bottom: 10%;
          left: 0;
          animation: sparkle 3s infinite ease-in-out 1s;
        "></div>
        <div class="sparkle sparkle-3" style="
          position: absolute;
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          top: 15%;
          left: 15%;
          animation: sparkle 3s infinite ease-in-out 2s;
        "></div>
      </div>
    `;
  } else {
    // Regular marker
    el.innerHTML = `
      <div class="regular-marker" style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
      </div>
    `;
    
    // Add hover effect for regular markers
    el.addEventListener('mouseenter', () => {
      const marker = el.querySelector('.regular-marker') as HTMLElement;
      if (marker) {
        marker.style.transform = 'scale(1.1)';
      }
    });
    
    el.addEventListener('mouseleave', () => {
      const marker = el.querySelector('.regular-marker') as HTMLElement;
      if (marker) {
        marker.style.transform = 'scale(1)';
      }
    });
  }

  return el;
};

/**
 * Injects CSS animations for sponsored markers into the document
 */
export const injectSponsoredMarkerStyles = () => {
  // Check if styles are already injected
  if (document.getElementById('sponsored-marker-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'sponsored-marker-styles';
  style.innerHTML = `
    @keyframes pulse-glow {
      0%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
    }
    
    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.4);
        opacity: 0;
      }
    }
    
    @keyframes marker-pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    @keyframes sparkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .sponsored-marker-container:hover .main-marker {
      animation: marker-pulse 0.5s infinite ease-in-out;
      transform: scale(1.1);
    }
    
    .sponsored-marker-container:hover .glow-ring {
      animation: pulse-glow 1s infinite ease-in-out;
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Gets marker configuration based on item type and sponsored status
 */
export const getMarkerConfig = (itemType: string, isSponsored: boolean = false) => {
  const baseColors = {
    event: '#dc2626',      // Red
    business: '#059669',   // Green  
    'local-service': '#2563eb', // Blue
    news: '#7c3aed'       // Purple
  };

  return {
    isSponsored,
    color: baseColors[itemType as keyof typeof baseColors] || '#6b7280',
    glowColor: isSponsored ? '#fbbf24' : undefined, // Gold glow for sponsored
    size: isSponsored ? 35 : 25 // Larger size for sponsored
  };
};