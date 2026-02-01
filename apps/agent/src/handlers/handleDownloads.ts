import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export async function downloadJar(type: string, version: string, destPath: string) {
  const url = "https://fill-data.papermc.io/v1/objects/4a558a00005d33dafa4c4d5f9e47b3bd47d92311fceccd9c9754ee6b913f8649/paper-1.21.11-100.jar" // `https://jars.flint.io/${type}/${version}.jar`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download jar: ${res.statusText}`);

  // Node.js ReadableStream
  const body = res.body as unknown as NodeJS.ReadableStream;
  await streamPipeline(body, fs.createWriteStream(destPath));

  console.log(`[agent] Downloaded ${type} ${version} to ${destPath}`);
}