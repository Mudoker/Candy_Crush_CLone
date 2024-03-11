/* eslint-disable @next/next/no-img-element */
import React from 'react'
export const GameState = () => {
  return (
    <div className='bg-white text-white items-center tracking-tighter font-BeVietnamPro mr-2 w-[260px]'>
      <div className='bg-[#3a4c95] text-2xl px-3.5 py-3'>
        <div className='tracking-tighter leading-none flex items-center gap-3 mt-4 w-[180px]'>
          {'COOKIES YOU NEED TO CRASH'}

          {/* <img className='w-7 h-7 fill-white' alt="nct" src={`/arrow-down-left.svg`} /> */}
        </div>

        <div className='flex flex-col mt-7 gap-2 items-center'>
          <div className='flex gap-2 items-center'>
            <img className=' w-20 h-20 first-letter' alt="nct" src={`/pieces/piece-1.png`} />

            <div>
              {'x20'}
            </div>
          </div>

          <div className='flex gap-2 items-center'>
            <img className='w-20 h-20' alt="nct" src={`/pieces/piece-2.png`} />

            <div>
              {'x20'}
            </div>
          </div>
        </div>

        <div className='flex justify-between leading-none mb-4 mt-4'>
          <div className='w-4 tracking-tight'>{'MOVE LEFT'}</div>

          <div className=' border-2 rounded-full px-8 py-2 self-center'>
            {69}
          </div>
        </div>
      </div>

      <div className='text-[#3a4c95] text-left p-2 py-4 text-3xl font-semibold my-2 leading-none flex items-center justify-center'>
        {'Neo Culture Tech Club'}
      </div>

    </div>
  )
}
