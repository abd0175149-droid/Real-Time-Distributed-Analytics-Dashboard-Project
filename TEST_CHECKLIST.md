# قائمة اختبارات النظام الشاملة
# Comprehensive System Test Checklist

## المتطلبات الأساسية للتشغيل

قبل البدء بالاختبارات، تأكد من:

1. تشغيل MySQL على المنفذ 3306
2. تشغيل ClickHouse على المنفذ 8123
3. إنشاء قاعدة بيانات MySQL (اسمها في `.env`)
4. تشغيل migrations

---

## 1. اختبارات Backend الأساسية

### 1.1 اختبار الاتصال بقاعدة البيانات

```powershell
cd BackEnd
php artisan migrate:status
```

**النتيجة المتوقعة:** قائمة بجميع migrations مع حالة "Ran"

### 1.2 تشغيل Unit Tests

```powershell
cd BackEnd
php artisan test
```

**النتيجة المتوقعة:** جميع الاختبارات تمر (PASS)

### 1.3 اختبار ClickHouse Connection

```powershell
curl http://localhost:8000/api/analytics/test-connection
```

**النتيجة المتوقعة:**
```json
{"success": true, "message": "ClickHouse connection successful"}
```

---

## 2. اختبارات Authentication API

### 2.1 تسجيل مستخدم جديد

```powershell
curl -X POST http://localhost:8000/api/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}'
```

**النتيجة المتوقعة:** Status 201 مع `message: "Register success"`

### 2.2 تسجيل الدخول

```powershell
curl -X POST http://localhost:8000/api/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

**النتيجة المتوقعة:** Status 200 مع `access_token` و `user` object

### 2.3 الحصول على معلومات المستخدم

```powershell
curl -X GET http://localhost:8000/api/me `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**النتيجة المتوقعة:** Status 200 مع بيانات المستخدم

### 2.4 تجديد Token

```powershell
curl -X POST http://localhost:8000/api/refresh `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**النتيجة المتوقعة:** Status 200 مع `access_token` جديد

### 2.5 تسجيل الخروج

```powershell
curl -X POST http://localhost:8000/api/logout `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**النتيجة المتوقعة:** Status 200 مع `message: "Logged out"`

---

## 3. اختبارات Tracking API

### 3.1 تتبع حدث Page View

```powershell
curl -X POST http://localhost:8000/api/track `
  -H "Content-Type: application/json" `
  -d '{\"tracking_id\":\"test_site\",\"type\":\"page_view\",\"session_id\":\"sess_123\",\"page_url\":\"/test\",\"page_title\":\"Test Page\"}'
```

**النتيجة المتوقعة:**
```json
{"status": "ok", "message": "Event stored successfully", "event_type": "page_view"}
```

### 3.2 تتبع حدث Page Load

```powershell
curl -X POST http://localhost:8000/api/track `
  -H "Content-Type: application/json" `
  -d '{\"tracking_id\":\"test_site\",\"type\":\"page_load\",\"session_id\":\"sess_123\",\"data\":{\"url\":\"https://example.com\",\"title\":\"Home\",\"device_type\":\"Desktop\",\"browser\":\"Chrome\"}}'
```

**النتيجة المتوقعة:** Status 200 مع `event_type: "page_load"`

### 3.3 تتبع حدث Click

```powershell
curl -X POST http://localhost:8000/api/track `
  -H "Content-Type: application/json" `
  -d '{\"tracking_id\":\"test_site\",\"type\":\"click\",\"session_id\":\"sess_123\",\"x\":100,\"y\":200,\"element\":\"button\"}'
```

**النتيجة المتوقعة:** Status 200 مع `event_type: "click"`

### 3.4 تتبع Batch Events

```powershell
curl -X POST http://localhost:8000/api/track/batch `
  -H "Content-Type: application/json" `
  -d '{\"events\":[{\"tracking_id\":\"test_site\",\"type\":\"page_view\",\"page_url\":\"/p1\"},{\"tracking_id\":\"test_site\",\"type\":\"page_view\",\"page_url\":\"/p2\"}]}'
```

**النتيجة المتوقعة:**
```json
{"status": "ok", "message": "Batch processed", "success_count": 2, "fail_count": 0, "total": 2}
```

### 3.5 اختبار Rate Limiting

```powershell
# أرسل 121 طلب سريع
for ($i=1; $i -le 121; $i++) {
  curl -s -o $null -w "%{http_code}" -X POST http://localhost:8000/api/track `
    -H "Content-Type: application/json" `
    -d '{\"tracking_id\":\"test\",\"type\":\"page_view\",\"page_url\":\"/test\"}'
}
```

**النتيجة المتوقعة:** الطلب 121 يرجع Status 429 (Too Many Requests)

---

## 4. اختبارات Analytics API

### 4.1 الحصول على إحصائيات Real-Time

```powershell
curl http://localhost:8000/api/analytics/test_site/realtime
```

**النتيجة المتوقعة:**
```json
{"status": "ok", "data": {"active_users": 0, "page_views": 0, "events": 0}}
```

### 4.2 الحصول على Analytics للمستخدم

```powershell
curl http://localhost:8000/api/user/USER_ID/analytics `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**النتيجة المتوقعة:** Status 200 مع `events_count` و `last_events`

---

## 5. اختبارات Frontend

### 5.1 تشغيل Development Server

```powershell
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard
npm run dev
```

**النتيجة المتوقعة:** Server يعمل على http://localhost:5173

### 5.2 اختبار صفحة Login

1. افتح http://localhost:5173/login
2. أدخل بيانات مستخدم صحيحة
3. اضغط Login

