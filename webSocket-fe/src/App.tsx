import { useEffect, useRef } from "react";
import ChatBox from "./Component/ChatBox";

function App() {
  // const [wsRef, setWsRefs] = useState<WebSocket | null>();
  const wsRef = useRef<WebSocket | null>(null);


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    wsRef.current = ws;

  return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <ChatBox wsRef={wsRef} />
    </div>
  );
}

export default App;
