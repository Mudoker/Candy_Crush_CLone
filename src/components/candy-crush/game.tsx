import { useEffect, useState } from "react";
import Piece, { piecePropsType } from "./piece";
import CandyCrush from "@/class/CandyCrush";
import _ from "lodash";


type coordinateType = {x: number, y: number}
type tileType = {
    piece: piecePropsType,
    blocked: boolean,
}
type boardType = tileType[][]
type initialBoardType = number[][]
type gamePropsType = {
    availablePieces: number[];
    width: number;
    height: number;
    initialBoard: initialBoardType
}
async function wait(delay: number){
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), delay)
    })
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

function getClearableMap(board : boardType){
    const height = board.length
    const width = board[0].length
    let clearableMap = new Array(height).fill(0).map(() => Array(width).fill(false))

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
    return clearableMap
}

function clearPieces(board: boardType){
    let pieceCleared = false
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if(board[i][j].piece.isPopping){
                board[i][j].piece.type = 0
                board[i][j].piece.isPopping = false
                pieceCleared = true
            }
        }        
    }
    return {board, pieceCleared}
}

function popPieces(board: boardType){
    const clearableMap = getClearableMap(board)

    for (let i = 0; i < clearableMap.length; i++) {
        for (let j = 0; j < clearableMap[i].length; j++) {
            if(clearableMap[i][j] && board[i][j].piece.type != -777){
                board[i][j].piece.isPopping = true
            }
        }
    }

    return board
}

function dropPieces(oldBoard: boardType){
    // const transposedBoard = _.zip(...board)
    // console.log(transposedBoard.map(row => row.map(tile => tile?.piece)))
    const board = _.cloneDeep(oldBoard)
    for (let i = board.length - 1; i >= 0; i--) {
        const row = board[i];
        // console.log(row)
        for (let j = 0; j < row.length; j++) {
            if(board[i][j].piece.type === 0){
                let k = i - 1
                let normalPieceFound = false
                while( k >= 0 && !normalPieceFound){
                    normalPieceFound = board[k][j].piece.type > 0
                    if(!normalPieceFound) k--
                }
                if(normalPieceFound){
                    swapPieces(board, {x: j, y: i}, {x: j, y: k})
                }
            }
        }
    }
    return board
}

function swapPieces(board : boardType, source : coordinateType, destination : coordinateType){
    const temp = board[source.y][source.x].piece
    board[source.y][source.x].piece = board[destination.y][destination.x].piece
    board[destination.y][destination.x].piece = temp
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
    const moveBro = async function(x: number, y: number, {dx = 0, dy = 0} : {dx? : number; dy?: number}){
        let newBoard = board.map(row => row.map(cell => cell))

        // const temp = newBoard[y+dy][x+dx].piece
        // newBoard[y+dy][x+dx].piece = newBoard[y][x].piece
        // newBoard[y][x].piece = temp
        swapPieces(newBoard, {x, y}, {x: x + dx, y: y + dy})
        syncBoardPieces(newBoard)
        setBoard(newBoard)
        await wait(250)

        newBoard = popPieces(_.cloneDeep(newBoard))
        setBoard(newBoard)
        await wait(1000)

        let result = clearPieces(newBoard)
        while(result.pieceCleared){
            newBoard = result.board
            syncBoardPieces(newBoard)
            setBoard(newBoard)
            await wait(250)
            
            newBoard = dropPieces(newBoard)
            syncBoardPieces(newBoard)
            setBoard(newBoard)
            await wait(250)

            newBoard = fillAllZero(newBoard, availablePieces)
            syncBoardPieces(newBoard)
            setBoard(newBoard)
            await wait(250)

            // syncBoardPieces(newBoard)
            // setBoard(newBoard)
            // await wait(500)

            newBoard = popPieces(_.cloneDeep(newBoard))
            setBoard(newBoard)
            await wait(1000)
    
            result = clearPieces(newBoard)
        }
        // newBoard = clearPieces(newBoard).board
        // console.log(newBoard)
        // dropPieces(newBoard)
        // syncBoardPieces(newBoard)

        // setBoard(newBoard)
    }
    
    useEffect(() => {
        const newBoard = fillAllZero( convertInitialBoard(initialBoard), availablePieces)
        setBoard(newBoard)
    }, [initialBoard])
    const pieces = _.flatten(board).map(tile => tile.piece)
    return (
        <div className={"flex flex-wrap relative"} style={{width: width * tileSize}}>
            {
                _.flatten(board).map(({piece}) => <Piece {...piece} onSwipe={moveBro} tileSize={tileSize} key={piece.id}></Piece>)
            }
            {
                _.zip(...board).map((row, i) => {
                    return (
                        <div key={i}>
                            {
                                row.map((cell, j) => {
                                    if(cell.blocked){
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