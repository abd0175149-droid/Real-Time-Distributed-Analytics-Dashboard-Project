# وثيقة مشروع التخرج
# لوحة تحكم التحليلات الموزعة في الوقت الفعلي
# (Real-Time Distributed Analytics Dashboard)

---

## صفحة العنوان

**اسم المشروع:** لوحة تحكم التحليلات الموزعة في الوقت الفعلي

**الطلاب:**
- [اسم الطالب الأول] – [الرقم الجامعي]
- [اسم الطالب الثاني] – [الرقم الجامعي]
- [اسم الطالب الثالث] – [الرقم الجامعي]

**المشرف:** د. خالد بطيحة

**تاريخ التقديم:** 2025/2026

---

## الإقرار (Declaration)

نحن الموقعون أدناه نقر بأن هذا المشروع هو عمل أصيل من إعدادنا، وأن جميع المصادر والمراجع المستخدمة قد تم توثيقها بشكل صحيح. كما نؤكد أن هذا العمل لم يُقدم مسبقاً لنيل أي درجة علمية أخرى.

| الاسم | التوقيع | التاريخ |
|-------|---------|---------|
| [اسم الطالب الأول] | __________ | ___/___/2026 |
| [اسم الطالب الثاني] | __________ | ___/___/2026 |
| [اسم الطالب الثالث] | __________ | ___/___/2026 |

---

# الفصل الأول: المقدمة

## 1.1 نظرة عامة على المشروع (Project Overview)

في ظل التحول الرقمي المتسارع، أصبحت البيانات هي العامل الأهم في نجاح المواقع الإلكترونية والتطبيقات. تحتاج المواقع الصغيرة والمتوسطة إلى فهم دقيق لسلوك زوارها لتحسين تجربة المستخدم وزيادة معدلات التحويل والمبيعات.

يهدف مشروع "لوحة تحكم التحليلات الموزعة" إلى توفير نظام متكامل لتتبع وتحليل سلوك المستخدمين على المواقع الإلكترونية في الوقت الفعلي. يتميز النظام بقدرته على:

- **جمع البيانات بشكل لحظي:** عبر سكريبت JavaScript خفيف يُضاف للموقع
- **تحليل السلوك:** تتبع النقرات، التمرير، النماذج، ومشاهدات الفيديو
- **عرض الإحصائيات:** لوحة تحكم تفاعلية تعرض البيانات في الوقت الفعلي
- **التجميعات الزمنية:** ملخصات دورية كل 5 دقائق، ساعة، ويوم

يدعم النظام تحليل سلوك المستخدم بشكل شامل، مما يمكّن أصحاب المواقع من اتخاذ قرارات مدروسة مبنية على بيانات حقيقية.

## 1.2 بيان المشكلة (Problem Statement)

يواجه أصحاب المواقع الصغيرة والمتوسطة عدة تحديات رئيسية:

### 1.2.1 غياب الرؤى الواضحة
- عدم معرفة الصفحات والمنتجات الأكثر زيارة
- صعوبة تحديد نقاط الضعف في تجربة المستخدم
- عدم فهم مسار المستخدم (User Journey) داخل الموقع

### 1.2.2 محدودية البيانات الجغرافية والديموغرافية
- عدم معرفة التوزيع الجغرافي للزوار
- غياب المعلومات عن الأجهزة والمتصفحات المستخدمة
- صعوبة استهداف الجمهور المناسب

### 1.2.3 ضعف الرؤية اللحظية
- التأخر في الحصول على البيانات
- عدم القدرة على رصد المشاكل فور حدوثها
- غياب التحديثات الفورية للإحصائيات

### 1.2.4 تعقيد الأدوات الحالية
- Google Analytics معقد ويتطلب خبرة
- الأدوات المجانية محدودة الميزات
- التكلفة العالية للحلول الاحترافية

## 1.3 الأهداف (Objectives)

### 1.3.1 الأهداف الرئيسية

1. **جمع بيانات لحظية وشبه لحظية:**
   - تتبع أحداث المستخدم (Page Views, Clicks, Scrolls)
   - إرسال البيانات كل 7 ثوانٍ (قابل للتعديل)
   - دعم الإرسال الدفعي (Batch) للتحسين

2. **تحسين تجربة المستخدم:**
   - واجهة سهلة الاستخدام
   - تحديثات فورية عبر WebSocket
   - رسوم بيانية تفاعلية

3. **دعم اتخاذ القرار المبني على البيانات:**
   - تقارير مفصلة عن سلوك الزوار
   - تحليلات جغرافية وديموغرافية
   - قياس أداء الصفحات والمنتجات

4. **تجميعات زمنية متعددة:**
   - تحديث فوري (Real-time)
   - ملخصات كل 5 دقائق
   - ملخصات ساعية
   - ملخصات يومية

### 1.3.2 الأهداف التقنية

1. بناء نظام قابل للتوسع (Scalable)
2. ضمان أداء عالي مع كميات بيانات كبيرة
3. توفير API موحد وموثق
4. تطبيق معايير الأمان والخصوصية

---

# الفصل الثاني: الأعمال ذات الصلة (Related Work)

## 2.1 مقارنة الأدوات الحالية

### 2.1.1 Google Analytics

| الجانب | الوصف |
|--------|-------|
| **المميزات** | - أداة مجانية وشاملة<br>- تقارير متقدمة<br>- تكامل مع منتجات Google |
| **العيوب** | - منحنى تعلم حاد<br>- واجهة معقدة<br>- تأخر في البيانات (24-48 ساعة)<br>- مخاوف الخصوصية<br>- محدودية التخصيص |
| **التكلفة** | مجاني (النسخة المدفوعة باهظة) |

### 2.1.2 Umami

| الجانب | الوصف |
|--------|-------|
| **المميزات** | - مفتوح المصدر<br>- يحترم الخصوصية<br>- سهل الاستخدام<br>- Self-hosted |
| **العيوب** | - ميزات محدودة<br>- لا يدعم تتبع E-commerce المتقدم<br>- بدون تجميعات زمنية دقيقة<br>- لا يدعم Real-time الحقيقي |
| **التكلفة** | مجاني (Self-hosted) |

### 2.1.3 Matomo

| الجانب | الوصف |
|--------|-------|
| **المميزات** | - مفتوح المصدر<br>- ميزات متقدمة<br>- يحترم GDPR<br>- تخصيص عالي |
| **العيوب** | - يتطلب موارد سيرفر عالية<br>- إعداد معقد<br>- الأداء يتراجع مع البيانات الكبيرة<br>- Real-time محدود |
| **التكلفة** | مجاني (Self-hosted) / مدفوع (Cloud) |

## 2.2 جدول المقارنة الشامل

| الميزة | Google Analytics | Umami | Matomo | **نظامنا** |
|--------|------------------|-------|--------|------------|
| Real-time الحقيقي | ❌ (تأخر) | ❌ | محدود | ✅ (WebSocket) |
| تجميعات 5 دقائق | ❌ | ❌ | ❌ | ✅ |
| تتبع E-commerce | ✅ | محدود | ✅ | ✅ |
| Self-hosted | ❌ | ✅ | ✅ | ✅ |
| سهولة الاستخدام | ❌ | ✅ | متوسط | ✅ |
| خصوصية البيانات | ❌ | ✅ | ✅ | ✅ |
| قاعدة بيانات زمنية | ❌ | ❌ | ❌ | ✅ (ClickHouse) |

## 2.3 محدودية الأدوات الحالية (Limitations)

### 2.3.1 تأخر البيانات
معظم الأدوات لا توفر بيانات لحظية حقيقية. Google Analytics يتأخر 24-48 ساعة، مما يمنع اكتشاف المشاكل فور حدوثها.

### 2.3.2 غياب التجميعات الدقيقة
لا توفر الأدوات الحالية ملخصات دورية دقيقة (5 دقائق، ساعة) بشكل مدمج، مما يصعّب تتبع التغييرات قصيرة المدى.

