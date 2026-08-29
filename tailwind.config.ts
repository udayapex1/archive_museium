import type { Config } from 'tailwindcss'
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#2f211b', parchment: '#f7f1e8', maroon: '#7d302b', saffron: '#d47b37', moss: '#526353', indigo: '#31556b' }, fontFamily: { display: ['Geom', 'Georgia', 'serif'], sans: ['National Park', 'Arial', 'sans-serif'] }, boxShadow: { museum: '0 18px 50px rgba(64,35,20,.12)' } } }, plugins: [] }
export default config
