// Comprehensive Multilingual Job Localization Engine for VoiceHire
import { getProfession, PROFESSIONS } from '../styles/theme'

// City translations mapping
const CITY_TRANSLATIONS = {
  bengaluru: {
    en: 'Bengaluru',
    kn: 'ಬೆಂಗಳೂರು',
    hi: 'बेंगलुरु',
    te: 'బెంగళూరు',
    ta: 'பெங்களூரு',
    ml: 'ബെംഗളൂരു',
    bn: 'বেঙ্গালুরু',
    es: 'Bangalore',
  },
  bangalore: {
    en: 'Bengaluru',
    kn: 'ಬೆಂಗಳೂರು',
    hi: 'बेंगलुरु',
    te: 'బెంగళూరు',
    ta: 'பெங்களூரு',
    ml: 'ബെംഗളൂരു',
    bn: 'বেঙ্গালুরু',
    es: 'Bangalore',
  },
  mysuru: {
    en: 'Mysuru',
    kn: 'ಮೈಸೂರು',
    hi: 'मैसूर',
    te: 'మైసూర్',
    ta: 'மைசூர்',
    ml: 'മൈസൂർ',
    bn: 'মহীশূর',
    es: 'Mysore',
  },
  mysore: {
    en: 'Mysuru',
    kn: 'ಮೈಸೂರು',
    hi: 'मैसूर',
    te: 'మైసూర్',
    ta: 'மைசூர்',
    ml: 'മൈസൂർ',
    bn: 'মহীশূর',
    es: 'Mysore',
  },
  mangaluru: {
    en: 'Mangaluru',
    kn: 'ಮಂಗಳೂರು',
    hi: 'मंगलौर',
    te: 'మంగళూరు',
    ta: 'மங்களூரு',
    ml: 'മംഗലാപുരം',
    bn: 'ম্যাঙ্গালোর',
    es: 'Mangalore',
  },
  mangalore: {
    en: 'Mangaluru',
    kn: 'ಮಂಗಳೂರು',
    hi: 'मंगलौर',
    te: 'మంగళూరు',
    ta: 'மங்களூரு',
    ml: 'മംഗലാപുരം',
    bn: 'ম্যাঙ্গালোর',
    es: 'Mangalore',
  },
  ujire: {
    en: 'Ujire',
    kn: 'ಉಜಿರೆ',
    hi: 'उजिरे',
    te: 'ఉజిరే',
    ta: 'உஜிரே',
    ml: 'ഉജിരെ',
    bn: 'উজিরে',
    es: 'Ujire',
  },
  dharmasthala: {
    en: 'Dharmasthala',
    kn: 'ಧರ್ಮಸ್ಥಳ',
    hi: 'धर्मस्थल',
    te: 'ధర్మస్థల',
    ta: 'தர்மஸ்தலா',
    ml: 'ധർമ്മസ്ഥല',
    bn: 'ধর্মস্থল',
    es: 'Dharmasthala',
  },
  hubballi: {
    en: 'Hubballi',
    kn: 'ಹುಬ್ಬಳ್ಳಿ',
    hi: 'हुबली',
    te: 'హుబ్పళ్ళి',
    ta: 'ஹூப்ளி',
    ml: 'ഹുബ്ബള്ളി',
    bn: 'হুবলি',
    es: 'Hubballi',
  },
  tumakuru: {
    en: 'Tumakuru',
    kn: 'ತುಮಕೂರು',
    hi: 'तुमकुर',
    te: 'తుమకూరు',
    ta: 'தும்கூர்',
    ml: 'തുമകൂരു',
    bn: 'তুমকুর',
    es: 'Tumakuru',
  },
  belagavi: {
    en: 'Belagavi',
    kn: 'ಬೆಳಗಾವಿ',
    hi: 'बेलगाम',
    te: 'బెల్గాం',
    ta: 'பெல்காம்',
    ml: 'ബെൽഗാം',
    bn: 'বেলগাম',
    es: 'Belagavi',
  },
  delhi: {
    en: 'Delhi NCR',
    kn: 'ದೆಹಲಿ (NCR)',
    hi: 'दिल्ली (NCR)',
    te: 'ఢిల్లీ (NCR)',
    ta: 'டெல்லி (NCR)',
    ml: 'ഡൽഹി (NCR)',
    bn: 'দিল্লি (NCR)',
    es: 'Delhi NCR',
  },
}

