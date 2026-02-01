interface AnsiSegment {
  text: string
  style?: React.CSSProperties
}

const ANSI_REGEX = /\x1b\[([0-9;]+)m/g

export function parseAnsi(input: string): AnsiSegment[] {
  const segments: AnsiSegment[] = []

  let lastIndex = 0
  let match: RegExpExecArray | null
  let currentStyle: React.CSSProperties = {}

  while ((match = ANSI_REGEX.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: input.slice(lastIndex, match.index),
        style: { ...currentStyle },
      })
    }

    const codes = match[1].split(";").map(Number)

    // Reset
    if (codes[0] === 0) {
      currentStyle = {}
    }

    // 24-bit foreground color
    if (codes[0] === 38 && codes[1] === 2) {
      const [_, __, r, g, b] = codes
      currentStyle = {
        ...currentStyle,
        color: `rgb(${r}, ${g}, ${b})`,
      }
    }

    lastIndex = ANSI_REGEX.lastIndex
  }

  if (lastIndex < input.length) {
    segments.push({
      text: input.slice(lastIndex),
      style: { ...currentStyle },
    })
  }

  return segments
}
