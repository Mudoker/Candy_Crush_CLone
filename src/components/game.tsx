import Image from 'next/image'
import {RefObject, useEffect, useRef, useState} from 'react'
import CandyCrush from '@/class/CandyCrush';
import Piece from './piece';
import CandyCrushPiece from '@/class/CandyCrushPiece';

export default function Game({candyCrush} : {candyCrush: CandyCrush}) {
  const tilesContainer = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState(0);
  const [toggle, triggerToggle] = useState(false);

  useEffect(() => {
    function handleResize(){
      if(tilesContainer.current){
        setSize(Math.max(tilesContainer.current.offsetWidth / candyCrush.width, 100));
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
  }, []);

  const swipeHandler = (prop : any) => { 
    candyCrush.swipe(prop)
    console.log(candyCrush.board)
  }

  // let width = 100 / candyCrush.width
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-12`}
    >
      <div className={`flex flex-wrap w-full items-center`}>
        <div className={`mx-auto relative`} ref={tilesContainer}>
          {
            candyCrush.board.map((row, i) => {
              return (
                <div className={`flex items-center justify-center border-boardBorder border-x-4 ${i === 0 ? "border-t-4" : i === candyCrush.height - 1 ? "border-b-4" : ""}`} key={i}> 
                  {
                    row.map((tile, j) => {
                      return ( 
                        <div className={`bg-tile border-tileBorder border-2 flex`} style={{width: size, height: size}} key={j}>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
          {
            Object.values(candyCrush.pieces).map((piece) => {
              return <Piece swipeHandler={swipeHandler} candyCrushPiece={piece} tileSize={size}/>
            })
          }
        </div>
      </div>
    </main>
  )
}
