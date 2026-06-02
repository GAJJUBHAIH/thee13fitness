import { Suspense, useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const MALE_MODEL_URL = '/assets/models/gym-character.glb'
const FEMALE_MODEL_URL = '/assets/models/female.glb'

/**
 * Loads the gender-specific GLB human model and rotates it
 * smoothly to show front/back. Muscle selection is not used here.
 */
function Model({ side, gender }) {
  const group = useRef()
  const modelUrl = gender === 'female' ? FEMALE_MODEL_URL : MALE_MODEL_URL
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const first = actions && Object.values(actions)[0]
    if (first) first.reset().fadeIn(0.3).play()
    return () => first?.fadeOut(0.3)
  }, [actions])

  useFrame(() => {
    if (!group.current) return
    const targetY = side === 'back' ? Math.PI : 0
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.1
  })

  const scale = gender === 'female' ? [0.95, 1, 0.95] : [1, 1, 1]

  return (
    <group ref={group} position={[0, -1.6, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

export default function ModelBody({ side, gender }) {
  return (
    <Suspense fallback={null}>
      <Model side={side} gender={gender} />
    </Suspense>
  )
}

useGLTF.preload(MALE_MODEL_URL)
useGLTF.preload(FEMALE_MODEL_URL)
