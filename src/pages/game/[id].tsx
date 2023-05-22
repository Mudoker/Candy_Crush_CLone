import Game from "@/components/candy-crush/game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { availableStageType, fetchStage } from "./available-stages";
import Modal from 'react-modal';
import ButtonPrimary from "@/components/button-primary";

export default function Page(){
  const router = useRouter()
  const [stage, setStage] = useState<availableStageType>()
  const [endgameStatus, setEndgameStatus] = useState("")
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
      <Modal
        isOpen={endgameStatus !== ""}
        contentLabel="Example Modal"
        style={{
          overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex'}, 
        }}
        className={`m-auto border-orange-600 rounded-xl border-4 bg-orange-200 flex items-center justify-center flex-col px-20 py-5 outline-none`}
      >
        <div className="w-full text-3xl font-bold text-center mb-5 text-orange-600">
          { endgameStatus === "win" ? 
            <>
              <img src={`/thumbs.svg`} /> 
              <div>You win</div>
            </> : <>
              <img src={`/thumbs.svg`} className="rotate-180"/> 
              <div>You lose</div>
            </>}
        </div>
        <ButtonPrimary className={`text-3xl`} onClick={() => router.back()}>Back</ButtonPrimary>
      </Modal>
      {
        !!stage ? <Game onGameFinished={setEndgameStatus} availablePieces={stage.availablePieces} initialBoard={stage.board} moveCount={stage.moveCount} goals={stage.goals}></Game>
        : null
      }
    </main>
  )
}