// Purpose: lifecycle-safe WebSocket with backoff; adapt event names to your server protocol.
export function createSocket(url, onMessage) {
  let socket; let retry = 0; let closed = false; let timer;
  const connect = () => {
    socket = new WebSocket(url);
    socket.onopen = () => { retry = 0; };
    socket.onmessage = event => onMessage(JSON.parse(event.data));
    socket.onerror = () => socket.close();
    socket.onclose = () => { if (!closed) { timer = setTimeout(connect, Math.min(1000 * 2 ** retry++, 30000)); } };
  };
  connect();
  return {send: payload => socket?.readyState === WebSocket.OPEN && socket.send(JSON.stringify(payload)), dispose: () => { closed = true; clearTimeout(timer); socket?.close(); }};
}