**النتيجة المتوقعة:** Redirect إلى Dashboard

### 5.3 اختبار صفحة Register

1. افتح http://localhost:5173/register
2. أدخل بيانات مستخدم جديد
3. اضغط Register

**النتيجة المتوقعة:** Redirect إلى Login مع رسالة نجاح

### 5.4 اختبار Dashboard

1. سجل الدخول
2. تحقق من ظهور Statistics cards
3. تحقق من زر Auto-refresh
4. اضغط Refresh لتحديث البيانات يدوياً

**النتيجة المتوقعة:** البيانات تظهر وتتحدث

### 5.5 اختبار Build للـ Production

```powershell
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard
npm run build
```

**النتيجة المتوقعة:** Build ينجح بدون أخطاء في مجلد `dist`

---

## 6. اختبارات Tracker SDK

### 6.1 اختبار تحميل Tracker

1. أنشئ صفحة HTML بسيطة:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Test</h1>
  <button id="test-btn">Click Me</button>
  <script 
    src="path/to/tracker/index.js"
    data-endpoint="http://localhost:8000/api/track"
    data-tracking-id="test_site"
    data-debug="true">
  </script>
</body>
</html>
```

2. افتح الصفحة في المتصفح
3. افتح Developer Console

**النتيجة المتوقعة:** رسائل debug تظهر للـ page_load event

### 6.2 اختبار Click Tracking

1. من نفس الصفحة السابقة
2. اضغط على الزر

**النتيجة المتوقعة:** Click event يُرسل للـ API (يظهر في Console)

---

## 7. اختبارات WebSocket (Reverb)

### 7.1 تشغيل Reverb Server

```powershell
cd BackEnd
php artisan reverb:start --debug
```

**النتيجة المتوقعة:** Server يعمل على المنفذ 8080

### 7.2 اختبار الاتصال

استخدم WebSocket client (مثل wscat أو browser):

```javascript
const ws = new WebSocket('ws://localhost:8080/app/your-app-key');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', e.data);
```

**النتيجة المتوقعة:** الاتصال ينجح

---

## 8. اختبارات Integration كاملة

### 8.1 سيناريو كامل

1. **تشغيل جميع الخدمات:**
   ```powershell
   # Terminal 1: Backend
   cd BackEnd && php artisan serve
   
   # Terminal 2: WebSocket
   cd BackEnd && php artisan reverb:start
   
   # Terminal 3: Frontend
   cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard && npm run dev
   ```

2. **التسجيل والدخول:**
   - افتح http://localhost:5173/register
   - سجل مستخدم جديد
   - سجل الدخول

3. **إرسال أحداث تتبع:**
   ```powershell
   for ($i=1; $i -le 10; $i++) {
     curl -X POST http://localhost:8000/api/track `
       -H "Content-Type: application/json" `
       -d "{`"tracking_id`":`"test_site`",`"type`":`"page_view`",`"page_url`":`"/page$i`"}"
   }
   ```

4. **التحقق من Dashboard:**
   - افتح Dashboard
   - تأكد من ظهور الأحداث
   - فعّل Auto-refresh
   - أرسل أحداث جديدة وتأكد من تحديث البيانات

**النتيجة المتوقعة:** جميع الخطوات تعمل بشكل صحيح

---

## 9. اختبارات الأداء

### 9.1 اختبار حمل بسيط

```powershell
# أرسل 100 حدث بسرعة
$start = Get-Date
for ($i=1; $i -le 100; $i++) {
  curl -s -o $null -X POST http://localhost:8000/api/track `
    -H "Content-Type: application/json" `
    -d "{`"tracking_id`":`"perf_test`",`"type`":`"page_view`",`"page_url`":`"/test$i`"}"
}
$end = Get-Date
Write-Host "Time: $(($end - $start).TotalSeconds) seconds"
```

**النتيجة المتوقعة:** أقل من 30 ثانية لـ 100 طلب

---

## 10. قائمة فحص نهائية

- [ ] Backend يعمل على http://localhost:8000
- [ ] Frontend يعمل على http://localhost:5173
- [ ] MySQL متصل ويعمل
- [ ] ClickHouse متصل ويعمل (أو يفشل gracefully)
- [ ] التسجيل يعمل
- [ ] تسجيل الدخول يعمل
- [ ] JWT tokens تعمل
- [ ] Dashboard يعرض البيانات
- [ ] Auto-refresh يعمل
- [ ] Tracking API يستقبل الأحداث
- [ ] Rate limiting يعمل
- [ ] Batch tracking يعمل
- [ ] Error handling يعمل (الأخطاء مُسجلة وليس crashes)
- [ ] Build للـ Frontend ينجح

---

## أوامر مفيدة

```powershell
# تشغيل Backend
cd BackEnd && php artisan serve

# تشغيل Frontend
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard && npm run dev

# تشغيل WebSocket
cd BackEnd && php artisan reverb:start --debug

# تشغيل الاختبارات
cd BackEnd && php artisan test

# مسح Cache
cd BackEnd && php artisan cache:clear && php artisan config:clear && php artisan route:clear

# تحديث Autoload
cd BackEnd && composer dump-autoload -o

# عرض Routes
cd BackEnd && php artisan route:list

# عرض حالة Migrations
cd BackEnd && php artisan migrate:status
```

---

## ملاحظات

1. إذا واجهت مشكلة في ClickHouse، النظام سيعمل بدونه (graceful degradation)
2. تأكد من أن المنافذ 8000, 5173, 8080, 3306, 8123 غير مستخدمة
3. إذا كان هناك مشكلة في CORS، تحقق من إعدادات `config/cors.php`
