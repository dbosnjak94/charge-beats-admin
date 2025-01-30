import { AngryRobotBassButton } from '@/sounds/drum-and-bass/angry-robot-bass'
import ShakerButton from '@/sounds/drum-and-bass/shaker-percusions'
import TSPBeatButton from '@/sounds/drum-and-bass/solid-and-thick-drum'
import AcidBassButton from '@/sounds/techno/acid-bass'
import AcidLeadButton from '@/sounds/techno/acid-lead'
import TechnoDrumButton from '@/sounds/techno/tehcno-drum'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

export function RecentSales() {
  return (
    <ScrollArea className='w-full h-fit'>
      <div className='space-y-8 p-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/01.png' alt='Avatar' />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>Chargebox 1</p>
              <p className='text-sm text-muted-foreground'>
                Address 12, Copenhagen
              </p>
            </div>
            <div className='font-medium'>
              <TSPBeatButton className='w-full' />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Avatar className='flex h-9 w-9 items-center justify-center space-y-0 border'>
            <AvatarImage src='/avatars/02.png' alt='Avatar' />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>Chargebox 2</p>
              <p className='text-sm text-muted-foreground'>
                Address 23, Berlin
              </p>
            </div>
            <div className='font-medium'>
              <AngryRobotBassButton className='w-full' />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/03.png' alt='Avatar' />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>Chargebox 3</p>
              <p className='text-sm text-muted-foreground'>
                Address 43, Zagreb
              </p>
            </div>
            <div className='font-medium'>
              <ShakerButton className='w-full' />
            </div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/04.png' alt='Avatar' />
            <AvatarFallback>WK</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>Chargebox 4</p>
              <p className='text-sm text-muted-foreground'>Adress 32</p>
            </div>
            <div className='font-medium'>
              <AcidBassButton className='w-full' />
            </div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/05.png' alt='Avatar' />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>Chargebox 5</p>
              <p className='text-sm text-muted-foreground'>
                Address 124, London
              </p>
            </div>
            <div className='font-medium'>
              <TechnoDrumButton className='w-full' />
            </div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/05.png' alt='Avatar' />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>Chargebox 6</p>
              <p className='text-sm text-muted-foreground'>
                Address 120, New York
              </p>
            </div>
            <div className='font-medium'>
              <AcidLeadButton className='w-full' />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

{
  /* <PluckMelodyButton className='w-full' />
<FunkyLeadButton className='w-full' />
<PulseSynthButton className='w-full' />
<ElectronicBassButton className='w-full' /> */
}
