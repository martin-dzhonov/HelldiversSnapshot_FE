import { useEffect } from "react"
import { version } from "../constants"

export function useVersionCheck() {
  useEffect(() => {
    const stored = localStorage.getItem("site_version")

    if (!stored) {
      localStorage.setItem("site_version", version)
      return
    }

    if (stored !== version) {
      localStorage.clear()
      localStorage.setItem("site_version", version)
    }
  }, [])
}