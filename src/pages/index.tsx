// import Image from 'next/image'
import { Inter } from 'next/font/google'
import Game from '@/components/candy-crush/game'
import ButtonPrimary from '@/components/button-primary'
import images from '@/components/images-list'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(function(){
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [])


  return (
    <main>
      <div className={`flex bg-orange-300 p-4`} style={{height: "100svh"}}>
        <div className={`m-auto flex flex-col border-4 border-orange-600 bg-orange-200 rounded-lg w-full max-w-md p-4`}>
          <img src={`/logo.svg`} />
          <ButtonPrimary href={`/game`}>Play</ButtonPrimary>
        </div>
      </div>
    </main>
  )
}
