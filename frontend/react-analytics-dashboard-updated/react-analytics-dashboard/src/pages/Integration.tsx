import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import './Integration.scss';
import { useAuth } from '../components/AuthContext';
import { TRACK_ENDPOINT_URL } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function Integration() {
  const { me } = useAuth();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  // استخدام tracking_id الحقيقي من بيانات المستخدم
  const trackingId = me?.tracking_id || 'لم يتم إنشاء معرف بعد';
  const hasTrackingId = !!me?.tracking_id;
  
  const trackUrl = TRACK_ENDPOINT_URL || 'http://localhost:8000/api/track';
  
  const scriptSnippet = `<script 
  src="https://your-cdn-or-host/tracker/index.js"
  data-endpoint="${trackUrl}"
  data-tracking-id="${trackingId}"
  data-batch-size="10"
  data-interval="5000"
  data-debug="false"
></script>`;

  const localScriptSnippet = `<script 
  src="../tracker/index.js"
  data-endpoint="http://localhost:8000/api/track"
  data-tracking-id="${trackingId}"
  data-batch-size="10"
  data-interval="5000"
  data-debug="true"
></script>`;

  const curlExample = `curl -X POST "${trackUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tracking_id": "${trackingId}",
    "type": "page_view",
    "session_id": "sess_123",
    "page_url": "/example-page",
    "page_title": "My Page"
  }'`;

  const copyToClipboard = useCallback(async (text: string, step: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      setCopiedStep(null);
    }
  }, []);

  return (
    <DashboardLayout
      title="دليل التكامل"
      subtitle="دليل خطوة بخطوة لربط موقعك وبدء جمع البيانات التحليلية"
    >
      <div className="integration-content">
        {/* رسالة مهمة في حالة عدم وجود tracking_id */}
        {!hasTrackingId && (
          <div className="alert-box warning">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <strong>تنبيه:</strong> لم يتم إنشاء معرف التتبع بعد. 
              <Link to="/dashboard/integration/setup" className="alert-link">اذهب لصفحة الإعداد</Link> لإنشاء معرف التتبع الخاص بك.
            </div>
          </div>
        )}

        {/* بطاقة معرف التتبع */}
        <section className="tracking-id-card">
          <div className="card-header">
            <i className="fas fa-key"></i>
            <h3>معرف التتبع الخاص بك</h3>
          </div>
          <div className="card-body">
            {hasTrackingId ? (
              <>
                <div className="tracking-id-display">
                  <code className="tracking-id">{trackingId}</code>
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(trackingId, 0)}
                    title="نسخ"
                  >
                    <i className={`fas ${copiedStep === 0 ? 'fa-check' : 'fa-copy'}`}></i>
                    {copiedStep === 0 ? 'تم النسخ!' : 'نسخ'}
                  </button>
                </div>
                <p className="tracking-id-note">
                  استخدم هذا المعرف في جميع صفحات موقعك لربط البيانات بحسابك.
                </p>
              </>
            ) : (
              <div className="no-tracking-id">
                <p>لم يتم إنشاء معرف التتبع بعد</p>
                <Link to="/dashboard/integration/setup" className="btn-primary">
                  <i className="fas fa-plus-circle"></i> إنشاء معرف التتبع
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* روابط سريعة */}
        <section className="quick-links">
          <Link to="/dashboard/integration/setup" className="quick-link-card primary">
            <i className="fas fa-cog"></i>
            <div>
              <h4>صفحة الإعداد التفصيلية</h4>
              <p>عرض كود التتبع الكامل وخيارات التكامل المتقدمة</p>
            </div>
            <i className="fas fa-chevron-left"></i>
          </Link>
          <Link to="/dashboard/integration/guide" className="quick-link-card">
            <i className="fas fa-book"></i>
            <div>
              <h4>دليل التكامل المفصل</h4>
              <p>شرح تفصيلي لجميع أنواع الأحداث والتتبع</p>
            </div>
            <i className="fas fa-chevron-left"></i>
          </Link>
        </section>

        <div className="integration-intro">
          <p>
            اتبع الخطوات أدناه لإضافة كود التتبع لموقعك وبدء جمع البيانات التحليلية.
            ستظهر البيانات في لوحة التحكم فور بدء إرسال الأحداث.
          </p>
        </div>

        {/* Step 1: API Credentials */}
        <section className="integration-step">
          <div className="step-header">
            <span className="step-number">1</span>
            <h3>احصل على بيانات الاعتماد</h3>
          </div>
          <p className="step-desc">تحتاج إلى قيمتين: عنوان API ومعرف التتبع الفريد الخاص بك.</p>
          <div className="credentials-card">
            <div className="cred-row">
              <label>عنوان Track API</label>
              <div className="cred-value">
                <code>{trackUrl}</code>
                <button
                  className="btn-copy"
                  onClick={() => copyToClipboard(trackUrl, 1)}
                  title="نسخ"
                >
                  <i className={`fas ${copiedStep === 1 ? 'fa-check' : 'fa-copy'}`}></i>
                  {copiedStep === 1 ? 'تم!' : 'نسخ'}
                </button>
              </div>
            </div>
            <div className="cred-row">
              <label>معرف التتبع (Tracking ID)</label>
              <div className="cred-value">
                <code className={!hasTrackingId ? 'disabled' : ''}>{trackingId}</code>
                <button
                  className="btn-copy"
                  onClick={() => copyToClipboard(trackingId, 2)}
                  title="نسخ"
                  disabled={!hasTrackingId}
                >
                  <i className={`fas ${copiedStep === 2 ? 'fa-check' : 'fa-copy'}`}></i>
                  {copiedStep === 2 ? 'تم!' : 'نسخ'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Embed Script */}
        <section className="integration-step">
          <div className="step-header">
            <span className="step-number">2</span>
            <h3>أضف كود التتبع لموقعك</h3>
          </div>
          <p className="step-desc">
            أضف هذا الكود قبل علامة <code>&lt;/body&gt;</code> في صفحات HTML الخاصة بك.
          </p>
          
          {/* كود للإنتاج */}
          <div className="code-block">
            <div className="code-header">
              <span>كود HTML (للإنتاج)</span>
              <button
                className="btn-copy-sm"
                onClick={() => copyToClipboard(scriptSnippet, 3)}
              >
                <i className={`fas ${copiedStep === 3 ? 'fa-check' : 'fa-copy'}`}></i>
                {copiedStep === 3 ? 'تم!' : 'نسخ'}
              </button>
            </div>
            <pre dir="ltr"><code>{scriptSnippet}</code></pre>
          </div>

          {/* كود للتطوير المحلي */}
          <div className="code-block local">
            <div className="code-header">
              <span>كود HTML (للتطوير المحلي - localhost)</span>
              <button
                className="btn-copy-sm"
                onClick={() => copyToClipboard(localScriptSnippet, 5)}
              >
                <i className={`fas ${copiedStep === 5 ? 'fa-check' : 'fa-copy'}`}></i>
                {copiedStep === 5 ? 'تم!' : 'نسخ'}
              </button>
            </div>
            <pre dir="ltr"><code>{localScriptSnippet}</code></pre>
          </div>

          <div className="step-note">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>المعاملات:</strong>
              <ul>
                <li><code>data-endpoint</code> – عنوان API (مطلوب)</li>
                <li><code>data-tracking-id</code> – معرف التتبع الخاص بك (مطلوب)</li>
                <li><code>data-batch-size</code> – عدد الأحداث في كل دفعة (افتراضي: 10)</li>
                <li><code>data-interval</code> – فترة الإرسال بالمللي ثانية (افتراضي: 5000)</li>
                <li><code>data-debug</code> – تفعيل سجلات الـ Console (افتراضي: false)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3: Direct API */}
        <section className="integration-step">
          <div className="step-header">
            <span className="step-number">3</span>
            <h3>إرسال الأحداث عبر API (اختياري)</h3>
          </div>
          <p className="step-desc">
            يمكنك أيضاً إرسال الأحداث مباشرة باستخدام طلبات <code>POST</code>.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span>مثال cURL</span>
              <button
                className="btn-copy-sm"
                onClick={() => copyToClipboard(curlExample, 4)}
              >
                <i className={`fas ${copiedStep === 4 ? 'fa-check' : 'fa-copy'}`}></i>
                {copiedStep === 4 ? 'تم!' : 'نسخ'}
              </button>
            </div>
            <pre dir="ltr"><code>{curlExample}</code></pre>
          </div>
          <div className="step-note">
            <i className="fas fa-list"></i>
            <div>
              <strong>أنواع الأحداث المدعومة:</strong> <code>page_load</code>, <code>page_view</code>, <code>click</code>, 
              <code>scroll_depth</code>, <code>form_submit</code>, <code>video_play</code>, <code>product_view</code>, 
              <code>cart_add</code>, <code>purchase</code>, <code>custom_event</code>
            </div>
          </div>
        </section>

        {/* Step 4: View Data */}
        <section className="integration-step">
          <div className="step-header">
            <span className="step-number">4</span>
            <h3>عرض البيانات</h3>
          </div>
          <p className="step-desc">
            بمجرد إرسال الأحداث، ستظهر في لوحة التحكم. يمكنك أيضاً اختبار الأحداث من صفحة الإعداد.
          </p>
          <div className="step-actions">
            <Link to="/dashboard/overview" className="btn-primary">
              <i className="fas fa-chart-line"></i> لوحة التحكم
            </Link>
            <Link to="/dashboard/integration/setup" className="btn-outline">
              <i className="fas fa-cog"></i> صفحة الإعداد التفصيلية
            </Link>
            <Link to="/dashboard/realtime" className="btn-outline">
              <i className="fas fa-satellite-dish"></i> البيانات المباشرة
            </Link>
          </div>
        </section>

        <div className="integration-footer">
          <p>
            <i className="fas fa-book"></i> للحصول على التوثيق الكامل، راجع ملف <code>doc/PROJECT_DOCUMENTATION.md</code> في المشروع.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
