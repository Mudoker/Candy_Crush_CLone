import Image from 'next/image'
import { Inter } from 'next/font/google'
import CandyCrush from '@/class/CandyCrush'
import Game from '@/components/game'

const inter = Inter({ subsets: ['latin'] })


const candyCrush = new CandyCrush(7, 7)
export default function Home() {
  return <Game candyCrush={candyCrush}></Game>
}
