# خطة رفع المشروع — دومين + Hostinger + GitHub

## ما عندك الآن
| العنصر | الحالة |
|--------|--------|
| دومين | ✅ جاهز |
| استضافة مشتركة (Hostinger) | ✅ جاهز |
| GitHub | ✅ جاهز |

---

## ما تحتاجه إضافي (مهم)

المشروع يعتمد على **ClickHouse** لقاعدة التحليلات، واستضافة Hostinger المشتركة **لا تدعم** ClickHouse. لذلك تحتاج أحد الخيارين:

| الخيار | الوصف | تكلفة تقريبية |
|--------|--------|----------------|
| **أ) ClickHouse Cloud** | خدمة سحابية جاهزة لـ ClickHouse | قد يكون هناك طبقة مجانية أو تجريبية |
| **ب) VPS صغير** | سيرفر افتراضي (مثلاً من Hostinger أو DigitalOcean) لتشغيل ClickHouse فقط | من ~5 دولار/شهر |

- **MySQL**: Hostinger توفر MySQL مع الاستضافة → تكفي لـ Laravel (المستخدمين، الجلسات، إلخ).
- **الدومين**: تربطه في لوحة Hostinger بالاستضافة (استضافة الملفات + Laravel).

---

## هيكل الرفع المقترح

```
┌─────────────────────────────────────────────────────────────────┐
│  دومينك (مثلاً: analytics.yourdomain.com)                        │
├─────────────────────────────────────────────────────────────────┤
│  Hostinger (استضافة مشتركة)                                      │
│  ├── Laravel API (BackEnd)    ← في مجلد الاستضافة (مثلاً public_html/api) │
│  ├── MySQL                    ← من لوحة Hostinger               │
│  └── الداشبورد (React مبنية)   ← مجلد ثابت أو subdomain         │
├─────────────────────────────────────────────────────────────────┤
│  خارج Hostinger (ضروري للتحليلات)                                 │
│  └── ClickHouse                ← ClickHouse Cloud أو VPS         │
└─────────────────────────────────────────────────────────────────┘
```

---

## آلية العمل خطوة بخطوة

### المرحلة 1: تجهيز GitHub

1. **إنشاء Repository جديد** على GitHub (مثلاً اسمه: `analytics-dashboard`).

2. **رفع الكود من جهازك:**
   ```bash
   cd "مجلد المشروع الرئيسي"
   git init
   git add .
   git commit -m "Initial: Backend, Frontend, Tracker, DB scripts"
   git branch -M main
   git remote add origin https://github.com/USERNAME/analytics-dashboard.git
   git push -u origin main
   ```

3. **ما يحدث لاحقاً:** أي تعديل تعمله محلياً → `git add` ثم `git commit` ثم `git push`، والكود يبقى محدثاً على GitHub. الرفع للاستضافة يكون إما يدوياً أو عبر أداة (انظر المرحلة 4).

---

### المرحلة 2: تجهيز ClickHouse (خارج Hostinger)

