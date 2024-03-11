import { useState } from "react";
import Piece from "./piece";
import _ from "lodash";

export default function Board({board, onMove = () => {}, boardSize} : boardPropsType){
    const height = board.length
    const width = board[0] ? board[0].length : 0
    const tileSize = Math.floor(boardSize / Math.max(width, height))
    const [tappedCoordinate, setTappedCoordinate] = useState<coordinateType>({x: -1, y: -1})
    const processTap = function(x: number, y: number){
        if(tappedCoordinate.x === -1 && tappedCoordinate.y === -1){
            setTappedCoordinate({x, y})
            return
        }
        const old = tappedCoordinate
        const dx = x - old.x
        const dy = y - old.y
        if(dy === 0 && Math.abs(dx) === 1 || dx === 0 && Math.abs(dy) === 1){
            onMove(old, {dx, dy})
        }
        setTappedCoordinate({x: -1, y: -1})
    }
    return (
        <div className={"flex flex-wrap relative"} style={{width: width * tileSize, height: height * tileSize}}>
            {
                _.flatten(board).map(({piece}) => <Piece {...piece} onMove={onMove} onClick={processTap} tileSize={tileSize} key={piece.id}></Piece>)
            }
            {
                //transpose
                _.zip(...board).map((row, i) => {
                    return (
                        <div key={i}>
                            {
                                row.map((cell, j) => {
                                    if(cell?.blocked){
                                        return <div key={j} className='bg-boardBorder border-boardBorder border-8 text-black relative' style={{width: tileSize, height: tileSize}}></div>
                                    }
                                    return <div key={j} className={`${tappedCoordinate.x === i && tappedCoordinate.y === j ? "bg-yellow-400" : "bg-tile"} border-tileBorder border-4 text-black`} style={{width: tileSize, height: tileSize}}></div>
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}