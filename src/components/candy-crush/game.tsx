import { useEffect, useState } from "react";
import Piece, { piecePropsType } from "./piece";
import CandyCrush from "@/class/CandyCrush";
import _ from "lodash";

type tileType = {
    piece: piecePropsType,
    blocked: boolean,
}
type boardType = Array<Array<tileType>>
type initialBoardType = Array<Array<number>>
type gamePropsType = {
    availablePieces: Array<number>;
    width: number;
    height: number;
    initialBoard: initialBoardType
}
function convertInitialBoard(initialBoard : initialBoardType) : boardType{
    return initialBoard.map((row, y) => row.map((cell, x) => {
        return {
            blocked: cell === -777,
            piece: {
                type: cell, 
                x, 
                y, 
                id: `piece${Math.floor(Math.random() * 1000000)}`,
            }
        }
    }))
}
function fillAllZero(board: boardType, availablePieces : Array<number>) : boardType{
    return board.map((row, y) => row.map((tile, x) => {
        if(tile.piece.type === 0){
            tile.piece = {
                ...tile.piece,
                type: availablePieces[Math.floor(Math.random() * availablePieces.length)],
            }
        }
        return tile
    }))
}

function clearPieces(board: boardType){
    const height = board.length
    const width = board[0].length
    let clearableMap = new Array(height).fill(0).map(() => Array(width).fill(false))

    let pieceCleared = false
    //look for horizontal
    for (let i = 0; i < height; i++) {
        let j = 0
        while (j < width){
            let k = j
            while( k < width && board[i][j].piece.type === (board[i][k].piece.type)){
                k++
            }
            if(k - j > 2){
                for(let l = j; l < k; l++){
                    clearableMap[i][l] = true
                }
            }
            j = k;
        }
    }

    //look for vertical. Same as horizontal but flip height and width, index, etc.
    for (let i = 0; i < width; i++) {
        let j = 0
        while (j < height){
            let k = j
            while(k < height && board[j][i].piece.type === (board[k][i].piece.type)){
                k++
            }
            if(k - j > 2){
                for(let l = j; l < k; l++){
                    clearableMap[l][i] = true
                }
            }
            j = k;
        }
    }

    //look for square
    for (let i = 0; i < height - 1; i++){
        for(let j = 0; j < width - 1; j++){
            if(board[i][j].piece.type === (board[i][j + 1].piece.type) && board[i][j].piece.type === (board[i + 1][j].piece.type) && board[i][j].piece.type === (board[i + 1][j + 1].piece.type)){
                clearableMap[i][j] = true
                clearableMap[i][j + 1] = true
                clearableMap[i + 1][j] = true
                clearableMap[i + 1][j + 1] = true
            }
        }
    }
    
    for (let i = 0; i < clearableMap.length; i++) {
        for (let j = 0; j < clearableMap[i].length; j++) {
            if(clearableMap[i][j]){
                board[i][j].piece.type = 0
                pieceCleared = true
            }
        }
    }

    return {board, pieceCleared}
}

function syncBoardPieces(board : boardType){
    board.forEach((row, y) => {
        row.forEach((piece, x) => {
            piece.piece.x = x
            piece.piece.y = y
        })
    })
}

export default function Game({width, height, availablePieces, initialBoard} : gamePropsType){
    // const width = 5, height = 5, tileSize = 100
    // const {width, height} = candyCrush
    const tileSize = 100
    const [board, setBoard] = useState<boardType>([])
    const moveBro = function(x: number, y: number, {dx = 0, dy = 0} : {dx? : number; dy?: number}){
        let newBoard = board.map(row => row.map(cell => cell))

        const temp = newBoard[y+dy][x+dx]
        newBoard[y+dy][x+dx] = newBoard[y][x]
        newBoard[y][x] = temp

        newBoard = clearPieces(newBoard).board

        syncBoardPieces(newBoard)

        setBoard(newBoard)
    }
    
    useEffect(() => {
        const newBoard = fillAllZero( convertInitialBoard(initialBoard), availablePieces)
        setBoard(newBoard)

        // setTimeout(function(){
        //     setBoard(clearPieces(newBoard).board)
        // }, 3000)
    }, [initialBoard])
    const pieces = _.flatten(board).map(tile => tile.piece)
    return (
        <div className={"flex flex-wrap relative"} style={{width: width * tileSize}}>
            {
                _.flatten(board).map(({piece}) => <Piece {...piece} onSwipe={moveBro} tileSize={tileSize} key={piece.id}></Piece>)
            }
            {
                board.map((row, i) => {
                    return (
                        <div key={i}>
                            {row.map((cell, j) => <div key={j} className='bg-tile border-tileBorder border-2 text-black' style={{width: tileSize, height: tileSize}}></div>)}
                        </div>
                    )
                })
            }
        </div>
    )
}