import ancient from '@/data/exhibits/ancient-india.json'; import mughal from '@/data/exhibits/mughal-era.json'; import freedom from '@/data/exhibits/freedom-struggle.json'; import modern from '@/data/exhibits/modern-india.json'; import { Exhibit } from './types'
// The current build intentionally shows only exhibits with supplied real 3D models.
export const exhibits: Exhibit[] = ([...ancient,...mughal,...freedom,...modern] as Exhibit[]).filter(exhibit => exhibit.has3D)
export function yearValue(year:string){ const n=year.match(/\d[\d,]*/)?.[0]; if(!n) return 9999; const value=Number(n.replace(',','')); return /BCE/i.test(year)?-value:value }
export function getExhibit(id:string){ return exhibits.find(e=>e.id===id) }
