// src/utils/cropImage.ts

import { Area } from 'react-easy-crop';

/**
 * @title getCroppedImg
 * @dev ฟังก์ชันหลักในการใช้ Canvas เพื่อครอปรูปภาพตามพิกัดที่คำนวณจาก react-easy-crop
 * @param imageSrc Data URL ของรูปภาพต้นฉบับ
 * @param pixelCrop พิกัด (x, y, width, height) ที่จะครอปในหน่วยพิกเซล
 * @param isRoundOutput กำหนดว่าผลลัพธ์ที่ได้ควรเป็นวงกลม (มีพื้นหลังโปร่งใส) หรือไม่
 * @returns Promise ที่ส่งกลับ Data URL ของรูปภาพที่ถูกครอปแล้ว
 */
export const getCroppedImg = (
    imageSrc: string,
    pixelCrop: Area
): Promise<string> => {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // 1. กำหนดขนาด Canvas ให้เท่ากับขนาดของ Crop Area
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            // 2. วาดรูปภาพลงใน Canvas ตามพิกัดที่ครอป
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            // sx, sy, sWidth, sHeight: ส่วนของรูปภาพต้นฉบับที่ต้องการนำมา
            // dx, dy, dWidth, dHeight: ตำแหน่งและขนาดที่จะวาดลงใน Canvas ใหม่
            ctx.drawImage(
                image,
                pixelCrop.x, // sx: เริ่มต้นที่ X ของพิกัดที่ครอป
                pixelCrop.y, // sy: เริ่มต้นที่ Y ของพิกัดที่ครอป
                pixelCrop.width, // sWidth: กว้างของส่วนที่ครอป
                pixelCrop.height, // sHeight: สูงของส่วนที่ครอป
                0, // dx: วาดที่มุม (0, 0) ของ Canvas ใหม่
                0, // dy: วาดที่มุม (0, 0) ของ Canvas ใหม่
                pixelCrop.width, // dWidth: เต็มความกว้างของ Canvas ใหม่
                pixelCrop.height // dHeight: เต็มความสูงของ Canvas ใหม่
            );

            // 3. แปลง Canvas เป็น Data URL
            // ตรวจสอบว่ารูปภาพที่ครอปเป็นสี่เหลี่ยมจัตุรัสและผู้ใช้เลือกการครอปเป็นวงกลม
            const isRoundOutput =
                (pixelCrop.width === pixelCrop.height) &&
                document.querySelector('[data-cropshape="round"]')?.classList.contains('bg-fuchsia-700');

            if (isRoundOutput) {
                // ถ้าเป็นวงกลม ให้สร้าง Canvas ใหม่เพื่อ Mask
                const finalCanvas = document.createElement('canvas');
                const finalCtx = finalCanvas.getContext('2d');

                if (!finalCtx) {
                    throw new Error('Could not get final canvas context');
                }

                finalCanvas.width = pixelCrop.width;
                finalCanvas.height = pixelCrop.height;
                const centerX = pixelCrop.width / 2;
                const centerY = pixelCrop.height / 2;
                const radius = Math.min(centerX, centerY);

                // a. สร้าง Clipping Mask รูปวงกลม
                finalCtx.beginPath();
                finalCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                finalCtx.closePath();
                finalCtx.clip(); // ส่วนที่วาดหลังจากนี้จะถูกจำกัดอยู่ในวงกลมเท่านั้น

                // b. วาดรูปภาพที่ครอปแล้ว (จาก canvas เดิม) ลงใน Mask
                finalCtx.drawImage(canvas, 0, 0);

                // c. ส่งผลลัพธ์เป็น PNG เพื่อคงความโปร่งใสของพื้นหลัง
                resolve(finalCanvas.toDataURL('image/png'));
            } else {
                // ถ้าเป็นสี่เหลี่ยม (รวมถึงสี่เหลี่ยมจัตุรัสปกติ)
                resolve(canvas.toDataURL('image/jpeg', 0.9)); // ใช้ JPEG คุณภาพสูง
            }
        };
        image.onerror = (error) => {
            console.error("Error loading image for cropping:", error);
            resolve(''); // หรือ reject(error);
        };
    });
};