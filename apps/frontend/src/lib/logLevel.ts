export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG" | null

export function detectLogLevel(line: string): LogLevel {
  if (line.includes(" ERROR")) return "ERROR"
  if (line.includes(" WARN")) return "WARN"
  if (line.includes(" INFO")) return "INFO"
  if (line.includes(" DEBUG")) return "DEBUG"
  return null
}

export function levelClass(level: LogLevel) {
  switch (level) {
    case "ERROR":
      return "text-destructive font-medium"
    case "WARN":
      return "text-warning font-medium"
    case "INFO":
      return "text-blue-400"
    case "DEBUG":
      return "text-muted-foreground"
    default:
      return ""
  }
}
