# إعداد ClickHouse محلياً | ClickHouse Local Setup

## المتطلبات

1. **Docker Desktop** - [تحميل من هنا](https://www.docker.com/products/docker-desktop/)
2. تأكد من تشغيل Docker Desktop قبل البدء

---

## طريقة التشغيل السريعة (بعد تثبيت Docker)

### الطريقة 1: PowerShell

```powershell
cd "مسار\مشروع تخرج 2\Real-Time-Distributed-Analytics-Dashboard-Project-main\database"
.\setup-clickhouse.ps1
```

### الطريقة 2: CMD / Batch

```cmd
cd "مسار\مشروع تخرج 2\Real-Time-Distributed-Analytics-Dashboard-Project-main\database"
setup-clickhouse.bat
```

### الطريقة 3: يدوياً

```powershell
# 1. تشغيل الحاوية
cd database
docker compose up -d

# 2. انتظر 15 ثانية

# 3. إنشاء قاعدة البيانات والجداول
docker exec -i clickhouse clickhouse-client --user default --password root --query "CREATE DATABASE IF NOT EXISTS analytics"
Get-Content .\init\create_tables.v3.sql | docker exec -i clickhouse clickhouse-client --user default --password root --database analytics --multiquery
```

---

## إعداد ملف .env في BackEnd

تأكد من وجود هذه القيم في `BackEnd\.env`:

```env
CLICKHOUSE_HOST=127.0.0.1
CLICKHOUSE_PORT=8123
CLICKHOUSE_DATABASE=analytics
CLICKHOUSE_USERNAME=default
CLICKHOUSE_PASSWORD=root
```

---

## اختبار الاتصال

1. شغّل Laravel:
   ```bash
   cd BackEnd
   php artisan serve
   ```

2. اختبر الاتصال:
   ```
   GET http://localhost:8000/api/analytics/test-connection
   ```

   النتيجة المتوقعة:
   ```json
   {"success": true, "message": "ClickHouse connection successful"}
   ```

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| `docker` غير معروف | ثبّت Docker Desktop وأعد تشغيل الجهاز |
| `docker compose` غير معروف | استخدم `docker compose` (مسافة) بدلاً من `docker-compose` |
| المنفذ 8123 مستخدم | أوقف التطبيق الذي يستخدمه أو غيّر المنفذ في docker-compose.yml |
| خطأ في الاتصال | تأكد أن ClickHouse يعمل: `curl http://localhost:8123/` |
