import { AngryRobotBassButton } from "@/sounds/drum-and-bass/angry-robot-bass"
import ShakerButton from "@/sounds/drum-and-bass/shaker-percusions"
import TSPBeatButton from "@/sounds/drum-and-bass/solid-and-thick-drum"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

import { IconChargingPile } from "@tabler/icons-react"

const getStatusColor = (status) => {
  const colors = {
    available: "bg-green-600",
    charging: "bg-green-800",
    finishing: "bg-green-400",
    preparing: "bg-green-400",
    suspended: "bg-orange-600",
    faulted: "bg-red-600",
    unavailable: "bg-red-600",
  }
  return colors[status] || "bg-gray-100"
}

const chargeBoxStatus = [
  { chargerId: 38001, location: { lat: "55.697874", long: "12.544396" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38002, location: { lat: "55.694730", long: "12.554524" }, charger_type: "AC", connector_status: "unavailable" },
  { chargerId: 38003, location: { lat: "55.711153", long: "12.566810" }, charger_type: "HOME_CHARGER", connector_status: "available" },
  { chargerId: 38004, location: { lat: "55.715436", long: "12.571116" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38005, location: { lat: "55.708988", long: "12.554492" }, charger_type: "AC", connector_status: "charging" },
  { chargerId: 38006, location: { lat: "55.715360", long: "12.563131" }, charger_type: "HOME_CHARGER", connector_status: "available" },
]

const soundButtons = {
  DC: TSPBeatButton,
  AC: AngryRobotBassButton,
  HOME_CHARGER: ShakerButton,
}

export function RecentSales() {
  return (
    <ScrollArea className="h-[500px]">
      {" "}
      {/* Fixed height */}
      <div className="space-y-8 p-4">
        {chargeBoxStatus.map((item) => {
          const SoundButton = soundButtons[item.charger_type] || TSPBeatButton

          return (
            <div key={item.chargerId} className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback className={getStatusColor(item.connector_status)}>
                  <IconChargingPile className="pl-1" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-wrap items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{item.chargerId} ID </p>
                  <p className="text-sm text-muted-foreground">{item.connector_status}</p>
                </div>
                <div className="font-medium">
                  <Button className="w-full bg-violet-300 text-black">Show on the map</Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
