import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const CUP_PROFILE = [
  new THREE.Vector2(0.66, -1.02),
  new THREE.Vector2(0.75, -0.94),
  new THREE.Vector2(0.86, -0.48),
  new THREE.Vector2(0.98, 0.22),
  new THREE.Vector2(1.02, 0.82),
  new THREE.Vector2(1.0, 0.94),
  new THREE.Vector2(0.94, 0.98),
  new THREE.Vector2(0.8, 0.96),
]

function SteamWisp({ offset, delay }: { offset: number; delay: number }) {
  const points = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(offset * 0.4, 0.2, 0),
      new THREE.Vector3(-offset * 0.5, 0.42, 0),
      new THREE.Vector3(offset, 0.68, 0),
    ],
    [offset],
  )

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.022, 6, false), [curve])

  return (
    <Float speed={0.55} floatIntensity={0.12} rotationIntensity={0}>
      <mesh position={[offset * 0.75, 1.18, 0]} geometry={geometry}>
        <meshBasicMaterial
          color="#f4e9d8"
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[offset * 0.75, 1.18 + delay * 0.2, 0]} geometry={geometry}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </mesh>
    </Float>
  )
}

function CocoaDust() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 520
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#d7a757'),
      new THREE.Color('#94553b'),
      new THREE.Color('#eee0c7'),
    ]

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.3 + Math.random() * 2.2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.38) * 3.8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.7 - 0.8

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.012
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.14) * 0.035
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0.58}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function ChocolateMug() {
  const cup = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!cup.current) return
    const { pointer, clock } = state
    cup.current.rotation.y = THREE.MathUtils.damp(
      cup.current.rotation.y,
      Math.sin(clock.elapsedTime * 0.55) * 0.12 + pointer.x * 0.36,
      3,
      delta,
    )
    cup.current.rotation.x = THREE.MathUtils.damp(
      cup.current.rotation.x,
      -pointer.y * 0.16,
      3,
      delta,
    )
    cup.current.rotation.z = THREE.MathUtils.damp(
      cup.current.rotation.z,
      Math.sin(clock.elapsedTime * 0.4) * 0.018,
      2,
      delta,
    )
    cup.current.position.x = THREE.MathUtils.damp(
      cup.current.position.x,
      pointer.x * 0.24,
      2.2,
      delta,
    )
    cup.current.position.y = THREE.MathUtils.damp(
      cup.current.position.y,
      -0.08 + Math.sin(clock.elapsedTime * 0.85) * 0.065,
      2.2,
      delta,
    )
    const scale = THREE.MathUtils.damp(cup.current.scale.x, 1, 2.4, delta)
    cup.current.scale.setScalar(scale)
  })

  return (
    <group ref={cup} position={[0, -0.08, 0]} scale={0.94}>
          <mesh position={[0, -1.12, -0.08]} scale={[1, 0.11, 0.72]} receiveShadow>
            <cylinderGeometry args={[1.3, 1.3, 0.11, 64]} />
            <meshPhysicalMaterial
              color="#7d4932"
              roughness={0.27}
              metalness={0.08}
              clearcoat={0.55}
            />
          </mesh>
          <mesh position={[0, -1.055, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.025, 10, 64]} />
            <meshStandardMaterial color="#d5aa62" metalness={0.65} roughness={0.25} />
          </mesh>

          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <latheGeometry args={[CUP_PROFILE, 80]} />
            <meshPhysicalMaterial
              color="#e8dcc6"
              roughness={0.19}
              metalness={0.04}
              clearcoat={0.92}
              clearcoatRoughness={0.12}
            />
          </mesh>

          <mesh position={[1.0, -0.04, -0.015]} rotation={[0.12, 0, 0]}>
            <torusGeometry args={[0.43, 0.105, 24, 64]} />
            <meshPhysicalMaterial
              color="#e4d5bd"
              roughness={0.2}
              metalness={0.03}
              clearcoat={0.9}
            />
          </mesh>

          <mesh position={[0, 0.916, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.84, 0.055, 16, 80]} />
            <meshPhysicalMaterial color="#f4ead8" roughness={0.14} clearcoat={1} />
          </mesh>
          <mesh position={[0, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.79, 80]} />
            <meshPhysicalMaterial
              color="#35170f"
              roughness={0.19}
              metalness={0.06}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </mesh>
          <mesh position={[0, 0.887, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.54, 0.012, 8, 80]} />
            <meshBasicMaterial color="#94532d" transparent opacity={0.55} />
          </mesh>

          {[
            [-0.28, 0.936, -0.12, 0.14],
            [0.05, 0.934, -0.3, 0.12],
            [0.3, 0.936, -0.02, 0.13],
            [-0.06, 0.937, 0.2, 0.11],
          ].map(([x, y, z, scale], index) => (
            <Float key={index} speed={0.6 + index * 0.1} floatIntensity={0.035}>
              <mesh position={[x, y, z]} scale={[scale, scale * 0.65, scale * 0.72]}>
                <sphereGeometry args={[1, 24, 16]} />
                <meshPhysicalMaterial color="#f2e7d3" roughness={0.32} clearcoat={0.35} />
              </mesh>
            </Float>
          ))}

          <mesh position={[-0.4, -0.34, 0.87]} rotation={[0.15, 0.5, -0.1]}>
            <torusGeometry args={[0.16, 0.025, 10, 36]} />
            <meshStandardMaterial color="#c59b67" roughness={0.34} />
          </mesh>
          <mesh position={[0.39, -0.52, 0.8]} rotation={[0.4, -0.4, 0.1]}>
            <dodecahedronGeometry args={[0.11, 0]} />
            <meshStandardMaterial color="#6e3421" roughness={0.52} />
          </mesh>

      <SteamWisp offset={-0.42} delay={0} />
      <SteamWisp offset={0} delay={0.35} />
      <SteamWisp offset={0.4} delay={0.65} />
    </group>
  )
}

function Scene() {
  const movingLight = useRef<THREE.PointLight>(null)

  useFrame((state, delta) => {
    if (!movingLight.current) return
    movingLight.current.position.x = THREE.MathUtils.damp(
      movingLight.current.position.x,
      2.8 + state.pointer.x * 1.8,
      2.5,
      delta,
    )
    movingLight.current.position.y = THREE.MathUtils.damp(
      movingLight.current.position.y,
      1.5 + state.pointer.y * 1.4,
      2.5,
      delta,
    )
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 5, 5]} intensity={3.1} color="#fff1d5" />
      <pointLight
        ref={movingLight}
        position={[2.8, 1.5, 3]}
        intensity={52}
        color="#f2bd61"
        distance={12}
      />
      <pointLight position={[-3, -1, 2]} intensity={18} color="#ad5834" distance={10} />
      <ChocolateMug />
      <CocoaDust />
    </>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.15, 1.65, 7.6], fov: 36 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.05, 0)}
      className="!absolute inset-0"
    >
      <Scene />
    </Canvas>
  )
}