### 2.3.3 ضعف الأداء مع البيانات الكبيرة
تعتمد معظم الأدوات على قواعد بيانات تقليدية (MySQL, PostgreSQL) غير مُحسّنة للاستعلامات التحليلية على بيانات ضخمة.

### 2.3.4 محدودية التخصيص
صعوبة تخصيص لوحة التحكم حسب احتياجات العمل المحددة.

## 2.4 دوافع النظام المقترح

بناءً على المحدوديات السابقة، تم تصميم نظامنا ليوفر:

1. **بيانات لحظية حقيقية:** عبر WebSocket (Laravel Reverb) لتحديث الواجهة فوراً
2. **تجميعات زمنية دقيقة:** 5 دقائق، ساعة، يوم عبر Materialized Views في ClickHouse
3. **أداء عالي:** استخدام ClickHouse المُحسّن للبيانات الزمنية والاستعلامات التحليلية
4. **سهولة الاستخدام:** واجهة React حديثة وبديهية
5. **خصوصية:** Self-hosted مع تحكم كامل في البيانات

---

# الفصل الثالث: تصميم النظام (System Design)

## 3.1 هندسية النظام (Architecture)

### 3.1.1 نظرة عامة على البنية

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────┐                        ┌─────────────────────────┐     │
│   │  Website +      │                        │   React Dashboard       │     │
│   │  Tracker.js     │                        │   (Frontend)            │     │
│   │                 │                        │                         │     │
│   └────────┬────────┘                        └───────────┬─────────────┘     │
│            │                                             │                    │
│            │ HTTP POST                                   │ HTTP + WebSocket   │
│            │ /api/track                                  │                    │
└────────────┼─────────────────────────────────────────────┼────────────────────┘
             │                                             │
             ▼                                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API Layer (Laravel 12)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Laravel Backend                                   │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│   │  │ Auth         │  │ Analytics    │  │ WebSocket Server         │  │   │
│   │  │ Controller   │  │ Controller   │  │ (Laravel Reverb)         │  │   │
│   │  │              │  │              │  │                          │  │   │
│   │  │ - Register   │  │ - track()    │  │ - Real-time broadcasts   │  │   │
│   │  │ - Login      │  │ - trackBatch │  │ - analytics.new events   │  │   │
│   │  │ - JWT Auth   │  │ - realtime   │  │ - Port 8080              │  │   │
│   │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│   │                                                                     │   │
│   │  ┌──────────────────────────────────────────────────────────────┐  │   │
│   │  │            ClickHouse Service Layer                          │  │   │
│   │  │  - insertEvent()      - insertSession()                      │  │   │
│   │  │  - insertFormEvent()  - insertInteractionEvent()             │  │   │
│   │  │  - getRealTimeStats() - testConnection()                     │  │   │
│   │  └──────────────────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└──────────────────────────────┬────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Database Layer                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────────────┐        ┌─────────────────────────────────┐    │
│   │       MySQL 8.0         │        │         ClickHouse               │    │
│   │                         │        │    (Time-Series Database)        │    │
│   │  - users                │        │                                  │    │
│   │  - roles                │        │  Base Tables:                    │    │
│   │  - sessions             │        │  - sessions, page_events         │    │
│   │  - password_resets      │        │  - form_events, interaction_...  │    │
│   │  - refresh_tokens       │        │  - ecommerce_events, video_...   │    │
│   │                         │        │                                  │    │
│   │  (Authentication &      │        │  Aggregation Tables:             │    │
│   │   User Management)      │        │  - traffic_metrics               │    │
│   │                         │        │  - page_metrics, device_metrics  │    │
│   └─────────────────────────┘        │  - geo_metrics, source_metrics   │    │
│                                      │                                  │    │
│                                      │  22 Materialized Views           │    │
│                                      │  (Auto-aggregation)              │    │
│                                      └─────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1.2 شرح المكونات

#### Frontend Layer (طبقة الواجهة)

| المكون | التقنية | الوظيفة |
|--------|---------|---------|
| Dashboard | React 18 + TypeScript | عرض الإحصائيات والتقارير |
| Tracker | JavaScript SDK | جمع بيانات المستخدمين |
| State Management | Zustand | إدارة حالة التطبيق |
| Charts | Recharts | الرسوم البيانية التفاعلية |
| Real-time | Laravel Echo + Pusher JS | استقبال التحديثات الفورية |

#### API Layer (طبقة الواجهة البرمجية)

| المكون | التقنية | الوظيفة |
|--------|---------|---------|
| Backend | Laravel 12 + PHP 8.2 | معالجة الطلبات والمنطق |
| Authentication | JWT (tymon/jwt-auth) | المصادقة والتحقق |
| WebSocket | Laravel Reverb | البث الفوري للأحداث |
| Rate Limiting | Laravel Throttle | حماية من الطلبات الزائدة |

#### Database Layer (طبقة البيانات)

| قاعدة البيانات | الاستخدام | السبب |
|----------------|-----------|-------|
| MySQL 8.0 | المستخدمين والأدوار | موثوقة للبيانات العلائقية |
| ClickHouse | الأحداث والتحليلات | مُحسّنة للبيانات الزمنية |

## 3.2 تصميم قاعدة البيانات (Database Design)

### 3.2.1 MySQL Schema (المستخدمين)