// Clean Native Profession Titles for Badge Display
const NATIVE_PROFESSION_TITLES = {
  DRIVER: {
    en: 'Professional Driver',
    kn: 'ಚಾಲಕ',
    hi: 'ड्राइवर',
    te: 'డ్రైవర్',
    ta: 'ஓட்டுநர்',
    ml: 'ഡ്രൈവർ',
    bn: 'ড্রাইভার',
    es: 'Conductor',
  },
  ELECTRICIAN: {
    en: 'Electrician',
    kn: 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್',
    hi: 'इलेक्ट्रीशियन',
    te: 'ఎలక్ట్రీషియన్',
    ta: 'மின்சார வல்லுநர்',
    ml: 'ഇലക്ട്രീഷ്യൻ',
    bn: 'ইলেকট্রিশিয়ান',
    es: 'Electricista',
  },
  PLUMBER: {
    en: 'Plumber',
    kn: 'ಪ್ಲಂಬರ್',
    hi: 'प्लम्बर',
    te: 'ప్లంబర్',
    ta: 'குழாய் அமைப்பாளர்',
    ml: 'പ്ലംബർ',
    bn: 'প্লাম্বার',
    es: 'Fontanero',
  },
  CARPENTER: {
    en: 'Carpenter',
    kn: 'ಬಡಗಿ',
    hi: 'बढ़ई',
    te: 'వడ్రంగి',
    ta: 'தச்சர்',
    ml: 'ആശാരി',
    bn: 'ছুতার',
    es: 'Carpintero',
  },
  HELPER: {
    en: 'Helper / Labour',
    kn: 'ಸಹಾಯಕ (ಹಮಾಲಿ)',
    hi: 'सहायक (हमाली)',
    te: 'సహాయకుడు (హమాలీ)',
    ta: 'உதவியாளர்',
    ml: 'ഹെൽപ്പർ',
    bn: 'সহকারী',
    es: 'Ayudante',
  },
  COOK: {
    en: 'Cook / Chef',
    kn: 'ಅಡುಗೆಯವರು',
    hi: 'रसोइया',
    te: 'వంట మనిషి',
    ta: 'சமையல்காரர்',
    ml: 'പാചകക്കാരൻ',
    bn: 'বাবুর্চি',
    es: 'Cocinero',
  },
  PAINTER: {
    en: 'Painter',
    kn: 'ಪೇಂಟರ್',
    hi: 'पेंटर',
    te: 'పెయింటర్',
    ta: 'பெயிண்டர்',
    ml: 'പെയിന്റർ',
    bn: 'রঙমিস্ত্রি',
    es: 'Pintor',
  },
  WELDER: {
    en: 'Welder',
    kn: 'ವೆಲ್ಡರ್',
    hi: 'वेल्डर',
    te: 'వెల్డర్',
    ta: 'வெல்டர்',
    ml: 'വെൽഡർ',
    bn: 'ওয়েল্ডার',
    es: 'Soldador',
  },
  MECHANIC: {
    en: 'Mechanic',
    kn: 'ಮೆಕ್ಯಾನಿಕ್',
    hi: 'मेकेनिक',
    te: 'మెకానిక్',
    ta: 'இயந்திரவியலாளர்',
    ml: 'മെക്കാനിക്',
    bn: 'মেকানিক',
    es: 'Mecánico',
  },
  MASON: {
    en: 'Mason',
    kn: 'ಮೇಸ್ತ್ರಿ',
    hi: 'राजमिस्त्री',
    te: 'మేస్త్రీ',
    ta: 'கொத்தனார்',
    ml: 'മേസ്തിരി',
    bn: 'রাজমিস্ত্রি',
    es: 'Albañil',
  },
  CLEANER: {
    en: 'Housekeeping / Cleaner',
    kn: 'ಸ್ವಚ್ಛತಾಗಾರ',
    hi: 'सफाईकर्मी',
    te: 'సఫాయి మనిషి',
    ta: 'துப்புரவாளர்',
    ml: 'ശുചീകരണ തൊഴിലാളി',
    bn: 'ঝাড়ুদার',
    es: 'Limpiador',
  },
  SECURITY_GUARD: {
    en: 'Security Guard',
    kn: 'ಸೆಕ್ಯೂರಿಟಿ ಗಾರ್ಡ್',
    hi: 'सुरक्षा गार्ड',
    te: 'సెక్యూరిటీ గార్డ్',
    ta: 'பாதுகாவலர்',
    ml: 'സെക്യൂരിറ്റി ഗാർഡ്',
    bn: 'নিরাপত্তা রক্ষী',
    es: 'Guardia de Seguridad',
  },
  SECURITY: {
    en: 'Security Guard',
    kn: 'ಸೆಕ್ಯೂರಿಟಿ ಗಾರ್ಡ್',
    hi: 'सुरक्षा गार्ड',
    te: 'సెక్యూరిటీ గార్డ్',
    ta: 'பாதுகாவலர்',
    ml: 'സെക്യൂരിറ്റി ഗാർഡ്',
    bn: 'নিরাপত্তা রক্ষী',
    es: 'Guardia de Seguridad',
  },
  DELIVERY_WORKER: {
    en: 'Delivery Partner',
    kn: 'ಡೆಲಿವರಿ ಬಾಯ್',
    hi: 'डिलीवरी पार्टनर',
    te: 'డెలివరీ బాయ్',
    ta: 'டெலிவரி ஊழியர்',
    ml: 'ഡെലിവറി ബോയ്',
    bn: 'ডেলিভারি বয়',
    es: 'Repartidor',
  },
  DELIVERY: {
    en: 'Delivery Partner',
    kn: 'ಡೆಲಿವರಿ ಬಾಯ್',
    hi: 'डिलीवरी पार्टनर',
    te: 'డెలివరీ బాయ్',
    ta: 'டெலிவரி ஊழியர்',
    ml: 'ഡെലിവറി ബോയ്',
    bn: 'ডেলিভারি বয়',
    es: 'Repartidor',
  },
  GARDENER: {
    en: 'Gardener',
    kn: 'ತೋಟಗಾರ',
    hi: 'माली',
    te: 'తోటమాలి',
    ta: 'தோட்டக்காரர்',
    ml: 'തോട്ടക്കാരൻ',
    bn: 'মালী',
    es: 'Jardinero',
  },
  TAILOR: {
    en: 'Tailor',
    kn: 'ದರ್ಜಿ',
    hi: 'दर्जी',
    te: 'దర్జీ',
    ta: 'தையல்காரர்',
    ml: 'തയ്യൽക്കാരൻ',
    bn: 'দর্জি',
    es: 'Sastre',
  },
}

