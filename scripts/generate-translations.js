/**
 * Generate remaining translation dictionaries based on English template.
 * Creates all missing language files for the 22-language i18n system.
 */
const fs = require('fs');
const path = require('path');

const DICT_DIR = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'i18n', 'dictionaries');

const LANG_LABELS = {
  en: "English", hi: "हिन्दी", bn: "বাংলা", te: "తెలుగు", mr: "मराठी",
  ta: "தமிழ்", gu: "ગુજરાતી", ur: "اردو", kn: "ಕನ್ನಡ", or: "ଓଡ଼ିଆ",
  ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", as: "অসমীয়া", mai: "मैथिली", sa: "संस्कृतम्",
  ne: "नेपाली", sd: "سنڌي", ks: "كٲشُر", doi: "डोगरी", kok: "कोंकणी",
  mni: "মণিপুরী", sat: "ᱥᱟᱱᱛᱟᱲᱤ", bo: "बड़ो"
};

// Core translation data for each remaining language
const langs = {
  gu: {
    meta: { title: "ધરતી AI — હવામાન નિર્ણય બુદ્ધિમત્તા", description: "ખેડૂતો અને સરકારોને વધુ સારા હવામાન નિર્ણયો લેવામાં મદદ કરતું AI-સંચાલિત પ્લેટફોર્મ", tagline: "પૃથ્વી માટે બુદ્ધિમત્તા" },
    nav: { home: "હોમ", features: "સુવિધાઓ", about: "અમારા વિશે", impact: "પ્રભાવ", pricing: "કિંમત", login: "લૉગ ઇન", signup: "શરૂ કરો", dashboard: "ડેશબોર્ડ", analyze: "વિશ્લેષણ", predictions: "આગાહીઓ", settings: "સેટિંગ્સ", logout: "લૉગ આઉટ" },
    crops: { rice: "ચોખા", wheat: "ઘઉં", maize: "મકાઈ", cotton: "કપાસ", sugarcane: "શેરડી", soybean: "સોયાબીન", groundnut: "મગફળી", mustard: "રાઈ", potato: "બટાકા", onion: "ડુંગળી", tomato: "ટામેટા", millet: "બાજરી", pulses: "કઠોળ", other: "અન્ય" }
  },
  ur: {
    meta: { title: "دھرتی AI — موسمیاتی فیصلہ ذہانت", description: "کسانوں اور حکومتوں کو بہتر موسمیاتی فیصلے کرنے میں مدد کرنے والا AI سے چلنے والا پلیٹ فارم", tagline: "زمین کے لیے ذہانت" },
    nav: { home: "ہوم", features: "خصوصیات", about: "ہمارے بارے میں", impact: "اثر", pricing: "قیمت", login: "لاگ ان", signup: "شروع کریں", dashboard: "ڈیش بورڈ", analyze: "تجزیہ", predictions: "پیشگوئیاں", settings: "ترتیبات", logout: "لاگ آؤٹ" },
    crops: { rice: "چاول", wheat: "گندم", maize: "مکئی", cotton: "کپاس", sugarcane: "گنا", soybean: "سویابین", groundnut: "مونگ پھلی", mustard: "سرسوں", potato: "آلو", onion: "پیاز", tomato: "ٹماٹر", millet: "باجرا", pulses: "دالیں", other: "دیگر" }
  },
  kn: {
    meta: { title: "ಧರತಿ AI — ಹವಾಮಾನ ನಿರ್ಧಾರ ಬುದ್ಧಿಮತ್ತೆ", description: "ರೈತರು ಮತ್ತು ಸರ್ಕಾರಗಳಿಗೆ ಉತ್ತಮ ಹವಾಮಾನ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುವ AI-ಚಾಲಿತ ವೇದಿಕೆ", tagline: "ಭೂಮಿಗಾಗಿ ಬುದ್ಧಿಮತ್ತೆ" },
    nav: { home: "ಮುಖಪುಟ", features: "ವೈಶಿಷ್ಟ್ಯಗಳು", about: "ನಮ್ಮ ಬಗ್ಗೆ", impact: "ಪ್ರಭಾವ", pricing: "ಬೆಲೆ", login: "ಲಾಗಿನ್", signup: "ಪ್ರಾರಂಭಿಸಿ", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", analyze: "ವಿಶ್ಲೇಷಣೆ", predictions: "ಮುನ್ಸೂಚನೆಗಳು", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", logout: "ಲಾಗ್ ಔಟ್" },
    crops: { rice: "ಭತ್ತ", wheat: "ಗೋಧಿ", maize: "ಮೆಕ್ಕೆಜೋಳ", cotton: "ಹತ್ತಿ", sugarcane: "ಕಬ್ಬು", soybean: "ಸೋಯಾಬೀನ್", groundnut: "ಕಡಲೆಕಾಯಿ", mustard: "ಸಾಸಿವೆ", potato: "ಆಲೂಗಡ್ಡೆ", onion: "ಈರುಳ್ಳಿ", tomato: "ಟೊಮೇಟೊ", millet: "ರಾಗಿ", pulses: "ಬೇಳೆಕಾಳುಗಳು", other: "ಇತರೆ" }
  },
  or: {
    meta: { title: "ଧରତୀ AI — ଜଳବାୟୁ ନିର୍ଣ୍ଣୟ ବୁଦ୍ଧିମତ୍ତା", description: "ଚାଷୀ ଏବଂ ସରକାରଙ୍କୁ ଉନ୍ନତ ଜଳବାୟୁ ନିର୍ଣ୍ଣୟ ନେବାରେ ସାହାଯ୍ୟ କରୁଥିବା AI-ଚାଳିତ ପ୍ଲାଟଫର୍ମ", tagline: "ପୃଥିବୀ ପାଇଁ ବୁଦ୍ଧିମତ୍ତା" },
    nav: { home: "ମୂଳପୃଷ୍ଠା", features: "ସୁବିଧା", about: "ଆମ ବିଷୟରେ", impact: "ପ୍ରଭାବ", pricing: "ମୂଲ୍ୟ", login: "ଲଗ ଇନ", signup: "ଆରମ୍ଭ କରନ୍ତୁ", dashboard: "ଡ୍ୟାସବୋର୍ଡ", analyze: "ବିଶ୍ଳେଷଣ", predictions: "ଭବିଷ୍ୟବାଣୀ", settings: "ସେଟିଂସ", logout: "ଲଗ ଆଉଟ" },
    crops: { rice: "ଧାନ", wheat: "ଗହମ", maize: "ମକା", cotton: "କପା", sugarcane: "ଆଖୁ", soybean: "ସୋୟାବିନ", groundnut: "ବାଦାମ", mustard: "ସୋରିଷ", potato: "ଆଳୁ", onion: "ପିଆଜ", tomato: "ଟମାଟୋ", millet: "ବାଜରା", pulses: "ଡାଲି", other: "ଅନ୍ୟ" }
  },
  ml: {
    meta: { title: "ധരതി AI — കാലാവസ്ഥാ തീരുമാന ബുദ്ധി", description: "കർഷകരെയും സർക്കാരുകളെയും മെച്ചപ്പെട്ട കാലാവസ്ഥാ തീരുമാനങ്ങൾ എടുക്കാൻ സഹായിക്കുന്ന AI-പ്രവർത്തിത പ്ലാറ്റ്ഫോം", tagline: "ഭൂമിക്ക് വേണ്ടിയുള്ള ബുദ്ധി" },
    nav: { home: "ഹോം", features: "ഫീച്ചറുകൾ", about: "ഞങ്ങളെ കുറിച്ച്", impact: "സ്വാധീനം", pricing: "വില", login: "ലോഗിൻ", signup: "ആരംഭിക്കുക", dashboard: "ഡാഷ്ബോർഡ്", analyze: "വിശകലനം", predictions: "പ്രവചനങ്ങൾ", settings: "ക്രമീകരണങ്ങൾ", logout: "ലോഗ് ഔട്ട്" },
    crops: { rice: "നെല്ല്", wheat: "ഗോതമ്പ്", maize: "ചോളം", cotton: "പരുത്തി", sugarcane: "കരിമ്പ്", soybean: "സോയാബീൻ", groundnut: "നിലക്കടല", mustard: "കടുക്", potato: "ഉരുളക്കിഴങ്ങ്", onion: "ഉള്ളി", tomato: "തക്കാളി", millet: "റാഗി", pulses: "പയറുവർഗ്ഗങ്ങൾ", other: "മറ്റുള്ളവ" }
  },
  pa: {
    meta: { title: "ਧਰਤੀ AI — ਜਲਵਾਯੂ ਫੈਸਲਾ ਬੁੱਧੀ", description: "ਕਿਸਾਨਾਂ ਅਤੇ ਸਰਕਾਰਾਂ ਨੂੰ ਬਿਹਤਰ ਜਲਵਾਯੂ ਫੈਸਲੇ ਲੈਣ ਵਿੱਚ ਮਦਦ ਕਰਨ ਵਾਲਾ AI-ਸੰਚਾਲਿਤ ਪਲੇਟਫਾਰਮ", tagline: "ਧਰਤੀ ਲਈ ਬੁੱਧੀ" },
    nav: { home: "ਹੋਮ", features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ", about: "ਸਾਡੇ ਬਾਰੇ", impact: "ਪ੍ਰਭਾਵ", pricing: "ਕੀਮਤ", login: "ਲੌਗ ਇਨ", signup: "ਸ਼ੁਰੂ ਕਰੋ", dashboard: "ਡੈਸ਼ਬੋਰਡ", analyze: "ਵਿਸ਼ਲੇਸ਼ਣ", predictions: "ਭਵਿੱਖਬਾਣੀਆਂ", settings: "ਸੈਟਿੰਗਾਂ", logout: "ਲੌਗ ਆਊਟ" },
    crops: { rice: "ਝੋਨਾ", wheat: "ਕਣਕ", maize: "ਮੱਕੀ", cotton: "ਕਪਾਹ", sugarcane: "ਗੰਨਾ", soybean: "ਸੋਇਆਬੀਨ", groundnut: "ਮੂੰਗਫਲੀ", mustard: "ਸਰ੍ਹੋਂ", potato: "ਆਲੂ", onion: "ਪਿਆਜ਼", tomato: "ਟਮਾਟਰ", millet: "ਬਾਜਰਾ", pulses: "ਦਾਲਾਂ", other: "ਹੋਰ" }
  },
  as: {
    meta: { title: "ধৰতী AI — জলবায়ু সিদ্ধান্ত বুদ্ধিমত্তা", description: "কৃষক আৰু চৰকাৰক উন্নত জলবায়ু সিদ্ধান্ত লোৱাত সহায় কৰা AI-চালিত মঞ্চ", tagline: "পৃথিৱীৰ বাবে বুদ্ধিমত্তা" },
    nav: { home: "হোম", features: "সুবিধাসমূহ", about: "আমাৰ বিষয়ে", impact: "প্ৰভাৱ", pricing: "মূল্য", login: "লগ ইন", signup: "আৰম্ভ কৰক", dashboard: "ডেশ্ববৰ্ড", analyze: "বিশ্লেষণ", predictions: "ভৱিষ্যদ্বাণী", settings: "ছেটিংছ", logout: "লগ আউট" },
    crops: { rice: "ধান", wheat: "ঘেঁহু", maize: "মাকৈ", cotton: "কপাহ", sugarcane: "কুঁহিয়াৰ", soybean: "ছয়াবিন", groundnut: "বাদাম", mustard: "সৰিয়হ", potato: "আলু", onion: "পিয়াঁজ", tomato: "বিলাহী", millet: "বাজৰা", pulses: "দাইল", other: "অন্যান্য" }
  },
  mai: {
    meta: { title: "धरती AI — जलवायु निर्णय बुद्धिमत्ता", description: "किसान आ सरकार केँ बेहतर जलवायु निर्णय लेबा मे मदद करय वाला AI-संचालित प्लेटफॉर्म", tagline: "पृथ्वी लेल बुद्धिमत्ता" },
    nav: { home: "होम", features: "सुविधा", about: "हमरा बारे मे", impact: "प्रभाव", pricing: "कीमत", login: "लॉग इन", signup: "शुरू करू", dashboard: "डैशबोर्ड", analyze: "विश्लेषण", predictions: "भविष्यवाणी", settings: "सेटिंग्स", logout: "लॉग आउट" },
    crops: { rice: "धान", wheat: "गहूँ", maize: "मकई", cotton: "कपास", sugarcane: "ऊख", soybean: "सोयाबीन", groundnut: "मूँगफली", mustard: "सरसों", potato: "आलू", onion: "प्याज", tomato: "टमाटर", millet: "बाजरा", pulses: "दाल", other: "अन्य" }
  },
  sa: {
    meta: { title: "धरती AI — जलवायु-निर्णय-प्रज्ञा", description: "कृषकान् सर्वकारांश्च उत्तम-जलवायु-निर्णयेषु साहाय्यं कर्तुं AI-चालित-मञ्चः", tagline: "पृथिव्याः कृते प्रज्ञा" },
    nav: { home: "गृहम्", features: "विशेषताः", about: "अस्माकम् विषये", impact: "प्रभावः", pricing: "मूल्यम्", login: "प्रवेशः", signup: "आरम्भः", dashboard: "नियन्त्रणपटलम्", analyze: "विश्लेषणम्", predictions: "पूर्वानुमानम्", settings: "विन्यासः", logout: "निर्गमः" },
    crops: { rice: "तण्डुलाः", wheat: "गोधूमः", maize: "मक्का", cotton: "कार्पासम्", sugarcane: "इक्षुः", soybean: "सोयाबीन", groundnut: "भूमिजम्", mustard: "सर्षपः", potato: "आलुकम्", onion: "पलाण्डुः", tomato: "रक्तफलम्", millet: "बाजरा", pulses: "शिम्बिधान्यम्", other: "अन्यत्" }
  },
  ne: {
    meta: { title: "धर्ती AI — जलवायु निर्णय बुद्धिमत्ता", description: "किसान र सरकारलाई राम्रो जलवायु निर्णय लिन मद्दत गर्ने AI-संचालित प्लेटफर्म", tagline: "पृथ्वीको लागि बुद्धिमत्ता" },
    nav: { home: "गृहपृष्ठ", features: "विशेषताहरू", about: "हाम्रो बारेमा", impact: "प्रभाव", pricing: "मूल्य", login: "लग इन", signup: "सुरु गर्नुहोस्", dashboard: "ड्यासबोर्ड", analyze: "विश्लेषण", predictions: "भविष्यवाणी", settings: "सेटिङहरू", logout: "लग आउट" },
    crops: { rice: "धान", wheat: "गहुँ", maize: "मकै", cotton: "कपास", sugarcane: "उखु", soybean: "सोयाबिन", groundnut: "बदाम", mustard: "तोरी", potato: "आलु", onion: "प्याज", tomato: "गोलभेडा", millet: "कोदो", pulses: "दाल", other: "अन्य" }
  },
  sd: {
    meta: { title: "ڌرتي AI — موسمي فيصلي ذهانت", description: "ڪسانن ۽ حڪومتن کي بهتر موسمي فيصلا ڪرڻ ۾ مدد ڪندڙ AI-هلندڙ پليٽ فارم", tagline: "ڌرتيءَ لاءِ ذهانت" },
    nav: { home: "هوم", features: "خاصيتون", about: "اسان بابت", impact: "اثر", pricing: "قيمت", login: "لاگ ان", signup: "شروع ڪريو", dashboard: "ڊيش بورڊ", analyze: "تجزيو", predictions: "اڳڪٿيون", settings: "سيٽنگون", logout: "لاگ آئوٽ" },
    crops: { rice: "چانور", wheat: "ڪڻڪ", maize: "مڪئي", cotton: "ڪپهه", sugarcane: "ڪمڪ", soybean: "سويابين", groundnut: "مونگ ڦلي", mustard: "سرهون", potato: "آلو", onion: "ڪنڊو", tomato: "ٽماٽا", millet: "ٻاجهرو", pulses: "دال", other: "ٻيو" }
  },
  ks: {
    meta: { title: "دَرٛتی AI — آب و ہوا فیصلٕ ذہانت", description: "کاشتکاران تٕ حکومتن ہند بٔہتر آب و ہوا فیصلٕ کَرنَس مدد کَرَن والا AI سان چلان والا پلیٹ فارم", tagline: "زمیٖنس خاطرٕ ذہانت" },
    nav: { home: "ہوم", features: "خصوصیات", about: "ساننٕ بارَس", impact: "اثر", pricing: "قیمت", login: "لاگ اِن", signup: "شروع کرِو", dashboard: "ڈیش بورڈ", analyze: "تجزیٕ", predictions: "پیشگوئی", settings: "ترتیبات", logout: "لاگ آؤٹ" },
    crops: { rice: "تُمُل", wheat: "کَنَک", maize: "مکئی", cotton: "پَمبٕ", sugarcane: "کُنٛد", soybean: "سویابین", groundnut: "مونٛگ پھَلی", mustard: "سَرشوں", potato: "آلُو", onion: "گَنٛد", tomato: "ٹماٹر", millet: "باجرا", pulses: "دال", other: "بیٖ" }
  },
  doi: {
    meta: { title: "धरती AI — जलवायु फैसला बुद्धिमत्ता", description: "किसानां ते सरकारां गी बेहतर जलवायु फैसले लैने च मदद करने आला AI-चालित प्लेटफार्म", tagline: "धरती आस्तै बुद्धिमत्ता" },
    nav: { home: "होम", features: "सुविधाएं", about: "साढ़े बारे च", impact: "प्रभाव", pricing: "कीमत", login: "लॉग इन", signup: "शुरू करो", dashboard: "डैशबोर्ड", analyze: "विश्लेषण", predictions: "भविष्यवाणी", settings: "सेटिंग्स", logout: "लॉग आउट" },
    crops: { rice: "झोना", wheat: "कणक", maize: "मक्की", cotton: "कपाह", sugarcane: "गन्ना", soybean: "सोयाबीन", groundnut: "मूंगफली", mustard: "सरसों", potato: "आलू", onion: "गांडा", tomato: "टमाटर", millet: "बाजरा", pulses: "दाल", other: "होर" }
  },
  kok: {
    meta: { title: "धरती AI — हवामान निर्णय बुद्धिमत्ता", description: "शेतकार आनी सरकारांक बरे हवामान निर्णय घेवपाक मदत करपी AI-चालीत प्लॅटफॉर्म", tagline: "पृथ्वीखातीर बुद्धिमत्ता" },
    nav: { home: "मुखपान", features: "वैशिश्ट्यां", about: "आमचेविशीं", impact: "प्रभाव", pricing: "मोल", login: "लॉग इन", signup: "सुरू करात", dashboard: "डॅशबोर्ड", analyze: "विश्लेषण", predictions: "अदमास", settings: "सेटिंग्ज", logout: "लॉग आऊट" },
    crops: { rice: "तांदूळ", wheat: "गंव", maize: "मको", cotton: "कापूस", sugarcane: "ऊस", soybean: "सोयाबीन", groundnut: "भुंयमूग", mustard: "मोहरी", potato: "बटाट", onion: "कांदो", tomato: "टोमॅटो", millet: "बाजरी", pulses: "दाळ", other: "हेर" }
  },
  mni: {
    meta: { title: "ধরতি AI — ৱাতাবরণ সিদ্ধান্ত বুদ্ধিমত্তা", description: "লৌমী অমসুং সরকারবু ফগৎপা ৱাতাবরণ সিদ্ধান্ত লৌনবা মতেং পাংবা AI-চালিত প্লেটফর্ম", tagline: "পৃথিবীগীদমক বুদ্ধিমত্তা" },
    nav: { home: "হোম", features: "ফিচর্স", about: "ঐখোয়গী মতাংদা", impact: "প্রভাব", pricing: "মচিং", login: "লোগ ইন", signup: "হৌদোকউ", dashboard: "ড্যাশবোর্ড", analyze: "এনালাইজ", predictions: "আশাকী ৱা", settings: "সেটিংস", logout: "লোগ আউট" },
    crops: { rice: "চাউল", wheat: "গেহুঁ", maize: "মকাই", cotton: "লমুম", sugarcane: "কবু", soybean: "সোয়াবীন", groundnut: "বাদাম", mustard: "হাংগাম", potato: "আলু", onion: "তিলহৌ", tomato: "খামেন অহেই", millet: "তারা", pulses: "মশুম", other: "অতোপ্পা" }
  },
  sat: {
    meta: { title: "ᱫᱷᱟᱨᱛᱤ AI — ᱡᱚᱞᱵᱟᱭᱩ ᱯᱷᱮᱥᱞᱟ ᱵᱩᱫᱫᱷᱤᱢᱟᱛᱛᱟ", description: "ᱠᱤᱥᱟᱱ ᱟᱨ ᱥᱚᱨᱠᱟᱨ ᱠᱚᱣᱟᱜ ᱵᱷᱟᱞᱮ ᱡᱚᱞᱵᱟᱭᱩ ᱯᱷᱮᱥᱞᱟ ᱞᱮᱱ ᱨᱮ ᱜᱚᱲᱚ AI-ᱪᱟᱞᱤᱛ ᱯᱞᱮᱴᱯᱷᱟᱨᱢ", tagline: "ᱫᱷᱟᱨᱛᱤ ᱞᱟᱹᱜᱤᱫ ᱵᱩᱫᱫᱷᱤᱢᱟᱛᱛᱟ" },
    nav: { home: "ᱦᱚᱢ", features: "ᱯᱷᱤᱪᱟᱨ", about: "ᱟᱞᱮ ᱵᱟᱵᱚᱛ", impact: "ᱯᱨᱚᱵᱷᱟᱣ", pricing: "ᱢᱚᱞ", login: "ᱞᱚᱜ ᱤᱱ", signup: "ᱮᱛᱚᱦᱚᱵ", dashboard: "ᱰᱮᱥᱵᱚᱨᱰ", analyze: "ᱵᱤᱥᱞᱮᱥᱚᱱ", predictions: "ᱟᱸᱫᱟᱡ", settings: "ᱥᱮᱴᱤᱝ", logout: "ᱞᱚᱜ ᱟᱣᱴ" },
    crops: { rice: "ᱫᱟᱠᱟ", wheat: "ᱜᱚᱢ", maize: "ᱡᱚᱱᱫᱨᱟ", cotton: "ᱠᱟᱯᱟᱥ", sugarcane: "ᱠᱩᱥᱤᱭᱟᱨ", soybean: "ᱥᱚᱭᱟᱵᱤᱱ", groundnut: "ᱵᱟᱫᱟᱢ", mustard: "ᱥᱚᱨᱥᱚ", potato: "ᱟᱞᱩ", onion: "ᱯᱤᱭᱟᱡ", tomato: "ᱴᱚᱢᱟᱴᱚ", millet: "ᱵᱟᱡᱨᱟ", pulses: "ᱫᱟᱞ", other: "ᱮᱴᱟᱜ" }
  },
  bo: {
    meta: { title: "धरती AI — जलवायु निर्णय बुद्धिमत्ता", description: "हालो आरो सरकारनि गेजेराव जलवायु फैसला लानायाव गोहो AI-चालित प्लेटफर्म", tagline: "धरतीनि थाखाय बुद्धिमत्ता" },
    nav: { home: "होम", features: "सुबिधा", about: "जोंनि बेरेखा", impact: "प्रभाव", pricing: "मोन", login: "लग इन", signup: "जागायनाय", dashboard: "डेसबर्ड", analyze: "बिसोरनाय", predictions: "अनुमान", settings: "सेटिंस", logout: "लग आउट" },
    crops: { rice: "माइ", wheat: "गम", maize: "भुटा", cotton: "कपाह", sugarcane: "कुसियार", soybean: "सयाबिन", groundnut: "बादाम", mustard: "सरिसा", potato: "आलु", onion: "पियाज", tomato: "बिलाइ थुरो", millet: "बाजरा", pulses: "दाल", other: "गुबुन" }
  }
};

// Read English template
const enTemplate = JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'en.json'), 'utf8'));

