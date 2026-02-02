-- =====================================================
-- SAMPLE DATA FOR 3 DIFFERENT WEBSITE TYPES
-- =====================================================
-- User 1: E-commerce Store (TechStore)
-- User 2: Blog/Content Site (DevBlog)
-- User 3: SaaS Application (CloudApp)
-- =====================================================

-- =====================================================
-- 1. USERS DATA (for MySQL - Laravel)
-- =====================================================
-- Note: Run these in MySQL database

-- User 1: E-commerce
-- INSERT INTO users (id, name, email, password, company_name, is_active, created_at, updated_at) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', 'Ahmed Hassan', 'ahmed@techstore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TechStore', 1, NOW(), NOW());

-- User 2: Blog
-- INSERT INTO users (id, name, email, password, company_name, is_active, created_at, updated_at) VALUES
-- ('550e8400-e29b-41d4-a716-446655440002', 'Sara Ali', 'sara@devblog.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DevBlog', 1, NOW(), NOW());

-- User 3: SaaS
-- INSERT INTO users (id, name, email, password, company_name, is_active, created_at, updated_at) VALUES
-- ('550e8400-e29b-41d4-a716-446655440003', 'Omar Khalid', 'omar@cloudapp.io', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CloudApp', 1, NOW(), NOW());

-- =====================================================
-- 2. CLICKHOUSE SAMPLE DATA
-- =====================================================

-- Clear existing sample data (optional)
-- ALTER TABLE sessions DELETE WHERE tracking_id IN ('track_techstore_001', 'track_devblog_002', 'track_cloudapp_003');
-- ALTER TABLE page_events DELETE WHERE tracking_id IN ('track_techstore_001', 'track_devblog_002', 'track_cloudapp_003');
-- ALTER TABLE ecommerce_events DELETE WHERE tracking_id IN ('track_techstore_001', 'track_devblog_002', 'track_cloudapp_003');
-- ALTER TABLE form_events DELETE WHERE tracking_id IN ('track_techstore_001', 'track_devblog_002', 'track_cloudapp_003');
-- ALTER TABLE interaction_events DELETE WHERE tracking_id IN ('track_techstore_001', 'track_devblog_002', 'track_cloudapp_003');

-- =====================================================
-- USER 1: TECHSTORE (E-COMMERCE)
-- tracking_id: track_techstore_001
-- =====================================================

-- Sessions for TechStore (last 7 days)
INSERT INTO sessions (session_id, user_id, tracking_id, start_time, end_time, device_type, operating_system, browser, screen_width, screen_height, viewport_width, viewport_height, country, country_code, language, timezone, referrer, entry_page, exit_page, duration_ms, bounce, page_views, created_at)
VALUES
    ('sess_ts_001', 'user_ts_001', 'track_techstore_001', now() - INTERVAL 1 DAY, now() - INTERVAL 1 DAY + INTERVAL 15 MINUTE, 'Desktop', 'Windows 11', 'Chrome', 1920, 1080, 1920, 937, 'Saudi Arabia', 'SA', 'ar', 'Asia/Riyadh', 'https://google.com', '/', '/checkout/success', 900000, 0, 8, now()),
    ('sess_ts_002', 'user_ts_002', 'track_techstore_001', now() - INTERVAL 1 DAY, now() - INTERVAL 1 DAY + INTERVAL 5 MINUTE, 'Mobile', 'iOS 17', 'Safari', 390, 844, 390, 664, 'UAE', 'AE', 'en', 'Asia/Dubai', 'https://instagram.com', '/products/iphone', '/products/iphone', 300000, 1, 1, now()),
    ('sess_ts_003', 'user_ts_003', 'track_techstore_001', now() - INTERVAL 2 DAY, now() - INTERVAL 2 DAY + INTERVAL 20 MINUTE, 'Desktop', 'macOS', 'Safari', 2560, 1440, 1440, 900, 'USA', 'US', 'en', 'America/New_York', '', '/', '/cart', 1200000, 0, 12, now()),
    ('sess_ts_004', 'user_ts_004', 'track_techstore_001', now() - INTERVAL 2 DAY, now() - INTERVAL 2 DAY + INTERVAL 8 MINUTE, 'Mobile', 'Android 14', 'Chrome', 412, 915, 412, 732, 'Germany', 'DE', 'de', 'Europe/Berlin', 'https://facebook.com', '/products', '/products/laptop', 480000, 0, 4, now()),
    ('sess_ts_005', 'user_ts_005', 'track_techstore_001', now() - INTERVAL 3 DAY, now() - INTERVAL 3 DAY + INTERVAL 25 MINUTE, 'Desktop', 'Windows 10', 'Edge', 1366, 768, 1366, 625, 'UK', 'GB', 'en', 'Europe/London', 'https://twitter.com', '/sale', '/checkout/success', 1500000, 0, 15, now()),
    ('sess_ts_006', 'user_ts_006', 'track_techstore_001', now() - INTERVAL 3 DAY, now() - INTERVAL 3 DAY + INTERVAL 2 MINUTE, 'Tablet', 'iPadOS', 'Safari', 1024, 1366, 1024, 1292, 'Saudi Arabia', 'SA', 'ar', 'Asia/Riyadh', '', '/products/accessories', '/products/accessories', 120000, 1, 1, now()),
    ('sess_ts_007', 'user_ts_007', 'track_techstore_001', now() - INTERVAL 4 DAY, now() - INTERVAL 4 DAY + INTERVAL 12 MINUTE, 'Desktop', 'Windows 11', 'Firefox', 1920, 1080, 1903, 937, 'Egypt', 'EG', 'ar', 'Africa/Cairo', 'https://google.com', '/categories/phones', '/checkout/payment', 720000, 0, 7, now()),
    ('sess_ts_008', 'user_ts_008', 'track_techstore_001', now() - INTERVAL 5 DAY, now() - INTERVAL 5 DAY + INTERVAL 18 MINUTE, 'Mobile', 'iOS 16', 'Safari', 375, 812, 375, 635, 'Jordan', 'JO', 'ar', 'Asia/Amman', '', '/', '/account/orders', 1080000, 0, 9, now()),
    ('sess_ts_009', 'user_ts_009', 'track_techstore_001', now() - INTERVAL 6 DAY, now() - INTERVAL 6 DAY + INTERVAL 30 MINUTE, 'Desktop', 'macOS', 'Chrome', 1440, 900, 1440, 789, 'Kuwait', 'KW', 'ar', 'Asia/Kuwait', 'https://google.com', '/products/gaming', '/checkout/success', 1800000, 0, 18, now()),
    ('sess_ts_010', 'user_ts_010', 'track_techstore_001', now() - INTERVAL 7 DAY, now() - INTERVAL 7 DAY + INTERVAL 6 MINUTE, 'Mobile', 'Android 13', 'Chrome', 393, 873, 393, 718, 'Bahrain', 'BH', 'ar', 'Asia/Bahrain', 'https://tiktok.com', '/products/headphones', '/products/headphones', 360000, 0, 3, now());

-- Page Events for TechStore
INSERT INTO page_events (timestamp, session_id, user_id, tracking_id, event_type, page_url, page_title, referrer, duration_ms, scroll_depth_max, click_count, dns_time, connect_time, response_time, dom_load_time, page_load_time, connection_type, connection_downlink, connection_rtt, save_data)
VALUES
    (now() - INTERVAL 1 DAY, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'page_view', '/', 'TechStore - Home', 'https://google.com', 45000, 85, 12, 5, 20, 150, 800, 1200, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 1 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'page_view', '/products', 'All Products', '/', 60000, 92, 8, 3, 15, 120, 600, 950, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 3 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'page_view', '/products/iphone-15-pro', 'iPhone 15 Pro', '/products', 120000, 100, 15, 3, 12, 100, 500, 800, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 6 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'page_view', '/cart', 'Shopping Cart', '/products/iphone-15-pro', 30000, 100, 5, 3, 10, 80, 400, 650, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 8 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'page_view', '/checkout', 'Checkout', '/cart', 180000, 100, 20, 3, 10, 90, 450, 700, '4g', 10, 50, 0),
    (now() - INTERVAL 2 DAY, 'sess_ts_003', 'user_ts_003', 'track_techstore_001', 'page_view', '/', 'TechStore - Home', '', 30000, 75, 6, 8, 25, 200, 1000, 1500, '4g', 5, 100, 0),
    (now() - INTERVAL 2 DAY + INTERVAL 2 MINUTE, 'sess_ts_003', 'user_ts_003', 'track_techstore_001', 'page_view', '/categories/laptops', 'Laptops', '/', 90000, 88, 10, 5, 18, 150, 750, 1100, '4g', 5, 100, 0),
    (now() - INTERVAL 3 DAY, 'sess_ts_005', 'user_ts_005', 'track_techstore_001', 'page_view', '/sale', 'Special Sale', 'https://twitter.com', 45000, 95, 18, 4, 15, 130, 650, 1000, '4g', 8, 60, 0);

-- E-commerce Events for TechStore
INSERT INTO ecommerce_events (timestamp, session_id, user_id, tracking_id, page_url, event_type, product_id, product_name, price, quantity, category, currency, order_id, total, step, step_name)
VALUES
    -- Session 1: Full purchase flow
    (now() - INTERVAL 1 DAY + INTERVAL 3 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', '/products/iphone-15-pro', 'product_view', 'PROD_001', 'iPhone 15 Pro 256GB', 4999, 1, 'Phones', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 5 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', '/products/iphone-15-pro', 'cart_add', 'PROD_001', 'iPhone 15 Pro 256GB', 4999, 1, 'Phones', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 6 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', '/cart', 'cart_add', 'PROD_010', 'AirPods Pro 2', 999, 1, 'Accessories', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 8 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', '/checkout', 'checkout_step', NULL, NULL, NULL, NULL, NULL, 'SAR', NULL, 5998, 1, 'shipping'),
    (now() - INTERVAL 1 DAY + INTERVAL 10 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', '/checkout', 'checkout_step', NULL, NULL, NULL, NULL, NULL, 'SAR', NULL, 5998, 2, 'payment'),
    (now() - INTERVAL 1 DAY + INTERVAL 12 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', '/checkout/success', 'purchase', NULL, NULL, NULL, NULL, NULL, 'SAR', 'ORD_TS_001', 5998, NULL, NULL),
    
    -- Session 3: Browse and add to cart
    (now() - INTERVAL 2 DAY + INTERVAL 5 MINUTE, 'sess_ts_003', 'user_ts_003', 'track_techstore_001', '/products/macbook-pro', 'product_view', 'PROD_002', 'MacBook Pro 14"', 8999, 1, 'Laptops', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 2 DAY + INTERVAL 8 MINUTE, 'sess_ts_003', 'user_ts_003', 'track_techstore_001', '/products/macbook-pro', 'cart_add', 'PROD_002', 'MacBook Pro 14"', 8999, 1, 'Laptops', 'SAR', NULL, NULL, NULL, NULL),
    
    -- Session 5: Full purchase
    (now() - INTERVAL 3 DAY + INTERVAL 10 MINUTE, 'sess_ts_005', 'user_ts_005', 'track_techstore_001', '/sale', 'product_view', 'PROD_003', 'Samsung Galaxy S24', 3499, 1, 'Phones', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 3 DAY + INTERVAL 12 MINUTE, 'sess_ts_005', 'user_ts_005', 'track_techstore_001', '/sale', 'cart_add', 'PROD_003', 'Samsung Galaxy S24', 3499, 2, 'Phones', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 3 DAY + INTERVAL 20 MINUTE, 'sess_ts_005', 'user_ts_005', 'track_techstore_001', '/checkout/success', 'purchase', NULL, NULL, NULL, NULL, NULL, 'SAR', 'ORD_TS_002', 6998, NULL, NULL),
    
    -- Session 9: High value purchase
    (now() - INTERVAL 6 DAY + INTERVAL 15 MINUTE, 'sess_ts_009', 'user_ts_009', 'track_techstore_001', '/products/gaming-pc', 'product_view', 'PROD_004', 'Gaming PC RTX 4090', 15999, 1, 'Gaming', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 6 DAY + INTERVAL 18 MINUTE, 'sess_ts_009', 'user_ts_009', 'track_techstore_001', '/products/gaming-pc', 'cart_add', 'PROD_004', 'Gaming PC RTX 4090', 15999, 1, 'Gaming', 'SAR', NULL, NULL, NULL, NULL),
    (now() - INTERVAL 6 DAY + INTERVAL 25 MINUTE, 'sess_ts_009', 'user_ts_009', 'track_techstore_001', '/checkout/success', 'purchase', NULL, NULL, NULL, NULL, NULL, 'SAR', 'ORD_TS_003', 15999, NULL, NULL);

-- Interaction Events for TechStore
INSERT INTO interaction_events (timestamp, session_id, user_id, tracking_id, event_type, page_url, x, y, element, element_id, element_class, button_text, button_type, link_url, link_text, file_name, is_external, target)
VALUES
    (now() - INTERVAL 1 DAY + INTERVAL 1 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'click', '/', 450, 320, 'button', 'shop-now-btn', 'btn-primary', 'Shop Now', 'button', NULL, NULL, NULL, 0, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 2 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'click', '/products', 200, 450, 'a', 'prod-link-001', 'product-card', NULL, NULL, '/products/iphone-15-pro', 'iPhone 15 Pro', NULL, 0, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 5 MINUTE, 'sess_ts_001', 'user_ts_001', 'track_techstore_001', 'click', '/products/iphone-15-pro', 800, 600, 'button', 'add-to-cart', 'btn-cart', 'Add to Cart', 'button', NULL, NULL, NULL, 0, NULL);

-- =====================================================
-- USER 2: DEVBLOG (BLOG/CONTENT)
-- tracking_id: track_devblog_002
-- =====================================================

-- Sessions for DevBlog
INSERT INTO sessions (session_id, user_id, tracking_id, start_time, end_time, device_type, operating_system, browser, screen_width, screen_height, viewport_width, viewport_height, country, country_code, language, timezone, referrer, entry_page, exit_page, duration_ms, bounce, page_views, created_at)
VALUES
    ('sess_db_001', 'user_db_001', 'track_devblog_002', now() - INTERVAL 1 DAY, now() - INTERVAL 1 DAY + INTERVAL 8 MINUTE, 'Desktop', 'Windows 11', 'Chrome', 1920, 1080, 1920, 937, 'India', 'IN', 'en', 'Asia/Kolkata', 'https://google.com', '/blog/react-hooks-guide', '/blog/react-hooks-guide', 480000, 0, 1, now()),
    ('sess_db_002', 'user_db_002', 'track_devblog_002', now() - INTERVAL 1 DAY, now() - INTERVAL 1 DAY + INTERVAL 12 MINUTE, 'Desktop', 'macOS', 'Safari', 1440, 900, 1440, 789, 'USA', 'US', 'en', 'America/Los_Angeles', 'https://twitter.com', '/blog/typescript-best-practices', '/blog/nodejs-performance', 720000, 0, 3, now()),
    ('sess_db_003', 'user_db_003', 'track_devblog_002', now() - INTERVAL 2 DAY, now() - INTERVAL 2 DAY + INTERVAL 5 MINUTE, 'Mobile', 'iOS 17', 'Safari', 390, 844, 390, 664, 'UK', 'GB', 'en', 'Europe/London', 'https://linkedin.com', '/blog/docker-tutorial', '/blog/docker-tutorial', 300000, 0, 1, now()),
    ('sess_db_004', 'user_db_004', 'track_devblog_002', now() - INTERVAL 2 DAY, now() - INTERVAL 2 DAY + INTERVAL 15 MINUTE, 'Desktop', 'Linux', 'Firefox', 1920, 1080, 1903, 937, 'Germany', 'DE', 'de', 'Europe/Berlin', 'https://news.ycombinator.com', '/', '/blog/rust-for-beginners', 900000, 0, 5, now()),
    ('sess_db_005', 'user_db_005', 'track_devblog_002', now() - INTERVAL 3 DAY, now() - INTERVAL 3 DAY + INTERVAL 20 MINUTE, 'Desktop', 'Windows 10', 'Chrome', 1366, 768, 1366, 625, 'Brazil', 'BR', 'pt', 'America/Sao_Paulo', 'https://google.com', '/blog/python-async', '/blog/python-async', 1200000, 0, 1, now()),
    ('sess_db_006', 'user_db_006', 'track_devblog_002', now() - INTERVAL 4 DAY, now() - INTERVAL 4 DAY + INTERVAL 6 MINUTE, 'Tablet', 'iPadOS', 'Safari', 1024, 1366, 1024, 1292, 'Canada', 'CA', 'en', 'America/Toronto', '', '/tutorials', '/tutorials/git-basics', 360000, 0, 2, now()),
    ('sess_db_007', 'user_db_007', 'track_devblog_002', now() - INTERVAL 5 DAY, now() - INTERVAL 5 DAY + INTERVAL 25 MINUTE, 'Desktop', 'macOS', 'Chrome', 2560, 1440, 1440, 900, 'Australia', 'AU', 'en', 'Australia/Sydney', 'https://reddit.com/r/programming', '/blog/kubernetes-101', '/contact', 1500000, 0, 8, now()),
    ('sess_db_008', 'user_db_008', 'track_devblog_002', now() - INTERVAL 6 DAY, now() - INTERVAL 6 DAY + INTERVAL 10 MINUTE, 'Mobile', 'Android 14', 'Chrome', 412, 915, 412, 732, 'Japan', 'JP', 'ja', 'Asia/Tokyo', 'https://google.com', '/blog/vue-composition-api', '/blog/vue-composition-api', 600000, 0, 1, now());

-- Page Events for DevBlog (with high scroll depth for reading)
INSERT INTO page_events (timestamp, session_id, user_id, tracking_id, event_type, page_url, page_title, referrer, duration_ms, scroll_depth_max, click_count, dns_time, connect_time, response_time, dom_load_time, page_load_time, connection_type, connection_downlink, connection_rtt, save_data)
VALUES
    (now() - INTERVAL 1 DAY, 'sess_db_001', 'user_db_001', 'track_devblog_002', 'page_view', '/blog/react-hooks-guide', 'Complete Guide to React Hooks', 'https://google.com', 480000, 95, 3, 5, 15, 100, 500, 800, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY, 'sess_db_002', 'user_db_002', 'track_devblog_002', 'page_view', '/blog/typescript-best-practices', 'TypeScript Best Practices 2024', 'https://twitter.com', 360000, 88, 5, 4, 12, 90, 450, 700, '4g', 8, 60, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 6 MINUTE, 'sess_db_002', 'user_db_002', 'track_devblog_002', 'page_view', '/blog/nodejs-performance', 'Node.js Performance Tips', '/blog/typescript-best-practices', 360000, 92, 4, 3, 10, 80, 400, 650, '4g', 8, 60, 0),
    (now() - INTERVAL 2 DAY, 'sess_db_003', 'user_db_003', 'track_devblog_002', 'page_view', '/blog/docker-tutorial', 'Docker from Zero to Hero', 'https://linkedin.com', 300000, 75, 2, 8, 25, 200, 900, 1400, '3g', 2, 150, 0),
    (now() - INTERVAL 2 DAY, 'sess_db_004', 'user_db_004', 'track_devblog_002', 'page_view', '/', 'DevBlog - Web Development Tutorials', 'https://news.ycombinator.com', 60000, 70, 8, 3, 10, 80, 400, 600, '4g', 15, 40, 0),
    (now() - INTERVAL 2 DAY + INTERVAL 2 MINUTE, 'sess_db_004', 'user_db_004', 'track_devblog_002', 'page_view', '/blog/rust-for-beginners', 'Rust Programming for Beginners', '/', 540000, 100, 6, 3, 10, 75, 380, 580, '4g', 15, 40, 0),
    (now() - INTERVAL 3 DAY, 'sess_db_005', 'user_db_005', 'track_devblog_002', 'page_view', '/blog/python-async', 'Async Python: A Complete Guide', 'https://google.com', 1200000, 100, 10, 6, 18, 120, 600, 950, '4g', 5, 80, 0),
    (now() - INTERVAL 5 DAY, 'sess_db_007', 'user_db_007', 'track_devblog_002', 'page_view', '/blog/kubernetes-101', 'Kubernetes 101: Getting Started', 'https://reddit.com/r/programming', 600000, 98, 12, 4, 14, 95, 480, 750, '4g', 12, 45, 0);

-- Scroll Events for DevBlog (reading behavior)
INSERT INTO scroll_events (timestamp, session_id, user_id, tracking_id, page_url, event_type, depth_percent, scroll_top, scroll_percent)
VALUES
    (now() - INTERVAL 1 DAY + INTERVAL 1 MINUTE, 'sess_db_001', 'user_db_001', 'track_devblog_002', '/blog/react-hooks-guide', 'scroll_depth', 25, 800, 25),
    (now() - INTERVAL 1 DAY + INTERVAL 3 MINUTE, 'sess_db_001', 'user_db_001', 'track_devblog_002', '/blog/react-hooks-guide', 'scroll_depth', 50, 1600, 50),
    (now() - INTERVAL 1 DAY + INTERVAL 5 MINUTE, 'sess_db_001', 'user_db_001', 'track_devblog_002', '/blog/react-hooks-guide', 'scroll_depth', 75, 2400, 75),
    (now() - INTERVAL 1 DAY + INTERVAL 7 MINUTE, 'sess_db_001', 'user_db_001', 'track_devblog_002', '/blog/react-hooks-guide', 'scroll_depth', 95, 3040, 95),
    (now() - INTERVAL 3 DAY + INTERVAL 5 MINUTE, 'sess_db_005', 'user_db_005', 'track_devblog_002', '/blog/python-async', 'scroll_depth', 25, 600, 25),
    (now() - INTERVAL 3 DAY + INTERVAL 10 MINUTE, 'sess_db_005', 'user_db_005', 'track_devblog_002', '/blog/python-async', 'scroll_depth', 50, 1200, 50),
    (now() - INTERVAL 3 DAY + INTERVAL 15 MINUTE, 'sess_db_005', 'user_db_005', 'track_devblog_002', '/blog/python-async', 'scroll_depth', 75, 1800, 75),
    (now() - INTERVAL 3 DAY + INTERVAL 18 MINUTE, 'sess_db_005', 'user_db_005', 'track_devblog_002', '/blog/python-async', 'scroll_depth', 100, 2400, 100);

-- =====================================================
-- USER 3: CLOUDAPP (SAAS)
-- tracking_id: track_cloudapp_003
-- =====================================================

-- Sessions for CloudApp
INSERT INTO sessions (session_id, user_id, tracking_id, start_time, end_time, device_type, operating_system, browser, screen_width, screen_height, viewport_width, viewport_height, country, country_code, language, timezone, referrer, entry_page, exit_page, duration_ms, bounce, page_views, created_at)
VALUES
    ('sess_ca_001', 'user_ca_001', 'track_cloudapp_003', now() - INTERVAL 1 DAY, now() - INTERVAL 1 DAY + INTERVAL 30 MINUTE, 'Desktop', 'Windows 11', 'Chrome', 1920, 1080, 1920, 937, 'USA', 'US', 'en', 'America/New_York', 'https://google.com', '/', '/app/dashboard', 1800000, 0, 12, now()),
    ('sess_ca_002', 'user_ca_002', 'track_cloudapp_003', now() - INTERVAL 1 DAY, now() - INTERVAL 1 DAY + INTERVAL 45 MINUTE, 'Desktop', 'macOS', 'Safari', 2560, 1440, 1440, 900, 'UK', 'GB', 'en', 'Europe/London', '', '/app/dashboard', '/app/settings', 2700000, 0, 25, now()),
    ('sess_ca_003', 'user_ca_003', 'track_cloudapp_003', now() - INTERVAL 2 DAY, now() - INTERVAL 2 DAY + INTERVAL 15 MINUTE, 'Desktop', 'Windows 10', 'Edge', 1366, 768, 1366, 625, 'Germany', 'DE', 'de', 'Europe/Berlin', 'https://linkedin.com', '/pricing', '/signup', 900000, 0, 5, now()),
    ('sess_ca_004', 'user_ca_004', 'track_cloudapp_003', now() - INTERVAL 2 DAY, now() - INTERVAL 2 DAY + INTERVAL 60 MINUTE, 'Desktop', 'Linux', 'Firefox', 1920, 1080, 1903, 937, 'Canada', 'CA', 'en', 'America/Toronto', '', '/app/analytics', '/app/reports', 3600000, 0, 35, now()),
    ('sess_ca_005', 'user_ca_005', 'track_cloudapp_003', now() - INTERVAL 3 DAY, now() - INTERVAL 3 DAY + INTERVAL 10 MINUTE, 'Mobile', 'iOS 17', 'Safari', 390, 844, 390, 664, 'Australia', 'AU', 'en', 'Australia/Sydney', 'https://twitter.com', '/', '/signup', 600000, 0, 4, now()),
    ('sess_ca_006', 'user_ca_006', 'track_cloudapp_003', now() - INTERVAL 4 DAY, now() - INTERVAL 4 DAY + INTERVAL 20 MINUTE, 'Desktop', 'macOS', 'Chrome', 1440, 900, 1440, 789, 'France', 'FR', 'fr', 'Europe/Paris', 'https://producthunt.com', '/features', '/pricing', 1200000, 0, 8, now()),
    ('sess_ca_007', 'user_ca_007', 'track_cloudapp_003', now() - INTERVAL 5 DAY, now() - INTERVAL 5 DAY + INTERVAL 90 MINUTE, 'Desktop', 'Windows 11', 'Chrome', 1920, 1080, 1920, 937, 'Netherlands', 'NL', 'nl', 'Europe/Amsterdam', '', '/app/dashboard', '/app/integrations', 5400000, 0, 50, now()),
    ('sess_ca_008', 'user_ca_008', 'track_cloudapp_003', now() - INTERVAL 6 DAY, now() - INTERVAL 6 DAY + INTERVAL 5 MINUTE, 'Tablet', 'iPadOS', 'Safari', 1024, 1366, 1024, 1292, 'Japan', 'JP', 'ja', 'Asia/Tokyo', 'https://google.com', '/', '/features', 300000, 0, 3, now());

-- Page Events for CloudApp (SaaS app usage)
INSERT INTO page_events (timestamp, session_id, user_id, tracking_id, event_type, page_url, page_title, referrer, duration_ms, scroll_depth_max, click_count, dns_time, connect_time, response_time, dom_load_time, page_load_time, connection_type, connection_downlink, connection_rtt, save_data)
VALUES
    (now() - INTERVAL 1 DAY, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', 'page_view', '/', 'CloudApp - Cloud Management Platform', 'https://google.com', 30000, 80, 5, 5, 15, 100, 500, 800, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 1 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', 'page_view', '/pricing', 'Pricing Plans', '/', 120000, 100, 8, 3, 10, 80, 400, 650, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 5 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', 'page_view', '/signup', 'Create Account', '/pricing', 180000, 100, 15, 3, 10, 75, 380, 600, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 10 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', 'page_view', '/app/dashboard', 'Dashboard', '/signup', 300000, 90, 25, 3, 8, 60, 300, 500, '4g', 10, 50, 0),
    (now() - INTERVAL 1 DAY, 'sess_ca_002', 'user_ca_002', 'track_cloudapp_003', 'page_view', '/app/dashboard', 'Dashboard', '', 600000, 95, 40, 4, 10, 70, 350, 550, '4g', 8, 60, 0),
    (now() - INTERVAL 1 DAY + INTERVAL 15 MINUTE, 'sess_ca_002', 'user_ca_002', 'track_cloudapp_003', 'page_view', '/app/analytics', 'Analytics', '/app/dashboard', 900000, 100, 35, 3, 8, 65, 320, 520, '4g', 8, 60, 0),
    (now() - INTERVAL 2 DAY, 'sess_ca_003', 'user_ca_003', 'track_cloudapp_003', 'page_view', '/pricing', 'Pricing Plans', 'https://linkedin.com', 180000, 100, 12, 6, 18, 120, 600, 950, '4g', 5, 80, 0),
    (now() - INTERVAL 2 DAY + INTERVAL 5 MINUTE, 'sess_ca_003', 'user_ca_003', 'track_cloudapp_003', 'page_view', '/signup', 'Create Account', '/pricing', 420000, 100, 20, 5, 15, 100, 500, 800, '4g', 5, 80, 0);

-- Form Events for CloudApp (signups)
INSERT INTO form_events (timestamp, session_id, user_id, tracking_id, page_url, event_type, form_id, form_name, form_action, form_method, field_name, field_type, field_count, value_length, has_file_upload, success)
VALUES
    (now() - INTERVAL 1 DAY + INTERVAL 5 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/signup', 'form_focus', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'email', 'email', 5, 0, 0, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 6 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/signup', 'form_input', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'email', 'email', 5, 25, 0, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 7 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/signup', 'form_input', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'password', 'password', 5, 12, 0, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 8 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/signup', 'form_input', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'company', 'text', 5, 18, 0, NULL),
    (now() - INTERVAL 1 DAY + INTERVAL 9 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/signup', 'form_submit', 'signup-form', 'Signup Form', '/api/signup', 'POST', NULL, NULL, 5, NULL, 0, 1),
    
    (now() - INTERVAL 2 DAY + INTERVAL 8 MINUTE, 'sess_ca_003', 'user_ca_003', 'track_cloudapp_003', '/signup', 'form_focus', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'email', 'email', 5, 0, 0, NULL),
    (now() - INTERVAL 2 DAY + INTERVAL 10 MINUTE, 'sess_ca_003', 'user_ca_003', 'track_cloudapp_003', '/signup', 'form_input', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'email', 'email', 5, 22, 0, NULL),
    (now() - INTERVAL 2 DAY + INTERVAL 12 MINUTE, 'sess_ca_003', 'user_ca_003', 'track_cloudapp_003', '/signup', 'form_submit', 'signup-form', 'Signup Form', '/api/signup', 'POST', NULL, NULL, 5, NULL, 0, 1),
    
    (now() - INTERVAL 3 DAY + INTERVAL 8 MINUTE, 'sess_ca_005', 'user_ca_005', 'track_cloudapp_003', '/signup', 'form_focus', 'signup-form', 'Signup Form', '/api/signup', 'POST', 'email', 'email', 5, 0, 0, NULL),
    (now() - INTERVAL 3 DAY + INTERVAL 9 MINUTE, 'sess_ca_005', 'user_ca_005', 'track_cloudapp_003', '/signup', 'form_submit', 'signup-form', 'Signup Form', '/api/signup', 'POST', NULL, NULL, 5, NULL, 0, 1);

-- Custom Events for CloudApp (feature usage)
INSERT INTO custom_events (timestamp, session_id, user_id, tracking_id, page_url, event_name, properties)
VALUES
    (now() - INTERVAL 1 DAY + INTERVAL 15 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/app/dashboard', 'feature_used', '{"feature": "dashboard_view", "duration": 300}'),
    (now() - INTERVAL 1 DAY + INTERVAL 20 MINUTE, 'sess_ca_001', 'user_ca_001', 'track_cloudapp_003', '/app/dashboard', 'feature_used', '{"feature": "create_project", "project_type": "web"}'),
    (now() - INTERVAL 1 DAY + INTERVAL 25 MINUTE, 'sess_ca_002', 'user_ca_002', 'track_cloudapp_003', '/app/analytics', 'feature_used', '{"feature": "analytics_export", "format": "csv"}'),
    (now() - INTERVAL 1 DAY + INTERVAL 30 MINUTE, 'sess_ca_002', 'user_ca_002', 'track_cloudapp_003', '/app/analytics', 'feature_used', '{"feature": "custom_report", "metrics": 5}'),
    (now() - INTERVAL 2 DAY + INTERVAL 30 MINUTE, 'sess_ca_004', 'user_ca_004', 'track_cloudapp_003', '/app/analytics', 'feature_used', '{"feature": "api_usage", "calls": 150}'),
    (now() - INTERVAL 2 DAY + INTERVAL 45 MINUTE, 'sess_ca_004', 'user_ca_004', 'track_cloudapp_003', '/app/reports', 'feature_used', '{"feature": "scheduled_report", "frequency": "weekly"}'),
    (now() - INTERVAL 5 DAY + INTERVAL 30 MINUTE, 'sess_ca_007', 'user_ca_007', 'track_cloudapp_003', '/app/integrations', 'feature_used', '{"feature": "integration_added", "type": "slack"}'),
    (now() - INTERVAL 5 DAY + INTERVAL 60 MINUTE, 'sess_ca_007', 'user_ca_007', 'track_cloudapp_003', '/app/integrations', 'feature_used', '{"feature": "integration_added", "type": "github"}');

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================
-- TechStore (E-commerce):
--   - 10 sessions
--   - 3 purchases totaling 28,995 SAR
--   - Products: iPhone 15 Pro, AirPods, Samsung Galaxy, Gaming PC
--   - Countries: SA, AE, US, DE, UK, EG, JO, KW, BH
--   - Devices: Desktop 50%, Mobile 30%, Tablet 20%

-- DevBlog (Blog):
--   - 8 sessions
--   - High scroll depth (75-100%)
--   - Long read times (5-20 minutes)
--   - Top articles: React Hooks, TypeScript, Python Async
--   - Countries: IN, US, UK, DE, BR, CA, AU, JP
--   - Traffic sources: Google, Twitter, LinkedIn, HackerNews, Reddit

-- CloudApp (SaaS):
--   - 8 sessions
--   - 3 new signups
--   - Feature usage tracked: Dashboard, Analytics, Reports, Integrations
--   - Countries: US, UK, DE, CA, AU, FR, NL, JP
--   - Long session durations (15-90 minutes)
-- =====================================================
