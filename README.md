# 🏫 **SMK Muhammadiyah Bandongan - Buku Tamu Digital**

Aplikasi buku tamu digital modern dengan fitur lengkap untuk SMK Muhammadiyah Bandongan.

## ✨ **FITUR LENGKAP:**

### 📝 **Buku Tamu Digital**
- ✅ Form pendaftaran tamu yang user-friendly
- ✅ Dokumentasi foto dengan kamera Full HD
- ✅ Tanda tangan digital full screen dengan kualitas tinggi
- ✅ Auto timestamp atau manual input
- ✅ Data instansi, tujuan, dan pesan

### 👨‍💼 **Admin Dashboard**
- ✅ Management data tamu (CRUD)
- ✅ Admin management (maksimal 2 admin)
- ✅ Event & acara management
- ✅ Real-time statistics
- ✅ Export data ke CSV
- ✅ Search dan filter data

### 📱 **Mobile Responsive**
- ✅ Kamera Full HD dengan switch kamera depan/belakang
- ✅ Tanda tangan full screen yang optimal untuk jari besar
- ✅ Touch-friendly interface dengan area luas
- ✅ Optimized untuk semua device size
- ✅ Anti-pixel dengan kualitas gambar tinggi

### 🚀 **Production Ready**
- ✅ Auto-deployment dengan Vercel
- ✅ PostgreSQL database (Vercel Postgres)
- ✅ Cloud file storage (Vercel Blob)
- ✅ SSL certificate
- ✅ Custom domain support

## 🎯 **QUICK DEPLOY (5 MENIT):**
**Unduh ke zip dan install yang diperlukan untuk Git Repo ini lebih dahulu sebelum melanjutkan dengan mencari tutorial di internet**
### **1. Push ke GitHub**
```bash
git add .
git commit -m ""
git push origin main
```
## **Jika tidak mempunyai komputer untuk Push ke github bisa upload manual ke Project masing masing**

### **2. Deploy ke Vercel**
1. Buka `https://vercel.com`
2. Login dengan GitHub
3. Click **"New Project"**
4. Pilih repository → **"Deploy"**

### **3. Setup Database & Storage**
1. Di Vercel Dashboard → **"Storage"**
2. Create **"Postgres"** database
3. Create **"Blob"** storage
4. Run: `npm run db:push`

### **4. SELE Siap untuk dikerahkanSAI!** 🎉
- **App**: `https://your-app.vercel.app`
- **Admin**: `https://your-app.vercel.app/admin/dashboard`
- **Login**: `admin` / `admin123`

---

## 🛠️ **TECHNOLOGY STACK:**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Vercel Postgres)
- **Storage**: Vercel Blob Storage
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel

## 📁 **PROJECT STRUCTURE:**

```
src/
├── app/
│   ├── page.tsx                 # Halaman utama (buku tamu)
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx        # Admin dashboard
│   └── api/                   # API routes
├── components/
│   └── ui/                    # UI components
├── lib/
│   ├── db.ts                  # Database connection
│   └── vercel-blob.ts         # File storage
└── prisma/
    └── schema.prisma          # Database schema
```

## 🔧 **LOCAL DEVELOPMENT:**

### **Install Dependencies**
```bash
npm install
```

### **Setup Database**
```bash
npm run db:push
npm run reset-admin  # Reset admin credentials
```

### **Start Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build:vercel
```

## 📚 **GUIDES & DOCUMENTATION:**

- **[QUICK-START.md](./QUICK-START.md)** - Deploy dalam 5 menit
- **[VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)** - Deployment guide lengkap
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Alternative deployment options

## 🔐 **DEFAULT CREDENTIALS:**

- **Username**: `admin`
- **Password**: `admin123`

## 🎨 **FEATURES HIGHLIGHT:**

### **Tanda Tangan Digital Full Screen**
- Full screen popup untuk area tanda tangan yang luas
- Kualitas tinggi (0.9) anti-pixel dan kotak-kotak
- Canvas 2x retina display untuk hasil yang tajam
- Line width 3px agar lebih terlihat jelas
- Undo functionality untuk kesalahan
- Touch-optimized untuk jari besar

### **Kamera Integration**
- Full HD camera (1920x1080) untuk hasil yang jernih
- Popup modal full screen yang modern
- Support switch camera (depan/belakang) yang smooth
- Error handling dan retry functionality
- Optimized untuk mobile dengan loading states
- Camera ready indicator
- Foto quality 95% untuk hasil terbaik

### **Admin Dashboard**
- Tab-based navigation
- Real-time statistics
- Data visualization
- Export functionality
- Search & filter

## 🌟 **WHY THIS APP?**

1. **Modern Stack** - Next.js 15, TypeScript, Tailwind CSS
2. **Production Ready** - Auto-deployment, database, storage
3. **Mobile First** - Responsive design, touch-friendly
4. **Easy Deploy** - Tinggal push ke GitHub, deploy ke Vercel
5. **Complete Features** - Semua yang dibutuhkan buku tamu digital
6. **Maintainable** - Clean code, good structure, TypeScript

## 🤝 **CONTRIBUTION:**

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 **SUPPORT:**

Jika butuh bantuan:
- Cek documentation di folder ini
- Test di local development dulu
- Pastikan semua environment variables ter-set
  
---

## 🎉 **SELAMAT MENGGUNAKAN!**

**SMK Muhammadiyah Bandongan - Success By Discipline**

*Built with ❤️ using Next.js 15, TypeScript, and Vercel*

Dikembangkan Oleh Aditya Arta Putra X TJKT A
