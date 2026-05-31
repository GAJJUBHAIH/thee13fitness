import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import ModelBody from './ModelBody.jsx'

function Fallback() {
  return (
    <Html center>
      <div className="rounded-xl border border-neon/40 bg-ink-800/80 px-4 py-2 text-sm text-neon">
        Loading model…
      </div>
    </Html>
  )
}

export default function BodyScene({ side, gender }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 4.6], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={['#050607']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <pointLight position={[-4, 2, -3]} intensity={0.7} color="#39FF14" />
      <Suspense fallback={<Fallback />}>
        <ModelBody side={side} gender={gender} />
        <Environment preset="city" />
      </Suspense>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.45} scale={9} blur={2.5} color="#39FF14" />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={7}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  )
}
