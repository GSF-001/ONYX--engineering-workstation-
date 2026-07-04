import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const EXPORTS_DIR = process.env.EXPORTS_DIR ?? "./data/exports";

async function ensureDir(): Promise<void> {
  await mkdir(EXPORTS_DIR, { recursive: true });
}

export async function saveExportFile(
  content: string,
  extension: "csv" | "json"
): Promise<string> {
  await ensureDir();
  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(EXPORTS_DIR, fileName);
  await writeFile(filePath, content, "utf-8");
  return filePath;
}

export async function readExportFile(filePath: string): Promise<string> {
  return readFile(filePath, "utf-8");
}
