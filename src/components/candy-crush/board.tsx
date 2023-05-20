import Piece from "./piece";
import _ from "lodash";

export default function Board({board, onSwipe = () => {}, boardSize} : boardPropsType){
    const height = board.length
    const width = board[0]?.length
    const tileSize = Math.floor(boardSize / Math.max(width, height))
    return (
        <div className={"flex flex-wrap relative"} style={{width: width * tileSize, height: height * tileSize}}>
            {
                _.flatten(board).map(({piece}) => <Piece {...piece} onSwipe={onSwipe} tileSize={tileSize} key={piece.id}></Piece>)
            }
            {
                _.zip(...board).map((row, i) => {
                    return (
                        <div key={i}>
                            {
                                row.map((cell, j) => {
                                    if(cell?.blocked){
                                        return <div key={j} className='bg-boardBorder border-boardBorder border-8 text-black z-10 relative' style={{width: tileSize, height: tileSize}}></div>
                                    }
                                    return <div key={j} className='bg-tile border-tileBorder border-4 text-black' style={{width: tileSize, height: tileSize}}></div>
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}