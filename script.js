/* =========================================================
   روضة — script.js
   كل منطق الموقع مكتوب بـ JavaScript صافي بدون أي مكتبات خارجية.
   تم تقسيم الكود إلى ١٢ قسماً منظماً مع شرح بسيط فوق كل جزء:

   1)  البيانات الثابتة (الآيات، الأحاديث، القُرّاء، المدن، الأذكار، أسماء الله)
   2)  حالة التطبيق والدوال المساعدة
   3)  الوضع الليلي والنهاري
   4)  الصفحة الرئيسية (التحية، التاريخ، آية وحديث اليوم)
   5)  القرآن الكريم (قائمة السور، البحث، قارئ المصحف، التلاوة الصوتية)
   6)  السور المفضلة
   7)  مواقيت الصلاة والعدّاد التنازلي
   8)  الأذكار والمسبحة الإلكترونية
   9)  أسماء الله الحسنى
   10) نظام التنقل بين الصفحات (Hash Router)
   11) تثبيت التطبيق على الموبايل (PWA & Service Worker)
   12) نقطة البداية (تشغيل التطبيق وربط الأزرار)
   ========================================================= */

/* ================= 1) البيانات الثابتة ================= */

// مصفوفة آيات اليوم (تتغير تلقائياً كل يوم)
const VERSES = [
  { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ref: "سورة الرعد: ٢٨" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح: ٥-٦" },
  { text: "هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ", ref: "سورة الفتح: ٤" },
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", ref: "سورة البقرة: ١٥٢" },
  { text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", ref: "سورة الطلاق: ٣" },
  { text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", ref: "سورة البقرة: ٢٨٦" },
  { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", ref: "سورة البقرة: ١٨٦" },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", ref: "سورة البقرة: ١٥٣" }
];

// مصفوفة أحاديث اليوم (أحاديث صحيحة ومختصرة)
const HADITHS = [
  { text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", ref: "متفق عليه" },
  { text: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", ref: "متفق عليه" },
  { text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", ref: "متفق عليه" },
  { text: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", ref: "متفق عليه" },
  { text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", ref: "رواه البخاري" },
  { text: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ", ref: "متفق عليه" },
  { text: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", ref: "رواه الترمذي" },
  { text: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", ref: "متفق عليه" },
  { text: "الطُّهُورُ شَطْرُ الْإِيمَانِ", ref: "رواه مسلم" },
  { text: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", ref: "رواه مسلم" }
];

// قائمة القرّاء للتلاوة الصوتية (كل قارئ له معرّف وجودة صوت في Islamic Network CDN)
const RECITERS = [
  { id: "ar.alafasy", bitrate: 128, name: "مشاري العفاسي" },
  { id: "ar.abdulbasitmurattal", bitrate: 192, name: "عبد الباسط عبد الصمد" },
  { id: "ar.husary", bitrate: 128, name: "محمود خليل الحصري" },
  { id: "ar.minshawi", bitrate: 128, name: "محمد صديق المنشاوي" },
  { id: "ar.abdurrahmaansudais", bitrate: 192, name: "عبد الرحمن السديس" },
  { id: "ar.mahermuaiqly", bitrate: 128, name: "ماهر المعيقلي" },
  { id: "ar.hudhaify", bitrate: 128, name: "علي الحذيفي" },
  { id: "ar.ahmedajamy", bitrate: 128, name: "أحمد العجمي" }
];

// المدن المتاحة في صفحة مواقيت الصلاة:
// method = 5 تعني الهيئة المصرية العامة للمساحة، و method = 4 تعني تقويم أم القرى
const CITIES = [
  { city: "Zagazig", country: "Egypt", method: 5, name: "الزقازيق" },
  { city: "Cairo", country: "Egypt", method: 5, name: "القاهرة" },
  { city: "Alexandria", country: "Egypt", method: 5, name: "الإسكندرية" },
  { city: "Giza", country: "Egypt", method: 5, name: "الجيزة" },
  { city: "Mansoura", country: "Egypt", method: 5, name: "المنصورة" },
  { city: "Tanta", country: "Egypt", method: 5, name: "طنطا" },
  { city: "Aswan", country: "Egypt", method: 5, name: "أسوان" },
  { city: "Luxor", country: "Egypt", method: 5, name: "الأقصر" },
  { city: "Mecca", country: "Saudi Arabia", method: 4, name: "مكة المكرمة" },
  { city: "Medina", country: "Saudi Arabia", method: 4, name: "المدينة المنورة" }
];

// الصلوات الخمس مع أيقونة SVG لكل صلاة
const PRAYERS = [
  { key: "Fajr", name: "الفجر", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4v3M5 12h2M17 12h2M7.2 7.2l1.4 1.4M16.8 7.2l-1.4 1.4M7 16a5 5 0 0 1 10 0M3 19h18"/></svg>' },
  { key: "Dhuhr", name: "الظهر", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>' },
  { key: "Asr", name: "العصر", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4 12h2M18 12h2M6 6l1.5 1.5M16.5 16.5L18 18"/></svg>' },
  { key: "Maghrib", name: "المغرب", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 16a5 5 0 0 1 10 0M3 16h18M6 20h12M12 6v4"/></svg>' },
  { key: "Isha", name: "العشاء", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/><path d="M17.5 5v2M16.5 6h2"/></svg>' }
];
const PRAYER_NAMES = Object.fromEntries(PRAYERS.map((p) => [p.key, p.name]));

// أذكار المسبحة التي تتبدل تلقائياً كل ٣٣ تسبيحة
const TASBIH_PHRASES = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "اللَّهُ أَكْبَرُ"];

// الأذكار المشتركة بين الصباح والمساء (لتجنب تكرارها مرتين في الكود)
const COMMON_ADHKAR = [
  { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ (آية الكرسي)", count: 1 },
  { text: "قراءة سورة الإخلاص، وسورة الفلق، وسورة الناس", count: 3 },
  { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ (سيد الاستغفار)", count: 1 },
  { text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
  { text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
  { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 },
  { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ", count: 3 },
  { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", count: 1 },
  { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
  { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 },
  { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 }
];

// أذكار الصباح (١٤ ذكراً) وأذكار المساء (١٤ ذكراً)
const ADHKAR = {
  morning: [
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", count: 3 },
    ...COMMON_ADHKAR
  ],
  evening: [
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1 },
    { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
    ...COMMON_ADHKAR
  ]
};

// أسماء الله الحسنى التسعة والتسعون ومعانيها بالعربية: [الاسم، المعنى]
const NAMES_OF_ALLAH = [
  ["الرَّحْمَنُ", "واسع الرحمة بجميع خلقه في الدنيا"],
  ["الرَّحِيمُ", "ذو الرحمة الخاصة بالمؤمنين في الآخرة"],
  ["الْمَلِكُ", "المالك لكل شيء، المتصرف في ملكه بلا منازع"],
  ["الْقُدُّوسُ", "المنزّه عن كل نقص وعيب"],
  ["السَّلَامُ", "السالم من كل عيب، ومانح الأمان والسلام لخلقه"],
  ["الْمُؤْمِنُ", "المصدّق لرسله بالآيات، والواهب للأمن"],
  ["الْمُهَيْمِنُ", "الرقيب الحافظ الشاهد على كل شيء"],
  ["الْعَزِيزُ", "القوي الغالب الذي لا يُقهر"],
  ["الْجَبَّارُ", "الذي يجبر الكسير ويقهر الجبابرة بعظمته"],
  ["الْمُتَكَبِّرُ", "المتعالي عن صفات الخلق، صاحب الكبرياء والعظمة"],
  ["الْخَالِقُ", "المبدع للأشياء على غير مثال سابق"],
  ["الْبَارِئُ", "الذي خلق الخلق وميّز بعضه عن بعض بقدرته"],
  ["الْمُصَوِّرُ", "الذي صوّر المخلوقات وأحسن أشكالها"],
  ["الْغَفَّارُ", "كثير المغفرة والستر لذنوب عباده"],
  ["الْقَهَّارُ", "الذي خضع له كل شيء في الكون"],
  ["الْوَهَّابُ", "كثير العطاء والهبات بغير عوض"],
  ["الرَّزَّاقُ", "المتكفل برزق جميع المخلوقات"],
  ["الْفَتَّاحُ", "الذي يفتح أبواب الرحمة والرزق ويحكم بالحق"],
  ["الْعَلِيمُ", "المحيط علمه بكل ما في السماوات والأرض"],
  ["الْقَابِضُ", "الذي يقبض الأرزاق والأرواح بحكمته"],
  ["الْبَاسِطُ", "الذي يوسّع الرزق والرحمة لمن يشاء"],
  ["الْخَافِضُ", "الذي يخفض الظالمين والمتكبرين بعدله"],
  ["الرَّافِعُ", "الذي يرفع قدر المؤمنين وأهل الطاعة"],
  ["الْمُعِزُّ", "الذي يهب العزة لمن يشاء من عباده"],
  ["الْمُذِلُّ", "الذي يُذل من يعرض عنه ويستكبر"],
  ["السَّمِيعُ", "الذي يسمع كل الأصوات سرها وعلانيتها"],
  ["الْبَصِيرُ", "الذي يرى كل شيء مهما دقّ أو خفي"],
  ["الْحَكَمُ", "الحاكم العدل الذي لا رادّ لقضائه"],
  ["الْعَدْلُ", "المنزّه عن الظلم، الواضع لكل شيء في موضعه"],
  ["اللَّطِيفُ", "البرّ بعباده، المحيط بدقائق الأمور"],
  ["الْخَبِيرُ", "العليم ببواطن الأمور وخفاياها"],
  ["الْحَلِيمُ", "الذي لا يعاجل العصاة بالعقوبة مع قدرته"],
  ["الْعَظِيمُ", "ذو الجلال والكبرياء والقدر الأعظم"],
  ["الْغَفُورُ", "الساتر للذنوب، المتجاوز عن الخطايا"],
  ["الشَّكُورُ", "الذي يجازي على العمل القليل بالثواب الكثير"],
  ["الْعَلِيُّ", "الرفيع في ذاته وقدره فوق كل مخلوق"],
  ["الْكَبِيرُ", "العظيم الجليل الذي يصغر دونه كل شيء"],
  ["الْحَفِيظُ", "الحافظ لخلقه وأعمال عباده من الضياع"],
  ["الْمُقِيتُ", "المقتدر الذي يوصل لكل مخلوق قوته"],
  ["الْحَسِيبُ", "الكافي لعباده والمحاسب لهم على أعمالهم"],
  ["الْجَلِيلُ", "المتصف بصفات العظمة والكمال والجلال"],
  ["الْكَرِيمُ", "الكثير الخير والعطاء والجود بلا حدود"],
  ["الرَّقِيبُ", "المطلع على كل حركة وسكون وخطرة"],
  ["الْمُجِيبُ", "الذي يستجيب دعاء من دعاه ويلبي المضطر"],
  ["الْوَاسِعُ", "الذي وسع علمه ورحمته وغناه كل شيء"],
  ["الْحَكِيمُ", "الذي يضع كل شيء في موضعه بحكمة بالغة"],
  ["الْوَدُودُ", "المحب لعباده الصالحين، المحبوب في قلوبهم"],
  ["الْمَجِيدُ", "ذو المجد والشرف الواسع والعطاء الجزيل"],
  ["الْبَاعِثُ", "الذي يبعث الموتى يوم القيامة ويرسل الرسل"],
  ["الشَّهِيدُ", "الحاضر المطلع الذي لا يغيب عنه شيء"],
  ["الْحَقُّ", "الثابت وجوده، الصادق في وعده وقوله"],
  ["الْوَكِيلُ", "الكفيل بأرزاق العباد وتدبير شؤونهم"],
  ["الْقَوِيُّ", "ذو القوة التامة التي لا يعتريها ضعف"],
  ["الْمَتِينُ", "الشديد القوة الثابت الذي لا يُغلب"],
  ["الْوَلِيُّ", "الناصر والمعين والمتولي لأمر المؤمنين"],
  ["الْحَمِيدُ", "المستحق للحمد والثناء في كل حال"],
  ["الْمُحْصِي", "الذي أحاط بكل شيء عدداً وعلماً"],
  ["الْمُبْدِئُ", "الذي أنشأ الخلق وبدأه أول مرة"],
  ["الْمُعِيدُ", "الذي يعيد الخلق بعد الفناء للحساب"],
  ["الْمُحْيِي", "واهب الحياة لكل حي ومحيي القلوب بالإيمان"],
  ["الْمُمِيتُ", "مقدّر الموت على كل حي"],
  ["الْحَيُّ", "الدائم الباقي الذي لا يموت أبداً"],
  ["الْقَيُّومُ", "القائم بنفسه والمقيم لشؤون خلقه"],
  ["الْوَاجِدُ", "الغني الذي لا يعوزه ولا يفتقر إلى شيء"],
  ["الْمَاجِدُ", "ذو الشرف والكرم والفضل الواسع"],
  ["الْوَاحِدُ", "المتفرد في ذاته وصفاته وألوهيته"],
  ["الْأَحَدُ", "الفرد الذي لا شريك له ولا مثيل"],
  ["الصَّمَدُ", "السيد الذي تُقصد إليه كل الحوائج"],
  ["الْقَادِرُ", "التام القدرة الذي لا يعجزه شيء"],
  ["الْمُقْتَدِرُ", "ذو القدرة البالغة النافذة في كل شيء"],
  ["الْمُقَدِّمُ", "الذي يقدّم من يشاء ويقدّم الأشياء بحكمته"],
  ["الْمُؤَخِّرُ", "الذي يؤخّر ما يشاء بحكمته وعدله"],
  ["الْأَوَّلُ", "الذي ليس قبله شيء"],
  ["الْآخِرُ", "الباقي الذي ليس بعده شيء"],
  ["الظَّاهِرُ", "العالي فوق كل شيء، الظاهر بآياته ودلائله"],
  ["الْبَاطِنُ", "المحتجب عن الأبصار، العالم بخفايا كل شيء"],
  ["الْوَالِي", "المالك للأشياء والمتصرف فيها وحده"],
  ["الْمُتَعَالِي", "المنزّه عن صفات المخلوقين بعلوّه"],
  ["الْبَرُّ", "كثير الإحسان والعطف واللطف بعباده"],
  ["التَّوَّابُ", "الذي يقبل التوبة ويوفق عباده إليها"],
  ["الْمُنْتَقِمُ", "المعاقب للطغاة والظالمين بعدله"],
  ["الْعَفُوُّ", "الذي يمحو السيئات ويتجاوز عن الذنوب"],
  ["الرَّؤُوفُ", "شديد الرحمة والشفقة بعباده"],
  ["مَالِكُ الْمُلْكِ", "المتصرف في ملكه كيف يشاء بلا شريك"],
  ["ذُو الْجَلَالِ وَالْإِكْرَامِ", "صاحب العظمة والكرم المستحق للإجلال"],
  ["الْمُقْسِطُ", "العادل في حكمه، المنتصف للمظلوم من الظالم"],
  ["الْجَامِعُ", "الذي يجمع الخلائق ليوم لا ريب فيه"],
  ["الْغَنِيُّ", "المستغني عن كل ما سواه، وكل الخلق فقراء إليه"],
  ["الْمُغْنِي", "الذي يغني من يشاء من عباده بفضله"],
  ["الْمَانِعُ", "الذي يمنع السوء ويحفظ من يشاء بحكمته"],
  ["الضَّارُّ", "الذي يقدّر الابتلاء بحكمته ولا ضرّ إلا بإذنه"],
  ["النَّافِعُ", "الذي بيده النفع والخير كله"],
  ["النُّورُ", "الهادي لنوره ومنوّر السماوات والأرض"],
  ["الْهَادِي", "المرشد لعباده إلى طريق الحق والخير"],
  ["الْبَدِيعُ", "المبدع للسماوات والأرض على غير مثال سابق"],
  ["الْبَاقِي", "الدائم وجوده الذي لا يفنى ولا يزول"],
  ["الْوَارِثُ", "الباقي بعد فناء جميع المخلوقات"],
  ["الرَّشِيدُ", "الحكيم الذي يرشد عباده إلى الصواب"],
  ["الصَّبُورُ", "الذي لا يعاجل بالعقوبة ويحلم على عباده"]
];

/* ================= 2) حالة التطبيق والدوال المساعدة ================= */

// دالة مختصرة للوصول لأي عنصر في الصفحة عن طريق الـ id
const $ = (id) => document.getElementById(id);

// قراءة البيانات المحفوظة في المتصفح (localStorage) بأمان
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
// حفظ أي قيمة في المتصفح لتبقى موجودة حتى بعد إغلاق الصفحة
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// المتغيرات التي تحفظ حالة التطبيق أثناء الاستخدام
let favorites = load("rawda-favs", []);      // السور المفضلة
let tasbihCount = load("rawda-tasbih", 0);   // عداد المسبحة
let viewMode = load("rawda-view", "mushaf"); // وضع القراءة: mushaf أو tafsir
if (viewMode !== "mushaf" && viewMode !== "tafsir") viewMode = "mushaf";
let fontStep = load("rawda-font", 2);        // درجة حجم خط المصحف (0 إلى 4)
let lastRead = load("rawda-last", null);     // آخر سورة قرأها المستخدم
let repeatAyah = false;                      // هل تكرار الآية مفعّل؟
let surahs = [];                             // قائمة الـ ١١٤ سورة بعد جلبها من الـ API
let surahFilter = "all";                     // الفلتر الحالي: all أو Meccan أو Medinan
let timings = null;                          // مواقيت الصلاة لليوم
let timezone = null;                         // المنطقة الزمنية للمدينة المختارة
let lastNextPrayer = null;                   // آخر صلاة قادمة (لتحديث التظليل عند تغيرها)
let adhkarType = "morning";                  // أذكار الصباح أم المساء
let adhkarLeft = [];                         // العدد المتبقي لكل ذكر
let currentSurah = null;                     // بيانات السورة المفتوحة حالياً في القارئ
let playingIndex = null;                     // رقم الآية التي تُتلى حالياً
let deferredInstallPrompt = null;            // حدث تثبيت التطبيق على الموبايل (PWA)
const audio = new Audio();                   // كائن الصوت المدمج في المتصفح لتشغيل التلاوة

// درجات حجم الخط في قارئ المصحف
const FONT_STEPS = [
  { size: "1.3rem", label: "صغير جداً" },
  { size: "1.5rem", label: "صغير" },
  { size: "1.68rem", label: "متوسط" },
  { size: "1.95rem", label: "كبير" },
  { size: "2.25rem", label: "كبير جداً" }
];

// أيقونات SVG صغيرة متكررة في الكود
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
const EMBLEM_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="10" y="10" width="28" height="28" rx="3" fill="currentColor" fill-opacity="0.08"/><rect x="10" y="10" width="28" height="28" rx="3" transform="rotate(45 24 24)" fill="currentColor" fill-opacity="0.08"/></svg>';
const BOOKMARK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z"/></svg>';

// تحويل الأرقام الإنجليزية (123) إلى عربية (١٢٣)
const toArabicDigits = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
// تشغيل اهتزاز خفيف على الموبايل إذا كان الجهاز يدعمه
const vibrate = (pattern) => navigator.vibrate && navigator.vibrate(pattern);
// إرجاع رقم ثابت طوال اليوم ويتغير مع كل يوم جديد (لاختيار آية وحديث اليوم)
const dayIndex = (length) => Math.floor(Date.now() / 86400000) % length;
// ترجمة نوع نزول السورة للعربية
const revLabel = (type) => (type === "Meccan" ? "مكية" : "مدنية");

// تنظيف النص العربي من التشكيل وتوحيد الهمزات حتى يعمل البحث بسهولة
function normalize(text) {
  return String(text).toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[ٱأإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// عرض دائرة التحميل داخل أي عنصر
function showSpinner(el) { el.innerHTML = '<div class="spinner"></div>'; }

// عرض رسالة خطأ مع زر «إعادة المحاولة» لو فشل الاتصال بالإنترنت
function showError(el, retryFn) {
  el.innerHTML = '<div class="error"><p>تعذّر تحميل البيانات. تأكد من اتصالك بالإنترنت.</p><button class="btn-outline" type="button">إعادة المحاولة</button></div>';
  el.querySelector("button").addEventListener("click", retryFn);
}

// إظهار إشعار سريع أسفل الشاشة يختفي بعد ثانيتين
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2000);
}

// دالة عامة لجلب البيانات بصيغة JSON من أي API والتحقق من نجاح الطلب
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const json = await res.json();
  if (json.code !== 200) throw new Error("API error");
  return json.data;
}

/* ================= 3) الوضع الليلي والنهاري ================= */

// تبديل الوضع الليلي وحفظ اختيار المستخدم
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  $("themeBtn").setAttribute("aria-pressed", String(dark));
  save("rawda-theme", dark ? "dark" : "light");
}

/* ================= 4) الصفحة الرئيسية (الهيرو) ================= */

// عرض التحية حسب الوقت + التاريخ الهجري والميلادي + آية وحديث اليوم
function renderHero() {
  const now = new Date();
  $("greeting").textContent = `السلام عليكم — ${now.getHours() < 12 ? "صباح الخير" : "مساء الخير"}`;

  const opts = { day: "numeric", month: "long", year: "numeric" };
  try {
    $("hijriDate").textContent = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", opts).format(now);
  } catch {
    $("hijriDate").textContent = "";
  }
  $("gregDate").textContent = now.toLocaleDateString("ar-EG", { weekday: "long", ...opts });

  const verse = VERSES[dayIndex(VERSES.length)];
  $("verseText").textContent = verse.text;
  $("verseRef").textContent = verse.ref;

  const hadith = HADITHS[dayIndex(HADITHS.length)];
  $("hadithText").textContent = hadith.text;
  $("hadithRef").textContent = hadith.ref;
}

// نسخ آية اليوم أو حديث اليوم إلى الحافظة
function copyDaily(prefix) {
  const text = `${$(prefix + "Text").textContent}\n— ${$(prefix + "Ref").textContent}`;
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast("تم النسخ ✓")).catch(() => {});
}

/* ================= 5) القرآن الكريم وقارئ المصحف ================= */

// جلب قائمة الـ ١١٤ سورة من موقع AlQuran Cloud API
async function loadSurahs() {
  showSpinner($("surahStatus"));
  try {
    surahs = await getJSON("https://api.alquran.cloud/v1/surah");
    $("surahStatus").innerHTML = "";
    filterSurahs();
  } catch {
    showError($("surahStatus"), loadSurahs);
  }
}

// حذف كلمة «سورة» من الاسم القادم من الـ API لعرضه بشكل مرتب
function cleanName(name) {
  const words = name.split(" ");
  return normalize(words[0]) === "سوره" ? words.slice(1).join(" ") : name;
}

// بناء كود HTML لبطاقة سورة واحدة
function surahCard(s, i) {
  const isFav = favorites.some((f) => f.number === s.number);
  return `
    <div class="surah-card pop-in" style="--i:${i}" data-num="${s.number}">
      <div class="surah-emblem">${EMBLEM_SVG}<span>${toArabicDigits(s.number)}</span></div>
      <div class="names">
        <strong>${cleanName(s.name)}</strong>
        <div class="surah-tags">
          <span class="rev-tag">${revLabel(s.revelationType)}</span>
          <span>${toArabicDigits(s.numberOfAyahs)} آية</span>
        </div>
      </div>
      <button class="bookmark ${isFav ? "saved" : ""}" data-num="${s.number}" type="button" title="حفظ في المفضلة" aria-label="حفظ في المفضلة">${BOOKMARK_SVG}</button>
    </div>`;
}

// عرض شريط «متابعة آخر قراءة» في أعلى صفحة القرآن
function renderLastRead() {
  const bar = $("lastReadBar");
  if (!lastRead) return bar.classList.add("hidden");
  bar.classList.remove("hidden");
  bar.innerHTML = `
    <div class="last-read-info">
      <span class="last-read-ico" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H11v17H4.5A2.5 2.5 0 0 0 2 22V5.5z"/><path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H13v17h6.5a2.5 2.5 0 0 1 2.5 2V5.5z"/></svg>
      </span>
      <div>
        <span class="last-read-label">متابعة آخر قراءة</span>
        <div class="last-read-title">سورة ${cleanName(lastRead.name)}</div>
        <span class="last-read-meta">${revLabel(lastRead.revelationType)} · ${toArabicDigits(lastRead.numberOfAyahs)} آية</span>
      </div>
    </div>
    <button class="last-read-btn" type="button" data-open="${lastRead.number}">أكمل القراءة ←</button>`;
}

// تطبيق حجم الخط المختار داخل نافذة المصحف وحفظه
function applyFontStep() {
  fontStep = Math.max(0, Math.min(FONT_STEPS.length - 1, fontStep));
  const f = FONT_STEPS[fontStep];
  document.querySelector(".modal-box").style.setProperty("--mushaf-size", f.size);
  $("fontLabel").textContent = f.label;
  save("rawda-font", fontStep);
}

// تحديث شكل زر المفضلة داخل نافذة المصحف
function updateModalFav() {
  if (!currentSurah) return;
  const isFav = favorites.some((f) => f.number === currentSurah.number);
  $("modalFavBtn").classList.toggle("saved", isFav);
}

// البحث الفوري في السور وتطبيق فلتر مكية / مدنية
function filterSurahs() {
  const q = normalize($("searchInput").value.trim());
  const list = surahs.filter((s) =>
    (surahFilter === "all" || s.revelationType === surahFilter) &&
    (!q || normalize(s.name).includes(q) || String(s.number) === q)
  );
  $("surahGrid").innerHTML = list.length ? list.map(surahCard).join("") : '<p class="message">لا توجد نتائج مطابقة</p>';
}

// تغيير فلتر السور (الكل / مكية / مدنية)
function setSurahFilter(filter) {
  surahFilter = filter;
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === filter));
  filterSurahs();
}

// فتح قارئ المصحف وجلب النص العثماني + التفسير الميسّر في طلب واحد
async function openSurah(number) {
  stopAudio();
  const info = surahs.find((s) => s.number === number) || favorites.find((f) => f.number === number);
  currentSurah = null;
  $("modalTitle").textContent = info ? `سورة ${cleanName(info.name)}` : "";
  $("modalMeta").textContent = info ? `${revLabel(info.revelationType)} · ${toArabicDigits(info.numberOfAyahs)} آية` : "";
  $("modalFavBtn").classList.toggle("saved", favorites.some((f) => f.number === number));
  $("modal").classList.remove("hidden");
  document.body.classList.add("no-scroll");
  showSpinner($("modalBody"));
  openSurah.requested = number;

  try {
    const [quran, tafsir] = await getJSON(
      `https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,ar.muyassar`
    );
    // إذا فتح المستخدم سورة أخرى قبل انتهاء التحميل نتجاهل النتيجة القديمة
    if (openSurah.requested !== number) return;

    let basmala = "";
    const ayahs = quran.ayahs.map((a, i) => {
      let text = a.text.replace(/\uFEFF/g, "").trim();
      // الـ API يدمج البسملة داخل الآية الأولى (ما عدا الفاتحة والتوبة)، فنفصلها كعنوان مستقل
      if (i === 0 && number !== 1 && number !== 9 && normalize(text).startsWith("بسم")) {
        const words = text.split(/\s+/);
        basmala = words.slice(0, 4).join(" ");
        text = words.slice(4).join(" ");
      }
      return { text, number: a.number, numberInSurah: a.numberInSurah, tafsir: tafsir.ayahs[i].text };
    });

    currentSurah = {
      number, name: quran.name, revelationType: quran.revelationType,
      numberOfAyahs: quran.numberOfAyahs, basmala, ayahs
    };

    // حفظ السورة كآخر قراءة
    lastRead = { number, name: quran.name, revelationType: quran.revelationType, numberOfAyahs: quran.numberOfAyahs };
    save("rawda-last", lastRead);
    renderLastRead();

    $("modalTitle").textContent = `سورة ${cleanName(quran.name)}`;
    $("modalMeta").textContent = `${revLabel(quran.revelationType)} · ${toArabicDigits(quran.numberOfAyahs)} آية`;
    updateModalFav();
    renderAyahs();
  } catch {
    if (openSurah.requested === number) showError($("modalBody"), () => openSurah(number));
  }
}

// رسم الآيات داخل القارئ حسب الوضع المختار (المصحف أو التفسير الميسّر)
function renderAyahs() {
  if (!currentSurah) return;
  document.querySelectorAll("#viewSeg button").forEach((b) => b.classList.toggle("active", b.dataset.view === viewMode));
  const { number, name, basmala, ayahs } = currentSurah;
  const marker = (a) => `<span class="ayah-num">﴿${toArabicDigits(a.numberInSurah)}﴾</span>`;
  const prevInfo = surahs.find((s) => s.number === number - 1);
  const nextInfo = surahs.find((s) => s.number === number + 1);
  const navHTML = `
    <div class="surah-nav">
      <button type="button" data-surah="${number - 1}" ${number <= 1 ? "disabled" : ""}>→ السورة السابقة${prevInfo ? `: ${cleanName(prevInfo.name)}` : ""}</button>
      <button type="button" data-surah="${number + 1}" ${number >= 114 ? "disabled" : ""}>السورة التالية${nextInfo ? `: ${cleanName(nextInfo.name)}` : ""} ←</button>
    </div>`;

  let html = "";
  if (viewMode === "mushaf") {
    html = `
      <div class="mushaf-page">
        <div class="surah-cartouche">
          <span class="cartouche-orn" aria-hidden="true">◆ ۞ ◆</span>
          <h4>سورة ${cleanName(name)}</h4>
          <span class="cartouche-orn" aria-hidden="true">◆ ۞ ◆</span>
        </div>
        ${basmala ? `<p class="basmala ayah" data-i="-1">${basmala}</p>` : ""}
        <div class="ayahs quran-text">${ayahs.map((a, i) => `<span class="ayah" data-i="${i}">${a.text} ${marker(a)}</span>`).join(" ")}</div>
      </div>${navHTML}`;
  } else {
    html = (basmala ? `<p class="basmala ayah" data-i="-1">${basmala}</p>` : "") +
      ayahs.map((a, i) => `
      <div class="ayah-block">
        <div class="ayah-block-head">
          <span class="ayah-badge">الآية ${toArabicDigits(a.numberInSurah)}</span>
          <div class="ayah-actions">
            <button class="mini-btn" type="button" data-play="${i}">استماع</button>
            <button class="mini-btn" type="button" data-copy-ayah="${i}">نسخ</button>
          </div>
        </div>
        <span class="ayah quran-text" data-i="${i}">${a.text} ${marker(a)}</span>
        <p class="tafsir">${a.tafsir}</p>
      </div>`).join("") + navHTML;
  }
  $("modalBody").innerHTML = html;
  $("modalBody").scrollTop = 0;
  if (playingIndex !== null) highlightAyah(playingIndex, false);
}

// التبديل بين وضع المصحف ووضع التفسير
function setViewMode(mode) {
  viewMode = mode;
  save("rawda-view", mode);
  renderAyahs();
}

// إغلاق نافذة المصحف وإيقاف الصوت
function closeModal() {
  stopAudio();
  openSurah.requested = null;
  currentSurah = null;
  $("modal").classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

/* ---------- التلاوة الصوتية آية بآية ---------- */

// تكوين رابط ملف الصوت MP3 لآية معينة حسب القارئ المختار
function audioUrl(globalNumber) {
  const r = RECITERS[$("reciterSelect").value] || RECITERS[0];
  return `https://cdn.islamic.network/quran/audio/${r.bitrate}/${r.id}/${globalNumber}.mp3`;
}

// تشغيل الآية رقم i (-1 يعني البسملة)
function playAyah(i) {
  if (!currentSurah || i < (currentSurah.basmala ? -1 : 0) || i >= currentSurah.ayahs.length) return stopAudio();
  playingIndex = i;
  audio.src = audioUrl(i === -1 ? 1 : currentSurah.ayahs[i].number);
  audio.play().catch(() => {});
  highlightAyah(i, true);
  $("audioStatus").textContent = i === -1
    ? "البسملة"
    : `الآية ${toArabicDigits(currentSurah.ayahs[i].numberInSurah)} من ${toArabicDigits(currentSurah.ayahs.length)}`;
}

// تظليل الآية التي تُتلى حالياً والتمرير إليها تلقائياً
function highlightAyah(i, scroll) {
  document.querySelectorAll("#modalBody .playing").forEach((el) => el.classList.remove("playing"));
  const el = document.querySelector(`#modalBody .ayah[data-i="${i}"]`);
  if (!el) return;
  el.classList.add("playing");
  if (scroll) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

// زر تشغيل / إيقاف مؤقت
function togglePlay() {
  if (!currentSurah) return;
  if (playingIndex === null) playAyah(currentSurah.basmala ? -1 : 0);
  else if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

// إيقاف التلاوة بالكامل وإعادة تعيين المشغّل
function stopAudio() {
  playingIndex = null;
  audio.pause();
  audio.removeAttribute("src");
  document.querySelectorAll("#modalBody .playing").forEach((el) => el.classList.remove("playing"));
  $("audioStatus").textContent = "اضغط على أي آية للاستماع";
  updatePlayBtn();
}

// تحديث أيقونة زر التشغيل (▶ أو ❚❚)
function updatePlayBtn() {
  const playing = playingIndex !== null && !audio.paused;
  $("playBtn").innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
}

// التعامل مع الضغط داخل القارئ (آية للاستماع، نسخ آية، أو الانتقال للسورة السابقة/التالية)
function handleAyahClick(e) {
  const navBtn = e.target.closest("[data-surah]");
  if (navBtn && !navBtn.disabled) return openSurah(Number(navBtn.dataset.surah));

  const copyBtn = e.target.closest("[data-copy-ayah]");
  if (copyBtn && currentSurah) {
    const a = currentSurah.ayahs[Number(copyBtn.dataset.copyAyah)];
    if (a && navigator.clipboard) {
      navigator.clipboard.writeText(`${a.text} ﴿${toArabicDigits(a.numberInSurah)}﴾ — سورة ${cleanName(currentSurah.name)}`).then(() => toast("تم نسخ الآية ✓")).catch(() => {});
    }
    return;
  }

  const playBtn = e.target.closest("[data-play]");
  if (playBtn && currentSurah) return playAyah(Number(playBtn.dataset.play));

  const ayah = e.target.closest(".ayah");
  if (ayah && currentSurah) playAyah(Number(ayah.dataset.i));
}

/* ================= 6) السور المفضلة ================= */

// إضافة أو حذف سورة من المفضلة وحفظها في localStorage
function toggleFavorite(number) {
  if (favorites.some((f) => f.number === number)) {
    favorites = favorites.filter((f) => f.number !== number);
    toast("أُزيلت من المفضلة");
  } else {
    const s = surahs.find((x) => x.number === number);
    if (!s) return;
    favorites.push(s);
    toast("أُضيفت للمفضلة ✓");
  }
  favorites.sort((a, b) => a.number - b.number);
  save("rawda-favs", favorites);
  if (surahs.length) filterSurahs();
  renderFavorites();
  updateModalFav();
}

// عرض السور المفضلة في صفحة المفضلة وتحديث ملخصها في الصفحة الرئيسية
function renderFavorites() {
  $("favGrid").innerHTML = favorites.length
    ? favorites.map(surahCard).join("")
    : '<p class="message">لم تُضف أي سورة بعد. اضغط على أيقونة الحفظ في صفحة القرآن لإضافتها هنا.</p>';

  const count = favorites.length;
  $("homeFavHeading").textContent = count
    ? `لديك ${toArabicDigits(count)} ${count === 1 ? "سورة محفوظة" : "سور محفوظة"}`
    : "السور المفضلة";
  $("homeFavSub").textContent = count
    ? favorites.slice(0, 4).map((s) => cleanName(s.name)).join(" · ") + (count > 4 ? " ..." : "")
    : "احفظ السور التي تداوم على قراءتها للوصول السريع إليها في أي وقت.";
}

// معالج موحد للضغط على بطاقات السور (أيقونة الحفظ = مفضلة، البطاقة = فتح القارئ)
function handleGridClick(e) {
  const star = e.target.closest(".bookmark");
  const card = e.target.closest(".surah-card");
  if (star) toggleFavorite(Number(star.dataset.num));
  else if (card) openSurah(Number(card.dataset.num));
}

/* ================= 7) مواقيت الصلاة والعدّاد ================= */

// تعبئة قائمتي المدن والقرّاء واستعادة آخر اختيار محفوظ
function fillSelects() {
  const city = load("rawda-city", "0");
  $("citySelect").innerHTML = CITIES.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
  $("citySelect").value = CITIES[city] ? city : "0";

  const reciter = load("rawda-reciter", "0");
  $("reciterSelect").innerHTML = RECITERS.map((r, i) => `<option value="${i}">${r.name}</option>`).join("");
  $("reciterSelect").value = RECITERS[reciter] ? reciter : "0";
}

// جلب مواقيت الصلاة لليوم من AlAdhan API حسب المدينة المختارة
async function loadPrayerTimes() {
  const c = CITIES[$("citySelect").value];
  save("rawda-city", $("citySelect").value);
  timings = null;
  $("prayerGrid").innerHTML = "";
  showSpinner($("prayerStatus"));
  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(c.city)}&country=${encodeURIComponent(c.country)}&method=${c.method}`;
    const data = await getJSON(url);
    timings = data.timings;
    timezone = data.meta.timezone;
    $("prayerStatus").innerHTML = "";
    lastNextPrayer = null;
    updateCountdown();
  } catch {
    showError($("prayerStatus"), loadPrayerTimes);
  }
}

// تحويل وقت بصيغة "04:45" إلى ثوانٍ منذ منتصف الليل لتسهيل الطرح والمقارنة
function toSeconds(time) {
  const [h, m] = time.split(" ")[0].split(":").map(Number);
  return h * 3600 + m * 60;
}

// تحويل الوقت من نظام ٢٤ ساعة إلى ١٢ ساعة بالعربية (مثل ٤:٥٧ ص)
function format12(time) {
  const [h, m] = time.split(" ")[0].split(":").map(Number);
  return `${toArabicDigits(h % 12 || 12)}:${toArabicDigits(String(m).padStart(2, "0"))} ${h < 12 ? "ص" : "م"}`;
}

// حساب الوقت الحالي بالثواني حسب المنطقة الزمنية للمدينة المختارة (مثل مكة أو القاهرة)
function nowSeconds() {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return (get("hour") % 24) * 3600 + get("minute") * 60 + get("second");
  } catch {
    const d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  }
}

// تحديد الصلاة القادمة وكم ثانية متبقية لها (بعد العشاء تكون الصلاة القادمة فجر الغد)
function getNextPrayer() {
  const now = nowSeconds();
  for (const p of PRAYERS) {
    const s = toSeconds(timings[p.key]);
    if (s > now) return { key: p.key, left: s - now };
  }
  return { key: "Fajr", left: toSeconds(timings.Fajr) + 86400 - now };
}

// رسم بطاقات الصلوات الخمس وتمييز الصلاة القادمة بإطار ذهبي
function renderPrayers() {
  if (!timings) return;
  const next = getNextPrayer().key;
  $("prayerGrid").innerHTML = PRAYERS.map((p, i) => `
    <div class="prayer-card glass pop-in ${p.key === next ? "next" : ""}" style="--i:${i}">
      <div class="icon">${p.icon}</div>
      <h4>${p.name}</h4>
      <span class="time">${format12(timings[p.key])}</span>
    </div>`).join("");
}

// دالة تعمل كل ثانية لتحديث العدّاد التنازلي في صفحة المواقيت والصفحة الرئيسية
function updateCountdown() {
  if (!timings) return;
  const { key, left } = getNextPrayer();
  const pad = (n) => toArabicDigits(String(n).padStart(2, "0"));
  const time = `${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`;
  $("nextName").textContent = PRAYER_NAMES[key];
  $("countdown").textContent = time;
  $("heroNext").innerHTML = `الصلاة القادمة: ${PRAYER_NAMES[key]} بعد <b>${time}</b>`;
  const stat = $("homePrayerStat");
  if (stat) stat.textContent = `القادمة: ${PRAYER_NAMES[key]} (${format12(timings[key])})`;
  if (key !== lastNextPrayer) {
    lastNextPrayer = key;
    renderPrayers();
  }
}

/* ================= 8) الأذكار والمسبحة الإلكترونية ================= */

// التبديل بين أذكار الصباح والمساء وتجهيز عدّاداتها
function setAdhkarType(type) {
  adhkarType = type;
  adhkarLeft = ADHKAR[type].map((d) => d.count);
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.type === type));
  renderAdhkar();
}

// رسم بطاقات الأذكار وتحديث شريط الإنجاز
function renderAdhkar() {
  const list = ADHKAR[adhkarType];
  $("adhkarList").innerHTML = list.map((d, i) => `
    <div class="dhikr-card glass ${adhkarLeft[i] === 0 ? "done" : ""}" data-i="${i}">
      <p class="dhikr-text quran-text">${d.text}</p>
      <div class="dhikr-foot">
        <button class="dhikr-count" type="button">${adhkarLeft[i] === 0 ? "✓" : toArabicDigits(adhkarLeft[i])}</button>
        <span>${adhkarLeft[i] === 0 ? "تم ✓" : `التكرار: ${toArabicDigits(d.count)}`}</span>
        <button class="btn-outline dhikr-reset" type="button">إعادة</button>
      </div>
    </div>`).join("");

  const done = adhkarLeft.filter((n) => n === 0).length;
  $("adhkarProgressText").textContent = `أنجزت ${toArabicDigits(done)} من ${toArabicDigits(list.length)}`;
  $("adhkarBar").style.width = `${(done / list.length) * 100}%`;
}

// عند الضغط على بطاقة ذكر ينقص العداد ١، وعند الضغط على «إعادة» يرجع للعدد الأصلي
function handleDhikrClick(e) {
  const card = e.target.closest(".dhikr-card");
  if (!card) return;
  const i = Number(card.dataset.i);
  if (e.target.closest(".dhikr-reset")) {
    adhkarLeft[i] = ADHKAR[adhkarType][i].count;
  } else if (adhkarLeft[i] > 0) {
    adhkarLeft[i]--;
    vibrate(adhkarLeft[i] === 0 ? [80, 40, 80] : 25);
  }
  renderAdhkar();
}

// الضغط على المسبحة: يزيد العداد ويهز الموبايل (اهتزاز أطول كل ٣٣)
function tasbihTap() {
  tasbihCount++;
  vibrate(tasbihCount % 33 === 0 ? [120, 60, 120] : 30);
  updateTasbih();
}

// تحديث رقم المسبحة والحلقة الدائرية والذكر الظاهر فيها وحفظ الإجمالي
function updateTasbih() {
  const round = tasbihCount % 33;
  $("tasbihCount").textContent = toArabicDigits(round);
  $("tasbihPhrase").textContent = TASBIH_PHRASES[Math.floor((tasbihCount % 99) / 33)];
  $("tasbihTotal").textContent = `الإجمالي: ${toArabicDigits(tasbihCount)}`;
  $("tasbihRing").style.strokeDashoffset = 565.5 * (1 - round / 33);
  const stat = $("homeTasbihStat");
  if (stat) stat.textContent = `المسبحة: ${toArabicDigits(tasbihCount)}`;
  save("rawda-tasbih", tasbihCount);
}

/* ================= 9) أسماء الله الحسنى ================= */

// عرض وبحث الـ ٩٩ اسماً ومعانيها العربية في بطاقات قابلة للقلب
function renderNames() {
  const q = normalize($("namesSearch").value.trim());
  const list = NAMES_OF_ALLAH
    .map(([name, meaning], idx) => ({ number: idx + 1, name, meaning }))
    .filter((n) => !q || normalize(n.name).includes(q) || normalize(n.meaning).includes(q) || String(n.number) === q);

  $("namesGrid").innerHTML = list.length ? list.map((n, i) => `
    <div class="name-card pop-in" style="--i:${i}">
      <div class="name-inner">
        <div class="name-face glass"><span class="name-num">${toArabicDigits(n.number)}</span><strong>${n.name}</strong></div>
        <div class="name-face name-back glass"><b>${n.name}</b><small>${n.meaning}</small></div>
      </div>
    </div>`).join("") : '<p class="message">لا توجد نتائج مطابقة</p>';
}

/* ================= 10) نظام التنقل بين الصفحات ================= */

const PAGES = ["home", "quran", "prayer", "adhkar", "names", "favorites"];
const PAGE_TITLES = {
  home: "روضة — القرآن والأذكار ومواقيت الصلاة",
  quran: "القرآن الكريم — روضة",
  prayer: "مواقيت الصلاة — روضة",
  adhkar: "الأذكار والمسبحة — روضة",
  names: "أسماء الله الحسنى — روضة",
  favorites: "السور المفضلة — روضة"
};

// إظهار الصفحة المطلوبة حسب رابط الهاش (#quran, #prayer, ...) وإخفاء الباقي
function showPage(rawHash) {
  const hash = (rawHash || location.hash || "#home").replace(/^#/, "");
  if (hash === "home-explore") return; // تمرير داخلي داخل الرئيسية فقط
  const page = PAGES.includes(hash) ? hash : "home";

  document.querySelectorAll(".page").forEach((el) => el.classList.toggle("active", el.id === "page-" + page));
  document.querySelectorAll(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.page === page));
  document.title = PAGE_TITLES[page];
  scrollTo({ top: 0, behavior: "instant" });
  onScroll();
}

// تحديث شريط التقدم أعلى الشاشة وزر العودة للأعلى أثناء التمرير
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("progress").style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  $("toTop").classList.toggle("show", scrollY > 400);
}

/* ================= 11) تثبيت التطبيق على الموبايل (PWA) ================= */

// تسجيل ملف Service Worker (sw.js) لتمكين التثبيت والعمل السريع بدون إنترنت
function registerPWA() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

// تحديث نص أزرار التثبيت عند تثبيت التطبيق بالفعل
function markInstalled() {
  document.querySelectorAll("[data-install]").forEach((btn) => {
    btn.classList.add("installed");
    const label = btn.querySelector(".install-text");
    if (label) label.textContent = "مثبّت على جهازك ✓";
  });
}

// تهيئة زر التثبيت (يدعم أندرويد وكمبيوتر عبر النافذة الأصلية + إرشادات الآيفون)
function setupInstall() {
  const isStandalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (isStandalone) markInstalled();

  // يلتقط المتصفح هذا الحدث عندما يكون التطبيق جاهزاً للتثبيت بضغطة واحدة
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  // عند نجاح التثبيت نحدّث شكل الزر ونعرض إشعاراً لطيفاً
  addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    markInstalled();
    $("installHint").classList.add("hidden");
    toast("تم تثبيت تطبيق روضة بنجاح ✓");
  });

  // ربط كل أزرار التثبيت في الصفحة الرئيسية
  document.querySelectorAll("[data-install]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (isStandalone || btn.classList.contains("installed")) {
        return toast("التطبيق مثبّت بالفعل على جهازك ✓");
      }

      // 1) إذا كانت نافذة التثبيت التلقائية متاحة (أندرويد كروم / إيدج / كمبيوتر)
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === "accepted") deferredInstallPrompt = null;
        return;
      }

      // 2) إذا كان المستخدم على آيفون أو متصفح آخر: نعرض له خطوة التثبيت الواضحة
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const hint = $("installHint");
      hint.textContent = isIOS
        ? "لتثبيت روضة على الآيفون: افتح الموقع في Safari، اضغط زر المشاركة (Share) بالأسفل ثم اختر «إضافة إلى الشاشة الرئيسية»."
        : location.protocol === "file:"
          ? "للتثبيت كتطبيق على الموبايل، افتح رابط الموقع المنشور (GitHub Pages أو Vercel) من متصفح Chrome واضغط هذا الزر."
          : "اضغط قائمة المتصفح (⋮) في الأعلى ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».";
      hint.classList.remove("hidden");
      hint.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

/* ================= 12) نقطة البداية (تشغيل التطبيق) ================= */

function init() {
  // استعادة الوضع الليلي المحفوظ (أو اتباع إعدادات الجهاز)
  const savedTheme = load("rawda-theme", null);
  setTheme(savedTheme ? savedTheme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);

  // فتح أذكار المساء تلقائياً بعد الساعة ٣ عصراً
  setAdhkarType(new Date().getHours() >= 15 ? "evening" : "morning");

  // بناء الواجهات الأولية وتفعيل PWA والتنقل بين الصفحات
  renderHero();
  fillSelects();
  renderLastRead();
  applyFontStep();
  renderFavorites();
  updateTasbih();
  renderNames();
  registerPWA();
  setupInstall();
  showPage();

  // الاستماع لتغيير الرابط (يدعم أزرار الرجوع والتقديم في المتصفح)
  addEventListener("hashchange", () => showPage());

  // أحداث الهيدر والصفحة
  $("themeBtn").addEventListener("click", () => setTheme(!document.body.classList.contains("dark")));
  document.querySelectorAll(".copy-link").forEach((b) => b.addEventListener("click", () => copyDaily(b.dataset.copy)));
  $("toTop").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("scroll", onScroll, { passive: true });

  // أحداث صفحة القرآن والمفضلة
  $("searchInput").addEventListener("input", filterSurahs);
  document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => setSurahFilter(c.dataset.filter)));
  $("quickSurahs").addEventListener("click", (e) => { const b = e.target.closest("[data-num]"); if (b) openSurah(Number(b.dataset.num)); });
  $("lastReadBar").addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) openSurah(Number(b.dataset.open)); });
  $("surahGrid").addEventListener("click", handleGridClick);
  $("favGrid").addEventListener("click", handleGridClick);

  // أحداث قارئ المصحف ومشغّل التلاوة
  $("modalClose").addEventListener("click", closeModal);
  $("modalFavBtn").addEventListener("click", () => { if (currentSurah) toggleFavorite(currentSurah.number); });
  $("modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  document.querySelectorAll("#viewSeg button").forEach((b) => b.addEventListener("click", () => setViewMode(b.dataset.view)));
  $("fontInc").addEventListener("click", () => { fontStep++; applyFontStep(); });
  $("fontDec").addEventListener("click", () => { fontStep--; applyFontStep(); });
  $("modalBody").addEventListener("click", handleAyahClick);
  $("playBtn").addEventListener("click", togglePlay);
  $("prevAyahBtn").addEventListener("click", () => { if (currentSurah) playAyah((playingIndex ?? 1) - 1); });
  $("nextAyahBtn").addEventListener("click", () => { if (currentSurah) playAyah((playingIndex ?? -1) + 1); });
  $("repeatBtn").addEventListener("click", () => {
    repeatAyah = !repeatAyah;
    $("repeatBtn").classList.toggle("active", repeatAyah);
    $("repeatBtn").setAttribute("aria-pressed", String(repeatAyah));
    toast(repeatAyah ? "تم تفعيل تكرار الآية" : "تم إيقاف تكرار الآية");
  });
  $("reciterSelect").addEventListener("change", () => {
    save("rawda-reciter", $("reciterSelect").value);
    if (playingIndex !== null) playAyah(playingIndex);
  });
  audio.addEventListener("ended", () => playAyah(repeatAyah ? playingIndex : playingIndex + 1));
  audio.addEventListener("play", updatePlayBtn);
  audio.addEventListener("pause", updatePlayBtn);
  audio.addEventListener("error", () => { if (playingIndex !== null) { toast("تعذّر تشغيل التلاوة"); stopAudio(); } });

  // أحداث المواقيت والأذكار والمسبحة والأسماء الحسنى
  $("citySelect").addEventListener("change", loadPrayerTimes);
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => setAdhkarType(b.dataset.type)));
  $("adhkarList").addEventListener("click", handleDhikrClick);
  $("tasbihBtn").addEventListener("click", tasbihTap);
  $("tasbihReset").addEventListener("click", () => { tasbihCount = 0; updateTasbih(); });
  $("namesSearch").addEventListener("input", renderNames);
  $("namesGrid").addEventListener("click", (e) => { const c = e.target.closest(".name-card"); if (c) c.classList.toggle("flipped"); });

  // جلب بيانات القرآن والمواقيت من الإنترنت وتحديث العدّاد كل ثانية
  loadSurahs();
  loadPrayerTimes();
  setInterval(updateCountdown, 1000);
}

// تشغيل دالة init تلقائياً فور اكتمال تحميل هيكل الصفحة
document.addEventListener("DOMContentLoaded", init);
