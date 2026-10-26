// Production Multilingual Voice NLP Engine for VoiceHire
export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
]

export const JOB_CATEGORY_DICTIONARY = {
  DRIVER: [
    'driver', 'drivers', 'driving', 'cab driver', 'car driver', 'taxi driver', 'truck driver', 'auto driver', 'commercial driver', 'chauffeur',
    'चालक', 'गाड़ी', 'ड्राइवर', 'ड्राइविंग',
    'ಚಾಲಕ', 'ಡ್ರೈವರ್', 'ಡ್ರೈವಿಂಗ್',
    'చాలక', 'గాడీ', 'డ్రైవర్', 'డ్రైవింగ్',
    'ஓட்டுநர்', 'டிரைவர்'
  ],
  CARPENTER: [
    'carpenter', 'carpenters', 'carpentry', 'wood worker', 'woodworker', 'furniture worker', 'wood work', 'woodwork',
    'बढ़ई', 'कारपेंटर', 'लकड़ी', 'फर्नीचर',
    'ಬಡಗಿ', 'ಮರಗೆಲಸ', 'ಕಾರ್ಪೆಂಟರ್',
    'వడ్రంగి', 'కార్పెంటర్',
    'தச்சர்'
  ],
  HELPER: [
    'helper', 'helpers', 'general worker', 'general workers', 'worker', 'workers', 'labor', 'labour', 'construction worker', 'loading', 'unloading', 'coolie', 'hamali', 'assistant', 'packers', 'mover', 'factory worker', 'warehouse worker',
    'हेल्पर', 'हेल्पर्स', 'सहायक', 'मजदूर', 'कामगार', 'कुली', 'पल्लेदार', 'हमाली',
    'ಹೆಲ್ಪರ್', 'ಸಹಾಯಕ', 'ಕೂಲಿ', 'ಕೆಲಸಗಾರ',
    'సహాయకుడు', 'హెల్పర్', 'కూలీ', 'శ్రామికుడు',
    'கூலியாள்', 'உதவியாளர்'
  ],
  HOUSEHELP: [
    'househelp', 'house help', 'cook', 'cooking', 'chef', 'rasoi', 'maid', 'housemaid', 'cleaner', 'cleaning', 'sweeper', 'housekeeper', 'babysitter', 'ayah',
    'रसोइया', 'खाना', 'रसोई', 'बाई', 'कामवाली', 'सफाई वाला', 'सफाई', 'घरेलू', 'झाड़ू', 'आया',
    'ಅಡುಗೆಯವ', 'ಅಡುಗೆ', 'ಸ್ವಚ್ಛತಾಗಾರ', 'ಸಫಾಯಿ', 'ಮನೆಗೆಲಸ',
    'వంట మనిషి', 'వంట', 'సఫాయి', 'శుభ్రం', 'ఇంటి పని',
    'சமையல்காரர்', 'துப்புரவாளர்', 'வீட்டு வேலை'
  ],
  PAINTER: [
    'painter', 'painters', 'painting', 'paint worker', 'wall painter', 'whitewash',
    'पेंटर', 'पुताई', 'रंगाई', 'रंग',
    'ಪೇಂಟರ್', 'ಬಣ್ಣ',
    'పెయింటర్', 'రంగులు',
    'வண்ணப்பூச்சாளர்', 'பெயிண்டர்'
  ],
  ELECTRICIAN: [
    'electrician', 'electricians', 'electrical', 'wiring', 'wire worker', 'light fitting',
    'इलेक्ट्रीशियन', 'बिजली', 'वायरिंग',
    'ಇಲೆಕ್ಟ್ರೀಷಿಯನ್', 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್', 'ವೈರಿಂಗ್', 'ಕರೆಂಟ್',
    'ఎలక్ట్రీషియన్', 'కరెంట్', 'వైరింగ్',
    'மின்சார வல்லுநர்', 'எலக்ட்ரீஷியன்'
  ],
  PLUMBER: [
    'plumber', 'plumbers', 'plumbing', 'pipe worker', 'water pipe', 'tap repair', 'leakage',
    'प्लम्बर', 'नल', 'पाइप',
    'ಪ್ಲಂಬರ್', 'ಪೈಪ್',
    'ప్లంబర్', 'పైపులు',
    'குழாய் அமைப்பாளர்', 'பிளம்பர்'
  ],
  MASON: [
    'mason', 'masons', 'masonry', 'brick worker', 'construction mason', 'cement worker', 'plaster',
    'राजमिस्त्री', 'मिस्त्री', 'चिनाई',
    'ಮೇಸ್ತ್ರಿ', 'ಗಾರೆ',
    'మేస్త్రీ', 'ఇటుక',
    'கொத்தனார்'
  ],
  MECHANIC: [
    'mechanic', 'mechanics', 'repair', 'auto mechanic', 'bike mechanic', 'car mechanic', 'garage',
    'मेकेनिक', 'मैकेनिक', 'रिपेयर', 'गैराज',
    'ಮೆಕ್ಯಾನಿಕ್', 'ರಿಪೇರಿ',
    'మెకానిక్', 'రిపేర్',
    'இயந்திரவியலாளர்', 'மெக்கானிக்'
  ],
  WELDER: [
    'welder', 'welders', 'welding', 'iron worker', 'fabrication',
    'वेल्डर', 'वेल्डिंग', 'लोहार',
    'ವೆಲ್ಡರ್', 'ವೆಲ್ಡಿಂಗ್',
    'వెల్డర్', 'వెల్డింగ్',
    'வெல்டர்'
  ],
  SECURITY_GUARD: [
    'guard', 'guards', 'security', 'night guard', 'security guard', 'watchman', 'chowkidar',
    'सुरक्षा गार्ड', 'चौकीदार', 'गार्ड',
    'ಸೆಕ್ಯೂರಿಟಿ ಗಾಡ್', 'ಕಾವಲುಗಾರ',
    'సెక్యూరిటీ గార్డ్', 'కాపలా',
    'பாதுகாவலர்', 'காவலாளி'
  ],
  DELIVERY_WORKER: [
    'delivery', 'courier', 'rider', 'delivery boy', 'delivery worker', 'swiggy', 'zomato',
    'डिलीवरी', 'डिलीवरी बॉय', 'कूरियर',
    'ಡೆಲಿವರಿ', 'ಡೆಲಿವರಿ ಬಾಯ್',
    'డెలివరీ', 'బోయ్',
    'டெலிவரி'
  ],
  TAILOR: [
    'tailor', 'tailoring', 'stitching', 'garment worker', 'sewing',
    'दर्जी', 'सिलाई', 'टेलर',
    'ದರ್ಜಿ', 'ಹೊಲಿಗೆ',
    'దర్జీ', 'కుట్టు',
    'தையல்காரர்'
  ],
  FARM_WORKER: [
    'farm', 'farmer', 'agriculture', 'farm worker', 'crop worker', 'tractor',
    'किसान', 'खेती', 'कृषि',
    'ರೈತ', 'ಕೃಷಿ',
    'రైతు', 'వ్యవసాయం',
    'விவசாய'
  ],
}