#### جدول users
```sql
CREATE TABLE users (
    id              CHAR(36) PRIMARY KEY,      -- UUID
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255) NULL,
    email_verified_at TIMESTAMP NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    website_type    VARCHAR(50) NULL,
    tracking_id     VARCHAR(100) NULL,
    is_onboarded    BOOLEAN DEFAULT FALSE,
    website_url     VARCHAR(255) NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

**الغرض:** تخزين بيانات المستخدمين المسجلين، معلومات الحساب، وإعدادات التتبع.

#### جدول roles
```sql
CREATE TABLE roles (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- الأدوار الافتراضية
INSERT INTO roles (name, description) VALUES
    ('admin', 'مدير النظام - صلاحيات كاملة'),
    ('user', 'مستخدم عادي'),
    ('analyst', 'محلل بيانات');
```

**الغرض:** تعريف الأدوار وصلاحيات الوصول.

### 3.2.2 ClickHouse Schema (التحليلات)

#### جداول الأحداث الأساسية (Base Tables)

##### sessions - الجلسات
```sql
CREATE TABLE sessions (
    session_id       String,
    user_id          String,
    tracking_id      String,
    start_time       DateTime,
    end_time         Nullable(DateTime),
    device_type      LowCardinality(String) DEFAULT 'Unknown',
    operating_system LowCardinality(String) DEFAULT 'Unknown',
    browser          LowCardinality(String) DEFAULT 'Unknown',
    screen_width     UInt16 DEFAULT 0,
    screen_height    UInt16 DEFAULT 0,
    viewport_width   UInt16 DEFAULT 0,
    viewport_height  UInt16 DEFAULT 0,
    country          LowCardinality(Nullable(String)),
    country_code     LowCardinality(Nullable(String)),
    language         LowCardinality(String) DEFAULT 'en',
    timezone         String DEFAULT 'UTC',
    referrer         String DEFAULT '',
    entry_page       String DEFAULT '',
    exit_page        Nullable(String),
    duration_ms      Nullable(UInt32),
    bounce           UInt8 DEFAULT 0,
    page_views       UInt16 DEFAULT 0,
    created_at       DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(start_time)
ORDER BY (tracking_id, session_id, start_time);
```

**الغرض:** تخزين معلومات كل جلسة: الجهاز، الموقع الجغرافي، مدة الزيارة، عدد الصفحات.

##### page_events - أحداث الصفحات
```sql
CREATE TABLE page_events (
    timestamp        DateTime,
    session_id       String,
    user_id          String,
    tracking_id      String,
    event_type       String,  -- page_load, page_view, page_unload
    page_url         String,
    page_title       String DEFAULT '',
    referrer         String DEFAULT '',
    duration_ms      Nullable(UInt32),
    scroll_depth_max Nullable(Float32),
    click_count      Nullable(UInt16),
    -- Performance metrics
    dns_time         Nullable(UInt16),
    connect_time     Nullable(UInt16),
    response_time    Nullable(UInt16),
    dom_load_time    Nullable(UInt16),
    page_load_time   Nullable(UInt16),
    -- Network info
    connection_type     LowCardinality(Nullable(String)),
    connection_downlink Nullable(Float32),
    connection_rtt      Nullable(UInt16)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (tracking_id, session_id, timestamp);
```

**الغرض:** تتبع تحميل الصفحات، مدة البقاء، عمق التمرير، وبيانات الأداء.

##### interaction_events - أحداث التفاعل
```sql
CREATE TABLE interaction_events (
    timestamp     DateTime,
    session_id    String,
    user_id       String,
    tracking_id   String,
    event_type    String,  -- click, scroll, link_click, video_*
    page_url      String,
    x             Nullable(UInt16),
    y             Nullable(UInt16),
    element       String DEFAULT '',
    element_id    Nullable(String),
    element_class Nullable(String),
    button_text   Nullable(String),
    link_url      Nullable(String),
    link_text     Nullable(String),
    is_external   Nullable(UInt8)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (tracking_id, session_id, timestamp);
```

**الغرض:** تتبع النقرات، التمرير، الروابط، والتفاعلات المختلفة.

##### form_events - أحداث النماذج
```sql
CREATE TABLE form_events (
    timestamp       DateTime,
    session_id      String,
    user_id         String,
    tracking_id     String,
    page_url        String,
    event_type      String,  -- form_focus, form_input, form_submit
    form_id         String,
    form_name       String DEFAULT 'default_form',
    form_action     Nullable(String),
    form_method     Nullable(String),
    field_name      Nullable(String),
    field_type      Nullable(String),
    field_count     Nullable(UInt8),
    value_length    Nullable(UInt16),
    has_file_upload Nullable(UInt8),
    success         Nullable(UInt8)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (tracking_id, session_id, timestamp);
```

**الغرض:** تتبع تفاعل المستخدمين مع النماذج ومعدلات الإكمال.

##### ecommerce_events - أحداث التجارة الإلكترونية
```sql
CREATE TABLE ecommerce_events (
    timestamp    DateTime,
    session_id   String,
    user_id      String,
    tracking_id  String,
    page_url     String,
    event_type   String,  -- product_view, cart_add, cart_remove, purchase
    product_id   Nullable(String),
    product_name Nullable(String),
    price        Nullable(Float64),
    quantity     Nullable(UInt16),
    category     LowCardinality(Nullable(String)),
    currency     LowCardinality(Nullable(String)) DEFAULT 'USD',
    order_id     Nullable(String),
    total        Nullable(Float64),
    step         Nullable(UInt8),
    step_name    Nullable(String)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (tracking_id, session_id, timestamp);
```

**الغرض:** تتبع مسار الشراء: عرض المنتج، الإضافة للسلة، إتمام الشراء.

#### جداول التجميعات (Aggregation Tables)

##### traffic_metrics - مقاييس المرور
```sql
CREATE TABLE traffic_metrics (
    timestamp               DateTime,
    interval_type           String,  -- '5m', '1h', '1d'
    tracking_id             String,
    unique_users            UInt32,
    new_users               UInt32,
    returning_users         UInt32,
    total_sessions          UInt32,
    bounce_sessions         UInt32,
    bounce_rate             Float32,
    total_pageviews         UInt32,
    unique_pageviews        UInt32,
    avg_pages_per_session   Float32,
    avg_session_duration_sec Float32,
    total_time_on_site_sec  UInt64,
    created_at              DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY (interval_type, toYYYYMM(timestamp))
ORDER BY (tracking_id, interval_type, timestamp);
```

**الغرض:** تخزين ملخصات المرور لفترات زمنية مختلفة (5 دقائق، ساعة، يوم).

##### page_metrics - مقاييس الصفحات
```sql
CREATE TABLE page_metrics (
    timestamp           DateTime,
    interval_type       String,
    tracking_id         String,
    page_url            String,
    pageviews           UInt32,
    unique_visitors     UInt32,
    avg_time_on_page_sec Nullable(Float32),
    avg_scroll_depth    Nullable(Float32),
    total_clicks        UInt32,
    avg_load_time_ms    Nullable(Float32),
    p50_load_time_ms    Nullable(Float32),
    p95_load_time_ms    Nullable(Float32),
    entries             UInt32,
    exits               UInt32,
    bounces             UInt32,
    created_at          DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY (interval_type, toYYYYMM(timestamp))
ORDER BY (tracking_id, interval_type, timestamp, page_url);
```

**الغرض:** تحليل أداء كل صفحة: عدد الزيارات، وقت البقاء، سرعة التحميل.

##### device_metrics - مقاييس الأجهزة
```sql
CREATE TABLE device_metrics (
    timestamp               DateTime,
    interval_type           String,
    tracking_id             String,
    device_type             LowCardinality(String),
    operating_system        LowCardinality(String),
    browser                 LowCardinality(String),
    sessions                UInt32,
    unique_users            UInt32,
    pageviews               UInt32,
    avg_session_duration_sec Float32,
    bounce_rate             Float32,
    created_at              DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY (interval_type, toYYYYMM(timestamp))
ORDER BY (tracking_id, interval_type, timestamp, device_type);
```

**الغرض:** توزيع الزوار حسب نوع الجهاز، نظام التشغيل، والمتصفح.

##### geo_metrics - المقاييس الجغرافية
```sql
CREATE TABLE geo_metrics (
    timestamp               DateTime,
    interval_type           String,
    tracking_id             String,
    country                 LowCardinality(String),
    country_code            LowCardinality(String),
    sessions                UInt32,
    unique_users            UInt32,
    pageviews               UInt32,
    avg_session_duration_sec Float32,
    bounce_rate             Float32,
    created_at              DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY (interval_type, toYYYYMM(timestamp))
ORDER BY (tracking_id, interval_type, timestamp, country_code);
```

**الغرض:** التوزيع الجغرافي للزوار حسب الدولة.

#### Materialized Views (22 عرض)

تُحدّث هذه العروض تلقائياً عند إدخال بيانات جديدة:

| العرض | الجدول المصدر | جدول الوجهة | الفترة |
|-------|---------------|-------------|--------|
| mv_traffic_5m | sessions | traffic_metrics | 5 دقائق |
| mv_traffic_1h | sessions | traffic_metrics | ساعة |
| mv_traffic_1d | sessions | traffic_metrics | يوم |
| mv_page_1h | page_events | page_metrics | ساعة |
| mv_page_1d | page_events | page_metrics | يوم |
| mv_device_1h | sessions | device_metrics | ساعة |
| mv_device_1d | sessions | device_metrics | يوم |
| mv_geo_1h | sessions | geo_metrics | ساعة |
| mv_geo_1d | sessions | geo_metrics | يوم |
| mv_source_1h | sessions | source_metrics | ساعة |
| mv_source_1d | sessions | source_metrics | يوم |
| mv_interaction | interaction_events | interaction_metrics | ساعة |
| mv_interaction_1d | interaction_events | interaction_metrics | يوم |
| mv_form | form_events | form_metrics | ساعة |
| mv_form_1d | form_events | form_metrics | يوم |
| mv_ecommerce | ecommerce_events | ecommerce_metrics | ساعة |
| mv_ecommerce_1d | ecommerce_events | ecommerce_metrics | يوم |
| mv_product | ecommerce_events | product_metrics | يوم |
| mv_video | video_events | video_metrics | يوم |
| mv_session_pages | page_events | session_pages | يوم |
| mv_conversion_funnel | page_events | conversion_funnel | يوم |
| mv_user_first_session | sessions | user_first_session | - |

## 3.3 تدفق البيانات (Data Flow)

### 3.3.1 مسار جمع البيانات

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        تدفق جمع وتخزين البيانات                           │
└──────────────────────────────────────────────────────────────────────────┘

1. تحميل الصفحة
   │
   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser (Website + Tracker.js)                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • جمع معلومات الجهاز (Device, OS, Browser)                     │   │
│  │ • جمع معلومات الشاشة (Resolution, Viewport)                    │   │
│  │ • الحصول على الموقع الجغرافي (via ipapi.co)                    │   │
│  │ • قياس أداء التحميل (Performance Timing API)                   │   │
│  │ • إنشاء Session ID + User ID                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTP POST /api/track
                                 │ type: "page_load"
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Laravel API (AnalyticsController)                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 1. Validation: tracking_id required                             │   │
│  │ 2. Route to handler: handlePageLoad()                           │   │
│  │ 3. Insert into ClickHouse:                                      │   │
│  │    - sessions table (device, geo, referrer)                     │   │
│  │    - page_events table (performance data)                       │   │
│  │ 4. Broadcast via WebSocket: AnalyticsEvent                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
┌───────────────────────────────┐  ┌──────────────────────────────────────┐
│  ClickHouse                   │  │  WebSocket (Laravel Reverb)          │
│  ┌───────────────────────┐    │  │  ┌──────────────────────────────┐   │
│  │ Insert into tables    │    │  │  │ Broadcast to:                │   │
│  │ + Materialized Views  │    │  │  │ - analytics-channel          │   │
│  │   auto-aggregate      │    │  │  │ - analytics.{tracking_id}    │   │
│  └───────────────────────┘    │  │  └──────────────────────────────┘   │
└───────────────────────────────┘  └──────────────────────────────────────┘
                                                     │
                                                     │ WebSocket Event
                                                     ▼
                                   ┌──────────────────────────────────────┐
                                   │  React Dashboard                     │
                                   │  ┌──────────────────────────────┐   │
                                   │  │ • Update charts in real-time │   │
                                   │  │ • No page refresh needed     │   │
                                   │  └──────────────────────────────┘   │
                                   └──────────────────────────────────────┘
```

### 3.3.2 مسار عرض البيانات

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        تدفق عرض البيانات في Dashboard                    │
└──────────────────────────────────────────────────────────────────────────┘

1. فتح لوحة التحكم
   │
   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  React Dashboard                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 1. Authenticate user (JWT Token)                                │   │
│  │ 2. Fetch initial data from API                                  │   │
│  │ 3. Subscribe to WebSocket channels                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
              ▼ HTTP GET                            ▼ WebSocket
┌──────────────────────────────────┐  ┌─────────────────────────────────┐
│  Laravel API                     │  │  Laravel Reverb                 │
│  ┌────────────────────────────┐  │  │  ┌───────────────────────────┐ │
│  │ Query ClickHouse:          │  │  │  │ Real-time events:         │ │
│  │ - traffic_metrics          │  │  │  │ - New page views          │ │
│  │ - page_metrics             │  │  │  │ - New sessions            │ │
│  │ - device_metrics           │  │  │  │ - Interactions            │ │
│  │ - geo_metrics              │  │  │  └───────────────────────────┘ │
│  └────────────────────────────┘  │  └─────────────────────────────────┘
└────────────────────────────────┬─┘
                                 │
                                 ▼
                  ┌──────────────────────────────────┐
                  │  ClickHouse                      │
                  │  ┌────────────────────────────┐  │
                  │  │ Fast columnar queries:     │  │
                  │  │ - GROUP BY time intervals  │  │
                  │  │ - COUNT, SUM, AVG          │  │
                  │  │ - Percentiles (p50, p95)   │  │
                  │  └────────────────────────────┘  │
                  └──────────────────────────────────┘
```

## 3.4 تصميم API

### 3.4.1 نقاط النهاية (Endpoints)

#### المصادقة (Authentication)

| Method | Endpoint | الوصف | الطلب | الاستجابة |
|--------|----------|-------|-------|-----------|
| POST | `/api/register` | تسجيل مستخدم جديد | `{name, email, password, password_confirmation}` | `{message, user}` |
| POST | `/api/login` | تسجيل الدخول | `{email, password}` | `{access_token, token_type, expires_in, user}` |
| POST | `/api/logout` | تسجيل الخروج | - | `{message}` |
| POST | `/api/refresh` | تحديث Token | - | `{access_token}` |
| GET | `/api/me` | بيانات المستخدم الحالي | - | `{id, name, email, roles}` |

#### التتبع (Tracking)

| Method | Endpoint | الوصف | Rate Limit |
|--------|----------|-------|------------|
| POST | `/api/track` | إرسال حدث واحد | 120/دقيقة |
| POST | `/api/track/batch` | إرسال أحداث متعددة | 30/دقيقة |
| GET | `/api/analytics/{trackingId}/realtime` | إحصائيات لحظية | - |
| GET | `/api/analytics/test-connection` | اختبار اتصال ClickHouse | - |

### 3.4.2 أنواع الأحداث المدعومة

```json
{
  "events": {
    "page_events": ["page_load", "page_view", "page_unload"],
    "interaction_events": ["click", "mouse_click", "scroll", "scroll_depth", "link_click"],
    "form_events": ["form_focus", "form_input", "form_submit"],
    "video_events": ["video_play", "video_pause", "video_complete", "progress_25", "progress_50", "progress_75"],
    "ecommerce_events": ["product_view", "cart_add", "cart_remove", "checkout_step", "purchase"],
    "custom_events": ["custom"]
  }
}
```

### 3.4.3 مثال على طلب تتبع

**Request:**
```http
POST /api/track HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "tracking_id": "site_abc123",
  "type": "page_load",
  "session_id": "sess_xyz789",
  "user_id": "user_123",
  "data": {
    "url": "https://example.com/products",
    "title": "Products Page",
    "referrer": "https://google.com",
    "device_type": "Desktop",
    "operating_system": "Windows",
    "browser": "Chrome/120.0.0.0",
    "screen_resolution": {"width": 1920, "height": 1080},
    "viewport": {"width": 1200, "height": 800},
    "location": {
      "country": "Saudi Arabia",
      "country_code": "SA"
    },
    "performance": {
      "dns_time": 10,
      "connect_time": 50,
      "response_time": 100,
      "dom_load_time": 500,
      "page_load_time": 1200
    }
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Event stored successfully",
  "event_type": "page_load"
}
```

---

# الفصل الرابع: التنفيذ والاختبار (Implementation & Testing)

## 4.1 التقنيات المستخدمة

### 4.1.1 Backend Stack

| التقنية | الإصدار | المبرر |
|---------|---------|--------|
| **PHP** | 8.2+ | أحدث ميزات اللغة (Enums, Named Arguments, Match) |
| **Laravel** | 12.0 | إطار عمل ناضج، أدوات مدمجة، مجتمع كبير |
| **Laravel Reverb** | 1.x | WebSocket server مدمج مع Laravel |
| **JWT Auth** | 2.x | مصادقة stateless قابلة للتوسع |
| **phpclickhouse** | 1.x | عميل PHP لـ ClickHouse |

**لماذا Laravel؟**
- نظام routing متقدم
- Eloquent ORM للتعامل مع MySQL
- نظام Events/Broadcasting مدمج
- Middleware للمصادقة وRate Limiting
- Artisan CLI للأوامر المخصصة

### 4.1.2 Frontend Stack

| التقنية | الإصدار | المبرر |
|---------|---------|--------|
| **React** | 18.3 | مكتبة UI الأشهر، Virtual DOM، Hooks |
| **TypeScript** | 5.5 | Type safety، أخطاء أقل، IntelliSense |
| **Vite** | 5.4 | سريع جداً، HMR فوري |
| **Tailwind CSS** | 3.4 | Utility-first، تخصيص سهل |
| **Recharts** | 2.12 | رسوم بيانية React-native |
| **Zustand** | 4.5 | State management خفيف وبسيط |
| **Laravel Echo** | 1.x | عميل WebSocket لـ Laravel |

**لماذا React + TypeScript؟**
- Component-based architecture
- قابلية إعادة الاستخدام
- Type safety يقلل الأخطاء
- بيئة تطوير غنية بالأدوات

### 4.1.3 Database Stack

| قاعدة البيانات | الاستخدام | المبرر |
|----------------|-----------|--------|
| **MySQL 8.0** | المستخدمين | ACID، موثوقية عالية، Eloquent support |
| **ClickHouse** | التحليلات | مُحسّن للبيانات الزمنية، سريع جداً في التجميعات |

**لماذا ClickHouse؟**
- **تخزين عمودي (Columnar):** مثالي للتجميعات
- **ضغط عالي:** يقلل حجم البيانات 10x
- **Materialized Views:** تجميعات تلقائية
- **أداء:** ملايين الصفوف في ثوانٍ

### 4.1.4 Infrastructure

| المكون | التقنية | المبرر |
|--------|---------|--------|
| **Containerization** | Docker | عزل الخدمات، سهولة النشر |
| **WebSocket Server** | Laravel Reverb | مدمج مع Laravel، سهل الإعداد |
| **Load Balancer** | Nginx | موثوق، أداء عالي |

## 4.2 هيكل الكود (Code Structure)

### 4.2.1 Backend Structure

```
BackEnd/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       ├── CheckAnalyticsSetup.php    # أمر التشخيص
│   │       └── SeedClickHouseSample.php   # بيانات تجريبية
│   │
│   ├── DTOs/
│   │   └── AnalyticsEventDTO.php          # Data Transfer Objects
│   │
│   ├── Events/
│   │   ├── AnalyticsEvent.php             # حدث WebSocket
│   │   └── UserLoggedIn.php               # حدث تسجيل الدخول
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php         # المصادقة
│   │   │   ├── AnalyticsController.php    # التتبع
│   │   │   ├── UserAnalyticsController.php
│   │   │   ├── OnboardingController.php   # إعداد المستخدم
│   │   │   └── PasswordResetController.php
│   │   │
│   │   └── Middleware/
│   │       ├── JWTAuth.php                # التحقق من JWT
│   │       └── RoleMiddleware.php         # التحقق من الأدوار
│   │
│   ├── Models/
│   │   ├── User.php                       # نموذج المستخدم
│   │   └── Role.php                       # نموذج الدور
│   │
│   ├── Providers/
│   │   └── AppServiceProvider.php
│   │
│   └── Services/
│       └── ClickHouse/
│           └── ClickHouseTestService.php  # خدمة ClickHouse
│
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── broadcasting.php                   # إعدادات WebSocket
│   ├── database.php
│   ├── jwt.php                            # إعدادات JWT
│   └── reverb.php                         # إعدادات Reverb
│
├── database/
│   └── migrations/
│       ├── create_users_table.php
│       ├── create_roles_table.php
│       └── ...
│
├── routes/
│   ├── api.php                            # API routes
│   ├── channels.php                       # WebSocket channels
│   └── web.php
│
└── composer.json
```

### 4.2.2 Frontend Structure

```
frontend/react-analytics-dashboard-updated/react-analytics-dashboard/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── BarChart.tsx              # رسم بياني شريطي
│   │   │   ├── LineChart.tsx             # رسم بياني خطي
│   │   │   ├── PieChart.tsx              # رسم دائري
│   │   │   └── FunnelChart.tsx           # رسم القمع
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardCustomizer.tsx   # تخصيص اللوحة
│   │   │   ├── DraggableWidget.tsx       # عناصر قابلة للسحب
│   │   │   └── WidgetLibrary.tsx         # مكتبة العناصر
│   │   │
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx       # هيكل اللوحة
│   │   │   ├── Header.tsx                # الرأس
│   │   │   ├── Sidebar.tsx               # القائمة الجانبية
│   │   │   └── MobileNavigation.tsx      # التنقل للموبايل
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── KPICard.tsx               # بطاقة المؤشرات
│   │   │   └── Select.tsx
│   │   │
│   │   └── ProtectedRoute.tsx            # حماية المسارات
│   │
│   ├── hooks/
│   │   ├── index.ts
│   │   └── useAnalyticsData.ts           # جلب بيانات التحليلات
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── Overview.tsx              # نظرة عامة
│   │   │   ├── Traffic.tsx               # المرور
│   │   │   ├── Pages.tsx                 # الصفحات
│   │   │   ├── Devices.tsx               # الأجهزة
│   │   │   ├── Geography.tsx             # الجغرافيا
│   │   │   ├── Sources.tsx               # المصادر
│   │   │   ├── Interactions.tsx          # التفاعلات
│   │   │   ├── Forms.tsx                 # النماذج
│   │   │   ├── Ecommerce.tsx             # التجارة الإلكترونية
│   │   │   ├── Products.tsx              # المنتجات
│   │   │   ├── Videos.tsx                # الفيديوهات
│   │   │   ├── RealTime.tsx              # الوقت الفعلي
│   │   │   ├── Funnels.tsx               # القمع
│   │   │   ├── Reports.tsx               # التقارير
│   │   │   └── Settings.tsx              # الإعدادات
│   │   │
│   │   ├── onboarding/
│   │   │   ├── Welcome.tsx               # الترحيب
│   │   │   ├── WebsiteType.tsx           # نوع الموقع
│   │   │   ├── TrackingSetup.tsx         # إعداد التتبع
│   │   │   └── Verification.tsx          # التحقق
│   │   │
│   │   ├── Dashboard.tsx                 # الصفحة الرئيسية
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ...
│   │
│   ├── services/
│   │   ├── api.ts                        # Axios client + interceptors
│   │   ├── auth.ts                       # خدمات المصادقة
│   │   ├── analytics.ts                  # خدمات التحليلات
│   │   └── ...
│   │
│   ├── store/
│   │   ├── index.ts
│   │   └── dashboardStore.ts             # Zustand store
│   │
│   ├── types/
│   │   └── index.ts                      # TypeScript types
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### 4.2.3 Tracker Structure

```
tracker/
├── index.js                # السكريبت الرئيسي
└── bootstrap_snippet.html  # كود التضمين
```

## 4.3 قرارات التنفيذ الرئيسية

### 4.3.1 Rate Limiting

تم تطبيق Rate Limiting لحماية الـ API من الطلبات الزائدة:

```php
// routes/api.php
Route::post('/track', [AnalyticsController::class, 'track'])
    ->middleware('throttle:120,1');  // 120 طلب/دقيقة

Route::post('/track/batch', [AnalyticsController::class, 'trackBatch'])
    ->middleware('throttle:30,1');   // 30 طلب/دقيقة
```

**السبب:** منع إغراق السيرفر، خاصة من المواقع ذات الزيارات العالية.

### 4.3.2 WebSocket للتحديثات الفورية

بدلاً من Polling المتكرر، يتم استخدام WebSocket:

```php
// App/Events/AnalyticsEvent.php
class AnalyticsEvent implements ShouldBroadcast
{
    public function broadcastOn()
    {
        return [
            new Channel("analytics-channel"),
            new Channel("analytics.{$this->trackingId}"),
        ];
    }

    public function broadcastAs()
    {
        return "analytics.new";
    }
}
```

**الفوائد:**
- تحديث فوري بدون Refresh
- تقليل الطلبات على السيرفر
- تجربة مستخدم أفضل

### 4.3.3 Batch Processing

دعم إرسال أحداث متعددة في طلب واحد:

```javascript
// tracker/index.js
sendPeriodicData() {
    const periodicData = {
        type: 'periodic_events',
        clickCount: this.eventBuffer.clickCount,
        linkClicks: [...this.eventBuffer.linkClick],
        mouseMovements: [...this.eventBuffer.mouse_movement],
        // ...
    };
    this.sendEvent(periodicData);
}
```

**الفوائد:**
- تقليل عدد الطلبات
- أداء أفضل
- استهلاك أقل للشبكة

### 4.3.4 SendBeacon لـ Page Unload

استخدام SendBeacon لضمان إرسال البيانات عند مغادرة الصفحة:

```javascript
// tracker/index.js
sendEventImmediate(eventData) {
    if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(eventData)], {
            type: 'application/json',
        });
        navigator.sendBeacon(this.config.endpoint, blob);
    }
}
```

**السبب:** ضمان وصول بيانات مدة البقاء وعمق التمرير حتى عند الإغلاق المفاجئ.

## 4.4 استراتيجية الاختبار (Testing Strategy)

### 4.4.1 Unit Testing

#### اختبار ClickHouse Service
```php
// Tests/Unit/ClickHouseServiceTest.php
public function test_insert_event_returns_true_on_success()
{
    $service = new ClickHouseTestService();
    
    $result = $service->insertEvent([
        'timestamp' => now()->toDateTimeString(),
        'session_id' => 'test_session',
        'user_id' => 'test_user',
        'tracking_id' => 'test_site',
        'event_type' => 'page_view',
        'page_url' => '/test',
    ]);
    
    $this->assertTrue($result);
}

public function test_connection_succeeds()
{
    $service = new ClickHouseTestService();
    $result = $service->testConnection();
    
    $this->assertTrue($result['success']);
}
```

#### اختبار Controllers
```php
// Tests/Feature/AnalyticsControllerTest.php
public function test_track_endpoint_accepts_valid_event()
{
    $response = $this->postJson('/api/track', [
        'tracking_id' => 'test_site',
        'type' => 'page_view',
        'page_url' => '/test-page',
    ]);
    
    $response->assertStatus(200)
             ->assertJson(['status' => 'ok']);
}

public function test_track_endpoint_requires_tracking_id()
{
    $response = $this->postJson('/api/track', [
        'type' => 'page_view',
    ]);
    
    $response->assertStatus(422);
}
```

### 4.4.2 Integration Testing

#### API ↔ ClickHouse
```php
public function test_event_is_stored_in_clickhouse()
{
    // إرسال حدث
    $this->postJson('/api/track', [
        'tracking_id' => 'integration_test',
        'type' => 'page_view',
        'session_id' => 'test_session_123',
        'page_url' => '/integration-test',
    ]);
    
    // التحقق من التخزين
    $clickhouse = app(ClickHouseTestService::class);
    $count = $clickhouse->query(
        "SELECT count() FROM page_events 
         WHERE tracking_id = 'integration_test'"
    );
    
    $this->assertGreaterThan(0, $count);
}
```

#### Authentication Flow
```php
public function test_full_auth_flow()
{
    // تسجيل
    $registerResponse = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);
    $registerResponse->assertStatus(201);
    
    // تسجيل دخول
    $loginResponse = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);
    $loginResponse->assertStatus(200);
    $token = $loginResponse->json('access_token');
    
    // الوصول للـ me endpoint
    $meResponse = $this->withHeader('Authorization', "Bearer $token")
                       ->getJson('/api/me');
    $meResponse->assertStatus(200)
               ->assertJsonPath('email', 'test@example.com');
}
```

### 4.4.3 System Testing

#### Tracker على صفحة حقيقية

1. **إعداد صفحة الاختبار:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Analytics Test Page</h1>
    <button id="test-btn">Click Me</button>
    <form id="test-form">
        <input type="text" name="name">
        <button type="submit">Submit</button>
    </form>
    
    <script 
        src="tracker/index.js" 
        data-endpoint="http://localhost:8000/api/track"
        data-tracking-id="test_site"
        data-debug="true">
    </script>
</body>
</html>
```

2. **التحقق من ظهور البيانات:**
```bash
# التحقق من API
curl http://localhost:8000/api/analytics/test_site/realtime

# التحقق من ClickHouse مباشرة
curl "http://localhost:8123/?query=SELECT count(*) FROM page_events WHERE tracking_id='test_site'"
```

### 4.4.4 أوامر التشخيص

```bash
# التحقق من الإعداد الكامل
php artisan check:analytics-setup

# النتيجة المتوقعة:
# ✓ MySQL connection: OK
# ✓ Users count: 3
# ✓ ClickHouse connection: OK
# ✓ Page events count: 150
# ✓ Sessions count: 30
```

---

# الفصل الخامس: العمل المستقبلي والمراجع

## 5.1 العمل المستقبلي (Future Work)

### 5.1.1 قابلية التوسع (Scalability)

1. **Horizontal Scaling:**
   - إضافة Load Balancer (Nginx) أمام instances متعددة من Laravel
   - استخدام ClickHouse Cluster للبيانات الكبيرة

2. **Caching Layer:**
   - إضافة Redis لتخزين الاستعلامات المتكررة
   - تطبيق Query Caching للتقارير

3. **Message Queue:**
   - استخدام Redis Queue أو Amazon SQS لمعالجة الأحداث بشكل غير متزامن

### 5.1.2 المراقبة والأداء (Observability)

1. **Logging:**
   - تكامل مع ELK Stack (Elasticsearch, Logstash, Kibana)
   - تتبع الأخطاء عبر Sentry

2. **Metrics:**
   - إضافة Prometheus لجمع المقاييس
   - لوحة Grafana للمراقبة

3. **Tracing:**
   - تتبع الطلبات عبر Jaeger أو Zipkin

### 5.1.3 توسيع قدرات التحليل

1. **Machine Learning:**
   - اكتشاف الأنماط غير الطبيعية (Anomaly Detection)
   - التنبؤ بسلوك المستخدم

2. **Segmentation:**
   - تقسيم المستخدمين إلى شرائح
   - تحليل Cohort

3. **A/B Testing:**
   - دعم التجارب المقارنة
   - قياس تأثير التغييرات

### 5.1.4 تحسينات الواجهة

1. **تقارير مخصصة:**
   - محرر تقارير drag-and-drop
   - تصدير PDF/Excel

2. **Dashboards:**
   - لوحات تحكم قابلة للتخصيص
   - دعم الحفظ والمشاركة

3. **تنبيهات:**
   - إشعارات عند تجاوز حدود معينة
   - تكامل مع Slack/Email

## 5.2 المراجع (References)

### 5.2.1 الوثائق التقنية الرسمية

1. **ClickHouse Documentation**
   - ClickHouse Team. (2024). *ClickHouse Documentation*. Retrieved from https://clickhouse.com/docs/

2. **Laravel Documentation**
   - Laravel LLC. (2024). *Laravel 12.x Documentation*. Retrieved from https://laravel.com/docs/12.x

3. **React Documentation**
   - Meta Platforms, Inc. (2024). *React Documentation*. Retrieved from https://react.dev/

4. **TypeScript Documentation**
   - Microsoft. (2024). *TypeScript Documentation*. Retrieved from https://www.typescriptlang.org/docs/

### 5.2.2 أوراق بحثية ومقالات

5. **Columnar Storage**
   - Abadi, D. J., et al. (2006). *Column-stores vs. row-stores: how different are they really?* In Proceedings of the 2008 ACM SIGMOD international conference on Management of data.

6. **Time-Series Databases**
   - Pelkonen, T., et al. (2015). *Gorilla: A Fast, Scalable, In-Memory Time Series Database*. Proceedings of the VLDB Endowment.

### 5.2.3 أدوات ومكتبات

7. **JWT Authentication**
   - Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. RFC 7519.

8. **WebSocket Protocol**
   - Fette, I., & Melnikov, A. (2011). *The WebSocket Protocol*. RFC 6455.

9. **Tailwind CSS**
   - Tailwind Labs. (2024). *Tailwind CSS Documentation*. Retrieved from https://tailwindcss.com/docs

10. **Recharts**
    - Recharts Team. (2024). *Recharts - A composable charting library*. Retrieved from https://recharts.org/

### 5.2.4 مصادر إضافية

11. **Vite Build Tool**
    - Evan You. (2024). *Vite Documentation*. Retrieved from https://vitejs.dev/

12. **Zustand State Management**
    - Daishi Kato. (2024). *Zustand Documentation*. Retrieved from https://zustand-demo.pmnd.rs/

13. **Laravel Reverb**
    - Laravel LLC. (2024). *Laravel Reverb Documentation*. Retrieved from https://reverb.laravel.com/

---

# ملحق: أسئلة تقنية أساسية

## س1: كيف تعمل WebSockets في عرض البيانات الحية؟

### الشرح التفصيلي

**WebSocket** هو بروتوكول اتصال يُنشئ قناة **مستمرة ثنائية الاتجاه** (Full-Duplex) بين المتصفح والخادم، على عكس HTTP التقليدي الذي يعتمد على نمط الطلب/الاستجابة (Request/Response).

### آلية العمل في المشروع

```
┌───────────────────────────────────────────────────────────────────┐
│                     WebSocket Flow in Our System                  │
└───────────────────────────────────────────────────────────────────┘

1. WebSocket Handshake (مرة واحدة)
   ┌─────────────┐                           ┌─────────────────────┐
   │   Browser   │ ──── HTTP Upgrade ────▶   │  Laravel Reverb     │
   │  (React)    │ ◀── 101 Switching ────    │  (Port 8080)        │
   └─────────────┘      Protocols            └─────────────────────┘
                                              
2. الاتصال المستمر
   ┌─────────────┐                           ┌─────────────────────┐
   │   Browser   │ ◀════════════════════════▶│  Laravel Reverb     │
   │             │    Persistent Connection   │                     │
   └─────────────┘                           └─────────────────────┘

3. عند وصول حدث جديد
   ┌─────────────┐        ┌──────────────┐        ┌───────────────┐
   │   Website   │ POST   │   Laravel    │ INSERT │   ClickHouse  │
   │  + Tracker  │ ──────▶│   API        │ ──────▶│               │
   └─────────────┘        └──────┬───────┘        └───────────────┘
                                 │
                                 │ broadcast(new AnalyticsEvent)
                                 ▼
                          ┌─────────────────────┐
                          │  Laravel Reverb     │
                          │  WebSocket Server   │
                          └──────────┬──────────┘
                                     │ Push Event
                                     ▼
                          ┌─────────────────────┐
                          │   React Dashboard   │
                          │   (Auto-update UI)  │
                          └─────────────────────┘
```

### الكود في المشروع

**Backend - بث الحدث:**
```php
// App/Http/Controllers/AnalyticsController.php
public function track(Request $request)
{
    // ... معالجة الحدث ...
    
    // بث الحدث عبر WebSocket
    broadcast(new AnalyticsEvent($trackingId, $eventType, [
        "session_id" => $sessionId,
        "user_id" => $userId,
        "page_url" => $request->input("page_url"),
    ]))->toOthers();
}
```

**Frontend - الاشتراك في القناة:**
```typescript
// src/services/api.ts
import Echo from 'laravel-echo';

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
});

// الاشتراك في قناة التحليلات
echo.channel('analytics-channel')
    .listen('.analytics.new', (event) => {
        // تحديث الواجهة فوراً
        updateDashboard(event);
    });
```

### الفوائد

| بدون WebSocket | مع WebSocket |
|----------------|--------------|
| Polling كل 5 ثوانٍ | تحديث فوري |
| 12 طلب/دقيقة | اتصال واحد |
| تأخر 0-5 ثوانٍ | تأخر < 100ms |
| استهلاك شبكة عالي | استهلاك منخفض |

---

## س2: لماذا تم اختيار ClickHouse للبيانات الزمنية؟

### المقارنة مع قواعد البيانات التقليدية

| الميزة | MySQL/PostgreSQL | ClickHouse |
|--------|------------------|------------|
| نوع التخزين | صفوف (Row-based) | أعمدة (Columnar) |
| ضغط البيانات | منخفض | عالي جداً (10x) |
| سرعة INSERT | متوسط | سريع جداً |
| استعلامات COUNT/SUM | بطيء على بيانات كبيرة | سريع جداً |
| GROUP BY | بطيء | سريع جداً |
| JOINS المعقدة | ممتاز | ضعيف |

### لماذا ClickHouse مناسب لمشروعنا؟

**1. التخزين العمودي (Columnar Storage):**
```
التخزين الصفي (MySQL):
Row 1: [timestamp, session_id, user_id, tracking_id, event_type, ...]
Row 2: [timestamp, session_id, user_id, tracking_id, event_type, ...]
Row 3: [timestamp, session_id, user_id, tracking_id, event_type, ...]

التخزين العمودي (ClickHouse):
timestamp column:   [t1, t2, t3, ...]
session_id column:  [s1, s2, s3, ...]
tracking_id column: [tr1, tr2, tr3, ...]
```

عند تنفيذ `SELECT COUNT(*) WHERE tracking_id = 'x'`:
- MySQL: يقرأ كل الصفوف
- ClickHouse: يقرأ عمود tracking_id فقط

**2. أداء التجميعات:**
```sql
-- استعلام نموذجي في لوحة التحكم
SELECT 
    toStartOfHour(timestamp) as hour,
    count(*) as pageviews,
    uniq(session_id) as unique_sessions
FROM page_events
WHERE tracking_id = 'site_abc'
  AND timestamp >= now() - INTERVAL 7 DAY
GROUP BY hour
ORDER BY hour;

-- MySQL: ~5 ثوانٍ على مليون صف
-- ClickHouse: ~50 ميلي ثانية على مليون صف
```

**3. الضغط الممتاز:**
```
حجم البيانات:
- MySQL: 1 مليون صف = ~500 MB
- ClickHouse: 1 مليون صف = ~50 MB (ضغط 10x)
```

**4. Materialized Views للتجميعات التلقائية:**
```sql
-- يُحدّث تلقائياً عند كل INSERT
CREATE MATERIALIZED VIEW mv_traffic_5m TO traffic_metrics AS
SELECT 
    toStartOfFiveMinutes(start_time) as timestamp,
    '5m' as interval_type,
    tracking_id,
    count(*) as total_sessions,
    uniq(user_id) as unique_users
FROM sessions 
GROUP BY timestamp, tracking_id;
```

**5. تناسب نمط البيانات:**
- كتابة مستمرة (INSERT) ← ClickHouse ممتاز
- قراءات تحليلية (SELECT + GROUP BY) ← ClickHouse ممتاز
- تحديثات (UPDATE) نادرة ← لا مشكلة
- حذف (DELETE) نادر ← لا مشكلة

---

## س3: كيف يعمل نظام البث الفوري والمعالجة الموزعة في المشروع؟

### البنية المعمارية: Apache Kafka + Distributed System

يستخدم المشروع **Apache Kafka** كنظام معالجة أحداث موزع، مع **Spring Boot Cluster** خلف **Nginx Load Balancer** لاستقبال الأحداث. **Laravel** يُستخدم للـ Authentication والـ Dashboard API فقط.

### مكونات النظام الموزع

| المكون | الوصف |
|--------|-------|
| **Nginx Load Balancer** | موازن تحميل يوزع الطلبات على 3 Spring Boot instances |
| **Spring Boot Cluster** | 3 تطبيقات (app-1, app-2, app-3) للـ API |
| **Kafka Cluster** | 3 brokers (kafka-1, kafka-2, kafka-3) للمعالجة غير المتزامنة |
| **Zookeeper** | لإدارة Kafka cluster |
| **Redis** | Rate limiting + تخزين tracking_ids المسجلة |
| **ClickHouse** | قاعدة بيانات السلاسل الزمنية |
| **Laravel** | Authentication + Dashboard API + Reverb (WebSocket) |

### تدفق البيانات (Data Collection and Processing Flow)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│               Real-Time Distributed Analytics Data Flow                           │
└──────────────────────────────────────────────────────────────────────────────────┘

  Website                 Nginx LB              Spring Boot           Kafka Cluster
  + Tracker               (Port 8080)           (3 instances)         (3 brokers)
     │                       │                       │                      │
     │ POST /receive_data    │                       │                      │
     │──────────────────────▶│                       │                      │
     │                       │ Round Robin           │                      │
     │                       │──────────────────────▶│                      │
     │                       │                       │                      │
     │                       │    1. Rate Limiting (Redis)                  │
     │                       │    2. Validate Registered tracking_id        │
     │                       │    3. Normalize event format                 │
     │                       │                       │                      │
     │                       │                       │ Kafka Producer       │
     │                       │                       │─────────────────────▶│
     │                       │                       │                      │
     │                       │                       │                      ▼
     │                       │                       │              ┌──────────────┐
     │                       │                       │              │ Kafka Topics │
     │                       │                       │              │ - page_load  │
     │                       │                       │              │ - page_view  │
     │                       │                       │              │ - scroll_*   │
     │                       │                       │              │ - video_*    │
     │                       │                       │              │ - ecommerce_*│
     │                       │                       │              └──────┬───────┘
     │                       │                       │                     │
     │                       │                       │  Kafka Consumer     │
     │                       │                       │◀────────────────────┘
     │                       │                       │
     │                       │                       │   INSERT INTO
     │                       │                       │   ClickHouse
     │                       │                       │─────────────────────▶ ClickHouse
     │                       │                       │                       (Raw + MVs)
```

### التحقق من Registered Tracking ID

وفقاً للتوثيق (قسم 3.3.1)، يتم التحقق من أن `tracking_id` مسجّل قبل معالجة الأحداث:

```
1. User registers in Laravel → tracking_id stored in MySQL
2. Laravel Observer → syncs tracking_id to Redis (via /api/tracking-ids/register)
3. Spring Boot → validates tracking_id from Redis before publishing to Kafka
4. Invalid tracking_id → HTTP 403 response
```

### Kafka Topics

| Topic | Events |
|-------|--------|
| `page_load`, `page_view`, `page_unload`, `page_hidden`, `page_visible` | Page events + Session creation |
| `mouse_click`, `button_click`, `link_click`, `file_download` | Interaction events |
| `form_submit`, `form_focus`, `form_input` | Form events |
| `scroll_depth` | Scroll events |
| `mouse_move` | Mouse movement events |
| `video_events` | Video play/pause/complete/progress events |
| `product_view`, `cart_add`, `cart_remove`, `checkout_step`, `purchase` | E-commerce events |
| `periodic_events` | Batched events (unpacked by consumer) |

### تكوين Docker Compose

جميع الخدمات معرّفة في `docker-compose.yml` بالمسار الجذري:

```yaml
services:
  # ClickHouse
  clickhouse: ...
  
  # Redis for rate limiting and tracking_id cache
  redis: ...
  
  # Zookeeper
  zookeeper: ...
  
  # Kafka Cluster (3 brokers)
  kafka-1: ...
  kafka-2: ...
  kafka-3: ...
  
  # Spring Boot API Cluster (3 instances)
  app-1: ...
  app-2: ...
  app-3: ...
  
  # Nginx Load Balancer
  nginx-lb: ...
```

### تشغيل النظام الموزع

```bash
# تشغيل جميع الخدمات
docker-compose up -d

# مراقبة logs
docker-compose logs -f

# التحقق من صحة الخدمات
curl http://localhost:8080/health
```

### مزامنة Tracking IDs من Laravel

```bash
# مزامنة جميع tracking_ids إلى Kafka backend Redis
php artisan tracking:sync

# أو مع dry-run للمعاينة
php artisan tracking:sync --dry-run
```

### Laravel Reverb للـ Real-time Dashboard

**Laravel Reverb** يُستخدم لعرض التحديثات الفورية في لوحة التحكم:

```php
// عند وصول حدث جديد، يمكن إرسال broadcast
broadcast(new AnalyticsEvent($trackingId, $eventType, $data))->toOthers();
```

---

# ملخص المشروع

## ما تم تنفيذه

| المكون | الحالة | الوصف |
|--------|--------|-------|
| **Kafka Cluster** | ✅ مكتمل | 3 brokers للمعالجة الموزعة غير المتزامنة |
| **Spring Boot Cluster** | ✅ مكتمل | 3 instances خلف Nginx Load Balancer |
| **Nginx Load Balancer** | ✅ مكتمل | توزيع الحمل على Spring Boot instances |
| **Redis** | ✅ مكتمل | Rate Limiting + Tracking ID validation cache |
| Backend (Laravel) | ✅ مكتمل | API + Authentication + WebSocket (Reverb) |
| Frontend (React) | ✅ مكتمل | Dashboard + Charts + Real-time |
| Tracker (JavaScript) | ✅ مكتمل | Event collection + Batch sending |
| ClickHouse Schema | ✅ مكتمل | 8 جداول + 22 Materialized View |
| MySQL Schema | ✅ مكتمل | Users + Roles + Sessions |
| Documentation | ✅ مكتمل | API.md + README + هذه الوثيقة |
| **Kafka Consumers** | ✅ مكتمل | Sessions, Video, Scroll, Mouse, Periodic events |
| **Tracking ID Validation** | ✅ مكتمل | تحقق من tracking_id مسجّل قبل المعالجة |

## المنافذ المستخدمة

| الخدمة | المنفذ |
|--------|--------|
| **Nginx Load Balancer** | 8080 (Entry point للـ Tracker) |
| **Spring Boot app-1** | 8081 |
| **Spring Boot app-2** | 8082 |
| **Spring Boot app-3** | 8083 |
| **Kafka broker-1** | 9092 |
| **Kafka broker-2** | 9093 |
| **Kafka broker-3** | 9094 |
| **Zookeeper** | 2181 |
| **Redis** | 6379 |
| **ClickHouse HTTP** | 8123 |
| **ClickHouse Native** | 9000 |
| Laravel API | 8000 |
| Laravel Reverb | 6001 (أو 8080 إن لم يُستخدم Kafka) |
| MySQL | 3306 |
| Frontend (Vite) | 5173 |

## أوامر التشغيل

```bash
# 1. تشغيل النظام الموزع بالكامل (Kafka + ClickHouse + Spring Boot)
docker-compose up -d

# 2. انتظار حتى تصبح الخدمات جاهزة
docker-compose logs -f

# 3. Laravel Backend (في terminal منفصل)
cd BackEnd
php artisan migrate --force
php artisan db:seed
php artisan serve

# 4. مزامنة Tracking IDs من Laravel إلى Kafka Redis
php artisan tracking:sync

# 5. WebSocket (terminal جديد - اختياري للـ real-time dashboard)
cd BackEnd
php artisan reverb:start

# 6. Frontend (terminal جديد)
cd frontend/react-analytics-dashboard-updated/react-analytics-dashboard
npm run dev
```

### أوامر مفيدة

```bash
# إيقاف جميع الخدمات
docker-compose down

# إعادة بناء الـ images
docker-compose build --no-cache

# عرض حالة الخدمات
docker-compose ps

# عرض logs لخدمة معينة
docker-compose logs -f app-1

# التحقق من صحة Kafka
curl http://localhost:8080/health
```

---

**تاريخ آخر تحديث:** فبراير 2026

**إصدار الوثيقة:** 1.0