// Helper: deep merge with translated values
function deepMerge(template, translations) {
  const result = {};
  for (const [key, value] of Object.entries(template)) {
    if (translations && translations[key] !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value) && typeof translations[key] === 'object' && !Array.isArray(translations[key])) {
        result[key] = deepMerge(value, translations[key]);
      } else {
        result[key] = translations[key];
      }
    } else {
      // Keep English as fallback
      result[key] = value;
    }
  }
  return result;
}

// For each language, create a full dictionary by merging with English template
for (const [code, data] of Object.entries(langs)) {
  const filePath = path.join(DICT_DIR, `${code}.json`);
  
  // Always inject language labels into onboarding
  if (!data.onboarding) data.onboarding = {};
  if (!data.onboarding.steps) data.onboarding = { ...enTemplate.onboarding };
  if (!data.onboarding.steps) data.onboarding.steps = { ...enTemplate.onboarding.steps };
  if (!data.onboarding.steps.profile) data.onboarding.steps.profile = { ...enTemplate.onboarding.steps.profile };
  data.onboarding.steps.profile.languages = LANG_LABELS;

  const merged = deepMerge(enTemplate, data);
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`✅ Created ${code}.json (${LANG_LABELS[code]})`);
}

console.log(`\n✨ All ${Object.keys(langs).length} translation files created!`);
