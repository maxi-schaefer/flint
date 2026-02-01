const PLAYER_REGEX = /\b([A-Za-z0-9_]{3,16})\b/g

export function splitPlayers(
  text: string,
  baseStyle?: React.CSSProperties
) {
  const parts: { text: string; style?: React.CSSProperties; isPlayer?: boolean }[] = []

  let last = 0
  let match: RegExpExecArray | null

  while ((match = PLAYER_REGEX.exec(text))) {
    if (match.index > last) {
      parts.push({
        text: text.slice(last, match.index),
        style: baseStyle,
      })
    }

    parts.push({
      text: match[1],
      isPlayer: true,
    })

    last = match.index + match[0].length
  }

  if (last < text.length) {
    parts.push({
      text: text.slice(last),
      style: baseStyle,
    })
  }

  return parts
}
