export class IsoStreamer {
  state: DurableObjectState;
  sessions: Map<WebSocket, any>;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());

    // Accept connection
    server.accept();
    this.sessions.set(server, { connectedAt: Date.now() });

    server.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data as string);
        // Handle incoming NWC limits, auth handshakes, etc.
        console.log("DO received:", data);
      } catch (e) {
        console.error("Invalid message");
      }
    });

    server.addEventListener('close', () => {
      this.sessions.delete(server);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  // Called internally to broadcast 5-min RTC+B LMPs
  broadcast(marketData: any) {
    const payload = JSON.stringify(marketData);
    for (const [ws] of this.sessions) {
      try {
        ws.send(payload);
      } catch (e) {
        this.sessions.delete(ws);
      }
    }
  }
}
