'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, X, RotateCw, CameraOff } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (file: File) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function OptimizedCameraCapture({ onPhotoCapture, isOpen, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError('');
    setIsCameraReady(false);
    
    try {
      // Coba dapatkan kamera dengan constraints yang optimal
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920, max: 1920 }, // Full HD
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 16/9 },
          frameRate: { ideal: 30, max: 30 }
        } 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Tunggu video siap
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin kamera.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions sesuai video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame ke canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob dengan kualitas tinggi
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            onPhotoCapture(file);
            onClose();
          }
        }, 'image/jpeg', 0.95); // Kualitas tinggi
      }
    }
  };

  const handleRetry = () => {
    startCamera();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Ambil Foto
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full p-4 space-y-4">
          {/* Camera Container */}
          <div className="flex-1 relative bg-black rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Memuat kamera...</p>
                </div>
              </div>
            )}
            
            {cameraError && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-white text-center p-4">
                  <CameraOff className="w-12 h-12 mx-auto mb-2 text-red-400" />
                  <p className="mb-3">{cameraError}</p>
                  <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
                    Coba Lagi
                  </Button>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isCameraReady && !cameraError ? 'opacity-50' : ''}`}
              style={{ 
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                transition: 'transform 0.3s ease'
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera status indicator */}
            {isCameraReady && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 rounded-full w-3 h-3 animate-pulse"></div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={switchCamera}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                {facingMode === 'user' ? 'Kamera Belakang' : 'Kamera Depan'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                Batal
              </Button>
              
              <Button
                type="button"
                onClick={capturePhoto}
                disabled={!isCameraReady || isLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 min-w-[140px]"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                {isCameraReady ? 'Ambil Foto' : 'Menyiapkan...'}
              </Button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p>Pastikan wajah Anda terlihat jelas dan cahaya cukup</p>
            <p className="text-xs text-gray-500 mt-1">
              {facingMode === 'user' ? 'Menggunakan kamera depan' : 'Menggunakan kamera belakang'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}