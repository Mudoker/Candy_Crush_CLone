import ButtonPrimary from "@/components/button-primary";
import Board from "@/components/candy-crush/board";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import React, {useEffect, useRef, useState} from 'react'
import { convertInitialBoard } from "@/components/candy-crush/game";
import { availableStageType, fetchAvailableStages } from "../../components/available-stages";

export default function GamePage(){
  const [availableStages, setAvailableStages] = useState<availableStageType[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [boardSize, setBoardSize] = useState(0)

  const tilesContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function calculateTileSize(){
      if(!tilesContainer.current){
          return
      }
      const referenceSize = Math.min(tilesContainer.current.offsetWidth)
      setBoardSize(referenceSize)
    }
    async function init(){
      const result = await fetchAvailableStages()
      const processedStages = result.availableStages
      setAvailableStages(processedStages)
      calculateTileSize()
      window.addEventListener("resize", calculateTileSize)
    }
    init()
  }, [])
  return (
    <main>
      <div className={`flex bg-orange-300 p-4`} style={{minHeight: "100svh"}}>
        <div className={`m-auto flex flex-col border-4 border-orange-600 bg-orange-200 rounded-lg w-full max-w-md p-4`}>
          <img src={`/logo.svg`} className="w-3/4 mx-auto"/>
          <div ref={tilesContainer} className="mb-4">
            <Carousel onChange={setSelectedIndex} showIndicators={false} showThumbs={false} showStatus={false}>
              {
                availableStages.map((availableStage, i) => (
                  <div className={`flex flex-col items-center justify-center h-full`} key={i}>
                    <div className={`bg-orange-50 border-orange-600 border-4 rounded-lg text-orange-600 mb-2`}>
                      <p className="text-xl font-bold mb-2">Target</p>
                      <div className="flex flex-wrap items-center justify-center">
                        {
                          Object.keys(availableStage.goals).map((piece, j) => {
                            return (
                              <div key={j} className="flex items-center justify-center mx-2">
                                <img src={`/pieces/piece-${piece}.svg`} className="w-8 h-8 mr-2" />
                                <p className="whitespace-nowrap">X {availableStage.goals[piece]}</p>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                    <Board board={convertInitialBoard(availableStage.board)} boardSize={boardSize}></Board>
                  </div>
                ))
              }
            </Carousel>
          </div>
          <ButtonPrimary href={`/game/${selectedIndex}`}>Play</ButtonPrimary>
        </div>
      </div>
    </main>
  )
}