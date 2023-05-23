export type availableStageType = {
  board: initialBoardType,
  moveCount: number,
  goals: { [key : string] : number},
  availablePieces: number[],
}
  
export const availableStages : availableStageType[] = [
  {
    board: [
      [ -777, 0, 0, 0, 0, 0, -777],
      [ -777, 0, 0, 0, 0, 0, 0],
      [ -777, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, -777],
      [ 0, 0, 0, 0, 0, 0, -777],
      [ 0, 0, 0, -777, -777, 0, -777],
      [ -1, -2, 0, 0, 0, 0, -777],
    ],
    moveCount: 20,
    goals: {"1" : 10, "2" : 10},
    availablePieces: [1, 2, 3, 4],
  },
  {
    board: [
      [ -777, 0, 0, 0, 0],
      [ -777, 0, 0, 1, 0],
      [ 0, 0, -1, -1, 0],
      [ 0, 0, 0, 0, 0],
      [ 0, 0, 0, -777, -777],
    ],
    moveCount: 30,
    goals: {"1" : 10, "2" : 10, "3" : 10},
    availablePieces: [1, 2, 3, 4],
  },
  {
    board: [
      [ 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0],
      [ 0, 0, -1, -1, -1],
      [ 0, 0, -1, -1, -1],
      [ 0, 0, -1, -1, -1],
    ],
    moveCount: 20,
    goals: {"-1" : 9, "2" : 10},
    availablePieces: [1, 2, 3, 4],
  }
]

export async function fetchAvailableStages(){
  return new Promise<{success: boolean, availableStages: availableStageType[]}>((resolve, reject) => {
    // setTimeout(() => {
      resolve({
        success: true,
        availableStages,
      })
    // }, 1000)
  })
}

export async function fetchStage(id : any){
  if(parseInt(id) < 0){
    return
  }
  return new Promise<{success: boolean, stage: availableStageType}>((resolve, reject) => {
    // setTimeout(() => {
      resolve({
        success: true,
        stage: availableStages[id],
      })
    // }, 1000)
  })
}