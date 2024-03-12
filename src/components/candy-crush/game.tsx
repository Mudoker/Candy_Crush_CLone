import { createContext, useEffect, useRef, useState } from "react";
import Piece from "./piece";
import _ from "lodash";
import Board from "./board";
import { AnimationSpeedContext, defaultAnimationSpeed } from "./animation-speed-context";
import { GameState } from './game-state'

async function waitFor(delay: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), delay)
    })
}
export function convertInitialBoard(initialBoard: initialBoardType): boardType {
    return initialBoard.map((row, y) => row.map((type, x) => {
        return {
            blocked: type === -777,
            piece: {
                type,
                x,
                y,
                id: `piece${Math.floor(Math.random() * 1000000)}`,
            }
        }
    }))
}
function fillAllZero(board: boardType, availablePieces: Array<number>): boardType {
    return board.map((row, y) => row.map((tile, x) => {
        if (tile.piece.type === 0) {
            tile.piece = {
                ...tile.piece,
                type: availablePieces[Math.floor(Math.random() * availablePieces.length)],
            }
        }
        return tile
    }))
}

function isObstacle(board: boardType, x: number, y: number) {
    return x >= 0 && x < board[0].length && y >= 0 && y < board.length && board[y][x].piece.type > -777 && board[y][x].piece.type < 0
}

function getClearableMapHorizontal(board: boardType) {
    const height = board.length
    const width = board[0].length
    let clearableMap = new Array(height).fill(0).map(() => Array(width).fill(false))

    for (let i = 0; i < height; i++) {
        let j = 0
        while (j < width) {
            if (board[i][j].piece.type <= 0) {
                j++
                continue
            }
            let k = j
            while (k < width && board[i][j].piece.type === (board[i][k].piece.type)) {
                k++
            }
            if (k - j > 2) {
                for (let l = j; l < k; l++) {
                    clearableMap[i][l] ||= board[i][l].piece.type > 0
                }
            }
            j = k;
        }
    }
    return clearableMap
}
function getClearableMapVertical(board: boardType) {
    // @ts-ignore-start
    const clearableMapHorizontal = getClearableMapHorizontal(_.zip(...board))
    // @ts-ignore-end
    return _.zip(...clearableMapHorizontal)
}
function getClearableMapSquare(board: boardType) {
    const height = board.length
    const width = board[0].length
    let clearableMap = new Array(height).fill(0).map(() => Array(width).fill(false))

    for (let i = 0; i < height - 1; i++) {
        for (let j = 0; j < width - 1; j++) {
            if (board[i][j]?.piece.type <= 0) {
                continue
            }
            if (board[i][j].piece.type === (board[i][j + 1].piece.type) && board[i][j].piece.type === (board[i + 1][j].piece.type) && board[i][j].piece.type === (board[i + 1][j + 1].piece.type)) {
                clearableMap[i][j] ||= board[i][j].piece.type > 0
                clearableMap[i][j + 1] ||= board[i][j].piece.type > 0
                clearableMap[i + 1][j] ||= board[i][j].piece.type > 0
                clearableMap[i + 1][j + 1] ||= board[i][j].piece.type > 0
            }
        }
    }
    return clearableMap
}

function getClearableMap(board: boardType) {
    const height = board.length
    const width = board[0].length
    const clearableMapHorizontal = getClearableMapHorizontal(board)
    const clearableMapVertical = getClearableMapVertical(board)
    const clearableMapSquare = getClearableMapSquare(board)

    const clearableMap = new Array(height).fill(0).map(() => Array(width).fill(false))
    for (let i = 0; i < clearableMap.length; i++) {
        for (let j = 0; j < clearableMap[i].length; j++) {
            clearableMap[i][j] = clearableMapHorizontal[i][j] || clearableMapVertical[i][j] || clearableMapSquare[i][j]
        }
    }
    return clearableMap
}

function clearPieces(board: boardType) {
    let pieceCleared = false
    let pieceClearedCount: { [key: string]: number } = {}
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (!board[i][j].piece.isPopping) {
                continue
            }
            if (!pieceClearedCount.hasOwnProperty(board[i][j].piece.type)) {
                pieceClearedCount[board[i][j].piece.type] = 0
            }
            pieceClearedCount[board[i][j].piece.type]++

            if (board[i][j].piece.type < 0 && board[i][j].piece.type > -777) {
                board[i][j].piece.type++
            } else {
                board[i][j].piece.type = 0
            }
            board[i][j].piece.isPopping = false
            pieceCleared = true
        }
    }
    return { board, pieceClearedCount, pieceCleared }
}

