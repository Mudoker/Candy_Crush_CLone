/* eslint-disable @next/next/no-img-element */
import Button from "../components/button";

export default function Home() {

  return (
    <main>
      <div className={`flex bg-orange-300 p-4`} style={{height: "100svh"}}>
      <div className={`relative m-auto bg-[#364e9a] rounded-lg w-full max-w-md pb-14`}>
          <img alt="nct" src={`/logo.png`} />

          <div className="absolute bottom-0 left-0 right-0 mb-10 flex items-center justify-center">
            <Button href={'/game/0'} className={`font-thin`}>{'START'}</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