// Known Titles Translations Dictionary
const JOB_TITLE_TRANSLATIONS = {
  // Job 1
  'professional driver (private car & cab)': {
    kn: 'ವೃತ್ತಿಪರ ಚಾಲಕ (ಖಾಸಗಿ ಕಾರು ಮತ್ತು ಕ್ಯಾಬ್)',
    hi: 'प्रोफेशनल ड्राइवर (प्राइवेट कार एवं कैब)',
    te: 'ప్రొఫెషనల్ డ్రైవర్ (ప్రైవేట్ కారు & క్యాబ్)',
    ta: 'தொழில்முறை ஓட்டுநர் (தனியார் கார் மற்றும் கேப்)',
    ml: 'പ്രൊഫഷണൽ ഡ്രൈവർ (സ്വകാര്യ കാറും ക്യാബും)',
    bn: 'পেশাদার ড্রাইভার (ব্যক্তিগত গাড়ি ও ক্যাব)',
    es: 'Conductor Profesional (Auto Privado y Taxi)',
  },
  // Job 2
  'commercial truck & e-commerce delivery driver': {
    kn: 'ವಾಣಿಜ್ಯ ಟ್ರಕ್ ಮತ್ತು ಇ-ಕಾಮರ್ಸ್ ಡೆಲಿವರಿ ಚಾಲಕ',
    hi: 'कमर्शियल ट्रक एवं ई-कॉमर्स डिलीवरी ड्राइवर',
    te: 'కమర్షియల్ ట్రక్ மற்றும் ఇ-కామర్స్ డెలివరీ డ్రైవర్',
    ta: 'வணிக லாரி மற்றும் இ-காமர்ஸ் டெலிவரி ஓட்டுநர்',
    ml: 'കൊമേഴ്സ്യൽ ട്രക്കും ഇ-കൊമേഴ്സ് ഡെലിവറി ഡ്രൈവറും',
    bn: 'বাণিজ্যিক ট্রাক ও ই-কমার্স ডেলিভারি ড্রাইভার',
    es: 'Conductor de Camión Comercial y Entregas',
  },
  // Job 3
  'modular furniture carpenter & assembler': {
    kn: 'ಮಾಡ್ಯುಲರ್ ಪೀಠೋಪಕರಣ ಬಡಗಿ ಮತ್ತು ಅಸೆಂಬ್ಲರ್',
    hi: 'मॉड्यूलर फर्नीचर बढ़ई एवं असेंबलर',
    te: 'మాడ్యులర్ ఫర్నిచర్ వడ్రంగి & అసెంబ్లర్',
    ta: 'மாடுலர் மரச்சாமான்கள் தச்சர் மற்றும் அசெம்பிளர்',
    ml: 'മോഡുലാർ ഫർണിച്ചർ ആശാരി',
    bn: 'মডুলার আসবাবপত্র ছুতার ও সংযোজক',
    es: 'Carpintero y Ensamblador de Muebles Modulares',
  },
  // Job 4
  'construction & warehouse general helper': {
    kn: 'ಕಟ್ಟಡ ಮತ್ತು ಗೋದಾಮು ಸಾಮಾನ್ಯ ಸಹಾಯಕ',
    hi: 'निर्माण एवं गोदाम सामान्य सहायक',
    te: 'నిర్మాణ & గోడౌన్ సాధారణ సహాయకుడు',
    ta: 'கட்டுமானம் மற்றும் கிடங்கு பொது உதவியாளர்',
    ml: 'നിർമ്മാണ & വെയർഹൗസ് ജനറൽ ഹെൽപ്പർ',
    bn: 'নির্মাণ ও গুদাম সাধারণ সহকারী',
    es: 'Ayudante General de Construcción y Almacén',
  },
  // Job 5
  'residential daily cook & kitchen associate': {
    kn: 'ಮನೆ ಅಡುಗೆಯವರು ಮತ್ತು ಕಿಚನ್ ಸಹಾಯಕ',
    hi: 'घरेलू रसोइया एवं किचन सहयोगी',
    te: 'ఇంటి వంట మనిషి & వంటగది సహాయకుడు',
    ta: 'வீட்டு சமையல்காரர் & சமையலறை உதவியாளர்',
    ml: 'വീട്ടു പാചകക്കാരനും അടുക്കള സഹായിയും',
    bn: 'গৃহস্থালী বাবুর্চি ও রান্নাঘর সহকারী',
    es: 'Cocinero Residencial y Asistente de Cocina',
  },
  // Job 6
  'interior wall painter & spray polisher': {
    kn: 'ಮನೆ ಪೇಂಟರ್ ಮತ್ತು ಸ್ಪ್ರೇ ಪಾಲಿಶರ್',
    hi: 'हाउस पेंटर एवं स्प्रे पॉलिशर',
    te: 'ఇంటి పెయింటర్ & స్ప్రే పాలిషర్',
    ta: 'வீட்டு பெயிண்டர் மற்றும் ஸ்ப்ரே பாலிஷர்',
    ml: 'ഹൗസ് പെയിന്ററും സ്പ്രേ പോളിഷറും',
    bn: 'রঙমিস্ত্রি ও স্প্রে পলিশার',
    es: 'Pintor de Interiores y Pulidor de Spray',
  },
  // Job 7
  'licensed building electrician & wireman': {
    kn: 'ಪರವಾನಗಿ ಪಡೆದ ಕಟ್ಟಡ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ & ವೈರ್‌ಮ್ಯಾನ್',
    hi: 'लाइसेंस प्राप्त बिल्डिंग इलेक्ट्रीशियन एवं वायरमैन',
    te: 'లైసెన్స్ పొందిన ఎలక్ట్రీషియన్ & వైర్‌మ్యాన్',
    ta: 'உரிமம் பெற்ற கட்டிட எலக்ட்ரீஷியன் & வயர்மேன்',
    ml: 'ലൈസൻസുള്ള ഇലക്ട്രീഷ്യനും വയർമാനും',
    bn: 'লাইসেন্সপ্রাপ্ত বিল্ডিং ইলেকট্রিশিয়ান ও ওয়্যারম্যান',
    es: 'Electricista y Montador de Cableado de Edificios',
  },
  // Job 8
  'sanitary & commercial pipe plumber': {
    kn: 'ಸ್ಯಾನಿಟರಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಪೈಪ್ ಪ್ಲಂಬರ್',
    hi: 'सेनेटरी एवं कमर्शियल पाइप प्लम्बर',
    te: 'శానిటరీ & కమర్షియల్ పైప్ ప్లంబర్',
    ta: 'சுகாதார மற்றும் வணிக குழாய் பிளம்பர்',
    ml: 'സാനിറ്ററി & കൊമേഴ്സ്യൽ പൈപ്പ് പ്ലംബർ',
    bn: 'স্যানিটারি ও বাণিজ্যিক পাইপ প্লাম্বার',
    es: 'Fontanero de Tuberías Sanitarias y Comerciales',
  },
}