function popPieces(board: boardType, popObstacle = true) {
    const clearableMap = getClearableMap(board)

    for (let i = 0; i < clearableMap.length; i++) {
        for (let j = 0; j < clearableMap[i].length; j++) {
            board[i][j].piece.isPopping = board[i][j].piece.isPopping || clearableMap[i][j] && board[i][j].piece.type != -777
        }
    }
    for (let i = 0; i < clearableMap.length; i++) {
        for (let j = 0; j < clearableMap[i].length; j++) {
            if (!board[i][j].piece.isPopping || board[i][j].piece.type < 0 || board[i][j].piece.type === -777 || !popObstacle) {
                continue
            }
            if (isObstacle(board, j, i - 1)) {
                board[i - 1][j].piece.isPopping = true
            } else if (isObstacle(board, j, i + 1)) {
                board[i + 1][j].piece.isPopping = true
            } else if (isObstacle(board, j - 1, i)) {
                board[i][j - 1].piece.isPopping = true
            } else if (isObstacle(board, j + 1, i)) {
                board[i][j + 1].piece.isPopping = true
            }
        }
    }

    return board
}

function dropPieces(oldBoard: boardType) {
    const board = _.cloneDeep(oldBoard)
    for (let i = board.length - 1; i >= 0; i--) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if (board[i][j].piece.type !== 0) {
                continue
            }
            let k = i - 1
            let normalPieceFound = false
            while (k >= 0 && !normalPieceFound) {
                normalPieceFound = board[k][j].piece.type > 0
                if (!normalPieceFound) k--
            }
            if (normalPieceFound) {
                swapPieces(board, { x: j, y: i }, { x: j, y: k })
            }
        }
    }
    return board
}

function swapPieces(board: boardType, source: coordinateType, destination: coordinateType) {
    [board[source.y][source.x].piece, board[destination.y][destination.x].piece] = [board[destination.y][destination.x].piece, board[source.y][source.x].piece]
}
function syncBoardPieces(board: boardType) {
    board.forEach((row, y) => {
        row.forEach((tile, x) => {
            tile.piece.x = x
            tile.piece.y = y
        })
    })
}
function isMoveLegal(board: boardType, source: coordinateType, destination: coordinateType) {
    const newBoard = _.cloneDeep(board)
    swapPieces(newBoard, source, destination)
    const map = _.flatten(getClearableMap(newBoard))
    return map.findIndex(e => e === true) >= 0
}

function getObjectDifferences(goals: { [key: string]: number }, piecesCleared: { [key: string]: number }) {
    const remainingGoals = Object.keys(goals).reduce((accumulator: { [key: string]: number }, piece) => {
        accumulator[piece] = goals[piece] - piecesCleared[piece];
        if (accumulator[piece] < 0) {
            accumulator[piece] = 0
        }
        return accumulator;
    }, {})

    // console.log("Piece cleared:", piecesCleared)
    return remainingGoals
}
function allGoalsReached(goals: { [key: string]: number }, piecesCleared: { [key: string]: number }) {
    const remainingGoals = getObjectDifferences(goals, piecesCleared)
    for (const i in remainingGoals) {
        if (remainingGoals[i] > 0) {
            return false
        }
    }
    return true
}

