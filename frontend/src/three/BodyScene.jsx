import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import HumanBody from './HumanBody.jsx'

export default function BodyScene({ side, gender, selected, onSelect }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 4.6], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={['#050607']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <pointLight position={[-4, 2, -3]} intensity={0.6} color="#39FF14" />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <HumanBody side={side} gender={gender} selected={selected} onSelect={onSelect} />
      </Float>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={8} blur={2.5} color="#39FF14" />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={7} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} autoRotate={!selected} autoRotateSpeed={0.8} />
    </Canvas>
  )
}
