import CandyCrushPiece from "./CandyCrushPiece";

class CandyCrushTile {
    piece: CandyCrushPiece | null | undefined = null

    matchPiece(targetTile : CandyCrushTile) : boolean{
        if(!targetTile.piece || !this.piece){
            return false
        }
        return targetTile.piece.type === this.piece.type
    }
}

export default CandyCrushTile