import { TwitterForm } from '@/components/TwitterForm'
import { FallingPetals } from '@/components/FallingPetals'
import Image from 'next/image'

export default function Page() {
  return (
    <main className="absolute bg-[#FFB7C5] h-screen w-screen overflow-hidden">
      <FallingPetals />

      <div className='absolute top-0 left-0  '>
      <Image src="/new.png" alt="Sakura" width={200} height={200} />
      </div>


        <div className="absolute w-2/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
        <TwitterForm showHeading={true} />
      </div>
      
      <div className='absolute bottom-0 right-0 scale-x-[-1] scale-y-[-1] '>
      <Image src="/new.png" alt="Sakura" width={200} height={200} />
      </div>
    </main>
  )
} 