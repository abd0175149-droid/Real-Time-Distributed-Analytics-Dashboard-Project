# دليل تشغيل المشروع بعد الاستنساخ
## Real-Time Distributed Analytics Dashboard

---

## المتطلبات (البرامج المطلوبة)

| البرنامج | الإصدار | رابط التحميل | الوظيفة |
|----------|---------|--------------|---------|
| **Git** | أحدث إصدار | https://git-scm.com/downloads | استنساخ المشروع |
| **PHP** | 8.2 أو أحدث | https://www.php.net/downloads | تشغيل Backend (Laravel) |
| **Composer** | 2.x | https://getcomposer.org/download/ | إدارة تبعيات PHP |
| **Node.js** | 18 أو أحدث | https://nodejs.org/ | تشغيل Frontend (React) |
| **npm** | 9 أو أحدث | يأتي مع Node.js | إدارة تبعيات JavaScript |
| **Docker Desktop** | أحدث إصدار | https://www.docker.com/products/docker-desktop/ | تشغيل ClickHouse |
| **MySQL** | 8.0 أو أحدث | https://dev.mysql.com/downloads/ | قاعدة بيانات المستخدمين والأدوار |

### ملاحظات التثبيت

**Windows:**
- PHP: احصل على XAMPP أو WAMP أو Laragon أو ثبّت PHP يدوياً مع امتدادات: `pdo_mysql`, `mbstring`, `openssl`, `json`, `curl`, `fileinfo`, `zip`
- MySQL: يمكن استخدام XAMPP أو MySQL Installer أو MariaDB

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install php8.2 php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip
sudo apt install composer nodejs npm mysql-server
```

---

## المنافذ المستخدمة

| الخدمة | المنفذ | ملاحظة |
|--------|--------|--------|
| Laravel API | 8000 | التأكد أنه غير مستخدم |
| Laravel Reverb (WebSocket) | 8080 | للتحديثات الفورية |
| ClickHouse HTTP | 8123 | قاعدة التحليلات |
| ClickHouse Native | 9000 | داخلي |
| MySQL | 3306 | افتراضي |
| Frontend (Vite) | 5173 | واجهة لوحة التحكم |

---

## خطوات التشغيل بالتفصيل

### الخطوة 0: استنساخ المشروع

```powershell
# PowerShell (Windows) أو Terminal (Mac/Linux)
git clone https://github.com/abd0175149-droid/Real-Time-Distributed-Analytics-Dashboard-Project.git
cd Real-Time-Distributed-Analytics-Dashboard-Project
```

---

### الخطوة 1: تشغيل ClickHouse (Docker)

1. **شغّل Docker Desktop** وتأكد أنه يعمل.
2. نفّذ:

```powershell
cd database
docker-compose up -d
```

3. **إنشاء قاعدة البيانات والجداول** (Windows PowerShell):

```powershell
.\setup-clickhouse.ps1
```

**أو يدوياً (Linux/Mac):**

```bash
cd database
docker-compose up -d

# انتظر عدة ثوانٍ ثم:
docker exec -i clickhouse clickhouse-client --user default --password root --query "CREATE DATABASE IF NOT EXISTS analytics"

# تشغيل ملف الجداول
docker exec -i clickhouse clickhouse-client --user default --password root --database analytics --multiquery < init/create_tables.v3.sql
```

4. **التحقق:** افتح http://localhost:8123/ — يجب أن ترى `Ok.`

---

### الخطوة 2: إنشاء قاعدة MySQL

1. **شغّل MySQL** (XAMPP/Laragon أو كخدمة).
2. **أنشئ قاعدة بيانات:**

```sql
CREATE DATABASE analytics_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'analytics_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON analytics_db.* TO 'analytics_user'@'localhost';
FLUSH PRIVILEGES;
```

أو استخدم المستخدم `root` بدون كلمة مرور للتطوير المحلي.

---

### الخطوة 3: إعداد Backend (Laravel)

```powershell
cd BackEnd

# 1. تثبيت التبعيات
composer install

# 2. نسخ ملف البيئة
copy .env.example .env
# Linux/Mac: cp .env.example .env

# 3. توليد المفاتيح
php artisan key:generate
php artisan jwt:secret

