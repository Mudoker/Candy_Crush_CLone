// import Image from 'next/image'
import { Inter } from 'next/font/google'
import CandyCrush from '@/class/CandyCrush'
import Game from '@/components/candy-crush/game'
import ButtonPrimary from '@/components/button-primary'
import images from '@/components/images-list'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })


// const candyCrush = new CandyCrush(7, 7)
export default function Home() {
  useEffect(function(){
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [])
  // const initialBoard = [
  //   [ -777, 0, 0, 0, 0],
  //   [ -777, 0, 0, 0, 0],
  //   [ -777, 0, 0, 0, 0],
  //   [ 0, 0, 0, 0, 0],
  //   [ 0, 0, 0, 0, 0],
  //   [ 0, 0, 0, -777, -777],
  //   [ -1, -2, 0, 0, 0],
  // ]
  // const availablePieces = [1, 2, 3, 4]
  // return <Game initialBoard={initialBoard} availablePieces={availablePieces} width={initialBoard[0].length} height={initialBoard.length}></Game>
  
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