export default function Game({ availablePieces, initialBoard, animationSpeed = defaultAnimationSpeed, goals, moveCount}: gamePropsType) {
    const tilesContainer = useRef<HTMLDivElement>(null)
    const [boardSize, setBoardSize] = useState(1000)
    const [isProcessing, setIsProcessing] = useState(false)
    const [board, setBoard] = useState<boardType>([])
    const [movesLeft, setMovesLeft] = useState(moveCount)
    const [piecesCleared, setPiecesCleared] = useState<{ [key: string]: number }>({})
    const [gameState, setGameState] = useState('playing')
    const width = board[0]?.length
    const height = board.length

    let remainingGoals = getObjectDifferences(goals, piecesCleared)

    const move = async function ({ x, y }: coordinateType, { dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
        if (isProcessing || movesLeft <= 0 || allGoalsReached(goals, piecesCleared)) {
            return
        }
        let newBoard = _.cloneDeep(board)
        if (
            y + dy < 0 || y + dy >= height || x + dx < 0 || x + dx >= width ||
            board[y][x].blocked || board[y + dy][x + dx].blocked || board[y][x].piece.type <= 0 || board[y + dy][x + dx].piece.type <= 0 ||
            !isMoveLegal(newBoard, { x, y }, { x: x + dx, y: y + dy })) {

            if (dy === 1) {
                newBoard[y][x].piece.shakeDirection = "down"
            } else if (dy === -1) {
                newBoard[y][x].piece.shakeDirection = "up"
            } else if (dx === 1) {
                newBoard[y][x].piece.shakeDirection = "right"
            } else if (dx === -1) {
                newBoard[y][x].piece.shakeDirection = "left"
            }
            // newBoard[y][x].piece.shakeDirection = dy !== 0 ? "vertical" : "horizontal"
            setBoard(newBoard)
            await waitFor(animationSpeed.shaking)

            newBoard[y][x].piece.shakeDirection = ""
            setBoard(_.clone(newBoard))
            return
        }

        setIsProcessing(true)

        const currentMovesLeft = movesLeft - 1
        setMovesLeft(currentMovesLeft)

        swapPieces(newBoard, { x, y }, { x: x + dx, y: y + dy })
        syncBoardPieces(newBoard)
        setBoard(newBoard)
        await waitFor(animationSpeed.move)

        let newPiecesCleared = _.clone(piecesCleared)
        let result
        do {
            newBoard = popPieces(_.cloneDeep(newBoard))
            setBoard(newBoard)
            await waitFor(animationSpeed.pop)

            result = clearPieces(newBoard)
            newBoard = result.board
            newPiecesCleared = _.clone(newPiecesCleared)
            for (const piece in result.pieceClearedCount) {
                if (!newPiecesCleared.hasOwnProperty(piece)) {
                    newPiecesCleared[piece] = 0
                }
                newPiecesCleared[piece] += result.pieceClearedCount[piece]
            }
            setPiecesCleared(newPiecesCleared)
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
        } while (result.pieceCleared)

        console.log(newBoard.map(e => e.map(f => f.piece.type)))

        setIsProcessing(false)
        if (allGoalsReached(goals, newPiecesCleared)) {
            setGameState("win")
        } else if (currentMovesLeft <= 0) {
            setGameState("lose")
        }
    }

    useEffect(() => {
        let newBoard = fillAllZero( convertInitialBoard(initialBoard), availablePieces)
        let result
        do{
            newBoard = popPieces(_.cloneDeep(newBoard), false)
            result = clearPieces(newBoard)
            newBoard = result.board
            newBoard = dropPieces(newBoard)
            newBoard = fillAllZero(newBoard, availablePieces)
        }while(result.pieceCleared)
        syncBoardPieces(newBoard)
        setBoard(newBoard)
    }, [initialBoard])

    useEffect(() => {
        function calculateTileSize(){
            if(!tilesContainer.current){
                return
            }
            const referenceSize = Math.min(tilesContainer.current.offsetWidth, tilesContainer.current.offsetHeight)
            // let size = referenceSize / Math.min(width, height)
            setBoardSize(referenceSize);
        }
        calculateTileSize()

        const newPiecesCleared = {...piecesCleared}
        Object.keys(goals).forEach(piece => newPiecesCleared[piece] = 0)
        setPiecesCleared(newPiecesCleared)
        window.addEventListener("resize", calculateTileSize)
    }, [])

    return (
        <div className="overflow-hidden">
            {/* <GameState /> */}
            <AnimationSpeedContext.Provider value={animationSpeed}>
                <div className={`flex w-full mt-24`}>
                    <GameState remainingGoal={remainingGoals} remainingMove={movesLeft} gameState={gameState}/>

                    <div ref={tilesContainer}>
                        <Board board={board} onMove={move} boardSize={500}></Board>
                    </div>
                </div>
            </AnimationSpeedContext.Provider>
        </div>
    )
}