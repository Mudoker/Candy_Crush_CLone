import CandyCrushPiece from "./CandyCrushPiece"
import CandyCrushTile from "./CandyCrushTile"
import { CandyCrushBoard, CandyCrushRow, CandyCrushCoordinate } from "./CandyCrushType"

const blankPiece = {type: 0, id: 0, x: -1, y: -1}

async function wait(ms : number){
    return await new Promise<void>((resolve, reject) => {
        setTimeout(function(){
            resolve()
        }, ms)
    })
}

class CandyCrush {
    board: CandyCrushBoard
    pieces: {[key: string] : CandyCrushPiece} = {}
    width: number
    height: number
    availablePieces: Array<number>
    currentId: number = 0
    reactUpdatesPaused: boolean = true
    constructor(width: number, height: number, availablePieces: Array<number> = [1, 2, 3, 4]){
        this.width = width
        this.height = height
        this.availablePieces = availablePieces
        
        this.reactUpdatesPaused = true
        this.board = this.generateEmptyBoard();
        this.fillAllZeros()

        // while(this.clearBoard()){
        //     this.fillAllZeros();
        // }
        this.reactUpdatesPaused = false

        this.refreshPiecesList()

        console.log(this.board.map(row => row.map(tile => tile.piece?.type)))
        
        this.swipe = this.swipe.bind(this)
        this.move = this.move.bind(this)
    }

    swipe({candyCrushPiece, dx, dy} : {candyCrushPiece: CandyCrushPiece, dx: 0 | 1 | -1, dy: 0 | 1 | -1}){
        console.log(candyCrushPiece)
        const origin = {
            x: candyCrushPiece.x,
            y: candyCrushPiece.y,
        }
        const destination = {
            x: candyCrushPiece.x + dx,
            y: candyCrushPiece.y + dy,
        }
        this.move({
            origin,
            destination,
        })

        // this.board[origin.y][origin.x].x += dx
        // this.board[origin.y][origin.x].y += dy

        // this.board[destination.y][destination.x].x -= dx
        // this.board[destination.y][destination.x].y -= dy
    }

    move({origin, destination} : {origin: CandyCrushCoordinate, destination: CandyCrushCoordinate}){
        let nextBoard = this.board.map(arr => arr.slice())
        
        let temp = nextBoard[destination.y][destination.x]
        nextBoard[destination.y][destination.x] = nextBoard[origin.y][origin.x]
        nextBoard[origin.y][origin.x] = temp

        this.board = nextBoard

        return true
    }

    dropPieces(){
        for(let j = 0; j < this.width; j++){
            const columnOfTiles : Array<CandyCrushTile> = []
            const pieces : Array<CandyCrushPiece> = []
            for (let i = 0; i < this.height; i++) {
                const tile = this.board[i][j]
                tile.piece = null
                columnOfTiles.push(tile)
            }

            let tileIndex = this.height - 1
            while(pieces.length >= 0 && tileIndex >= 0){
                if(!columnOfTiles[tileIndex].piece){
                    columnOfTiles[tileIndex].piece = pieces.pop()
                }
                tileIndex--
            }
        }
        this.refreshPiecesList()
        // let originalBoard = this.board
        // let transposedBoard = originalBoard.length > 0 ? originalBoard[0].map((col, i) => originalBoard.map(row => row[i].piece)) : [];

        // let transposedPieces = this.board.length > 0 ? this.board[0].map((col, i) => this.board.map(row => row[i].piece)) : []
        // for(let i = this.height - 1; i >= 0; i--) {
        //     this.board[i].forEach((tile, j) => {
        //         if(!tile.piece){
        //             let rowOfFirstFoundPiece = i - 1
        //         }
        //     })
        // }
        // for (let i = 0; i < transposedBoard.length; i++) {
        //     let column = transposedBoard[i]
        //     let blockLocations = column.map((value, index) => value !== -1 ? index : -1).filter(index => index !== -1)
        // }
        // for (let i = 0; i < transposedBoard.length; i++) {
        //     let column = transposedBoard[i].filter(piece => piece.type !== 0 && piece.type !== -1)
        //     let padding = Array<CandyCrushPiece | null>(this.height - column.length).fill(null)
        //     transposedBoard[i] = [...padding, ...column]
        // }
        // transposedBoard = this.fillAllZeros(transposedBoard)

        // this.board = transposedBoard.length > 0 ? transposedBoard[0].map((col, i) => transposedBoard.map(row => row[i])) : [];
    }
    generateEmptyBoard() : CandyCrushBoard{
        return Array<CandyCrushRow | undefined>(this.height).fill(undefined).map( () => {
            return Array<CandyCrushTile | undefined>(this.width).fill( undefined ).map(() => new CandyCrushTile)
        })
    }
    refreshPiecesList(){
        if(this.reactUpdatesPaused){
            return
        }
        const newPieces : {[key: string]: CandyCrushPiece} = {}
        this.board.forEach((row, i) => {
            row.forEach((tile, j) => {
                if(tile.piece){
                    newPieces[tile.piece.id + ""] = tile.piece
                    tile.piece.updateCoordinate({x: j, y:i})
                }
            })
        })
        const missingPieces : {[key: string]: CandyCrushPiece} = {}
        for (const id in this.pieces) {
            if(newPieces.hasOwnProperty(id)){
                missingPieces[id] = this.pieces[id]
            }
        }
        this.pieces = newPieces
    }
    fillAllZeros(){
        const board = this.board 
        board.forEach((row, i) => {
            row.forEach((tile, j) => {
                if(!tile.piece){
                    tile.piece = new CandyCrushPiece(this.availablePieces[Math.floor(Math.random() * this.availablePieces.length)], j, i, this.currentId++)
                }
            })
        })
        this.refreshPiecesList()
    }
    clearBoard() : boolean {
        let board = this.board
        let clearableMap = new Array(this.height).fill(0).map(() => Array(this.width).fill(false))

        let pieceCleared = false
        //look for horizontal
        for (let i = 0; i < this.height; i++) {
            let j = 0
            while (j < this.width){
                let k = j
                while( k < this.width && board[i][j].matchPiece(board[i][k])){
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
        for (let i = 0; i < this.width; i++) {
            let j = 0
            while (j < this.height){
                let k = j
                while(k < this.height && board[j][i].matchPiece(board[k][i])){
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
        for (let i = 0; i < this.height - 1; i++){
            for(let j = 0; j < this.width - 1; j++){
                if(board[i][j].matchPiece(board[i][j + 1]) && board[i][j].matchPiece(board[i + 1][j]) && board[i][j].matchPiece(board[i + 1][j + 1])){
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
                    board[i][j].piece = undefined
                    pieceCleared = true
                }
            }
        }
        this.board = board

        this.refreshPiecesList()
        return pieceCleared
    }
    updatePiecesInformation(){
        this.board.forEach((row, y) => {
            row.forEach((tile, x) => {
                if(tile.piece){
                    tile.piece.updateCoordinate({x, y})
                }
            })
        })
    }
}

export default CandyCrush