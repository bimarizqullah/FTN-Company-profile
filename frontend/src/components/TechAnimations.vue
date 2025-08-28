<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
    
    <!-- Floating Dots Pattern -->
    <div v-if="variant === 'dots'" class="absolute inset-0">
      <div 
        v-for="(dot, index) in floatingDots" 
        :key="index"
        class="absolute rounded-full animate-dot-float"
        :class="dot.sizeClass + ' ' + dot.colorClass"
        :style="{
          left: dot.x + '%',
          top: dot.y + '%',
          animationDelay: dot.delay + 's',
          animationDuration: dot.duration + 's'
        }"
        :data-aos="dot.aosAnimation"
        :data-aos-delay="dot.aosDelay"
      >
        <!-- Pulse Effect -->
        <div class="absolute inset-0 rounded-full animate-ping opacity-30" :class="dot.colorClass"></div>
      </div>
    </div>

    <!-- Simple Polygon Shapes -->
    <div v-if="variant === 'polygon'" class="absolute inset-0">
      <div 
        v-for="(polygon, index) in polygonShapes" 
        :key="index"
        class="absolute animate-polygon-rotate"
        :style="{
          left: polygon.x + '%',
          top: polygon.y + '%',
          animationDelay: polygon.delay + 's',
          animationDuration: polygon.duration + 's'
        }"
        :data-aos="polygon.aosAnimation"
        :data-aos-delay="polygon.aosDelay"
      >
        <svg :width="polygon.size" :height="polygon.size" viewBox="0 0 100 100">
          <polygon 
            :points="polygon.points"
            :fill="polygon.fillColor"
            :stroke="polygon.strokeColor"
            stroke-width="1"
            class="animate-polygon-pulse"
            :style="{ animationDelay: polygon.delay + 's' }"
          />
        </svg>
      </div>
    </div>

    <!-- Mixed Dots and Polygons -->
    <div v-if="variant === 'mixed'" class="absolute inset-0">
      <!-- Dots Layer -->
      <div 
        v-for="(dot, index) in mixedDots" 
        :key="'dot-' + index"
        class="absolute rounded-full animate-mixed-float"
        :class="dot.sizeClass + ' ' + dot.colorClass"
        :style="{
          left: dot.x + '%',
          top: dot.y + '%',
          animationDelay: dot.delay + 's'
        }"
        :data-aos="dot.aosAnimation"
        :data-aos-delay="dot.aosDelay"
      >
        <div class="absolute inset-0 rounded-full animate-ping opacity-20" :class="dot.colorClass"></div>
      </div>
      
      <!-- Polygons Layer -->
      <div 
        v-for="(polygon, index) in mixedPolygons" 
        :key="'polygon-' + index"
        class="absolute animate-mixed-rotate"
        :style="{
          left: polygon.x + '%',
          top: polygon.y + '%',
          animationDelay: polygon.delay + 's'
        }"
        :data-aos="polygon.aosAnimation"
        :data-aos-delay="polygon.aosDelay"
      >
        <svg :width="polygon.size" :height="polygon.size" viewBox="0 0 100 100">
          <polygon 
            :points="polygon.points"
            :fill="polygon.fillColor"
            :stroke="polygon.strokeColor"
            stroke-width="1.5"
            opacity="0.7"
          />
        </svg>
      </div>
    </div>

    <!-- Minimal Tech Dots -->
    <div v-if="variant === 'minimal'" class="absolute inset-0">
      <div 
        v-for="(dot, index) in minimalDots" 
        :key="index"
        class="absolute w-4 h-4 rounded-full bg-blue-400/40 dark:bg-blue-300/30 animate-minimal-pulse"
        :style="{
          left: dot.x + '%',
          top: dot.y + '%',
          animationDelay: dot.delay + 's'
        }"
        :data-aos="'fade-in'"
        :data-aos-delay="dot.aosDelay"
      >
        <div class="absolute inset-0 rounded-full bg-blue-300/30 dark:bg-blue-200/20 animate-ping"></div>
      </div>
    </div>

    <!-- Geometric Polygons Only -->
    <div v-if="variant === 'geometric'" class="absolute inset-0">
      <div 
        v-for="(shape, index) in geometricPolygons" 
        :key="index"
        class="absolute animate-geometric-drift"
        :style="{
          left: shape.x + '%',
          top: shape.y + '%',
          animationDelay: shape.delay + 's',
          animationDuration: shape.duration + 's'
        }"
        :data-aos="shape.aosAnimation"
        :data-aos-delay="shape.aosDelay"
      >
        <svg :width="shape.size" :height="shape.size" viewBox="0 0 100 100">
          <polygon 
            :points="shape.points"
            :fill="shape.fillColor"
            :stroke="shape.strokeColor"
            stroke-width="1"
            opacity="0.6"
            class="animate-shape-breathe"
          />
        </svg>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface FloatingDot {
  x: number
  y: number
  sizeClass: string
  colorClass: string
  delay: number
  duration: number
  aosAnimation: string
  aosDelay: number
}

