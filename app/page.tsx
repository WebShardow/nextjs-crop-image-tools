// app/page.tsx
import ImageCropper from "@/components/ImageCropper";

/**
 * @title Home Component (Server Component)
 * @dev หน้าหลักสำหรับ Image Cropper Tool
 */
export default function Home() {
  const githubRepoUrl = "https://github.com/WebShardow/nextjs-crop-image-tools";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 
                     bg-linear-to-br from-bg-start to-bg-end"> 
        
        {/* ชื่อโครงการและสโลแกน */}
        <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
            Image Cropper Tools
        </h1>
        <p className="text-xl text-gray-200 mb-8 text-center max-w-lg">
            เครื่องมือครอบตัดรูปภาพที่รวดเร็วและฟรีสำหรับทุกคน
        </p>

        {/* Image Cropper Component */}
        <div className="w-full max-w-lg bg-cyan-900 shadow-2xl rounded-xl p-6 border border-gray-100/50">
            <ImageCropper />
        </div>
        
        {/* ส่วนท้าย - GitHub Link และ Credits */}
        <div className="mt-8 text-center">
            {/* GitHub Link */}
            <a 
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-lg font-semibold text-blue-300 hover:text-blue-500 transition duration-300"
            >
                {/* 🐙 Icon GitHub */}
                <span className="text-2xl mr-2">🐙</span> 
                ร่วมทดสอบและพัฒนาบน GitHub
            </a>

            {/* Credits (แก้ไขส่วนนี้) */}
            <p className="mt-4 text-sm text-gray-400">
                พัฒนาโดย <a href="https://github.com/WebShardow" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-white">WebShardow</a> 
                | สถาปัตยกรรมโครงการโดย <a href="https://microtronic.biz/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-300 hover:text-white">microtronic.biz</a>
            </p>
        </div>
    </main>
  );
}