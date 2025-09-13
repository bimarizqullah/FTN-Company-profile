import { useState, useEffect, useCallback, useRef } from 'react';

interface UnreadCountResponse {
  unreadCount: number;
  timestamp: string;
}

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousCountRef = useRef(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/messages/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear and set count to 0
          localStorage.removeItem('token');
          setUnreadCount(0);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch unread count');
      }

      const data: UnreadCountResponse = await response.json();
      const newCount = data.unreadCount;
      
      // Check if count has changed
      if (previousCountRef.current !== newCount) {
        const previousCount = previousCountRef.current;
        previousCountRef.current = newCount;
        setUnreadCount(newCount);
        
        // Dispatch custom event when count changes
        window.dispatchEvent(new CustomEvent('unreadCountChanged', { 
          detail: { 
            newCount, 
            previousCount,
            timestamp: data.timestamp 
          } 
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching unread count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Don't set count to 0 on error, keep previous value
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial count
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Set up polling every 10 seconds for better responsiveness
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Function to manually refresh count (useful after marking messages as read)
  const refreshCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    error,
    refreshCount,
  };
};