interface PolygonShape {
  x: number
  y: number
  size: number
  points: string
  fillColor: string
  strokeColor: string
  delay: number
  duration: number
  aosAnimation: string
  aosDelay: number
}

interface MinimalDot {
  x: number
  y: number
  delay: number
  aosDelay: number
}

const props = defineProps<{
  variant?: 'dots' | 'polygon' | 'mixed' | 'minimal' | 'geometric'
  density?: 'low' | 'medium' | 'high'
}>()

const floatingDots = ref<FloatingDot[]>([])
const polygonShapes = ref<PolygonShape[]>([])
const mixedDots = ref<FloatingDot[]>([])
const mixedPolygons = ref<PolygonShape[]>([])
const minimalDots = ref<MinimalDot[]>([])
const geometricPolygons = ref<PolygonShape[]>([])

const getDensityCount = () => {
  const densityMap = {
    low: { dots: 12, polygons: 6 },
    medium: { dots: 20, polygons: 12 },
    high: { dots: 35, polygons: 18 }
  }
  return densityMap[props.density || 'medium']
}

// Dot size variations - diperbesar
const dotSizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5', 'w-6 h-6', 'w-8 h-8']

// Dot color variations (dengan dark mode support)
const dotColors = [
  'bg-blue-400/60 dark:bg-blue-300/40', 'bg-blue-500/50 dark:bg-blue-400/30', 'bg-cyan-400/60 dark:bg-cyan-300/40', 
  'bg-indigo-400/50 dark:bg-indigo-300/30', 'bg-purple-400/40 dark:bg-purple-300/25', 'bg-teal-400/60 dark:bg-teal-300/40'
]

// Polygon shapes (triangle, square, pentagon, hexagon)
const polygonPoints = [
  '50,10 90,90 10,90', // Triangle
  '20,20 80,20 80,80 20,80', // Square
  '50,5 95,35 80,85 20,85 5,35', // Pentagon
  '50,5 90,25 90,75 50,95 10,75 10,25', // Hexagon
  '30,10 70,10 85,50 70,90 30,90 15,50' // Octagon
]

const generateFloatingDots = () => {
  const count = getDensityCount().dots
  floatingDots.value = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    sizeClass: dotSizes[Math.floor(Math.random() * dotSizes.length)],
    colorClass: dotColors[Math.floor(Math.random() * dotColors.length)],
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 3,
    aosAnimation: ['fade-in', 'zoom-in', 'fade-up'][Math.floor(Math.random() * 3)],
    aosDelay: index * 100
  }))
}

const generatePolygonShapes = () => {
  const count = getDensityCount().polygons
  polygonShapes.value = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * 85 + 5,
    y: Math.random() * 85 + 5,
    size: 40 + Math.random() * 60, // diperbesar dari 20-50 menjadi 40-100
    points: polygonPoints[Math.floor(Math.random() * polygonPoints.length)],
    fillColor: ['#3B82F640', '#06B6D440', '#8B5CF640', '#10B98140'][Math.floor(Math.random() * 4)],
    strokeColor: ['#3B82F680', '#06B6D480', '#8B5CF680', '#10B98180'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 4,
    aosAnimation: ['fade-in', 'zoom-in', 'flip-up'][Math.floor(Math.random() * 3)],
    aosDelay: index * 200
  }))
}

const generateMixedElements = () => {
  const dotCount = Math.floor(getDensityCount().dots * 0.7)
  const polygonCount = Math.floor(getDensityCount().polygons * 0.6)

  mixedDots.value = Array.from({ length: dotCount }, (_, index) => ({
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    sizeClass: dotSizes[Math.floor(Math.random() * dotSizes.length)],
    colorClass: dotColors[Math.floor(Math.random() * dotColors.length)],
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    aosAnimation: ['fade-in', 'zoom-in'][Math.floor(Math.random() * 2)],
    aosDelay: index * 80
  }))

  mixedPolygons.value = Array.from({ length: polygonCount }, (_, index) => ({
    x: Math.random() * 85 + 5,
    y: Math.random() * 85 + 5,
    size: 30 + Math.random() * 50, // diperbesar dari 15-40 menjadi 30-80
    points: polygonPoints[Math.floor(Math.random() * polygonPoints.length)],
    fillColor: ['#3B82F630', '#06B6D430', '#8B5CF630'][Math.floor(Math.random() * 3)],
    strokeColor: ['#3B82F660', '#06B6D460', '#8B5CF660'][Math.floor(Math.random() * 3)],
    delay: Math.random() * 4,
    duration: 5 + Math.random() * 3,
    aosAnimation: ['zoom-in', 'flip-up'][Math.floor(Math.random() * 2)],
    aosDelay: index * 150
  }))
}

const generateMinimalDots = () => {
  const count = getDensityCount().dots
  minimalDots.value = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * 95 + 2.5,
    y: Math.random() * 95 + 2.5,
    delay: Math.random() * 5,
    aosDelay: index * 100
  }))
}

