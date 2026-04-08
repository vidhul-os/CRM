/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 
          DEFAULT: 'var(--primary, #3b82f6)', 
          hover:   'var(--primary-hover, #2563eb)',
          soft:    'var(--primary-soft, rgba(59, 130, 246, 0.1))'
        },
        sidebar: 'var(--text-main, #0f172a)',
        'sidebar-bg': 'var(--sidebar-bg, #0f172a)',
        'sidebar-text': 'var(--sidebar-text, #f8fafc)',
        surface: 'var(--surface-bg, #f8fafc)',
        border:  'var(--border-color, #e2e8f0)',
        muted:   'var(--muted-color, #64748b)',
        card:    'var(--card-bg, #ffffff)',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    }
  },
  plugins: []
}
