import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

export default function ThemeManager() {
  const branding = useSettingsStore(s => s.branding)

  useEffect(() => {
    if (!branding) return

    const root = window.document.documentElement
    
    // 1. Theme class
    if (branding.theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }

    // 2. Primary Color Palette
    const main = branding.primaryColor || '#3b82f6'
    root.style.setProperty('--primary', main)
    
    // Simple hover state using opacity or same for now
    root.style.setProperty('--primary-hover', main) 
    root.style.setProperty('--primary-soft', `${main}20`) // 12% opacity
    
    console.log('[ThemeManager] Applied Branding:', branding)
  }, [branding])

  return null
}