const generateGeometricPolygons = () => {
  const count = getDensityCount().polygons
  geometricPolygons.value = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * 85 + 5,
    y: Math.random() * 85 + 5,
    size: 50 + Math.random() * 70, // diperbesar dari 25-60 menjadi 50-120
    points: polygonPoints[Math.floor(Math.random() * polygonPoints.length)],
    fillColor: ['#3B82F630', '#06B6D430', '#8B5CF630', '#10B98130', '#F59E0B30'][Math.floor(Math.random() * 5)],
    strokeColor: ['#3B82F670', '#06B6D470', '#8B5CF670', '#10B98170', '#F59E0B70'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 4,
    aosAnimation: ['fade-in', 'zoom-in', 'flip-up', 'flip-down'][Math.floor(Math.random() * 4)],
    aosDelay: index * 120
  }))
}

onMounted(() => {
  switch (props.variant) {
    case 'dots':
      generateFloatingDots()
      break
    case 'polygon':
      generatePolygonShapes()
      break
    case 'mixed':
      generateMixedElements()
      break
    case 'minimal':
      generateMinimalDots()
      break
    case 'geometric':
      generateGeometricPolygons()
      break
    default:
      generateMixedElements()
  }
})
</script>

<style scoped>
/* Dot Animations */
@keyframes dot-float {
  0%, 100% { 
    transform: translateY(0) scale(1); 
    opacity: 0.8; 
  }
  33% { 
    transform: translateY(-8px) scale(1.1); 
    opacity: 1; 
  }
  66% { 
    transform: translateY(-4px) scale(0.9); 
    opacity: 0.9; 
  }
}

.animate-dot-float {
  animation: dot-float 4s ease-in-out infinite;
}

/* Polygon Animations */
@keyframes polygon-rotate {
  0% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.7; 
  }
  50% { 
    transform: rotate(180deg) scale(1.1); 
    opacity: 1; 
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    opacity: 0.7; 
  }
}

.animate-polygon-rotate {
  animation: polygon-rotate 8s linear infinite;
}

@keyframes polygon-pulse {
  0%, 100% { 
    fill-opacity: 0.3; 
    stroke-opacity: 0.6; 
  }
  50% { 
    fill-opacity: 0.6; 
    stroke-opacity: 1; 
  }
}

.animate-polygon-pulse {
  animation: polygon-pulse 3s ease-in-out infinite;
}

/* Mixed Animations */
@keyframes mixed-float {
  0%, 100% { 
    transform: translateY(0) translateX(0) scale(1); 
    opacity: 0.8; 
  }
  25% { 
    transform: translateY(-6px) translateX(3px) scale(1.05); 
    opacity: 1; 
  }
  75% { 
    transform: translateY(-3px) translateX(-2px) scale(0.95); 
    opacity: 0.9; 
  }
}

.animate-mixed-float {
  animation: mixed-float 5s ease-in-out infinite;
}

@keyframes mixed-rotate {
  0% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.6; 
  }
  25% { 
    transform: rotate(90deg) scale(1.05); 
    opacity: 0.8; 
  }
  50% { 
    transform: rotate(180deg) scale(0.95); 
    opacity: 1; 
  }
  75% { 
    transform: rotate(270deg) scale(1.05); 
    opacity: 0.8; 
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    opacity: 0.6; 
  }
}

.animate-mixed-rotate {
  animation: mixed-rotate 10s linear infinite;
}

/* Minimal Animations */
@keyframes minimal-pulse {
  0%, 100% { 
    opacity: 0.4; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.2); 
  }
}

.animate-minimal-pulse {
  animation: minimal-pulse 3s ease-in-out infinite;
}

/* Geometric Drift */
@keyframes geometric-drift {
  0%, 100% { 
    transform: translateY(0) translateX(0) rotate(0deg) scale(1); 
    opacity: 0.7; 
  }
  25% { 
    transform: translateY(-12px) translateX(8px) rotate(90deg) scale(1.1); 
    opacity: 0.9; 
  }
  50% { 
    transform: translateY(-8px) translateX(-5px) rotate(180deg) scale(0.9); 
    opacity: 1; 
  }
  75% { 
    transform: translateY(-15px) translateX(3px) rotate(270deg) scale(1.05); 
    opacity: 0.8; 
  }
}

.animate-geometric-drift {
  animation: geometric-drift 12s ease-in-out infinite;
}

/* Shape Breathing */
@keyframes shape-breathe {
  0%, 100% { 
    fill-opacity: 0.3; 
    stroke-opacity: 0.7; 
    transform: scale(1); 
  }
  50% { 
    fill-opacity: 0.6; 
    stroke-opacity: 1; 
    transform: scale(1.1); 
  }
}

.animate-shape-breathe {
  animation: shape-breathe 4s ease-in-out infinite;
}

/* Hover effects */
.tech-element:hover {
  transform: scale(1.15);
  filter: brightness(1.3);
  transition: all 0.3s ease;
}
</style>
