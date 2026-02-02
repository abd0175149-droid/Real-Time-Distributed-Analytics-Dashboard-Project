# دليل التشغيل والاختبار | Runbook

## 1. الإعداد الأولي (مهم - الترتيب ضروري)

### 1.1 ClickHouse

```powershell
cd database
docker compose up -d
```

### 1.2 MySQL

تأكد من تشغيل MySQL وإنشاء قاعدة البيانات `auth_db`.

### 1.3 إعداد كامل (الترتيب مهم)

```powershell
cd BackEnd

# 1. Migrations
php artisan migrate --force

# 2. مستخدمي الاختبار (IDs ثابتة لضمان توافق ClickHouse)
php artisan db:seed --class=TestUsersSeeder --force

# 3. بيانات ClickHouse النموذجية (يجب أن يعقب db:seed)
php artisan clickhouse:seed-sample

# 4. التحقق من الإعداد
php artisan check:analytics-setup
```

**أو استخدم سكربت الإعداد الكامل:**
```powershell
cd BackEnd
.\scripts\full-setup.ps1
```

### 1.4 إذا لم تظهر البيانات – إعادة الإعداد

```powershell
php artisan migrate:fresh --seed
php artisan clickhouse:seed-sample
php artisan check:analytics-setup
```

---

## 2. تشغيل السيرفرات

### 2.1 Backend (Laravel API)

```powershell
cd BackEnd
php artisan serve
```

السيرفر: **http://localhost:8000**

### 2.2 WebSocket (نافذة جديدة)

```powershell
cd BackEnd
php artisan reverb:start
```

يعمل على: **ws://localhost:8080**

### 2.3 Frontend (React Dashboard)

```powershell
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard
npm run dev
```

يعمل على: **http://localhost:5173**

---

## 3. مستخدمي الاختبار

| البريد | كلمة المرور | الدور |
|--------|-------------|-------|
| admin@test.com | password123 | admin |
| user@test.com | password123 | user |
| analyst@test.com | password123 | analyst |

---

## 4. أمر التشخيص

```powershell
php artisan check:analytics-setup
```

يعرض:
- المستخدمين في MySQL
- حالة الاتصال بـ ClickHouse
- عدد الأحداث لكل مستخدم
- التحقق من توافق البيانات

---

## 5. إعداد ملف .env

### Backend (`BackEnd\.env`)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=auth_db
DB_USERNAME=root
DB_PASSWORD=

CLICKHOUSE_HOST=127.0.0.1
CLICKHOUSE_PORT=8123
CLICKHOUSE_DATABASE=analytics
CLICKHOUSE_USERNAME=default
CLICKHOUSE_PASSWORD=root
```

### Frontend (`frontend/.../react-analytics-dashboard\.env`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8080
VITE_REVERB_APP_KEY=local
```

---

## 6. التسلسل الكامل للتشغيل

```powershell
# 1. ClickHouse
cd database
docker compose up -d

# 2. إعداد Backend (الترتيب مهم!)
cd ..\BackEnd
php artisan migrate --force
php artisan db:seed --class=TestUsersSeeder --force
php artisan clickhouse:seed-sample
php artisan check:analytics-setup

# 3. Backend + WebSocket + Frontend
php artisan serve
# (نافذة أخرى) php artisan reverb:start
# (نافذة أخرى) cd ..\frontend\...\react-analytics-dashboard; npm run dev
```

---

## 7. التحقق من الاتصال

- API: http://localhost:8000/api/analytics/test-connection  
- تسجيل الدخول: http://localhost:5173/login  
- لوحة التحكم: http://localhost:5173/dashboard  
