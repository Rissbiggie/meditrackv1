// WebSocket connection management
let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000; // 3 seconds
const messageListeners: ((data: any) => void)[] = [];
let isConnecting = false;

export function connectWebSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    console.log('WebSocket is already connected or connecting');
    return;
  }

  if (isConnecting) {
    console.log('WebSocket connection attempt already in progress');
    return;
  }

  isConnecting = true;

  try {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const token = localStorage.getItem('auth_token');
    const wsUrl = `${protocol}//${window.location.host}/ws${token ? `?token=${token}` : ''}`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established');
      reconnectAttempts = 0;
      isConnecting = false;
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Notify all listeners of the new message
        messageListeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
      socket = null;
      isConnecting = false;

      // Attempt to reconnect if not a normal closure
      if (event.code !== 1000) {
        attemptReconnect();
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnecting = false;
    };
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
    isConnecting = false;
    attemptReconnect();
  }
}

function attemptReconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
    setTimeout(connectWebSocket, reconnectDelay);
  } else {
    console.error('Max reconnect attempts reached.');
  }
}

export function sendWSMessage(type: string, data: any) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    connectWebSocket(); // Try to connect
    return false;
  }

  try {
    socket.send(JSON.stringify({ type, ...data }));
    return true;
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
    return false;
  }
}

export function addWSListener(listener: (data: any) => void) {
  messageListeners.push(listener);
  return () => {
    const index = messageListeners.indexOf(listener);
    if (index !== -1) {
      messageListeners.splice(index, 1);
    }
  };
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close(1000, 'Client disconnecting');
    socket = null;
  }
  isConnecting = false;
  reconnectAttempts = 0;
}

// Remove automatic connection
// connectWebSocket();