// Company / Employer Name Translations
const EMPLOYER_NAME_TRANSLATIONS = {
  'nandi motors & cabs': {
    kn: 'ನಂದಿ ಮೋಟಾರ್ಸ್ & ಕ್ಯಾಬ್ಸ್',
    hi: 'नंदी मोटर्स एवं कैब्स',
    te: 'నంది మోటార్స్ & క్యాబ్స్',
    ta: 'நந்தி மோட்டார்ஸ் & கேப்ஸ்',
  },
  'express logistics india': {
    kn: 'ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಇಂಡಿಯಾ',
    hi: 'एक्सप्रेस लॉजिस्टिक्स इंडिया',
    te: 'ఎక్స్‌ప్రెస్ లాజిస్టిక్స్ ఇండియా',
    ta: 'எக்ஸ்பிரஸ் லாஜிஸ்டிக்ஸ்',
  },
  'woodcraft interior studios': {
    kn: 'ವುಡ್‌ಕ್ರಾಫ್ಟ್ ಇಂಟೀರಿಯರ್ ಸ್ಟುಡಿಯೋಸ್',
    hi: 'वुडक्राफ्ट इंटीरियर स्टूडियो',
    te: 'వుడ్‌క్రాఫ్ట్ ఇంటీరియర్స్',
    ta: 'வுட்கிராஃப்ட் இன்டீரியர்ஸ்',
  },
  'skyline infrastructure': {
    kn: 'ಸ್ಕೈಲೈನ್ ಇನ್‌ಫ್ರಾಸ್ಟ್ರಕ್ಚರ್',
    hi: 'स्काईलाइन इंफ्रास्ट्रक्चर',
    te: 'స్కైలైన్ ఇన్‌ఫ్రాస్ట్రక్చర్',
    ta: 'ஸ்கைலைன் இன்ஃப்ரா',
  },
  'urban home services': {
    kn: 'ಅರ್ಬನ್ ಹೋಮ್ ಸರ್ವಿಸಸ್',
    hi: 'अर्बन होम सर्विसेज',
    te: 'అర్బన్ హోమ్ సర్వీసెస్',
    ta: 'அர்பன் ஹோம் சர்வீசஸ்',
  },
  'rainbow finishes': {
    kn: 'ರೇನ್‌ಬೋ ಫಿನಿಷಸ್',
    hi: 'रेनबो फिनिशेस',
    te: 'రెయిన్‌బో ఫినిషెస్',
    ta: 'ரெயின்போ ஃபினிஷஸ்',
  },
  'powertech electricals': {
    kn: 'ಪವರ್‌ಟೆಕ್ ಎಲೆಕ್ಟ್ರಿಕಲ್ಸ್',
    hi: 'पावरटेक इलेक्ट्रिकल्स',
    te: 'పవర్‌టెక్ ఎలక్ట్రికల్స్',
    ta: 'பவர்டெக் எலக்ட்ரிகல்ஸ்',
  },
  'aquaflow services': {
    kn: 'ಅಕ್ವಾಫ್ಲೋ ಸರ್ವಿಸಸ್',
    hi: 'एक्वाफ्लो सर्विसेज',
    te: 'ఆక్వాఫ్లో సర్వీసెస్',
    ta: 'அக்வாஃப்ளோ சர்வீசஸ்',
  },
}

