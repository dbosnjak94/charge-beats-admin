// components/WebSocketTester.tsx
import { useChargerWebSocket } from "@/hooks/use-charger-web-socket"

export function WebSocketTester() {
  const { chargers, isConnected, error } = useChargerWebSocket("ws://localhost:8080")

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Data Stream</h2>

      <div className="space-y-4">
        <div className="p-4 rounded border">
          <h3 className="font-semibold">Connection Status</h3>
          <p className={`mt-2 ${isConnected ? "text-green-600" : "text-yellow-600"}`}>
            {isConnected ? "🟢 Connected" : "🟡 Connecting..."}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded border border-red-200 bg-red-50">
            <h3 className="font-semibold text-red-600">Error</h3>
            <p className="mt-2 text-red-700">{error}</p>
          </div>
        )}

        <div className="p-4 rounded border">
          <h3 className="font-semibold">Received Data</h3>
          <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-96">{JSON.stringify(chargers, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
