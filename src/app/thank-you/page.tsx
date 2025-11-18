'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ThankYou() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Terima Kasih!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Data kunjungan Anda telah berhasil tersimpan.
            </p>
            <p className="text-gray-600">
              Terima kasih atas kunjungan Anda di SMK Muhammadiyah Bandongan.
            </p>
            <div className="pt-4 space-y-2">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Halaman Utama
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}