/**
 * Localize Experience text (e.g. "2+ Years" -> "2+ ವರ್ಷಗಳ ಅನುಭವ")
 */
export const getLocalizedExperience = (expStr = '', langCode = 'en') => {
  const lang = (langCode || 'en').split('-')[0].toLowerCase()
  if (lang === 'en') return expStr || '1+ Years Experience'

  const numMatch = String(expStr).match(/\d+/)
  const num = numMatch ? numMatch[0] : '1'

  switch (lang) {
    case 'kn':
      return `${num}+ ವರ್ಷಗಳ ಅನುಭವ`
    case 'hi':
      return `${num}+ वर्ष का अनुभव`
    case 'te':
      return `${num}+ సంవత్సరాల అనుభవం`
    case 'ta':
      return `${num}+ வருட அனுபவம்`
    case 'ml':
      return `${num}+ വർഷത്തെ പരിചയം`
    case 'bn':
      return `${num}+ বছরের অভিজ্ঞতা`
    case 'es':
      return `${num}+ años de experiencia`
    default:
      return `${num}+ Years Experience`
  }
}

/**
 * Localize City / Location
 */
export const getLocalizedLocation = (loc = '', langCode = 'en') => {
  const lang = (langCode || 'en').split('-')[0].toLowerCase()
  if (!loc) return lang === 'kn' ? 'ಬೆಂಗಳೂರು' : 'Bengaluru'

  const clean = loc.trim().toLowerCase()
  if (CITY_TRANSLATIONS[clean] && CITY_TRANSLATIONS[clean][lang]) {
    return CITY_TRANSLATIONS[clean][lang]
  }

  // Check substring
  for (const [key, mapping] of Object.entries(CITY_TRANSLATIONS)) {
    if (clean.includes(key) && mapping[lang]) {
      return mapping[lang]
    }
  }

  return loc
}

