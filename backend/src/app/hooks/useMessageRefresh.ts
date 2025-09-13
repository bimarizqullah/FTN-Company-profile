import { useEffect, useCallback } from 'react';

interface MessageRefreshOptions {
  onRefresh: () => void;
  enabled?: boolean;
}

export const useMessageRefresh = ({ onRefresh, enabled = true }: MessageRefreshOptions) => {
  const handleUnreadCountChange = useCallback((event: CustomEvent) => {
    if (!enabled) return;
    
    const { newCount, previousCount } = event.detail;
    
    // Only refresh if count increased (new message received)
    if (newCount > previousCount) {
      console.log(`New message detected: ${previousCount} -> ${newCount}`);
      onRefresh();
    }
  }, [onRefresh, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('unreadCountChanged', handleUnreadCountChange as EventListener);
    
    return () => {
      window.removeEventListener('unreadCountChanged', handleUnreadCountChange as EventListener);
    };
  }, [handleUnreadCountChange, enabled]);
};


