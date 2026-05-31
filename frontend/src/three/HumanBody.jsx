import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

const NEON = '#39FF14'
const BASE_MALE = '#3a4750'
const BASE_FEMALE = '#4a3a50'

const PARTS = [
  { id: 'shoulders', side: 'front', pos: [-0.62, 0.95, 0.18], geo: ['sphere', 0.2] },
  { id: 'shoulders', side: 'front', pos: [0.62, 0.95, 0.18], geo: ['sphere', 0.2] },
  { id: 'chest', side: 'front', pos: [-0.28, 0.62, 0.26], geo: ['box', [0.42, 0.34, 0.18]] },
  { id: 'chest', side: 'front', pos: [0.28, 0.62, 0.26], geo: ['box', [0.42, 0.34, 0.18]] },
  { id: 'biceps', side: 'front', pos: [-0.78, 0.42, 0.18], geo: ['capsule', [0.13, 0.4]] },
  { id: 'biceps', side: 'front', pos: [0.78, 0.42, 0.18], geo: ['capsule', [0.13, 0.4]] },
  { id: 'forearms', side: 'front', pos: [-0.86, -0.05, 0.16], geo: ['capsule', [0.11, 0.42]] },
  { id: 'forearms', side: 'front', pos: [0.86, -0.05, 0.16], geo: ['capsule', [0.11, 0.42]] },
  { id: 'abs', side: 'front', pos: [0, 0.18, 0.26], geo: ['box', [0.5, 0.6, 0.16]] },
  { id: 'obliques', side: 'front', pos: [-0.34, 0.1, 0.2], geo: ['box', [0.16, 0.5, 0.16]] },
  { id: 'obliques', side: 'front', pos: [0.34, 0.1, 0.2], geo: ['box', [0.16, 0.5, 0.16]] },
  { id: 'quads', side: 'front', pos: [-0.28, -0.85, 0.18], geo: ['capsule', [0.2, 0.7]] },
  { id: 'quads', side: 'front', pos: [0.28, -0.85, 0.18], geo: ['capsule', [0.2, 0.7]] },
  { id: 'traps', side: 'back', pos: [0, 0.95, -0.2], geo: ['box', [0.7, 0.3, 0.18]] },
  { id: 'lats', side: 'back', pos: [-0.34, 0.5, -0.24], geo: ['box', [0.34, 0.55, 0.16]] },
  { id: 'lats', side: 'back', pos: [0.34, 0.5, -0.24], geo: ['box', [0.34, 0.55, 0.16]] },
  { id: 'triceps', side: 'back', pos: [-0.78, 0.42, -0.18], geo: ['capsule', [0.13, 0.4]] },
  { id: 'triceps', side: 'back', pos: [0.78, 0.42, -0.18], geo: ['capsule', [0.13, 0.4]] },
  { id: 'back', side: 'back', pos: [0, 0.12, -0.24], geo: ['box', [0.4, 0.5, 0.16]] },
  { id: 'glutes', side: 'back', pos: [-0.24, -0.4, -0.22], geo: ['sphere', 0.26] },
  { id: 'glutes', side: 'back', pos: [0.24, -0.4, -0.22], geo: ['sphere', 0.26] },
  { id: 'hamstrings', side: 'back', pos: [-0.28, -0.85, -0.2], geo: ['capsule', [0.19, 0.66]] },
  { id: 'hamstrings', side: 'back', pos: [0.28, -0.85, -0.2], geo: ['capsule', [0.19, 0.66]] },
  { id: 'calves', side: 'back', pos: [-0.28, -1.5, -0.18], geo: ['capsule', [0.15, 0.42]] },
  { id: 'calves', side: 'back', pos: [0.28, -1.5, -0.18], geo: ['capsule', [0.15, 0.42]] },
]

function Geometry({ geo }) {
  const [type, arg] = geo
  if (type === 'box') return <boxGeometry args={arg} />
  if (type === 'sphere') return <sphereGeometry args={[arg, 24, 24]} />
  if (type === 'capsule') return <capsuleGeometry args={[arg[0], arg[1], 8, 16]} />
  return null
}

function MusclePart({ part, baseColor, hovered, selected, onHover, onSelect }) {
  const isActive = hovered === part.id || selected === part.id
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const target = isActive ? 1.06 : 1
    ref.current.scale.lerp({ x: target, y: target, z: target }, 0.15)
  })
  return (
    <mesh
      ref={ref}
      position={part.pos}
      onPointerOver={(e) => { e.stopPropagation(); onHover(part.id); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onSelect(part.id) }}
    >
      <Geometry geo={part.geo} />
      <meshStandardMaterial
        color={isActive ? NEON : baseColor}
        emissive={isActive ? NEON : '#000000'}
        emissiveIntensity={isActive ? 0.6 : 0}
        roughness={0.5}
        metalness={0.3}
      />
    </mesh>
  )
}

function Frame({ baseColor }) {
  return (
    <group>
      <mesh position={[0, 1.45, 0]}><sphereGeometry args={[0.24, 24, 24]} /><meshStandardMaterial color={baseColor} roughness={0.6} metalness={0.2} /></mesh>
      <mesh position={[0, 1.18, 0]}><cylinderGeometry args={[0.1, 0.12, 0.2, 16]} /><meshStandardMaterial color={baseColor} /></mesh>
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.7, 1.1, 0.34]} /><meshStandardMaterial color={baseColor} roughness={0.7} metalness={0.1} /></mesh>
      <mesh position={[0, -0.3, 0]}><boxGeometry args={[0.6, 0.4, 0.3]} /><meshStandardMaterial color={baseColor} /></mesh>
    </group>
  )
}

export default function HumanBody({ side, gender, selected, onSelect }) {
  const [hovered, setHovered] = useState(null)
  const group = useRef()
  const baseColor = gender === 'female' ? BASE_FEMALE : BASE_MALE

  useFrame(() => {
    if (!group.current) return
    const targetY = side === 'back' ? Math.PI : 0
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.1
  })

  const visible = PARTS.filter((p) => p.side === side)

  return (
    <group ref={group} scale={gender === 'female' ? [0.92, 1, 0.92] : [1, 1, 1]}>
      <Frame baseColor={baseColor} />
      {visible.map((part, i) => (
        <MusclePart key={`${part.id}-${i}`} part={part} baseColor={baseColor} hovered={hovered} selected={selected} onHover={setHovered} onSelect={onSelect} />
      ))}
    </group>
  )
}
