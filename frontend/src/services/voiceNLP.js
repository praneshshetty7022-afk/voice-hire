// Production Multilingual Voice NLP Engine for VoiceHire
import { SUPPORTED_LANGUAGES } from '../hooks/useVoiceRecognition'

export { SUPPORTED_LANGUAGES }

export const JOB_CATEGORY_DICTIONARY = {
  DRIVER: [
    'driver', 'driving', 'cab driver', 'car driver', 'taxi driver', 'truck driver', 'auto driver',
    'చాలక', 'గాడీ', 'డ్రైవర్', 'డ్రైవింగ్',
    'ಚಾಲಕ', 'ಡ್ರೈವರ್',
    'ड्राइवर', 'गाड़ी', 'चालक',
    'ஓட்டுநர்', 'டிரைவர்'
  ],
  CARPENTER: [
    'carpenter', 'carpentry', 'wood worker', 'furniture worker', 'wood work',
    'వడ్రంగి', 'కార్పెంటర్',
    'ಬಡಗಿ', 'ಮರಗೆಲಸ', 'ಕಾರ್ಪೆಂಟರ್',
    'बढ़ई', 'कारपेंटर',
    'தச்சர்'
  ],
  PAINTER: [
    'painter', 'painting', 'paint worker', 'wall painter',
    'పెయింటర్', 'రంగులు',
    'ಪೇಂಟರ್', 'ಬಣ್ಣ',
    'पेंटर', 'पुताई',
    'வண்ணப்பூச்சாளர்', 'பெயிண்டர்'
  ],
  ELECTRICIAN: [
    'electrician', 'electrical', 'wiring', 'wire worker',
    'ఎలక్ట్రీషియన్', 'కరెంట్',
    'ಇಲೆಕ್ಟ್ರೀಷಿಯನ್', 'ವೈರಿಂಗ್',
    'इलेक्ट्रीशियन', 'बिजली',
    'மின்சார வல்லுநர்', 'எலக்ட்ரீஷியன்'
  ],
  PLUMBER: [
    'plumber', 'plumbing', 'pipe worker', 'water pipe',
    'ప్లంబర్', 'పైపులు',
    'ಪ್ಲಂಬರ್', 'ಪೈಪ್',
    'प्लम्बर', 'नल',
    'குழாய் அமைப்பாளர்', 'பிளம்பர்'
  ],
  MASON: [
    'mason', 'masonry', 'brick worker', 'construction mason',
    'మేస్త్రీ', 'ఇటుక',
    'ಮೇಸ್ತ್ರಿ', 'ಗಾರೆ',
    'राजमिस्त्री', 'मिस्त्री',
    'கொத்தனார்'
  ],
  COOK: [
    'cook', 'cooking', 'chef', 'rasoi',
    'వంట మనిషి', 'వంట',
    'ಅಡುಗೆಯವ', 'ಅಡುಗೆ',
    'रसोइया', 'खाना',
    'சமையல்காரர்'
  ],
  CLEANER: [
    'cleaner', 'housekeeper', 'sweeper', 'cleaning', 'househelp',
    'సఫాయి', 'శుభ్రం',
    'ಸ್ವಚ್ಛತಾಗಾರ', 'ಸಫಾಯಿ',
    'सफाई वाला', 'घरेलू', 'झाड़ू',
    'துப்புரவாளர்'
  ],
  MECHANIC: [
    'mechanic', 'repair', 'auto mechanic', 'bike mechanic',
    'మెకానిక్', 'రిపేర్',
    'ಮೆಕ್ಯಾನಿಕ್',
    'मेकेनिक', 'रिपेयर',
    'இயந்திரவியலாளர்', 'மெக்கானிக்'
  ],
  WELDER: [
    'welder', 'welding', 'iron worker',
    'వెల్డర్', 'వెల్డింగ్',
    'ವೆಲ್ಡರ್',
    'वेल्डर',
    'வெல்டர்'
  ],
  SECURITY_GUARD: [
    'guard', 'security', 'night guard', 'security guard',
    'సెక్యూరిటీ గార్డ్', 'కాపలా',
    'ಸೆಕ್ಯೂರಿಟಿ ಗಾರ್ಡ್',
    'सुरक्षा गार्ड', 'चौकीदार',
    'பாதுகாவலர்'
  ],
  DELIVERY_WORKER: [
    'delivery', 'courier', 'rider', 'delivery boy', 'delivery worker',
    'డెలివరీ', 'బోయ్',
    'ಡೆಲಿವರಿ',
    'डिलीवरी',
    'டெலிவரி'
  ],
  FARM_WORKER: [
    'farm', 'farmer', 'agriculture', 'farm worker',
    'రైతు', 'వ్యవసాయం',
    'ರೈತ', 'ಕೃಷಿ',
    'किसान', 'खेती',
    'விவசாய'
  ],
  TAILOR: [
    'tailor', 'stitching', 'garment worker',
    'దర్జీ', 'కుట్టు',
    'ದರ್ಜಿ', 'ಹೊಲಿಗೆ',
    'दर्जी', 'सिलाई',
    'தையல்காரர்'
  ]
}