export const normalizeSpeechText = (text) => {
  if (!text) return ''
  let str = text.toLowerCase().trim()
  str = str.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ').replace(/\s+/g, ' ').trim()
  return str
}

export const extractCategory = (normalizedText) => {
  for (const [category, synonyms] of Object.entries(JOB_CATEGORY_DICTIONARY)) {
    for (const syn of synonyms) {
      // Check full word boundary match or substring for long compound words
      const regex = new RegExp(`\\b${syn}\\b`, 'i')
      if (regex.test(normalizedText) || normalizedText.includes(syn)) {
        return category
      }
    }
  }
  return null
}

export const extractLocation = (normalizedText) => {
  const locations = [
    { name: 'Bengaluru', triggers: ['bengaluru', 'bangalore', 'blr', 'ಬೆಂಗಳೂರು', 'बेंगलुरु', 'బెంగళూరు', 'பெங்களூரு'] },
    { name: 'Mysuru', triggers: ['mysuru', 'mysore', 'ಮೈಸೂರು', 'मैसूर', 'మైసూర్', 'மைசூர்'] },
    { name: 'Mangaluru', triggers: ['mangaluru', 'mangalore', 'ಮಂಗಳೂರು', 'मंगलौर', 'మంగళూరు', 'மங்களூரு'] },
    { name: 'Hubballi', triggers: ['hubballi', 'hubli', 'ಹುಬ್ಬಳ್ಳಿ', 'हुबली', 'హుబ్పళ్ళి', 'ஹூப்ளி'] },
    { name: 'Tumakuru', triggers: ['tumakuru', 'tumkur', 'ತುಮಕೂರು', 'तुमकुर', 'తుమకూరు', 'தும்கூர்'] },
    { name: 'Delhi', triggers: ['delhi', 'new delhi', 'ncr', 'ఢిల్లీ', 'ದೆಹಲಿ', 'दिल्ली', 'டெல்லி'] },
    { name: 'Mumbai', triggers: ['mumbai', 'bombay', 'मुंबई', 'ముంబై'] },
    { name: 'Hyderabad', triggers: ['hyderabad', 'hyd', 'హైదరాబాద్', 'हैदराबाद'] },
    { name: 'Chennai', triggers: ['chennai', 'madras', 'சென்னை', 'चेन्नई'] },
  ]

  for (const loc of locations) {
    for (const trig of loc.triggers) {
      if (normalizedText.includes(trig)) {
        return loc.name
      }
    }
  }
  return null
}

