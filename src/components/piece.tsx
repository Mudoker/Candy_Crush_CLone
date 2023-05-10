import { useSwipeable } from 'react-swipeable';
import CandyCrushPiece from '@/class/CandyCrushPiece';
import { useEffect, useState } from 'react';

export default function Piece({candyCrushPiece, swipeHandler, tileSize} : {candyCrushPiece : CandyCrushPiece | undefined | null, swipeHandler: Function, tileSize: number}) : JSX.Element{
    if(!candyCrushPiece){
        return <></>
    }

    const [coordinate, setCoordinate] = useState({x: candyCrushPiece.x, y: candyCrushPiece.y})
    const {x, y} = coordinate
    useEffect(() => {
        candyCrushPiece.updateCallback = setCoordinate
    })

    const offset = tileSize * 0.125
    const size = tileSize * 0.75
    
    const handlers = useSwipeable({
        onSwipedLeft: () => swipeHandler({candyCrushPiece, dx: -1, dy: 0}),
        onSwipedRight: () => swipeHandler({candyCrushPiece, dx: 1, dy: 0}),
        onSwipedUp: () => swipeHandler({candyCrushPiece, dx: 0, dy: -1}),
        onSwipedDown: () => swipeHandler({candyCrushPiece, dx: 0, dy: 1}),
    })
    return <img {...handlers} src={`/pieces/${candyCrushPiece.type}.svg`} className='absolute transition-all' key={candyCrushPiece.id} style={{left: x * tileSize + offset, top: y * tileSize + offset, width: size, height: size}}/>
}