/**
 * Localize Work Timing (e.g. "8 AM – 6 PM" -> "ಬೆಳಿಗ್ಗೆ 8 – ಸಂಜೆ 6")
 */
export const getLocalizedWorkTime = (timeStr = '', langCode = 'en') => {
  const lang = (langCode || 'en').split('-')[0].toLowerCase()
  if (!timeStr || lang === 'en') return timeStr || '9 AM – 6 PM'

  // Extract start and end numbers
  const times = timeStr.match(/\d+/g)
  const start = times?.[0] || '9'
  const end = times?.[1] || '6'

  switch (lang) {
    case 'kn':
      return `ಬೆಳಿಗ್ಗೆ ${start} – ಸಂಜೆ ${end}`
    case 'hi':
      return `सुबह ${start} – शाम ${end}`
    case 'te':
      return `ఉదయం ${start} – సాయంత్రం ${end}`
    case 'ta':
      return `காலை ${start} – மாலை ${end}`
    case 'ml':
      return `രാവിലെ ${start} – വൈകുന്നേരം ${end}`
    case 'bn':
      return `সকাল ${start} – সন্ধ্যা ${end}`
    default:
      return `${start} AM – ${end} PM`
  }
}

/**
 * Localize Job Title dynamically based on trade and custom keywords
 */
