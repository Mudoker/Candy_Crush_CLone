/* eslint-disable @next/next/no-img-element */
import Game from "@/components/candy-crush/game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { availableStageType, fetchStage } from "../../components/available-stages";
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
  }, [id, router.query.id])

  return (
    <main className="bg-orange-300 flex">
      <Modal
        isOpen={endgameStatus !== ""}
        contentLabel="Example Modal"
        style={{
          overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex'},
        }}
        className={`m-auto border-orange-600 rounded-xl border-4 bg-orange-200 flex items-center justify-center flex-col px-10 py-5 outline-none`}
      >
        <div className="w-full text-3xl font-bold text-center mb-5 text-orange-600">
          { endgameStatus === "win" ?
            <>
              <img alt="thumb" src={`/thumbs.svg`} />
              <div>You win</div>
            </> : <>
              <img alt="thumb" src={`/thumbs.svg`} className="rotate-180"/>
              <div>You lose</div>
            </>}
        </div>
        <ButtonPrimary className={`text-3xl`} onClick={() => router.replace('/')}>Back</ButtonPrimary>
      </Modal>
      <div className="m-auto flex flex-col w-full items-center">
        <div className="" style={{minHeight: "100svh"}}>
          {
            !!stage ? <Game availablePieces={stage.availablePieces} initialBoard={stage.board} moveCount={stage.moveCount} goals={stage.goals}></Game>
            : null
          }
        </div>
      </div>
    </main>
  )
}