'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Download, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  LogOut,
  Phone,
  MessageSquare,
  Building,
  X,
  Settings,
  UserPlus,
  CalendarDays,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface Guest {
  id: string;
  fullName: string;
  institution?: string;
  purpose?: string;
  message?: string;
  photoPath?: string;
  signaturePath?: string;
  visitDate: string;
  createdAt: string;
  hasSignature?: boolean;
}

interface Admin {
  id: string;
  username: string;
  password?: string;
  currentPassword?: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalGuests: number;
  todayGuests: number;
  recentGuests: number;
  dateStats: Array<{ date: string; count: number }>;
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guests' | 'admins' | 'events'>('guests');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchGuests();
    fetchAdmins();
    fetchEvents();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests');
      if (response.ok) {
        const data = await response.json();
        // Add hasSignature field based on signaturePath
        const guestsWithSignature = data.map((guest: any) => ({
          ...guest,
          hasSignature: !!guest.signaturePath
        }));
        setGuests(guestsWithSignature);
      }
    } catch (error) {
      toast.error('Gagal mengambil data tamu');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/manage');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data admin');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data events');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      toast.success('Berhasil keluar');
    } catch (error) {
      toast.error('Gagal keluar');
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Data berhasil dihapus');
        fetchGuests();
        fetchStats();
      } else {
        toast.error('Gagal menghapus data');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const openAddAdminModal = () => {
    setEditingAdmin({ username: '', password: '' } as any);
    setIsAdminModalOpen(true);
  };

  const openAddEventModal = () => {
    setEditingEvent({ title: '', description: '', isActive: true } as any);
    setIsEventModalOpen(true);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    try {
      const response = await fetch(`/api/guests/${editingGuest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingGuest),
      });

      if (response.ok) {
        toast.success('Data berhasil diperbarui');
        setIsEditModalOpen(false);
        setEditingGuest(null);
        fetchGuests();
      } else {
        toast.error('Gagal memperbarui data');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  // Admin management functions
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    try {
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAdmin),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setIsAdminModalOpen(false);
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        toast.error(data.message || 'Gagal menambah admin');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin({ ...admin, password: '', currentPassword: '' } as any);
    setIsAdminModalOpen(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    try {
      const response = await fetch(`/api/admin/manage/${editingAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAdmin),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setIsAdminModalOpen(false);
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        toast.error(data.message || 'Gagal memperbarui admin');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) return;

    try {
      const response = await fetch(`/api/admin/manage/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchAdmins();
      } else {
        toast.error(data.message || 'Gagal menghapus admin');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  // Event management functions
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEvent),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setIsEventModalOpen(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        toast.error(data.message || 'Gagal menambah event');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEvent),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setIsEventModalOpen(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        toast.error(data.message || 'Gagal memperbarui event');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchEvents();
      } else {
        toast.error(data.message || 'Gagal menghapus event');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guests_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Data berhasil diexport');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal export data. Silakan coba lagi.');
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.institution?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tamu</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalGuests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tamu Hari Ini</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayGuests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">7 Hari Terakhir</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recentGuests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Navigation */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('guests')}
                className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'guests'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Data Tamu
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'admins'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Manajemen Admin
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <CalendarDays className="w-4 h-4 inline mr-2" />
                Event/Acara
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === 'guests' && (
          <>
            {/* Search and Filter */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari nama atau instansi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tamu Baru
                  </Button>
                </div>
              </CardContent>
            </Card>

        {/* Guests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar Tamu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-700">Nama</th>
                    <th className="text-left p-3 font-medium text-gray-700">Instansi</th>
                    <th className="text-left p-3 font-medium text-gray-700">Tujuan</th>
                    <th className="text-left p-3 font-medium text-gray-700">Tanggal</th>
                    <th className="text-left p-3 font-medium text-gray-700">Tanda Tangan</th>
                    <th className="text-left p-3 font-medium text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{guest.fullName}</div>
                        {guest.message && (
                          <div className="text-sm text-gray-500 mt-1">
                            <MessageSquare className="w-3 h-3 inline mr-1" />
                            {guest.message.substring(0, 50)}...
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {guest.institution ? (
                          <Badge variant="secondary">
                            <Building className="w-3 h-3 mr-1" />
                            {guest.institution}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-sm">
                          {guest.purpose ? guest.purpose.substring(0, 30) + (guest.purpose.length > 30 ? '...' : '') : '-'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {new Date(guest.visitDate).toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(guest.visitDate).toLocaleTimeString('id-ID')}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(guest)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(guest.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredGuests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Tidak ada data tamu ditemukan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          </>
        )}

        {activeTab === 'admins' && (
          <>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manajemen Admin</h3>
                    <p className="text-sm text-gray-600">Kelola akun admin (maksimal 2 admin)</p>
                  </div>
                  <Button
                    onClick={openAddAdminModal}
                    className="flex items-center gap-2"
                    disabled={admins.length >= 2}
                  >
                    <UserPlus className="w-4 h-4" />
                    Tambah Admin
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Daftar Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">Username</th>
                        <th className="text-left p-3 font-medium text-gray-700">Dibuat</th>
                        <th className="text-left p-3 font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{admin.username}</td>
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(admin.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAdmin(admin)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={admins.length <= 1}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {admins.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada admin</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'events' && (
          <>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manajemen Event</h3>
                    <p className="text-sm text-gray-600">Kelola event/acara yang akan ditampilkan di halaman utama</p>
                  </div>
                  <Button
                    onClick={openAddEventModal}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Daftar Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">Judul Event</th>
                        <th className="text-left p-3 font-medium text-gray-700">Deskripsi</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{event.title}</td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {event.description ? event.description.substring(0, 50) + (event.description.length > 50 ? '...' : '') : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <Badge variant={event.isActive ? 'default' : 'secondary'}>
                              {event.isActive ? 'Aktif' : 'Non-aktif'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditEvent(event)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {events.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada event</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Contact Developer */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Butuh Bantuan?</h3>
                <p className="text-sm text-gray-600">Hubungi developer untuk dukungan teknis</p>
              </div>
              <Button
                onClick={() => window.open('https://wa.me/6283199105445', '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Kontak WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Admin Panel Buku Tamu Digital</p>
          <p className="font-medium text-blue-600">Dibuat oleh Siswa SMK Muhammadiyah Bandongan</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Edit Data Tamu
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateGuest} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={editingGuest.fullName}
                    onChange={(e) => setEditingGuest({...editingGuest, fullName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="institution">Instansi</Label>
                  <Input
                    id="institution"
                    value={editingGuest.institution || ''}
                    onChange={(e) => setEditingGuest({...editingGuest, institution: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="purpose">Maksud dan Tujuan</Label>
                  <Textarea
                    id="purpose"
                    value={editingGuest.purpose || ''}
                    onChange={(e) => setEditingGuest({...editingGuest, purpose: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Kesan dan Pesan</Label>
                  <Textarea
                    id="message"
                    value={editingGuest.message || ''}
                    onChange={(e) => setEditingGuest({...editingGuest, message: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Simpan Perubahan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Modal */}
      {isAdminModalOpen && editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingAdmin.id ? 'Edit Admin' : 'Tambah Admin'}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdminModalOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingAdmin.id ? handleUpdateAdmin : handleAddAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editingAdmin.username}
                    onChange={(e) => setEditingAdmin({...editingAdmin, username: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">
                    {editingAdmin.id ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={editingAdmin.password || ''}
                    onChange={(e) => setEditingAdmin({...editingAdmin, password: e.target.value})}
                    required={!editingAdmin.id}
                  />
                </div>

                {editingAdmin.id && (
                  <div>
                    <Label htmlFor="currentPassword">Password Lama</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={editingAdmin.currentPassword || ''}
                      onChange={(e) => setEditingAdmin({...editingAdmin, currentPassword: e.target.value})}
                      required={!!editingAdmin.password}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingAdmin.id ? 'Update' : 'Tambah'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdminModalOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event Modal */}
      {isEventModalOpen && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingEvent.id ? 'Edit Event' : 'Tambah Event'}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEventModalOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingEvent.id ? handleUpdateEvent : handleAddEvent} className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul Event</Label>
                  <Input
                    id="title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingEvent.isActive}
                    onChange={(e) => setEditingEvent({...editingEvent, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Tampilkan di halaman utama</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingEvent.id ? 'Update' : 'Tambah'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEventModalOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}