- إنشاء حساب على [ClickHouse Cloud](https://clickhouse.com/cloud) أو استئجار VPS وتثبيت ClickHouse عليه.
- إنشاء قاعدة بيانات وتشغيل ملف الجداول: `database/init/create_tables.v3.sql`.
- تسجيل:
  - عنوان الـ Host
  - المنفذ (عادة 8443 أو 8123)
  - اسم القاعدة
  - المستخدم وكلمة المرور

هذه القيم ستُستخدم في ملف `.env` في Laravel على Hostinger.

---

### المرحلة 3: تجهيز الاستضافة (Hostinger)

1. **ربط الدومين:** من لوحة Hostinger اربط دومينك (أو subdomain مثل `app.yourdomain.com`) بالمستضاف عليه.

2. **إنشاء قاعدة MySQL:**
   - من لوحة Hostinger: MySQL Databases → إنشاء قاعدة جديدة + مستخدم.
   - حفظ: اسم القاعدة، اسم المستخدم، كلمة المرور، Host (غالباً `localhost`).

3. **رفع ملفات Laravel:**
   - الطريقة البسيطة: من جهازك أو من GitHub (تحميل ZIP) ترفع محتويات مجلد **BackEnd** إلى الاستضافة.
   - المسار المقترح: أن يكون جذر الاستضافة للمشروع هو مجلد واحد (مثلاً `analytics`) وليس مباشرة داخل `public_html`، ثم جذر الموقع (Document Root) يُوجّه إلى `analytics/BackEnd/public` حتى يعمل Laravel بأمان.

   **مهم لـ Laravel على استضافة مشتركة:**
   - جذر الموقع (Document Root) = `public` فقط (مجلد BackEnd/public).
   - أو: نقل محتويات `public` إلى `public_html` ورفع باقي Laravel خارج `public_html` وتعديل `index.php` ليشير للمجلد الأعلى (الطريقة تعتمد على ما تسمح به Hostinger).

4. **ملف `.env` على السيرفر:**
   - انسخ `.env.example` إلى `.env`.
   - عدّل:
     - `APP_URL` = دومينك (مثلاً `https://analytics.yourdomain.com`)
     - إعدادات MySQL (DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST)
     - إعدادات ClickHouse (CLICKHOUSE_HOST, CLICKHOUSE_PORT, CLICKHOUSE_USERNAME, CLICKHOUSE_PASSWORD, CLICKHOUSE_DATABASE)
     - مفتاح التطبيق: `php artisan key:generate` إن أمكن، أو توليد مفتاح محلي ووضعه في `.env`.

5. **صلاحيات المجلدات:**  
   التأكد أن مجلدات `storage` و `bootstrap/cache` قابلة للكتابة (صلاحيات 755 أو حسب ما تنصح به Hostinger).

---

### المرحلة 4: بناء ورفع الداشبورد (React)

- الداشبورد مبني بـ React ويحتاج `npm run build`. الاستضافة المشتركة عادة لا تشغل Node، لذلك:

1. **على جهازك (أو أي جهاز فيه Node):**
   ```bash
   cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard
   npm install
   npm run build
   ```
   ينتج مجلد `build` (أو `dist` حسب إعداد المشروع).

2. **رفع الداشبورد:**
   - إما رفع محتويات مجلد `build` إلى مسار على نفس الدومين (مثلاً `/dashboard`) أو subdomain آخر.
   - أو ربط الدومين/المسار في Hostinger بمجلد يحتوي فقط على ملفات الـ build.

3. **ربط الداشبورد بالـ API:**  
   التأكد أن عنوان الـ API (في إعدادات React أو ملف env للفرونتند) يشير إلى دومينك الحقيقي، مثلاً:  
   `https://analytics.yourdomain.com/api`

---

### المرحلة 5: التراكر (سكربت التحليلات)

- الملف: `tracker/index.js` (أو النسخة المُجمّعة إن وُجدت).
- الخيارات:
  - رفعه على استضافتك ثم تضمينه من دومينك، أو
  - وضعه على CDN (مثلاً jsDelivr مرتبط بـ GitHub كما في المقطع الحالي).
- في كود التضمين الذي تعطيه للشركات، تضبط:
  - `data-endpoint` = عنوان استلام الأحداث، مثلاً:  
    `https://analytics.yourdomain.com/api/track`
  - `data-tracking-id` = يُعطى لكل عميل (يُولّى من لوحتك أو من حسابهم).

---

## ملخص ما تحتاجه بالترتيب

| # | المطلوب | الاستخدام |
|---|---------|-----------|
| 1 | دومين + Hostinger | استضافة Laravel + الداشبورد المبنية + MySQL |
| 2 | GitHub | حفظ الكود، نسخ احتياطي، وتحديث الرفع لاحقاً |
| 3 | ClickHouse (Cloud أو VPS) | قاعدة تحليلات المشروع (لا تعمل على الاستضافة المشتركة) |
| 4 | Node.js على جهازك | لبناء مشروع React مرة واحدة (أو استخدام GitHub Actions لاحقاً) |
| 5 | FTP/SFTP أو File Manager | رفع ملفات Laravel والـ build إلى Hostinger |
| 6 | (اختياري) GitHub Actions أو أداة Deploy | أتمتة البناء والرفع عند كل تحديث |

---

## رفع التحديثات لاحقاً (بدون أتمتة)

1. تعديل الكود محلياً.
2. `git add .` → `git commit -m "وصف"` → `git push`.
3. على السيرفر: إما سحب من GitHub (إن وُجد SSH و git) أو تحميل الملفات المعدّلة عبر FTP ورفعها مكان القديمة.
4. إن غيّرت شيء في Laravel: قد تحتاج مسح الكاش من لوحة Hostinger أو تشغيل أوامر مثل `php artisan config:cache` إن كان متاحاً.

---

## ملاحظات أمان

- لا ترفع ملف `.env` إلى GitHub (يجب أن يكون في `.gitignore`).
- على السيرفر استخدم دومينك الحقيقي في `APP_URL` و CORS إن كان الـ API يُستدعى من دومين الداشبورد أو من مواقع العملاء.
- احتفظ بنسخة من `.env` محلياً أو في مكان آمن؛ السيرفر يعتمد عليها فقط.

---

## الخلاصة

- **الدومين + Hostinger:** لاستضافة الـ API (Laravel) والداشبورد (React مبنية) وقاعدة MySQL.
- **GitHub:** لحفظ الكود والتحديثات وربطه لاحقاً بأي آلية رفع تختارها.
- **ClickHouse (خارج Hostinger):** ضروري للتحليلات؛ إما ClickHouse Cloud أو VPS.
- **الآلية:** رفع يدوي (أو لاحقاً أوتوماتيكي) بعد كل تحديث على GitHub.

إذا رغبت، يمكن تفصيل خطوة معينة (مثلاً إعداد الدومين في Hostinger، أو إعداد ClickHouse Cloud فقط) في ملف أو تعليمات إضافية.