# 4. تعديل ملف .env
# افتح .env وعدّل:
# DB_DATABASE=analytics_db
# DB_USERNAME=root (أو المستخدم الذي أنشأته)
# DB_PASSWORD= (كلمة مرور MySQL أو فارغ لـ root)
# CLICKHOUSE_HOST=127.0.0.1
# CLICKHOUSE_PORT=8123
# CLICKHOUSE_USERNAME=default
# CLICKHOUSE_PASSWORD=root
# CLICKHOUSE_DATABASE=analytics

# 5. تشغيل migrations (جداول MySQL)
php artisan migrate --force

# 6. إنشاء الأدوار والمستخدمين التجريبيين
php artisan db:seed --force

# 7. (اختياري) إدخال بيانات تجريبية في ClickHouse
php artisan clickhouse:seed-sample

# 8. التحقق من الإعداد
php artisan check:analytics-setup
```

---

### الخطوة 4: إعداد Frontend (React)

```powershell
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard

# 1. تثبيت التبعيات
npm install

# 2. نسخ ملف البيئة
copy .env.example .env
# Linux/Mac: cp .env.example .env

# 3. تأكد من إعدادات .env
# VITE_API_URL=http://localhost:8000/api
# VITE_WS_URL=ws://localhost:8080
# VITE_REVERB_APP_KEY=my-app-key
```

---

### الخطوة 5: تشغيل السيرفرات

تحتاج **3 نوافذ Terminal**:

#### Terminal 1: Laravel API

```powershell
cd BackEnd
php artisan serve
```

- **النتيجة:** `Server running on [http://127.0.0.1:8000]`
- **API:** http://localhost:8000/api

---

#### Terminal 2: Laravel Reverb (WebSocket)

```powershell
cd BackEnd
php artisan reverb:start
```

- **النتيجة:** `Reverb server started on 0.0.0.0:8080`
- **WebSocket:** ws://localhost:8080

---

#### Terminal 3: Frontend (Vite)

```powershell
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard
npm run dev
```

- **النتيجة:** `Local: http://localhost:5173/`
- **لوحة التحكم:** http://localhost:5173

---

## الدخول للنظام

| الحساب | البريد | كلمة المرور |
|--------|--------|-------------|
| Admin | admin@test.com | password123 |
| User | user@test.com | password123 |
| Analyst | analyst@test.com | password123 |

افتح: **http://localhost:5173** وسجّل الدخول بأحد الحسابات أعلاه.

---

## اختبار سريع (اختياري)

### اختبار صفحة Landing Page + Tracker

```powershell
# في نافذة رابعة، من جذر المشروع:
cd test-landing-page
npx serve .
# أو: python -m http.server 3000
```

ثم افتح http://localhost:3000 (أو المنفذ الذي ظهر) وتأكد أن التراكر يرسل الأحداث للـ API.

---

## أوامر مختصرة للتشغيل اليومي

بعد الإعداد الأول، للتشغيل اليومي:

```powershell
# 1. التأكد من تشغيل Docker و ClickHouse
cd database
docker-compose up -d

# 2. في 3 نوافذ منفصلة:
cd BackEnd && php artisan serve
cd BackEnd && php artisan reverb:start
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard && npm run dev
```

---

## حل المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| `composer install` فشل | تأكد من PHP 8.2+ وامتداد `pdo_mysql` |
| `php artisan migrate` فشل | تحقق من إعدادات MySQL في `.env` وتأكد أن القاعدة موجودة |
| ClickHouse لا يتصل | تأكد أن Docker يعمل و`docker-compose up -d` تم بنجاح |
| WebSocket لا يعمل | تأكد أن Reverb يعمل على المنفذ 8080 وأن `VITE_WS_URL` و`VITE_REVERB_APP_KEY` في frontend/.env تطابق Backend |
| CORS Error | تحقق من `config/cors.php` في Laravel وأن Frontend يعمل على المنفذ 5173 |

---

## روابط مفيدة

- **لوحة التحكم:** http://localhost:5173
- **API:** http://localhost:8000/api
- **ClickHouse:** http://localhost:8123
- **المستودع:** https://github.com/abd0175149-droid/Real-Time-Distributed-Analytics-Dashboard-Project
