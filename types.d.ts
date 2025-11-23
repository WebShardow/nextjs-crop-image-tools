// types.d.ts (สร้างที่ Root Directory ของโปรเจกต์)

// 1. ประกาศสำหรับไฟล์ CSS ภายในโปรเจกต์ทั้งหมด (รวมถึง '@/app/globals.css')
declare module '*.css' {
    // TypeScript จะละเว้นการตรวจสอบ Module นี้
}

// 2. ประกาศสำหรับ CSS ของ RainbowKit โดยเฉพาะ
// (มักจะจำเป็นสำหรับการอิมพอร์ตจาก node_modules)
declare module '@rainbow-me/rainbowkit/styles.css';