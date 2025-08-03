import { useFocusMode } from '@/contexts/FocusModeContext'
import { useKeywords } from '@/contexts/KeywordsContext'
import { FocusModeProvider } from '@/contexts/FocusModeContext'
import { KeywordsProvider } from '@/contexts/KeywordsContext'
import { useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Content Script Component that uses the hooks
const ContentScript = () => {
  const { isFocusMode } = useFocusMode();
  const { blacklistedKeywords, focusKeywords, allowedWebsites } = useKeywords();

  useEffect(() => {
    // check if the current URL matches any of the allowed websites
    const currentUrl = window.location.href;
    const isAllowed = allowedWebsites.some(website => currentUrl.includes(website));

    if (!isAllowed) {
      return;
    }

    console.log('Focus Mode is', isFocusMode ? 'enabled' : 'disabled');

    const processVideoElements = () => {
      if (currentUrl.includes('youtube.com')) {
        // Get all video elements: regular videos, video renderers, and YouTube Shorts
        const richItemElements = Array.from(document.getElementsByTagName('ytd-rich-item-renderer'));
        const videoRendererElements = Array.from(document.getElementsByTagName('ytd-video-renderer'));
        const shortsElements = Array.from(document.querySelectorAll('ytGridShelfViewModelGridShelfItem'));
        
        const allVideoElements = [...richItemElements, ...videoRendererElements, ...shortsElements];

        allVideoElements.forEach(item => {
          // Skip if already processed (has our data attribute)
          if ((item as HTMLElement).dataset.focusModeProcessed) {
            return;
          }

          let title = '';
          
          // For ytGridShelfViewModelGridShelfItem (YouTube Shorts), look for yt-core-attributed-string classes
          if (item.tagName.toLowerCase() === 'ytgridshelfviewmodelgridshelfitem') {
            const titleElement = item.querySelector('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap');
            title = titleElement?.textContent || '';
          } else {
            // For ytd-rich-item-renderer and ytd-video-renderer
            const titleElement = item.querySelector('#video-title');
            title = titleElement?.querySelector('yt-formatted-string')?.textContent || titleElement?.textContent || '';
          }

          // Mark as processed to avoid re-processing
          (item as HTMLElement).dataset.focusModeProcessed = 'true';

          // Check for blacklisted keywords first (always active)
          const matchedBlacklistedKeyword = blacklistedKeywords.find(keyword => 
            title.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (matchedBlacklistedKeyword) {
            console.log(`🚫 Hiding video "${title}" - contains blacklisted keyword: "${matchedBlacklistedKeyword}"`);
            (item as HTMLElement).style.display = 'none';
            return; // Skip further checks
          }

          // Check for focus keywords (only when focus mode is enabled)
          if (isFocusMode) {
            const matchedFocusKeyword = focusKeywords.find(keyword => 
              title.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (matchedFocusKeyword) {
              console.log(`🎯 Hiding video "${title}" - contains distraction keyword: "${matchedFocusKeyword}"`);
              (item as HTMLElement).style.display = 'none';
            }
          }
        });
      }
    };

    // Initial processing
    processVideoElements();

    // Set up multiple triggers for detecting new content
    
    // 1. Mutation Observer - detects DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes are video elements or contain them
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'YTD-RICH-ITEM-RENDERER' || 
                  element.tagName === 'YTD-VIDEO-RENDERER' ||
                  element.classList?.contains('ytGridShelfViewModelGridShelfItem') ||
                  element.querySelector('ytd-rich-item-renderer, ytd-video-renderer, ytGridShelfViewModelGridShelfItem')) {
                shouldProcess = true;
              }
            }
          });
        }
      });
      
      if (shouldProcess) {
        setTimeout(processVideoElements, 100); // Small delay to ensure elements are fully rendered
      }
    });

    // Start observing the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 2. Interval-based processing as fallback (every 2 seconds)
    const interval = setInterval(processVideoElements, 2000);

    // 3. URL change detection (for navigation within YouTube)
    let currentURL = window.location.href;
    const urlCheckInterval = setInterval(() => {
      if (window.location.href !== currentURL) {
        currentURL = window.location.href;
        setTimeout(processVideoElements, 500); // Delay for page to load
      }
    }, 1000);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
      clearInterval(urlCheckInterval);
    }; 

  }, [isFocusMode, blacklistedKeywords, focusKeywords, allowedWebsites]);

  return null; // This component doesn't render anything visible
};

// Create the container and render the component with providers
const container = document.createElement('div');
container.id = 'focus-mode-content-script';
container.style.display = 'none'; // Hide the container since we're not rendering UI
document.body.appendChild(container);

createRoot(container).render(
  <StrictMode>
    <FocusModeProvider>
      <KeywordsProvider>
        <ContentScript />
      </KeywordsProvider>
    </FocusModeProvider>
  </StrictMode>,
);
