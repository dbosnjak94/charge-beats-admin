import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { TopNav } from "@/components/layout/top-nav"
import { ThemeSwitch } from "@/components/theme-switch"
import { Overview } from "./components/overview"
import { RecentSales } from "./components/recent-sales"

import { IconChargingPile, IconHeartbeat, IconPlugX, IconActivityHeartbeat } from "@tabler/icons-react"
import { WebSocketTester } from "@/components/WebSocketTester"
import { useChargerWebSocket } from "@/hooks/use-charger-web-socket"

export default function Dashboard() {
  const { chargers } = useChargerWebSocket("ws://localhost:8080")

  const numberOfChargers = chargers.length
  const offlineChargers = chargers.filter(
    (item) => item.connector_status === "unavailable" || item.connector_status === "faulted" || item.connector_status === "suspended"
  ).length
  const activeChargers = chargers.filter(
    (item) =>
      item.connector_status === "available" ||
      item.connector_status === "charging" ||
      item.connector_status === "finishing" ||
      item.connector_status === "preparing"
  ).length

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search /> */}
          <ThemeSwitch />
          {/* <ProfileDropdown /> */}
        </div>
      </Header>
      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Chargebox Beats</h1>
          {/* <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div> */}
        </div>
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            {/* <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList> */}
          </div>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total chargers on network</CardTitle>
                  <IconChargingPile />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{numberOfChargers}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Beats</CardTitle>
                  <IconHeartbeat />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+1 Mil.</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Offline</CardTitle>
                  <IconPlugX />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{offlineChargers}</div>
                  <p className="text-xs text-muted-foreground">-19% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Currently active</CardTitle>
                  <IconActivityHeartbeat />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeChargers}</div>
                  <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4 h-[600px]">
                {/* Add a fixed height */}
                <CardHeader>
                  <CardTitle>Charge Box Map</CardTitle>
                </CardHeader>
                <CardContent className="pl-2 h-[calc(100%-80px)]">
                  {/* Subtract the approximate header height */}
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Chargebox list</CardTitle>
                  <CardDescription>Currenlty charging 20234</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <WebSocketTester />
      </Main>
    </>
  )
}

const topNav = [
  {
    title: "",
    href: "dashboard/overview",
    isActive: true,
    disabled: false,
  },
  // {
  //   title: 'Customers',
  //   href: 'dashboard/customers',
  //   isActive: false,
  //   disabled: true,
  // },
  // {
  //   title: 'Products',
  //   href: 'dashboard/products',
  //   isActive: false,
  //   disabled: true,
  // },
  // {
  //   title: 'Settings',
  //   href: 'dashboard/settings',
  //   isActive: false,
  //   disabled: true,
  // },
]
