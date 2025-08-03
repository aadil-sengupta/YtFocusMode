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

    if (currentUrl.includes('youtube.com')) {

        Array.from(document.getElementsByTagName('ytd-rich-item-renderer')).forEach(item => {
          const title = item.querySelector('#video-title')?.textContent || '';

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
