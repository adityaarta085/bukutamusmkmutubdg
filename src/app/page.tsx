'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Calendar, Clock, User, Building, MessageSquare, Send, CalendarDays, Pen } from 'lucide-react';
import { toast } from 'sonner';
import FullScreenSignatureCanvas from '@/components/ui/FullScreenSignatureCanvas';
import OptimizedCameraCapture from '@/components/ui/OptimizedCameraCapture';

interface Event {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GuestBook() {
  const [formData, setFormData] = useState({
    fullName: '',
    visitDate: '',
    isAutoDate: true,
    institution: '',
    purpose: '',
    message: '',
    photo: null as File | null,
    signatureData: null as string | null
  });
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (formData.isAutoDate) {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setFormData(prev => ({ ...prev, visitDate: localDateTime }));
    }
  }, [formData.isAutoDate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/active');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    const isAuto = value === 'auto';
    setFormData(prev => ({ 
      ...prev, 
      isAutoDate: isAuto,
      visitDate: isAuto ? new Date().toISOString().slice(0, 16) : prev.visitDate
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePhotoCapture = (file: File) => {
    setFormData(prev => ({ ...prev, photo: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Nama lengkap wajib diisi!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('visitDate', formData.visitDate);
      formDataToSend.append('isAutoDate', formData.isAutoDate.toString());
      formDataToSend.append('institution', formData.institution);
      formDataToSend.append('purpose', formData.purpose);
      formDataToSend.append('message', formData.message);
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      
      if (formData.signatureData) {
        formDataToSend.append('signatureData', formData.signatureData);
      }

      const response = await fetch('/api/guests', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success('Data berhasil disimpan! Terima kasih atas kunjungan Anda.');
        setTimeout(() => {
          window.location.href = '/thank-you';
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Gagal menyimpan data. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="mb-4">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-Rdj_KB9skzLT1EDNWQm3M3t3lAx8nCf3IhYhGN8XxI1a-7-Bkd_h-f-OeP6_134e2-k_r_Zjc-0gxu8DLjWGOjjx4DQ0nhKEW-7U1erYKzzyt-KXVjboTYN7zAbk_8wQIP9dtve_PbgIYXuCDgbC9Np8sq0vjsI6_zszRi8GShq8vKlDp5nPg7IPj6I/s320/images__2_-removebg-preview.png" 
              alt="Logo Sekolah"
              className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg object-contain bg-white"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SMK Muhammadiyah Bandongan</h1>
          <p className="text-lg text-gray-600 italic">Success By Discipline</p>
        </div>

        {/* Events Section */}
        {events.length > 0 && (
          <div className="mb-8">
            <Card className="shadow-lg border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5" />
                  Event & Acara Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h3>
                          {event.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                          )}
                        </div>
                        <Badge variant="default" className="ml-3 bg-green-500 hover:bg-green-600">
                          Aktif
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Card */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-xl font-semibold text-center">
              Buku Tamu Digital
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  className="w-full"
                />
              </div>

              {/* Visit Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Waktu dan Tanggal Kedatangan
                </Label>
                <RadioGroup 
                  value={formData.isAutoDate ? 'auto' : 'manual'} 
                  onValueChange={handleRadioChange}
                  className="flex gap-4 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto">Otomatis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Isi Sendiri</Label>
                  </div>
                </RadioGroup>
                <Input
                  name="visitDate"
                  type="datetime-local"
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  disabled={formData.isAutoDate}
                  className="w-full"
                />
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <Label htmlFor="institution" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Nama Instansi
                </Label>
                <Input
                  id="institution"
                  name="institution"
                  type="text"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama instansi (opsional)"
                  className="w-full"
                />
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label htmlFor="purpose">Maksud dan Tujuan</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Jelaskan maksud dan tujuan kunjungan Anda (opsional)"
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Kesan dan Pesan
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Bagikan kesan dan pesan Anda (opsional)"
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Photo Documentation */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Dokumentasi (Foto)
                </Label>
                
                {previewUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData(prev => ({ ...prev, photo: null }));
                        }}
                        className="flex-1"
                      >
                        Hapus Foto
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCameraOpen(true)}
                        className="flex-1"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Buka Kamera
                      </Button>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  Foto opsional, namun sangat disarankan untuk dokumentasi
                </p>
              </div>

              {/* Signature */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Pen className="w-4 h-4" />
                  Tanda Tangan Digital
                </Label>
                
                {formData.signatureData ? (
                  <div className="space-y-2">
                    <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50">
                      <div className="flex items-center gap-2 text-green-700">
                        <Pen className="w-4 h-4" />
                        <span className="font-medium">Tanda tangan sudah disimpan</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, signatureData: null }));
                        }}
                        className="flex-1"
                      >
                        Hapus Tanda Tangan
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsSignatureOpen(true)}
                        className="flex-1"
                      >
                        Ubah Tanda Tangan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsSignatureOpen(true)}
                    className="w-full h-16 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                    variant="outline"
                  >
                    <Pen className="w-5 h-5 mr-2" />
                    Buat Tanda Tangan Digital
                  </Button>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Simpan Data
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Camera Dialog */}
        <OptimizedCameraCapture
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onPhotoCapture={handlePhotoCapture}
        />
        
        {/* Signature Dialog */}
        <FullScreenSignatureCanvas
          isOpen={isSignatureOpen}
          onClose={() => setIsSignatureOpen(false)}
          onSignatureChange={(signatureData) => 
            setFormData(prev => ({ ...prev, signatureData }))
          }
        />
      </div>
    </div>
  );
}