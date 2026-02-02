# Real-Time Distributed Analytics Dashboard

نظام تحليلات موزع يعمل في الوقت الفعلي لجمع وتحليل سلوك المستخدمين على المواقع.

## نظرة عامة

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Website +     │────▶│   Laravel API   │────▶│   ClickHouse    │
│   Tracker.js    │     │   (Backend)     │     │   (Analytics)   │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 │ WebSocket
                                 ▼
                        ┌─────────────────┐
                        │  React Dashboard │
                        │   (Frontend)     │
                        └─────────────────┘
```

## المكونات

| المكون | التقنية | الوصف |
|--------|---------|-------|
| Backend | Laravel 12 + PHP 8.2 | API + WebSocket + Authentication |
| Frontend | React 18 + TypeScript + Vite | لوحة التحكم |
| Tracker | JavaScript SDK | جمع بيانات المستخدمين |
| Analytics DB | ClickHouse | تخزين وتحليل الأحداث |
| Users DB | MySQL | المستخدمين والأدوار |

## المتطلبات

### برمجيات مطلوبة

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- npm 9+
- Docker Desktop
- MySQL 8.0+

### المنافذ المستخدمة

| الخدمة | المنفذ |
|--------|--------|
| Laravel API | 8000 |
| Laravel Reverb (WebSocket) | 8080 |
| ClickHouse HTTP | 8123 |
| ClickHouse Native | 9000 |
| MySQL | 3306 |
| Frontend (Vite) | 5173 |

## التثبيت والتشغيل

### 1. تشغيل ClickHouse (Docker)

```bash
cd database
docker-compose up -d
```

### 2. إعداد Backend

```bash
cd BackEnd

# تثبيت التبعيات
composer install

# نسخ ملف البيئة
cp .env.example .env

# توليد المفاتيح
php artisan key:generate
php artisan jwt:secret

# تشغيل migrations
php artisan migrate

# إنشاء الأدوار الافتراضية
php artisan db:seed

# تشغيل السيرفر
php artisan serve
```

### 3. تشغيل WebSocket (في terminal منفصل)

```bash
cd BackEnd
php artisan reverb:start
```

### 4. إعداد Frontend

```bash
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard

# تثبيت التبعيات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل سيرفر التطوير
npm run dev
```

## هيكل المشروع

```
├── BackEnd/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/             # Eloquent Models
│   │   ├── Services/           # ClickHouse Service
│   │   ├── Events/             # WebSocket Events
│   │   └── Middleware/         # Auth Middleware
│   ├── routes/api.php          # API Routes
│   └── config/                 # Configuration
│
├── frontend/                   # React Frontend
│   └── react-analytics-dashboard-updated/
│       └── react-analytics-dashboard/
│           ├── src/
│           │   ├── pages/      # Page Components
│           │   ├── services/   # API Services
│           │   └── components/ # Reusable Components
│           └── package.json
│
├── tracker/                    # Tracking Script
│   ├── index.js               # Main Tracker
│   └── bootstrap_snippet.html # Integration Snippet
│
├── database/                   # ClickHouse Setup
│   ├── docker-compose.yml
│   └── init/                  # Schema Files
│
└── load balancer/             # Nginx Config
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | تسجيل مستخدم جديد |
| POST | `/api/login` | تسجيل الدخول |
| POST | `/api/logout` | تسجيل الخروج (JWT) |
| POST | `/api/refresh` | تحديث Token |
| GET | `/api/me` | معلومات المستخدم الحالي |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/track` | إرسال حدث تتبع |
| POST | `/api/track/batch` | إرسال أحداث متعددة |
| GET | `/api/user/{id}/analytics` | تحليلات المستخدم |
| GET | `/api/analytics/{trackingId}/realtime` | إحصائيات لحظية |

## استخدام Tracker

### إضافة Tracker للموقع

```html
<script 
  src="tracker/index.js" 
  data-endpoint="http://localhost:8000/api/track"
  data-tracking-id="your-site-id"
  data-debug="true">
</script>
```

### الأحداث المدعومة

- `page_load` - تحميل الصفحة
- `page_view` - عرض الصفحة
- `click` - النقرات
- `scroll` - التمرير
- `form_submit` - إرسال النماذج
- `video_play/pause/complete` - أحداث الفيديو
- `product_view/cart_add/purchase` - التجارة الإلكترونية

## البيانات المجمعة

### بيانات الجلسة
- معلومات الجهاز (نوع، نظام التشغيل، المتصفح)
- الموقع الجغرافي
- دقة الشاشة
- مصدر الزيارة

### بيانات الأداء
- DNS time
- Connect time
- Response time
- DOM load time
- Page load time

### بيانات التفاعل
- النقرات (موضع، عنصر)
- التمرير (عمق)
- النماذج (الحقول، الإرسال)

## الاختبار

### اختبار API

```bash
# تسجيل مستخدم
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","password_confirmation":"password123"}'

# تسجيل دخول
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# إرسال حدث
curl -X POST http://localhost:8000/api/track \
  -H "Content-Type: application/json" \
  -d '{"tracking_id":"test","type":"page_view","page_url":"/test"}'
```

### اختبار ClickHouse

```bash
# التحقق من الاتصال
curl http://localhost:8123/

# استعلام البيانات
curl "http://localhost:8123/?query=SELECT count(*) FROM page_events"
```

## النشر

### متطلبات الإنتاج

- VPS بـ 4GB RAM كحد أدنى
- Ubuntu 22.04 LTS
- Nginx
- SSL Certificate

### لا يمكن النشر على:
- Shared Hosting (هوستنجر المشتركة)
- لأن المشروع يحتاج: ClickHouse, WebSocket (daemon), Docker

### خيارات الاستضافة المقترحة
- DigitalOcean Droplet ($12-24/شهر)
- Hostinger VPS ($8-15/شهر)
- Contabo VPS ($5-10/شهر)
- Railway.app / Render.com

## المساهمة

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## الترخيص

MIT License
