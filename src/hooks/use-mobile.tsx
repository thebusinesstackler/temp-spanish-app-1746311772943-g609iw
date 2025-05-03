
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check on mount
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set initial value immediately
    checkMobile()
    
    // Create media query for detecting changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the more modern approach for event listener
    const onChange = () => checkMobile()
    mql.addEventListener("change", onChange)
    
    // Add resize listener for more precise updates
    window.addEventListener("resize", checkMobile)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
