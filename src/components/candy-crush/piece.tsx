import { useContext, useEffect, useState } from "react"
import { useSwipeable } from "react-swipeable"
import { animated, useSpring } from '@react-spring/web'
import { AnimationSpeedContext } from "./animation-speed-context"

export function createEmptyPieceProps() : piecePropsType{
    return {
        type: 0,
        x: 0,
        y: 0,
        id: `piece${Math.floor(Math.random() * 10000)}`
    }
}

export default function Piece({tileSize = 20, type, onMove = () => {}, onClick = () => {}, id, x, y, isPopping = false, shakeDirection = ""} : piecePropsType){
    const animationSpeed = useContext(AnimationSpeedContext)
    const offset = tileSize * 0.125
    // const [size, setSize] = useState(0)
    const size = tileSize * 0.75
    // const [scale, setScale] = useState(0)
    const [{left, top}, setPosition] = useState({left: x * tileSize + offset, top: y * tileSize + offset})
    
    const [positionSprings, positionApi] = useSpring(() => ({
        from: { x: left, y: top },
    }))
    const [sizeSprings, sizeApi] = useSpring(() => ({
        // from: { width: 0, height: 0 }
        from: { transform : `scale(0)`},
        config: {
            friction: 20,
        },
    }))
    
    useEffect(() => {
        if(shakeDirection === ""){
            return
        }
        const from = {x : left, y: top}
        const config = {
            duration: animationSpeed.shaking
        }
        let to : {x?: number, y? : number}[] = []
        
        const rightKeyframes = [{ x : left + tileSize * 0.1 }, { x : left - tileSize * 0.1 }, { x : left + tileSize * 0.1 }, { x : left - tileSize * 0.1 }]
        const leftKeyframes = rightKeyframes.slice().reverse()
        const downKeyframes = [{ y : top + tileSize * 0.1 }, { y : top - tileSize * 0.1 }, { y : top + tileSize * 0.1 }, { y : top - tileSize * 0.1 }]
        const upKeyframes = downKeyframes.slice().reverse()
        
        if(shakeDirection === "right"){
            to = [...rightKeyframes, from]
        }else if(shakeDirection === "left"){
            to = [...leftKeyframes, from]
        }else if(shakeDirection === "down"){
            to = [...downKeyframes, from]
        }else if(shakeDirection === "up"){
            to = [...upKeyframes, from]
        }
        positionApi.start({
            from,
            to,
            config
        })
    }, [shakeDirection])
    useEffect(() => {
        if(isPopping && type > 0){
            sizeApi.start({
                from: { transform : `scale(1)` },
                to: [
                    { transform : `scale(1.5)` },
                    { transform : `scale(0)` }
                ],
                config: {
                    duration: animationSpeed.pop
                },
            })
        }
    }, [isPopping])
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
            },
            config: {
                duration: animationSpeed.move
            },
        })
        setPosition({left: newLeft, top: newTop})
    }, [x, y, tileSize])
    useEffect(() => {
        if(type === 0){
            sizeApi.start({
                from: { transform : `scale(1)`},
                to: { transform : `scale(0)`},
                config: {
                    duration: animationSpeed.clear
                },
            })
            // setScale(0)
        }else{
            sizeApi.start({
                from: { transform : `scale(0)`},
                to: { transform : `scale(1)`},
                config: {
                    duration: animationSpeed.appear
                },
            })
            // setScale(1)
        }
    }, [type])
    const move = function(dx: number, dy: number){
        onMove({x, y}, {dx, dy})
    }
    
    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => move(-1, 0),
        onSwipedRight: (eventData) => move(1, 0),
        onSwipedUp: (eventData) => move(0, -1),
        onSwipedDown: (eventData) => move(0, 1),
    });
    
    return <animated.img {...handlers} id={id} src={`/pieces/piece-${type}.svg`} className='absolute' style={{...sizeSprings, ...positionSprings, width: size, height: size}} onClick={() => onClick(x, y)}></animated.img>
}