export const getLocalizedJobTitle = (rawTitle = '', category = '', langCode = 'en') => {
  const lang = (langCode || 'en').split('-')[0].toLowerCase()
  if (!rawTitle || lang === 'en') return rawTitle

  const clean = rawTitle.trim().toLowerCase()

  // 1. Direct match with known seed jobs
  if (JOB_TITLE_TRANSLATIONS[clean] && JOB_TITLE_TRANSLATIONS[clean][lang]) {
    return JOB_TITLE_TRANSLATIONS[clean][lang]
  }

  // 2. Keyword substring matching
  const prof = getProfession(category, rawTitle)
  const badgeTitle = NATIVE_PROFESSION_TITLES[prof.id]?.[lang] || prof.title

  // Check if title mentions a city
  let detectedCity = ''
  for (const [cityKey, cityMap] of Object.entries(CITY_TRANSLATIONS)) {
    if (clean.includes(cityKey)) {
      detectedCity = cityMap[lang] || cityKey
      break
    }
  }

  if (detectedCity) {
    switch (lang) {
      case 'kn':
        return `${badgeTitle} (${detectedCity})`
      case 'hi':
        return `${badgeTitle} (${detectedCity})`
      case 'te':
        return `${badgeTitle} (${detectedCity})`
      case 'ta':
        return `${badgeTitle} (${detectedCity})`
      case 'ml':
        return `${badgeTitle} (${detectedCity})`
      case 'bn':
        return `${badgeTitle} (${detectedCity})`
      case 'es':
        return `${badgeTitle} (${detectedCity})`
      default:
        return `${badgeTitle} in ${detectedCity}`
    }
  }

  // General fallback: return native trade title with original qualifier if present
  if (badgeTitle && badgeTitle !== prof.title) {
    return `${badgeTitle} (${rawTitle})`
  }

  return rawTitle
}

/**
 * Localize Employer / Company Name
 */
export const getLocalizedEmployer = (empName = '', langCode = 'en') => {
  const lang = (langCode || 'en').split('-')[0].toLowerCase()
  if (!empName || lang === 'en') return empName

  const clean = empName.trim().toLowerCase()
  if (EMPLOYER_NAME_TRANSLATIONS[clean] && EMPLOYER_NAME_TRANSLATIONS[clean][lang]) {
    return EMPLOYER_NAME_TRANSLATIONS[clean][lang]
  }

  return empName
}

/**
 * Get Clean Native Profession Badge
 */
export const getLocalizedProfessionBadge = (category = '', title = '', langCode = 'en') => {
  const lang = (langCode || 'en').split('-')[0].toLowerCase()
  const prof = getProfession(category, title)
  return NATIVE_PROFESSION_TITLES[prof.id]?.[lang] || prof.title
}

/**
 * Main Comprehensive Job Localizer
 * Returns fully localized fields + native text-to-speech string
 */
