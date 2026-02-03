# تحليل الفجوة: التوثيق vs المنطق الحالي للمشروع
## Real-Time Distributed Analytics Dashboard

تمت المقارنة بين **ملف التوثيق** (Documation Real-Time Distributed Analytics Dashboard / PROJECT_DOCUMENTATION.md) وبين **الكود والمنطق الحالي** في المشروع. فيما يلي أوجه الاختلاف والتعديلات المطلوبة إذا أردنا الاعتماد على منطق التوثيق في **جمع البيانات، تحليلها، وعرضها**.

---

## 1. جمع البيانات (Data Collection)

### 1.1 ما يتوافق مع التوثيق حالياً
| البند | التوثيق | الحالة الحالية |
|-------|---------|-----------------|
| فاصل الإرسال | كل **7 ثوان** (قابل للتعديل) | `data-interval="7000"` في الـ Tracker ✓ |
| إرسال دفعي (Batch) | `POST /api/track/batch` | موجود ومحدود 30 طلب/دقيقة ✓ |
| SendBeacon عند المغادرة | استخدام SendBeacon لـ `page_unload` | `sendEventImmediate()` تستخدم `navigator.sendBeacon` ✓ |
| أحداث الصفحة | page_load → sessions + page_events | مُنفَّذ (insertSession + insertEvent) ✓ |
| أحداث النماذج | form_focus, form_input, form_submit → form_events | مُنفَّذ (insertFormEvent) ✓ |
| أحداث التفاعل | click, scroll, link_click → interaction_events | مُنفَّذ (insertInteractionEvent) ✓ |

### 1.2 أوجه الاختلاف والتعديل المطلوب

#### أ) أحداث التجارة الإلكترونية (E-commerce)
| التوثيق | المنطق الحالي | المطلوب |
|---------|----------------|----------|
| تخزين في جدول **ecommerce_events** مع الحقول: product_id, product_name, price, quantity, category, currency, order_id, total, step, step_name | يتم تخزينها حالياً في **interaction_events** فقط (تعليق في الكود: "For now, store as interaction event") | 1) إضافة دالة **insertEcommerceEvent** في `ClickHouseTestService` (أو خدمة مخصصة) مع كل أعمدة جدول `ecommerce_events`. 2) في `AnalyticsController::handleEcommerceEvent` استدعاء **insertEcommerceEvent** بدلاً من **insertInteractionEvent** وتمرير كل الحقول القادمة من الـ Tracker (product_id, product_name, price, quantity, category, currency, order_id, total, step, step_name). |

#### ب) أحداث الفيديو (Video)
| التوثيق | المنطق الحالي | المطلوب |
|---------|----------------|----------|
| تخزين في جدول **video_events** مع: video_src, video_duration, current_time، وأنواع الأحداث: play, pause, complete, progress_25, progress_50, progress_75 | يتم تخزينها في **interaction_events** كـ "video_*" | 1) إضافة دالة **insertVideoEvent** في خدمة ClickHouse مع أعمدة جدول `video_events`. 2) في `AnalyticsController::handleVideoEvent` استدعاء **insertVideoEvent** بدلاً من **insertInteractionEvent**. 3) في **handlePeriodicEvents** عند معالجة `videoEvents` استدعاء **insertVideoEvent** لكل حدث فيديو (مع video_src, video_duration, current_time, event_type). |

#### ج) معالجة الـ Batch (track/batch)
| التوثيق | المنطق الحالي | المطلوب |
|---------|----------------|----------|
| استقبال مصفوفة أحداث بأنواع مختلفة (page_view, click, form_submit, …) وتوجيه كل حدث إلى الـ handler المناسب (مثل `/track` المفرد) | كل حدث في الـ batch يُمرَّر إلى **handleGenericEvent** فقط، فيُخزَّن كله في **page_events** | في **trackBatch**: لكل عنصر في `events` استخراج `type`/`event_type` واستدعاء نفس الـ **match** (أو نفس الدوال) المستخدمة في **track()** (handlePageLoad, handlePageView, handleClick, handleFormEvent, handleEcommerceEvent, handleVideoEvent, …) بدلاً من handleGenericEvent فقط، حتى تُخزَّن الأحداث في الجداول الصحيحة (page_events, interaction_events, form_events, ecommerce_events, video_events). |

#### د) حقول إضافية في الجداول الحالية
- **page_events:** جدول ClickHouse يحتوي حقل **save_data** (من Network Information). الخدمة **insertEvent** لا تضمّنه. المطلوب: قراءة `data.network.saveData` (أو ما يعادله من الـ Tracker) وإضافته إلى مصفوفة الأعمدة والقيم في insertEvent.
- **interaction_events:** الجدول يحتوي **button_type, file_name, target**. دالة **insertInteractionEvent** لا ترسلها. المطلوب: إضافة هذه الأعمدة عند الإدراج وتمرير القيم من الـ request (مثل button_type من button_click، file_name من file_download، target من link_click).

---

## 2. التحليل (Analysis)

### 2.1 ما يتوافق مع التوثيق
- وجود جداول التجميع: **traffic_metrics**, **page_metrics**, **device_metrics**, **geo_metrics**, **source_metrics**, **interaction_metrics**, **form_metrics**, **ecommerce_metrics**, **product_metrics**, **video_metrics**، وجداول مساعدة (مثل session_pages, conversion_funnel, user_first_session).
- وجود **22 Materialized View** تقوم بالتجميع التلقائي من الجداول الأساسية (sessions, page_events, interaction_events, form_events, ecommerce_events, video_events) إلى جداول المقاييس.

