type piecePropsType = {
    type: number;
    x: number;
    y: number;
    id: string;
    isPopping?: boolean;
    shakeDirection?: string;
    tileSize?: number;
    onSwipe?: Function;
}
type boardPropsType = {
    board: boardType; 
    onSwipe?: Function; 
    boardSize: number;
}

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