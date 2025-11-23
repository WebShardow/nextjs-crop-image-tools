// app/layout.tsx

// ❌ ลบ: ไม่มีการใช้ RainbowKit CSS
// import '@rainbow-me/rainbowkit/styles.css'; 

import { Inter } from 'next/font/google';
// ✅ แก้ไข: กลับไปใช้ Relative Path (./globals.css) หรือใช้ Alias (@/app/globals.css)
// เนื่องจากเราไม่ได้สร้าง types.d.ts เพื่อรองรับการ Import CSS ด้วย Alias แล้ว การใช้ Relative Path อาจทำให้เกิด TS Error 2882 อีกครั้ง
// แต่เราจะลองใช้ Relative Path ตามเดิมก่อน โดยเชื่อว่าปัญหา TS 2882 เกิดจาก Wagmi/RainbowKit Interop
import './globals.css'; 

// ❌ ลบ: ไม่มีการใช้ Web3Provider
// import { Web3Provider } from '@/components/Web3Provider'; 

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* ❌ ลบ: ไม่มีการห่อหุ้มด้วย Web3Provider */}
                {children}
            </body>
        </html>
    );
}