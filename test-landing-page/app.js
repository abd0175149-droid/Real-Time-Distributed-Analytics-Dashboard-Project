/**
 * Analytics Test Landing Page - Interactive Demo
 * يعرض البيانات المجمعة في الوقت الحقيقي
 */

(function() {
    'use strict';

    // State
    let eventsCount = 0;
    let clickCount = 0;
    let mouseMoves = 0;
    let maxScrollDepth = 0;
    let pageStartTime = Date.now();
    let cart = [];

    // Elements
    const eventsLog = document.getElementById('events-log');
    const connectionStatus = document.getElementById('connection-status');
    const eventsCountEl = document.getElementById('events-count');
    const togglePanelBtn = document.getElementById('toggle-panel');
    const trackingPanel = document.getElementById('tracking-panel');

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupPanelToggle();
        populateDeviceInfo();
        populateSessionInfo();
        setupEventListeners();
        setupScrollTracking();
        setupVideoTracking();
        setupEcommerceTracking();
        setupCustomEvents();
        startTimeCounter();
        interceptAnalyticsEvents();
    }

    // Toggle tracking panel
    function setupPanelToggle() {
        togglePanelBtn.addEventListener('click', () => {
            trackingPanel.classList.toggle('minimized');
            togglePanelBtn.textContent = trackingPanel.classList.contains('minimized') ? 'تكبير' : 'تصغير';
        });
    }

    // Populate device information
    function populateDeviceInfo() {
        const deviceInfo = document.getElementById('device-info');
        if (!deviceInfo) return;

        const items = deviceInfo.querySelectorAll('li');
        const values = [
            getDeviceType(),
            navigator.platform,
            getBrowserName(),
            `${screen.width} x ${screen.height}`,
            `${window.innerWidth} x ${window.innerHeight}`
        ];

        items.forEach((item, index) => {
            const valueEl = item.querySelector('.value');
            if (valueEl && values[index]) {
                valueEl.textContent = values[index];
            }
        });

        // Get geo info
        fetchGeoInfo();

        // Get network info
        populateNetworkInfo();

        // Get performance info
        setTimeout(populatePerformanceInfo, 1000);
    }

    function getDeviceType() {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/mobile|android|iphone|ipod|phone/i.test(userAgent)) return 'Mobile 📱';
        if (/tablet|ipad|kindle|silk/i.test(userAgent)) return 'Tablet 📲';
        return 'Desktop 🖥️';
    }

    function getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox 🦊';
        if (ua.includes('Edg')) return 'Edge 🌐';
        if (ua.includes('Chrome')) return 'Chrome 🌐';
        if (ua.includes('Safari')) return 'Safari 🧭';
        return 'Unknown';
    }

    async function fetchGeoInfo() {
        const geoInfo = document.getElementById('geo-info');
        if (!geoInfo) return;

        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            const items = geoInfo.querySelectorAll('li');
            const values = [
                data.country_name || 'غير متاح',
                data.city || 'غير متاح',
                data.region || 'غير متاح',
                data.ip || 'غير متاح'
            ];

            items.forEach((item, index) => {
                const valueEl = item.querySelector('.value');
                if (valueEl && values[index]) {
                    valueEl.textContent = values[index];
                }
            });

            updateConnectionStatus(true);
        } catch (error) {
            console.error('Error fetching geo info:', error);
        }
    }

    function populateNetworkInfo() {
        const networkInfo = document.getElementById('network-info');
        if (!networkInfo) return;

        const items = networkInfo.querySelectorAll('li');
        
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const values = [
                connection.effectiveType?.toUpperCase() || 'غير متاح',
                connection.downlink ? `${connection.downlink} Mbps` : 'غير متاح',
                connection.rtt ? `${connection.rtt} ms` : 'غير متاح',
                connection.saveData ? 'مفعل' : 'معطل'
            ];

            items.forEach((item, index) => {
                const valueEl = item.querySelector('.value');
                if (valueEl && values[index]) {
                    valueEl.textContent = values[index];
                }
            });
        } else {
            items.forEach(item => {
                const valueEl = item.querySelector('.value');
                if (valueEl) valueEl.textContent = 'غير مدعوم';
            });
        }
    }

    function populatePerformanceInfo() {
        const perfInfo = document.getElementById('performance-info');
        if (!perfInfo) return;

        const items = perfInfo.querySelectorAll('li');
        
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const values = [
                `${timing.loadEventEnd - timing.navigationStart} ms`,
                `${timing.domainLookupEnd - timing.domainLookupStart} ms`,
                `${timing.connectEnd - timing.connectStart} ms`,
                `${timing.domContentLoadedEventEnd - timing.navigationStart} ms`
            ];

            items.forEach((item, index) => {
                const valueEl = item.querySelector('.value');
                if (valueEl && values[index]) {
                    valueEl.textContent = values[index];
                }
            });
        }
    }

    // Populate session information
    function populateSessionInfo() {
        const sessionInfo = document.getElementById('session-info');
        if (!sessionInfo) return;

        const items = sessionInfo.querySelectorAll('li');
        const values = [
            sessionStorage.getItem('analytics_session_id') || 'جاري الإنشاء...',
            localStorage.getItem('analytics_user_id') || 'جاري الإنشاء...',
            'trk_TB4ABmsyyoJRpilc',
            document.referrer || 'زيارة مباشرة'
        ];

        // Wait a bit for analytics to initialize
        setTimeout(() => {
            const updatedValues = [
                sessionStorage.getItem('analytics_session_id') || values[0],
                localStorage.getItem('analytics_user_id') || values[1],
                values[2],
                values[3]
            ];

            items.forEach((item, index) => {
                const valueEl = item.querySelector('.value');
                if (valueEl && updatedValues[index]) {
                    valueEl.textContent = updatedValues[index];
                }
            });
        }, 500);
    }

    // Setup event listeners for tracking display
    function setupEventListeners() {
        // Track all clicks
        document.addEventListener('click', (e) => {
            clickCount++;
            updateInteractionStats();
            
            // Log the click
            const target = e.target.closest('button, a, [role="button"]');
            if (target) {
                const eventType = target.tagName === 'A' ? 'link_click' : 'button_click';
                const text = target.textContent?.trim().substring(0, 30) || 'unknown';
                logEvent(eventType, { text, x: e.clientX, y: e.clientY }, 'click');
            } else {
                logEvent('mouse_click', { 
                    element: e.target.tagName, 
                    x: e.clientX, 
                    y: e.clientY 
                }, 'click');
            }
        });

        // Track mouse movement (sampled)
        let lastMove = 0;
        let moveCounter = 0;
        document.addEventListener('mousemove', (e) => {
            moveCounter++;
            if (moveCounter % 10 === 0 && Date.now() - lastMove > 500) {
                lastMove = Date.now();
                mouseMoves++;
                updateInteractionStats();
            }
        });

        // Track form interactions
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('focus', () => {
                logEvent('form_focus', { field: el.name || el.id }, 'form');
            });

            el.addEventListener('input', () => {
                logEvent('form_input', { 
                    field: el.name || el.id, 
                    length: el.value?.length || 0 
                }, 'form');
            });
        });

        // Track form submission
        document.getElementById('contact-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            logEvent('form_submit', { 
                form_id: 'contact-form',
                fields: Array.from(e.target.elements).filter(el => el.name).length
            }, 'form');
            showToast('تم إرسال النموذج بنجاح! (للاختبار فقط)', 'success');
        });
    }

    // Setup scroll tracking
    function setupScrollTracking() {
        const milestones = [25, 50, 75, 100];
        const reached = new Set();
        const progressFill = document.getElementById('scroll-progress-fill');

        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const percent = Math.round((scrollTop / docHeight) * 100);

            if (percent > maxScrollDepth) {
                maxScrollDepth = percent;
                updateInteractionStats();
            }

            // Update progress bar
            if (progressFill) {
                progressFill.style.width = `${percent}%`;
            }

            // Log milestones
            milestones.forEach(m => {
                if (percent >= m && !reached.has(m)) {
                    reached.add(m);
                    logEvent('scroll_depth', { depth: m }, 'scroll');
                }
            });
        });
    }

    // Setup video tracking display
    function setupVideoTracking() {
        const video = document.getElementById('demo-video');
        const statusEl = document.getElementById('video-status');
        const progressEl = document.getElementById('video-progress');

        if (!video) return;

        video.addEventListener('play', () => {
            if (statusEl) statusEl.textContent = 'يعمل ▶️';
            logEvent('video_play', { src: video.src }, 'video');
        });

        video.addEventListener('pause', () => {
            if (statusEl) statusEl.textContent = 'متوقف ⏸️';
            logEvent('video_pause', { currentTime: video.currentTime }, 'video');
        });

        video.addEventListener('ended', () => {
            if (statusEl) statusEl.textContent = 'انتهى ✓';
            logEvent('video_complete', {}, 'video');
        });

        video.addEventListener('timeupdate', () => {
            if (!video.duration) return;
            const percent = Math.round((video.currentTime / video.duration) * 100);
            if (progressEl) progressEl.textContent = `${percent}%`;
        });
    }

    // Setup e-commerce tracking
    function setupEcommerceTracking() {
        const cartItemsEl = document.getElementById('cart-items');
        const checkoutBtn = document.getElementById('checkout-btn');

        // Product view buttons
        document.querySelectorAll('.view-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = getProductData(card);
                
                logEvent('product_view', product, 'ecommerce');
                
                // Track via analytics API if available
                if (window.analytics?.trackProductView) {
                    window.analytics.trackProductView(
                        product.id, 
                        product.name, 
                        product.price, 
                        product.category
                    );
                }

                showToast(`تم عرض: ${product.name}`, 'info');
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = getProductData(card);
                
                cart.push(product);
                updateCartDisplay();
                
                logEvent('cart_add', product, 'ecommerce');
                
                if (window.analytics?.trackCartAdd) {
                    window.analytics.trackCartAdd(
                        product.id, 
                        product.name, 
                        product.price, 
                        1
                    );
                }

                showToast(`تمت الإضافة: ${product.name}`, 'success');
            });
        });

        // Checkout button
        checkoutBtn?.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('السلة فارغة!', 'warning');
                return;
            }

            const total = cart.reduce((sum, p) => sum + p.price, 0);
            const orderId = 'ORD-' + Date.now();

            logEvent('purchase', { 
                order_id: orderId, 
                items: cart.length, 
                total: total 
            }, 'ecommerce');

            if (window.analytics?.trackPurchase) {
                window.analytics.trackPurchase(orderId, cart, total, 'SAR');
            }

            showToast(`تم الشراء! المجموع: ${total.toFixed(2)} ريال`, 'success');
            cart = [];
            updateCartDisplay();
        });

        function updateCartDisplay() {
            if (!cartItemsEl) return;
            
            if (cart.length === 0) {
                cartItemsEl.innerHTML = 'السلة فارغة';
                return;
            }

            cartItemsEl.innerHTML = cart.map(p => `
                <div class="cart-item">
                    <span>${p.name}</span>
                    <span>${p.price} ريال</span>
                </div>
            `).join('');
        }

        function getProductData(card) {
            return {
                id: card.dataset.productId,
                name: card.dataset.productName,
                price: parseFloat(card.dataset.price),
                category: card.dataset.category
            };
        }
    }

    // Setup custom events
    function setupCustomEvents() {
        document.getElementById('track-signup')?.addEventListener('click', () => {
            const eventData = { 
                event_name: 'user_signup', 
                properties: { source: 'landing_page', plan: 'free' } 
            };
            logEvent('custom_event', eventData, 'click');
            window.analytics?.track('user_signup', eventData.properties);
            showToast('تم تتبع: تسجيل مستخدم', 'info');
        });

        document.getElementById('track-search')?.addEventListener('click', () => {
            const eventData = { 
                event_name: 'search', 
                properties: { query: 'test query', results: 10 } 
            };
            logEvent('custom_event', eventData, 'click');
            window.analytics?.track('search', eventData.properties);
            showToast('تم تتبع: بحث', 'info');
        });

        document.getElementById('track-share')?.addEventListener('click', () => {
            const eventData = { 
                event_name: 'content_share', 
                properties: { platform: 'twitter', content_id: '123' } 
            };
            logEvent('custom_event', eventData, 'click');
            window.analytics?.track('content_share', eventData.properties);
            showToast('تم تتبع: مشاركة', 'info');
        });

        document.getElementById('track-error')?.addEventListener('click', () => {
            const eventData = { 
                event_name: 'error', 
                properties: { type: 'validation', message: 'Invalid input' } 
            };
            logEvent('custom_event', eventData, 'click');
            window.analytics?.track('error', eventData.properties);
            showToast('تم تتبع: خطأ', 'error');
        });

        // Checkout steps
        const stepNames = ['السلة', 'الشحن', 'الدفع', 'التأكيد'];
        [1, 2, 3, 4].forEach(step => {
            document.getElementById(`checkout-step-${step}`)?.addEventListener('click', () => {
                const stepName = stepNames[step - 1];
                logEvent('checkout_step', { step, step_name: stepName }, 'ecommerce');
                window.analytics?.trackCheckoutStep(step, stepName);
                showToast(`تم تتبع خطوة الشراء: ${stepName}`, 'info');
            });
        });
    }

    // Intercept analytics events for display
    function interceptAnalyticsEvents() {
        // Override console.log to catch analytics debug messages
        const originalLog = console.log;
        console.log = function(...args) {
            if (args[0] === '[Analytics]') {
                const eventType = args[1];
                const eventData = args[2];
                
                if (eventType === 'Event:' && eventData) {
                    // Already handled by our own logging
                }
                
                // Update connection status on successful events
                updateConnectionStatus(true);
            }
            originalLog.apply(console, args);
        };

        // Log page load event
        setTimeout(() => {
            logEvent('page_load', { 
                url: window.location.href,
                title: document.title
            }, 'page_load');
        }, 100);
    }

    // Log event to display panel
    function logEvent(type, data, category = 'default') {
        eventsCount++;
        updateEventsCount();

        const time = new Date().toLocaleTimeString('ar-SA');
        const eventItem = document.createElement('div');
        eventItem.className = `event-item ${category}`;
        eventItem.innerHTML = `
            <div class="event-time">${time}</div>
            <div class="event-type">${type}</div>
            <div class="event-data">${JSON.stringify(data).substring(0, 100)}...</div>
        `;

        if (eventsLog) {
            eventsLog.insertBefore(eventItem, eventsLog.firstChild);
            
            // Keep only last 50 events in display
            while (eventsLog.children.length > 50) {
                eventsLog.removeChild(eventsLog.lastChild);
            }
        }
    }

    // Update interaction stats display
    function updateInteractionStats() {
        const clickCountEl = document.getElementById('click-count');
        const scrollDepthEl = document.getElementById('scroll-depth');
        const mouseMovesEl = document.getElementById('mouse-moves');

        if (clickCountEl) clickCountEl.textContent = clickCount;
        if (scrollDepthEl) scrollDepthEl.textContent = `${maxScrollDepth}%`;
        if (mouseMovesEl) mouseMovesEl.textContent = mouseMoves;
    }

    // Update events count
    function updateEventsCount() {
        if (eventsCountEl) {
            eventsCountEl.textContent = `الأحداث: ${eventsCount}`;
        }
    }

    // Update connection status
    function updateConnectionStatus(isConnected) {
        if (connectionStatus) {
            connectionStatus.className = `status ${isConnected ? 'connected' : 'disconnected'}`;
            connectionStatus.textContent = isConnected ? 'متصل' : 'غير متصل';
        }
    }

    // Start time counter
    function startTimeCounter() {
        const timeEl = document.getElementById('time-on-page');
        
        setInterval(() => {
            const seconds = Math.floor((Date.now() - pageStartTime) / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            
            if (timeEl) {
                if (minutes > 0) {
                    timeEl.textContent = `${minutes} دقيقة ${remainingSeconds} ثانية`;
                } else {
                    timeEl.textContent = `${seconds} ثانية`;
                }
            }
        }, 1000);
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

})();
