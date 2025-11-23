// components/ImageCropper.tsx
'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage';

/**
 * @title ImageCropper Component
 * @dev คอมโพเนนต์สำหรับอัปโหลด, ครอป, และดาวน์โหลดรูปภาพ
 */
const ImageCropper = () => {
    // 1. สถานะหลัก
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(1 / 1);
    const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');

    // 2. Handlers
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_croppedAreaPercentage: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const onCropAndDownload = useCallback(async () => {
        if (!imageSrc || !croppedArea) return;

        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedArea); 
            
            const link = document.createElement('a');
            link.href = croppedImage;
            const fileName = cropShape === 'round' ? 'cropped-image-round.png' : 'cropped-image.jpeg';
            link.download = fileName; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (e) {
            console.error(e);
            alert('เกิดข้อผิดพลาดในการครอปรูปภาพ');
        }
    }, [imageSrc, croppedArea, cropShape]);

    const handleAspectChange = (newAspect: number | undefined, shape: 'rect' | 'round') => {
        setAspectRatio(newAspect);
        setCropShape(shape);
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold text-center text-blue-100">📸 Image Cropper</h1>
            
            {/* -------------------- 1. INPUT (A11y Fix Applied) -------------------- */}
            <input 
                type="file" 
                accept="image/*" 
                onChange={onFileChange} 
                aria-label="Upload Image File" // ✅ FIX: เพิ่ม aria-label สำหรับ Input File
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
            />

            {/* -------------------- 2. CONTROLS -------------------- */}
            <div className="flex flex-wrap gap-2 justify-center">
                <button 
                    onClick={() => handleAspectChange(1 / 1, 'rect')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${aspectRatio === 1 / 1 && cropShape === 'rect' ? 'bg-fuchsia-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-fuchsia-100'}`}
                >
                    สี่เหลี่ยมจัตุรัส (1:1)
                </button>
                <button 
                    onClick={() => handleAspectChange(undefined, 'rect')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${aspectRatio === undefined && cropShape === 'rect' ? 'bg-fuchsia-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-fuchsia-100'}`}
                >
                    สี่เหลี่ยมอิสระ
                </button>
                <button 
                    onClick={() => handleAspectChange(1 / 1, 'round')}
                    data-cropshape="round" // Attribute สำหรับ getCroppedImg
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${cropShape === 'round' ? 'bg-fuchsia-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-fuchsia-100'}`}
                >
                    วงกลม
                </button>
            </div>

            {/* -------------------- 3. CROP AREA -------------------- */}
            {imageSrc && (
                <div className="relative w-full h-[400px] bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape={cropShape}
                        showGrid={cropShape === 'rect'} 
                    />
                </div>
            )}
            
            {/* -------------------- 4. ZOOM SLIDER (A11y Fix Applied) -------------------- */}
            {imageSrc && (
                <div className="flex items-center gap-4">
                    <span id="zoom-label" className="text-sm font-medium">Zoom:</span> {/* ✅ FIX: เพิ่ม id ให้ span */}
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="zoom-label" // ✅ FIX: เชื่อม input เข้ากับ span ด้วย aria-labelledby
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                    />
                </div>
            )}

            {/* -------------------- 5. DOWNLOAD BUTTON -------------------- */}
            <button 
                onClick={onCropAndDownload}
                disabled={!imageSrc || !croppedArea}
                className="w-full px-4 py-3 font-bold text-white rounded-lg transition disabled:opacity-50 
                           bg-fuchsia-600 hover:bg-fuchsia-700"
            >
                Crop & Download
            </button>
        </div>
    );
};

export default ImageCropper;