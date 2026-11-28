/* =========================================================
   ملف Service Worker — sw.js
   وظيفته: حفظ ملفات التطبيق الأساسية على جهاز المستخدم (Cache)
   لكي يصبح الموقع قابلاً للتثبيت كتطبيق (PWA) ويعمل بسرعة
   وحتى بدون إنترنت للأذكار والمسبحة والأسماء الحسنى.
   ========================================================= */

// اسم الكاش (نغيّر الرقم عند تحديث ملفات الموقع لتجديد الكاش)
const CACHE_NAME = "rawda-cache-v1";

// قائمة الملفات الأساسية التي تُحفظ على الجهاز فور تثبيت التطبيق
const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// 1) حدث التثبيت (install): فتح الكاش وحفظ الملفات الأساسية فيه
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  // تفعيل النسخة الجديدة فوراً دون انتظار إغلاق كل التبويبات
  self.skipWaiting();
});

// 2) حدث التفعيل (activate): حذف أي كاش قديم لتوفير المساحة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3) حدث جلب الملفات (fetch):
//    - لملفات الموقع نفسه: نجرّب الإنترنت أولاً (Network First) لتصل التحديثات،
//      وإذا انقطع الإنترنت نعرض النسخة المحفوظة في الكاش.
//    - للـ APIs الخارجية (القرآن والمواقيت): تذهب للإنترنت مباشرة.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isSameOrigin = new URL(req.url).origin === location.origin;
  if (!isSameOrigin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // تحديث النسخة المحفوظة في الكاش عند نجاح الاتصال
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
  );
});
