import './globals.css'; import { Navbar } from '@/components/layout/Navbar'; import { Footer } from '@/components/layout/Footer'
export const metadata={title:'The Archive | Interactive Digital Museum',description:'A living archive of Indian history'}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Navbar/><main>{children}</main><Footer/></body></html>}
