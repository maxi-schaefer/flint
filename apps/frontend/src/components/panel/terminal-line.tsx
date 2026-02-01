"use client"

import { parseAnsi } from "@/lib/ansi"
import { detectLogLevel, levelClass } from "@/lib/logLevel"
import { splitPlayers } from "@/lib/players"
import { cn } from "@/lib/utils"

interface TerminalLineProps {
  line: string
}

export default function TerminalLine({ line }: TerminalLineProps) {
  if (!line.trim()) return <div className="h-4" />

  const level = detectLogLevel(line)
  const ansiSegments = parseAnsi(line)

  return (
    <div className="leading-relaxed whitespace-pre-wrap font-mono text-sm">
      {ansiSegments.map((seg, i) => {
        const hasAnsiColor = !!seg.style?.color
        const baseClass = !hasAnsiColor ? levelClass(level) : ""

        const parts = splitPlayers(seg.text, seg.style)

        return parts.map((part, j) => (
          <span
            key={`${i}-${j}`}
            className={cn(
              baseClass,
              part.isPlayer && "font-medium"
            )}
            style={part.style}
          >
            {part.text}
          </span>
        ))
      })}
    </div>
  )
}