### 2.2 أوجه الاختلاف والتعديل المطلوب
- **مصدر بيانات الداشبورد:** التوثيق يوضح أن عرض الإحصائيات يعتمد على الاستعلام من جداول التجميع (مثل traffic_metrics, page_metrics) للفترات **5m, 1h, 1d**.
- **المنطق الحالي:** دوال مثل **getOverviewStats** و **getTrafficData** و **getTopPages** تستعلم من **page_events** (و**sessions**) مباشرة بدون استخدام **traffic_metrics** أو **page_metrics**.
- **المطلوب (للمطابقة مع التوثيق):**
  - إما: إضافة/استخدام دوال في `ClickHouseTestService` تستعلم من **traffic_metrics** و **page_metrics** عند طلب فترات (5m, 1h, 1d) وعرضها في الداشبورد.
  - أو: الإبقاء على الاستعلام من الجداول الخام مع توثيق أن هذا اختيار لأسباب مرونة الفترات؛ مع إمكانية إضافة خيار "فترة مجمّعة" (5m/1h/1d) لاحقاً من جداول التجميع.

بعد تنفيذ **إدراج ecommerce_events و video_events** بشكل صحيح، الـ Materialized Views الخاصة بـ ecommerce و video ستبدأ بالامتلاء تلقائياً، وسيصبح تحليل التجارة الإلكترونية والفيديو متوافقاً مع التوثيق.

---

## 3. عرض البيانات (Display)

### 3.1 ما يتوافق مع التوثيق
- لوحة تحكم (React) تستعلم من API وتستمع لـ WebSocket (Laravel Reverb) للتحديث الفوري.
- وجود endpoints: overview, traffic, realtime, pages, devices, behavior, forms, videos, interactions, geography, ecommerce.
- التجميعات الزمنية مذكورة في التوثيق: **فوري، 5 دقائق، ساعة، يوم**.

### 3.2 أوجه الاختلاف والتعديل المطلوب
- **الفترات المجمّعة (5m, 1h, 1d):** التوثيق يذكرها صراحة؛ الواجهة الحالية تعتمد على فترات مثل "7d" من الجداول الخام. المطلوب: إضافة دعم لاختيار الفترة (مثل 5m, 1h, 1d) في واجهة الداشبورد واستدعاء API يعيد بيانات من **traffic_metrics** / **page_metrics** حسب الفترة المختارة.
- **بيانات E-commerce و Video في الداشبورد:** بعد تنفيذ insertEcommerceEvent و insertVideoEvent، التأكد من أن endpoints مثل **ecommerce** و **videos** تستعلم من **ecommerce_metrics** / **product_metrics** و **video_metrics** (أو من الجداول الخام عند الحاجة)، حتى يعكس العرض ما هو موثّق.

---

## 4. ملخص التعديلات اللازمة لاعتماد منطق التوثيق

| # | المكون | التعديل المطلوب |
|---|--------|------------------|
| 1 | **Backend – ClickHouse Service** | إضافة **insertEcommerceEvent** مع أعمدة جدول `ecommerce_events`. |
| 2 | **Backend – ClickHouse Service** | إضافة **insertVideoEvent** مع أعمدة جدول `video_events`. |
| 3 | **Backend – AnalyticsController** | **handleEcommerceEvent**: استدعاء insertEcommerceEvent مع كل الحقول (product_id, product_name, price, quantity, category, currency, order_id, total, step, step_name) بدلاً من insertInteractionEvent. |
| 4 | **Backend – AnalyticsController** | **handleVideoEvent** و **handlePeriodicEvents** (قسم videoEvents): استدعاء insertVideoEvent بدلاً من insertInteractionEvent. |
| 5 | **Backend – AnalyticsController** | **trackBatch**: توجيه كل حدث في المصفوفة حسب نوعه إلى نفس الـ handlers المستخدمة في **track()** (page_load, page_view, click, form_*, ecommerce, video, …) بدلاً من handleGenericEvent فقط. |
| 6 | **Backend – ClickHouse Service** | **insertEvent**: إضافة حقل **save_data** من بيانات الشبكة إن وُجد. |
| 7 | **Backend – ClickHouse Service** | **insertInteractionEvent**: إضافة أعمدة **button_type**, **file_name**, **target** إن وُجدت في الـ request. |
| 8 | **Backend – Dashboard/API** | (اختياري) دوال تستعلم من **traffic_metrics** و **page_metrics** للفترات 5m, 1h, 1d وعرضها في الداشبورد. |
| 9 | **Frontend – Dashboard** | (اختياري) إضافة خيارات الفترة (5m, 1h, 1d) وربطها بـ API التي تعيد بيانات التجميع. |

بعد تنفيذ البنود 1–7 يكون **جمع البيانات وتحليلها** متوافقاً مع منطق التوثيق (جداول منفصلة لأحداث التجارة الإلكترونية والفيديو، ومعالجة صحيحة للـ batch). البنود 8–9 تحقق **عرض البيانات** حسب التجميعات الزمنية المذكورة في التوثيق.

---

*تم إعداد هذا الملف بناءً على مقارنة ملف التوثيق (PROJECT_DOCUMENTATION.md وملخص doc/data-collection.txt و doc/API.md) مع الكود في BackEnd، Tracker، وقاعدة ClickHouse (create_tables.v3.sql).*