export const cleanQueryText = (normalizedText) => {
  const stopWords = [
    'find', 'search', 'show', 'need', 'want', 'looking for', 'jobs for', 'job for', 'jobs', 'job', 'work', 'work in', 'work for',
    'near me', 'nearby', 'local', 'in', 'at', 'please', 'can you',
    'चाहिए', 'ढूंढो', 'दिखाओ', 'काम', 'नौकरी', 'चाहता', 'के लिए',
    'ಬೇಕು', 'ತೋರಿಸಿ', 'ಹುಡುಕಿ', 'ಕೆಲಸ', 'ಉದ್ಯೋಗ',
    'కావాలి', 'చూపించు', 'వెతుకు', 'ఉద్యోగం',
    'வேண்டும்', 'காட்டு', 'வேலை'
  ]

  let cleaned = normalizedText
  for (const word of stopWords) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), ' ')
  }
  return cleaned.replace(/\s+/g, ' ').trim()
}

export const parseFullVoiceCommand = (rawSpeech, contextMemory = {}) => {
  const norm = normalizeSpeechText(rawSpeech)
  const category = extractCategory(norm)
  const location = extractLocation(norm)
  const cleanKeyword = cleanQueryText(norm)

  let intent = 'UNKNOWN'
  let action = 'SEARCH'

  // 1. Navigation Commands
  const homeTriggers = ['home', 'go home', 'main page', 'homepage', 'होम', 'घर', 'ಮನೆ', 'హోమ్']
  const applicationTriggers = [
    'status', 'my application', 'applications', 'applied', 'applied jobs', 'interview', 'track',
    'आवेदन', 'स्टेटस', 'मेरी अर्जी', 'क्या हुआ',
    'ಅರ್ಜಿ', 'ಸ್ಥಿತಿ', 'ನನ್ನ ಕೆಲಸ',
    'అప్లికేషన్', 'స్టేటస్', 'ఏమైంది',
    'விண்ணப்பம்', 'நிலை'
  ]
  const profileTriggers = ['profile', 'my profile', 'account', 'my account', 'प्रोफाइल', 'खाता', 'ಪ್ರೊಫೈಲ್', 'ప్రొఫైల్']
  const registerTriggers = ['register', 'sign up', 'create account', 'new worker', 'पंजीकरण', 'रजिस्टर', 'ಖಾತೆ ತೆರೆ']
  const loginTriggers = ['login', 'sign in', 'log in', 'लॉगिन', 'ಲಾಗಿನ್', 'లాగిన్']
  const browseJobsTriggers = ['browse jobs', 'all jobs', 'show jobs', 'open jobs', 'find jobs', 'सभी काम', 'सब नौकरी', 'ಎಲ್ಲಾ ಕೆಲಸಗಳು']
  const employerTriggers = ['employer', 'for employer', 'post job', 'hire workers', 'एम्प्लॉयर']

  if (homeTriggers.some(t => norm === t || norm.startsWith(t))) {
    intent = 'NAVIGATE_HOME'
    action = 'NAVIGATE'
  } else if (applicationTriggers.some(t => norm.includes(t))) {
    intent = 'CHECK_APPLICATION_STATUS'
    action = 'CHECK_STATUS'
  } else if (profileTriggers.some(t => norm.includes(t))) {
    intent = 'NAVIGATE_PROFILE'
    action = 'NAVIGATE'
  } else if (registerTriggers.some(t => norm.includes(t))) {
    intent = 'NAVIGATE_REGISTER'
    action = 'NAVIGATE'
  } else if (loginTriggers.some(t => norm.includes(t))) {
    intent = 'NAVIGATE_LOGIN'
    action = 'NAVIGATE'
  } else if (employerTriggers.some(t => norm.includes(t))) {
    intent = 'NAVIGATE_EMPLOYER'
    action = 'NAVIGATE'
  } else if (category) {
    intent = 'SEARCH_CATEGORY'
    action = 'SEARCH'
  } else if (browseJobsTriggers.some(t => norm.includes(t))) {
    intent = 'NAVIGATE_JOBS'
    action = 'NAVIGATE'
  } else if (norm.includes('apply') || norm.includes('आवेदन') || norm.includes('ಅಪ್ಲೈ') || norm.includes('అప్లై')) {
    intent = 'APPLY_JOB'
    action = 'APPLY'
  } else if (norm.includes('yes') || norm.includes('ಅವುನು') || norm.includes('ಹೌದು') || norm.includes('हां') || norm === 'ok' || norm === 'done') {
    intent = 'CONFIRM'
    action = 'CONFIRM_ACTION'
  } else if (norm.includes('no') || norm.includes('వద్దు') || norm.includes('ಇಲ್ಲ') || norm.includes('ना') || norm === 'cancel') {
    intent = 'CANCEL'
    action = 'CANCEL_ACTION'
  } else {
    intent = 'SEARCH_KEYWORD'
    action = 'SEARCH'
  }

  return {
    rawSpeech,
    norm,
    cleanKeyword,
    intent,
    entities: { category, location },
    action,
  }
}
