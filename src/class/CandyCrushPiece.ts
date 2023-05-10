import Piece from "@/components/piece"
class CandyCrushPiece {
    x: number
    y: number
    type: number
    id: number
    updateCallback: Function = () => {}
    constructor(type: number, x: number = -1, y: number = -1, id: number = -1){
        this.x = x
        this.y = y
        this.type = type
        this.id = id
    }

    updateCoordinate({x, y} : {x: number, y: number}){
        this.x = x
        this.y = y

        this.updateCallback({x, y})
    }
}

export default CandyCrushPiece