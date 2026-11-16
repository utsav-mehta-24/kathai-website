// Tiny class-name combiner (no extra deps).
export type ClassValue = string | number | null | false | undefined | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === 'string' || typeof input === 'number') {
      out.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) out.push(nested)
    }
  }
  return out.join(' ')
}

// Linear interpolation helper.
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
