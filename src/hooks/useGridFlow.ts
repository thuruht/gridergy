import { useEffect, useState, useRef } from 'react';

export interface ZoneData {
  zone: string;
  timestamp: string;
  lmp: number;
  is_congested: boolean;
}

export const useGridFlow = (wsUrl: string) => {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("Connected to Gridergy IsoStreamer DO");
    };

    ws.onmessage = (event) => {
      try {
        const data: ZoneData[] = JSON.parse(event.data);
        setZones(data);
      } catch (err) {
        console.error("Failed to parse zone data", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("Disconnected from IsoStreamer");
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  return { zones, connected };
};
