declare module 'aos' {
  interface AosOptions {
    offset?: number
    delay?: number
    duration?: number
    easing?: string
    once?: boolean
    mirror?: boolean
    anchorPlacement?: string
  }

  interface AosInstance {
    init(options?: AosOptions): void
    refresh(): void
    refreshHard(): void
  }

  const AOS: AosInstance
  export default AOS
}
