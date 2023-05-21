import Game from "@/components/candy-crush/game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { availableStageType, fetchStage } from "./available-stages";

export default function Page(){
  const router = useRouter()
  const [stage, setStage] = useState<availableStageType>()
  const id = router.query
  useEffect(() => {
    async function init(){
      const response = await fetchStage(router.query.id)
      if(!response?.success){
        return
      }
      setStage(response.stage)
    }
    init()
  }, [id])
  return (
    <main className="bg-orange-300" style={{minHeight: "100svh"}}>
      {
        !!stage ? <Game availablePieces={stage.availablePieces} initialBoard={stage.board} moveCount={stage.moveCount} goals={stage.goals}></Game>
        : null
      }
    </main>
  )
}