export const getLocalizedJob = (job, langCode = 'en') => {
  if (!job) return null
  const lang = (langCode || 'en').split('-')[0].toLowerCase()

  const prof = getProfession(job.category, job.title)
  const rawTitle = job.title || prof.title
  const title = getLocalizedJobTitle(rawTitle, job.category || prof.id, langCode)
  const badge = getLocalizedProfessionBadge(job.category || prof.id, rawTitle, langCode)
  const location = getLocalizedLocation(job.location || 'Bengaluru', langCode)
  const experience = getLocalizedExperience(job.experience || '1+ Years', langCode)
  const workTime = getLocalizedWorkTime(job.workTime || '9 AM – 6 PM', langCode)
  const employerName = getLocalizedEmployer(job.employerName || job.companyName || 'Verified Employer', langCode)

  const wageNum = job.dailyWage || 1200
  let perDayLabel = '/ Day'
  switch (lang) {
    case 'kn':
      perDayLabel = '/ದಿನ'
      break
    case 'hi':
      perDayLabel = '/दिन'
      break
    case 'te':
      perDayLabel = '/రోజు'
      break
    case 'ta':
      perDayLabel = '/நாள்'
      break
    case 'ml':
      perDayLabel = '/ദിവസം'
      break
    case 'bn':
      perDayLabel = '/দিন'
      break
    case 'es':
      perDayLabel = '/día'
      break
    default:
      perDayLabel = '/ Day'
  }
  const salary = `₹${wageNum} ${perDayLabel}`

  // Multilingual Audio Speech String for Voice Listen Button
  let speechText = ''
  switch (lang) {
    case 'kn':
      speechText = `${title}. ಕೆಲಸದ ವಿಭಾಗ: ${badge}. ಸ್ಥಳ: ${location}. ದಿನದ ಸಂಬಳ: ₹${wageNum}. ಕೆಲಸದ ಸಮಯ: ${workTime}. ಅಗತ್ಯವಿರುವ ಅನುಭವ: ${experience}. ಮಾಲೀಕರು: ${employerName}.`
      break
    case 'hi':
      speechText = `${title}। कार्य श्रेणी: ${badge}। स्थान: ${location}। दैनिक वेतन: ₹${wageNum} प्रति दिन। काम का समय: ${workTime}। आवश्यक अनुभव: ${experience}। नियोक्ता: ${employerName}।`
      break
    case 'te':
      speechText = `${title}. పని విభాగం: ${badge}. ప్రదేశం: ${location}. దినసరి వేతనం: ₹${wageNum}. పని సమయం: ${workTime}. అనుభవం: ${experience}. యజమాని: ${employerName}.`
      break
    case 'ta':
      speechText = `${title}. பணி வகை: ${badge}. இடம்: ${location}. தினசரி சம்பளம்: ₹${wageNum}. வேலை நேரம்: ${workTime}. அனுபவம்: ${experience}. முதலாளி: ${employerName}.`
      break
    case 'ml':
      speechText = `${title}. തൊഴിൽ വിഭാഗം: ${badge}. സ്ഥലം: ${location}. ദിവസ വേതനം: ₹${wageNum}. ജോലി സമയം: ${workTime}. പരിചയം: ${experience}.`
      break
    case 'bn':
      speechText = `${title}। কাজের বিভাগ: ${badge}। স্থান: ${location}। দৈনিক বেতন: ₹${wageNum}। কাজের সময়: ${workTime}। অভিজ্ঞতা: ${experience}।`
      break
    case 'es':
      speechText = `${title}. Categoría: ${badge}. Ubicación: ${location}. Salario diario: ₹${wageNum}. Horario: ${workTime}. Experiencia requerida: ${experience}.`
      break
    default:
      speechText = `${title}. Category: ${badge}. Location: ${location}. Daily salary: ₹${wageNum}. Work timing: ${workTime}. Experience required: ${experience}. Employer: ${employerName}.`
  }

  return {
    ...job,
    prof,
    title,
    badge,
    location,
    experience,
    workTime,
    salary,
    employerName,
    speechText,
  }
}