export const normalizeSpeechText = (text) => {
  if (!text) return ''
  let str = text.toLowerCase().trim()
  str = str.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim()
  return str
}

export const extractCategory = (normalizedText) => {
  for (const [category, synonyms] of Object.entries(JOB_CATEGORY_DICTIONARY)) {
    for (const syn of synonyms) {
      if (normalizedText.includes(syn)) {
        return category
      }
    }
  }
  return null
}

export const extractLocation = (normalizedText) => {
  const locations = [
    { name: 'Bengaluru', triggers: ['bengaluru', 'bangalore', 'బెంగళూరు', 'ಬೆಂಗಳೂರು', 'बेंगलुरु', 'பெங்களூரு'] },
    { name: 'Mysuru', triggers: ['mysuru', 'mysore', 'మైసూర్', 'ಮೈಸೂರು', 'मैसूर', 'மைசூர்'] },
    { name: 'Mangaluru', triggers: ['mangaluru', 'mangalore', 'మంగళూరు', 'ಮಂಗಳೂರು', 'मंगलौर', 'மங்களூரு'] },
    { name: 'Hubballi', triggers: ['hubballi', 'hubli', 'హుబ్పళ్ళి', 'ಹುಬ್ಬಳ್ಳಿ', 'हुबली', 'ஹூப்ளி'] },
    { name: 'Tumakuru', triggers: ['tumakuru', 'tumkur', 'తుమకూరు', 'ತುಮಕೂರು', 'तुमकुर', 'தும்கூர்'] },
    { name: 'Delhi', triggers: ['delhi', 'ఢిల్లీ', 'ದೆಹಲಿ', 'दिल्ली', 'டெல்லி'] },
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

export const parseFullVoiceCommand = (rawSpeech, contextMemory = {}) => {
  const norm = normalizeSpeechText(rawSpeech)
  const category = extractCategory(norm)
  const location = extractLocation(norm)

  let intent = 'UNKNOWN'
  let action = 'NAVIGATE'

  const statusKeywords = [
    'status', 'happened', 'interview', 'did i get', 'get the job', 'which jobs', 'my application', 'applied', 'selected', 'hired',
    'ಸ್ಥಿತಿ', 'ಏನಾಯಿತು', 'ಸಂದರ್ಶನ', 'ಸಿಕ್ಕಿದೆಯೇ', 'ನನ್ನ ಕೆಲಸ', 'ಅರ್ಜಿ',
    'स्टेटस', 'क्या हुआ', 'इंटरव्यू', 'जॉब मिली', 'आवेदन', 'चयन',
    'స్టేటస్', 'ఏమైంది', 'ఇంటర్వ్యూ', 'వచ్చిందా', 'అప్లికేషన్',
    'நிலை', 'என்ன ஆச்சு', 'நேர்காணல்', 'கிடைத்ததா', 'விண்ணப்பம்'
  ]

  const isStatusTrigger = statusKeywords.some(kw => norm.includes(kw))
  const isApplyTrigger = norm.includes('apply') || norm.includes('आवेदन') || norm.includes('ಅಪ್ಲೈ') || norm.includes('అప్లై') || norm.includes('விண்ணப்பிக்க')

  if (isStatusTrigger) {
    intent = 'CHECK_APPLICATION_STATUS'
    action = 'CHECK_STATUS'
  } else if (isApplyTrigger) {
    intent = 'APPLY_JOB'
    action = 'APPLY'
  } else if (category) {
    intent = 'SEARCH_CATEGORY'
    action = 'SEARCH'
  } else if (norm.includes('yes') || norm.includes('అవును') || norm.includes('ಹೌದು') || norm.includes('हां')) {
    intent = 'CONFIRM'
    action = 'CONFIRM_ACTION'
  } else if (norm.includes('no') || norm.includes('వద్దు') || norm.includes('ಇಲ್ಲ') || norm.includes('ना')) {
    intent = 'CANCEL'
    action = 'CANCEL_ACTION'
  }

  return {
    rawSpeech,
    norm,
    intent,
    entities: { category, location },
    action,
  }
}


