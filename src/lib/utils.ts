import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const capitalizeName = function (name: string) {
  const arrName = name.split(" ")

  for (let i = 0; i < arrName.length; i++) {
    arrName[i] = arrName[i][0].toUpperCase() + arrName[i].substr(1)
  }

  return arrName.join(" ")
}
