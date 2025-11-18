'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pen, Eraser, X, RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange?: (signatureData: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullScreenSignatureCanvas({ 
  onSignatureChange, 
  isOpen,
  onClose 
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    if (isOpen) {
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
    }
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isOpen]);

  const updateCanvasSize = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      const newWidth = Math.min(width - 40, 1200); // Max 1200px
      const newHeight = Math.max(300, newWidth * 0.5); // Aspect ratio 2:1, min 300px
      setCanvasSize({ width: newWidth, height: newHeight });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas properties untuk kualitas tinggi
    canvas.width = canvasSize.width * 2; // 2x untuk retina display
    canvas.height = canvasSize.height * 2;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3; // Lebih tebal untuk signature
    ctx.strokeStyle = '#000000';
    
    // Clear canvas dengan background putih
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasSize]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setIsEmpty(false);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onSignatureChange?.(null);
  };

  const getSignatureData = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return null;

    return canvas.toDataURL('image/png', 0.9); // Kualitas tinggi untuk tampilan bagus
  };

  const saveSignature = () => {
    const signatureData = getSignatureData();
    if (signatureData) {
      onSignatureChange?.(signatureData);
      onClose();
    }
  };

  const undoLastStroke = () => {
    // Implementasi undo sederhana - clear canvas
    clearCanvas();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Pen className="w-5 h-5" />
              Tanda Tangan Digital
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
        
        <div ref={containerRef} className="flex flex-col h-full p-4 space-y-4">
          {/* Canvas Container */}
          <div className="flex-1 border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
              style={{ touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="flex items-center gap-2"
              >
                <Eraser className="w-4 h-4" />
                Hapus
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={undoLastStroke}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Undo
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
                onClick={saveSignature}
                disabled={isEmpty}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Pen className="w-4 h-4" />
                Simpan Tanda Tangan
              </Button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p>Gunakan mouse atau jari untuk menandatangani di area putih</p>
            <p className="text-xs text-gray-500 mt-1">Pastikan tanda tangan terlihat jelas dan mudah dibaca</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}