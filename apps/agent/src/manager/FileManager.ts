import fs from "fs";
import path from "path";

export class FileManager {
  constructor(private basePath: string) {
    // Normalize basePath to absolute
    this.basePath = path.resolve(basePath);
  }

  /** Resolve a safe absolute path */
  private resolveSafe(relPath: string) {
    const resolved = path.resolve(this.basePath, relPath);

    // Check if the resolved path is inside basePath
    const relative = path.relative(this.basePath, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error("Invalid path");
    }

    return resolved;
  }

  list(relPath = ".") {
    const full = this.resolveSafe(relPath);

    return fs.readdirSync(full, { withFileTypes: true }).map((e) => {
      const filePath = path.join(full, e.name);
      const stats = fs.statSync(filePath);

      return {
        name: e.name,
        isDirectory: e.isDirectory(),
        size: e.isFile() ? fs.statSync(path.join(full, e.name)).size : 0,
        modified: stats.mtime.toISOString(),
        path: path.relative(this.basePath, filePath).replace("/\\/g", "/")
      }
      
    });
  }

  readFile(relPath: string) {
    const full = this.resolveSafe(relPath);
    return fs.readFileSync(full, "utf8");
  }

  writeFile(relPath: string, content: string) {
    const full = this.resolveSafe(relPath);
    fs.writeFileSync(full, content, "utf8");
  }
}
