import { useEffect, useState } from "react"
import { useSwipeable } from "react-swipeable"
import { animated, useSpring } from '@react-spring/web'

export type piecePropsType = {
    type: number;
    x: number;
    y: number;
    id: string;
    tileSize?: number;
    onSwipe?: Function;
}

export function createEmptyPieceProps() : piecePropsType{
    return {
        type: 0,
        x: 0,
        y: 0,
        id: `piece${Math.floor(Math.random() * 10000)}`
    }
}

export default function Piece({tileSize = 20, type, onSwipe, id, x, y} : piecePropsType){
    const offset = tileSize * 0.125
    const [size, setSize] = useState(0)
    const [{left, top}, setPosition] = useState({left: x * tileSize + offset, top: y * tileSize + offset})
    
    const [positionSprings, positionApi] = useSpring(() => ({
      from: { x: left, y: top }
    }))
    const [sizeSprings, sizeApi] = useSpring(() => ({
      from: { width: 0, height: 0 }
    }))
  
  
    useEffect(() => {
      const newLeft = x * tileSize + offset
      const newTop = y * tileSize + offset
      positionApi.start({
        from: {
            y: top,
            x: left,
        },
        to: {
            y: newTop,
            x: newLeft,
        }
      })
      setPosition({left: newLeft, top: newTop})
    }, [x, y])
    useEffect(() => {
      if(type === 0){
        sizeApi.start({
          from: { width: size, height: size },
          to: {width: 0, height: 0}
        })
        setSize(0)
      }else{
        const newSize = tileSize * 0.75
        sizeApi.start({
            from: { width: size, height: size },
            to: {width: newSize, height: newSize}
        })
        setSize(newSize)
      }
    }, [type])
    const move = function(dx: number, dy: number){
        onSwipe(x, y, {dx, dy})
    }
    
    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => move(-1, 0),
        onSwipedRight: (eventData) => move(1, 0),
        onSwipedUp: (eventData) => move(0, -1),
        onSwipedDown: (eventData) => move(0, 1),
    });
    
    return <animated.img {...handlers} id={id} src={`/pieces/${type}.svg`} className='absolute' style={{...sizeSprings, ...positionSprings}}></animated.img>
    // return <img {...handlers} id={id} src={`/pieces/${type}.svg`} className='absolute transition-all' style={{left, top, width: size, height: size}}></img>
}