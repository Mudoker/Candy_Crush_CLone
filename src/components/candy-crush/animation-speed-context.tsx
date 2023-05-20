import { createContext } from "react"

export const defaultAnimationSpeed = {pop: 200, appear: 200, clear: 100, move: 200, shaking: 100}
export const AnimationSpeedContext = createContext(defaultAnimationSpeed)