import Image from 'next/image'
import { Inter } from 'next/font/google'
import CandyCrush from '@/class/CandyCrush'
import Game from '@/components/candy-crush/game'

const inter = Inter({ subsets: ['latin'] })


// const candyCrush = new CandyCrush(7, 7)
export default function Home() {
  const initialBoard = [
    [ -777, 0, 0, 0, 0],
    [ -777, 0, 0, 0, 0],
    [ -777, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0],
    [ 0, 0, 0, -777, -777],
    [ -1, -2, 0, 0, 0],
  ]
  const availablePieces = [1, 2, 3, 4]
  return <Game initialBoard={initialBoard} availablePieces={availablePieces} width={initialBoard[0].length} height={initialBoard.length}></Game>
}
