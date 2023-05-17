import { createContext, useEffect, useRef, useState } from "react";
import Piece, { piecePropsType } from "./piece";
import CandyCrush from "@/class/CandyCrush";
import _ from "lodash";

export const defaultAnimationSpeed = {pop: 200, appear: 200, clear: 100, move: 200, shaking: 100}
export const AnimationSpeedContext = createContext(defaultAnimationSpeed)

type coordinateType = {x: number, y: number}
type tileType = {
    piece: piecePropsType,
    blocked: boolean,
}
type animationSpeedType = {pop: number; appear: number; clear: number; move: number; shaking: number;}
type boardType = tileType[][]
type initialBoardType = number[][]
type gamePropsType = {
    availablePieces: number[];
    width: number;
    height: number;
    initialBoard: initialBoardType;
    animationSpeed?: animationSpeedType
}
async function waitFor(delay: number){
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
            if(board[i][j]?.piece.type <= 0){
                j++
                continue
            }
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
            if(board[i][j]?.piece.type <= 0){
                j++
                continue
            }
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
            if(board[i][j]?.piece.type <= 0){
                continue
            }
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
            if(!board[i][j].piece.isPopping){
                continue
            }
            board[i][j].piece.type = 0
            board[i][j].piece.isPopping = false
            pieceCleared = true
        }        
    }
    return {board, pieceCleared}
}

function popPieces(board: boardType){
    const clearableMap = getClearableMap(board)

    for (let i = 0; i < clearableMap.length; i++) {
        for (let j = 0; j < clearableMap[i].length; j++) {
            board[i][j].piece.isPopping = board[i][j].piece.isPopping || clearableMap[i][j] && board[i][j].piece.type != -777
        }
    }

    return board
}

function dropPieces(oldBoard: boardType){
    const board = _.cloneDeep(oldBoard)
    for (let i = board.length - 1; i >= 0; i--) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if(board[i][j].piece.type !== 0){
                continue
            }
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
    return board
}

function swapPieces(board : boardType, source : coordinateType, destination : coordinateType){
    [board[source.y][source.x].piece, board[destination.y][destination.x].piece] = [board[destination.y][destination.x].piece, board[source.y][source.x].piece]
}
function syncBoardPieces(board : boardType){
    board.forEach((row, y) => {
        row.forEach((piece, x) => {
            piece.piece.x = x
            piece.piece.y = y
        })
    })
}
function isMoveLegal(board : boardType, source : coordinateType, destination : coordinateType){
    const newBoard = _.cloneDeep(board)
    swapPieces(newBoard, source, destination)
    const map = _.flatten(getClearableMap(newBoard))
    // console.log(map)
    return map.findIndex(e => e === true) >= 0
}

export default function Game({width, height, availablePieces, initialBoard, animationSpeed = defaultAnimationSpeed} : gamePropsType){
    const tilesContainer = useRef<HTMLDivElement>(null)
    const [tileSize, setTileSize] = useState(100)
    const [isProcessing, setIsProcessing] = useState(false)
    const [board, setBoard] = useState<boardType>([])
    const moveBro = async function(x: number, y: number, {dx = 0, dy = 0} : {dx? : number; dy?: number}){
        if(isProcessing){
            return
        }
        setIsProcessing(true)
        let newBoard = _.cloneDeep(board)
        if(
            y + dy < 0 || y + dy >= height || x + dx < 0 || x + dx >= width ||
            board[y][x].blocked || board[y + dy][x + dx].blocked || board[y][x].piece.type <= 0 || board[y + dy][x + dx].piece.type <= 0 || 
            !isMoveLegal(newBoard, {x, y}, {x: x + dx, y: y + dy}) ) {
            
                if(dy === 1){
                    newBoard[y][x].piece.shakeDirection = "down"
                }else if(dy === -1){
                    newBoard[y][x].piece.shakeDirection = "up"
                }else if(dx === 1){
                    newBoard[y][x].piece.shakeDirection = "right"
                }else if(dx === -1){
                    newBoard[y][x].piece.shakeDirection = "left"
                }
                // newBoard[y][x].piece.shakeDirection = dy !== 0 ? "vertical" : "horizontal"
                setBoard(newBoard)
                await waitFor(animationSpeed.shaking)

                newBoard[y][x].piece.shakeDirection = ""
                setBoard(_.clone(newBoard))
                return
        }

        swapPieces(newBoard, {x, y}, {x: x + dx, y: y + dy})
        syncBoardPieces(newBoard)
        setBoard(newBoard)
        await waitFor(animationSpeed.move)

        let result
        do {
            newBoard = popPieces(_.cloneDeep(newBoard))
            setBoard(newBoard)
            await waitFor(animationSpeed.pop)

            result = clearPieces(newBoard)
            newBoard = result.board
            syncBoardPieces(newBoard)
            setBoard(newBoard)
            await waitFor(animationSpeed.clear)

            newBoard = dropPieces(newBoard)
            syncBoardPieces(newBoard)
            setBoard(newBoard)
            await waitFor(animationSpeed.move)

            newBoard = fillAllZero(newBoard, availablePieces)
            syncBoardPieces(newBoard)
            setBoard(newBoard)
            await waitFor(animationSpeed.appear)
        } while(result.pieceCleared)

        setIsProcessing(false)
    }
    
    useEffect(() => {
        let newBoard = fillAllZero( convertInitialBoard(initialBoard), availablePieces)
        let result
        do{
            newBoard = popPieces(_.cloneDeep(newBoard))
            result = clearPieces(newBoard)
            newBoard = result.board
            newBoard = dropPieces(newBoard)
            newBoard = fillAllZero(newBoard, availablePieces)
        }while(result.pieceCleared)
        syncBoardPieces(newBoard)
        setBoard(newBoard)
    }, [initialBoard])
    useEffect(() => {
        function handleResize(){
            if(!tilesContainer.current){
                return
            }
            const referenceSize = Math.min(tilesContainer.current.offsetWidth)
            let size = referenceSize / Math.min(width, height)
            setTileSize(Math.min(size, 75));
        }
        handleResize()
        window.addEventListener("resize", handleResize)
    }, [])
    
    return (
        <AnimationSpeedContext.Provider value={animationSpeed}>
            <div className={"flex flex-wrap relative"} style={{width: width * tileSize, height: height * tileSize}}>
                {
                    _.flatten(board).map(({piece}) => <Piece {...piece} onSwipe={moveBro} tileSize={tileSize} key={piece.id}></Piece>)
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
        </AnimationSpeedContext.Provider>
    )
}