/**
 * Real-Time Language Detector for VoiceHire
 * 
 * Inspects visible DOM text or raw strings to detect which language
 * texts are actually shown in right now.
 * Supports Kannada, Hindi, Telugu, Tamil, Malayalam, Bengali, Spanish, and English.
 */

export const SCRIPT_RANGES = {
  kn: {
    code: 'kn',
    fullCode: 'kn-IN',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    // Kannada Unicode Range: U+0C80 - U+0CFF
    regex: /[\u0C80-\u0CFF]/g,
  },
  hi: {
    code: 'hi',
    fullCode: 'hi-IN',
    name: 'Hindi',
    native: 'हिंदी',
    flag: '🇮🇳',
    // Devanagari Unicode Range: U+0900 - U+097F
    regex: /[\u0900-\u097F]/g,
  },
  te: {
    code: 'te',
    fullCode: 'te-IN',
    name: 'Telugu',
    native: 'తెలుగు',
    flag: '🇮🇳',
    // Telugu Unicode Range: U+0C00 - U+0C7F
    regex: /[\u0C00-\u0C7F]/g,
  },
  ta: {
    code: 'ta',
    fullCode: 'ta-IN',
    name: 'Tamil',
    native: 'தமிழ்',
    flag: '🇮🇳',
    // Tamil Unicode Range: U+0B80 - U+0BFF
    regex: /[\u0B80-\u0BFF]/g,
  },
  ml: {
    code: 'ml',
    fullCode: 'ml-IN',
    name: 'Malayalam',
    native: 'മലയാളം',
    flag: '🇮🇳',
    // Malayalam Unicode Range: U+0D00 - U+0D7F
    regex: /[\u0D00-\u0D7F]/g,
  },
  bn: {
    code: 'bn',
    fullCode: 'bn-IN',
    name: 'Bengali',
    native: 'বাংলা',
    flag: '🇮🇳',
    // Bengali Unicode Range: U+0980 - U+09FF
    regex: /[\u0980-\u09FF]/g,
  },
  es: {
    code: 'es',
    fullCode: 'es-ES',
    name: 'Spanish',
    native: 'Español',
    flag: '🇪🇸',
    regex: /[áéíóúüñ¿¡]/gi,
    wordRegex: /\b(el|la|los|las|un|una|de|en|y|que|por|para|con|trabajo|cuenta|iniciar|sesión|contraseña|empleo)\b/gi,
  },
  en: {
    code: 'en',
    fullCode: 'en-IN',
    name: 'English',
    native: 'English',
    flag: '🇬🇧',
    regex: /[a-zA-Z]/g,
    wordRegex: /\b(the|and|for|with|skills|hired|voice|account|work|apply|instant|jobs|login|sign|up|portal)\b/gi,
  },
}

/**
 * Detects the language of a given text string based on script character counts and vocabulary.
 * @param {string} text - Raw text to analyze
 * @returns {object} { code, fullCode, name, native, flag, confidence, reason }
 */
export function detectTextLanguage(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      code: 'en',
      fullCode: 'en-IN',
      name: 'English',
      native: 'English',
      flag: '🇬🇧',
      confidence: 1,
      reason: 'Empty text, default to English',
    }
  }

  // Count matches for each Indic script
  const indicCounts = {}
  let totalIndicMatches = 0

  const indicKeys = ['kn', 'hi', 'te', 'ta', 'ml', 'bn']
  for (const k of indicKeys) {
    const matches = text.match(SCRIPT_RANGES[k].regex)
    const count = matches ? matches.length : 0
    indicCounts[k] = count
    totalIndicMatches += count
  }

  // If Indic script characters are present in significant numbers, classify by dominant script
  if (totalIndicMatches >= 4) {
    let topCode = 'kn'
    let topCount = 0
    for (const [k, c] of Object.entries(indicCounts)) {
      if (c > topCount) {
        topCount = c
        topCode = k
      }
    }
    const target = SCRIPT_RANGES[topCode]
    return {
      code: target.code,
      fullCode: target.fullCode,
      name: target.name,
      native: target.native,
      flag: target.flag,
      confidence: Math.min(0.99, Number((topCount / totalIndicMatches).toFixed(2))),
      reason: `Found ${topCount} ${target.name} characters (${((topCount / totalIndicMatches) * 100).toFixed(0)}% of Indic script)`,
    }
  }

  // Check Spanish diacritics / common words
  const esAccents = (text.match(SCRIPT_RANGES.es.regex) || []).length
  const esWords = (text.match(SCRIPT_RANGES.es.wordRegex) || []).length
  if (esAccents >= 2 || esWords >= 3) {
    const es = SCRIPT_RANGES.es
    return {
      code: es.code,
      fullCode: es.fullCode,
      name: es.name,
      native: es.native,
      flag: es.flag,
      confidence: 0.92,
      reason: 'Detected Spanish diacritics and vocabulary',
    }
  }

  // Count English / Latin characters
  const enMatches = (text.match(SCRIPT_RANGES.en.regex) || []).length
  const en = SCRIPT_RANGES.en

  return {
    code: en.code,
    fullCode: en.fullCode,
    name: en.name,
    native: en.native,
    flag: en.flag,
    confidence: enMatches > 15 ? 0.98 : 0.8,
    reason: `Dominant Latin characters detected (${enMatches} chars)`,
  }
}

/**
 * Traverses visible DOM elements on the page (excluding script, styles, and the language selector itself)
 * and detects which language the user is currently reading on screen.
 * 
 * @param {HTMLElement} [container=document.body]
 * @returns {object} { code, fullCode, name, native, flag, confidence, reason, sampleText }
 */
export function detectVisiblePageLanguage(container = (typeof document !== 'undefined' ? document.body : null)) {
  if (typeof window === 'undefined' || !container) {
    return {
      code: 'en',
      fullCode: 'en-IN',
      name: 'English',
      native: 'English',
      flag: '🇬🇧',
      confidence: 1,
      reason: 'Server-side or no DOM container',
      sampleText: '',
    }
  }

  try {
    // Select prominent content elements on the page
    const elements = container.querySelectorAll(
      'h1, h2, h3, h4, p, button span, a span, [data-translatable]'
    )

    let gathered = ''
    elements.forEach((el) => {
      // Skip language selector itself to prevent self-detection bias
      if (el.closest('[data-no-detect="true"]') || el.closest('[data-lang-picker="true"]')) {
        return
      }
      // Skip hidden elements
      if (el.offsetParent === null && el.tagName !== 'BODY') {
        return
      }
      const t = (el.innerText || el.textContent || '').trim()
      // Only include meaningful sentences/words (skip single numbers or icons)
      if (t.length > 3 && !/^[\d\s\W]+$/.test(t)) {
        gathered += ' ' + t
      }
    })

    // If gathered is empty, fallback to container textContent
    if (gathered.trim().length < 10) {
      gathered = (container.innerText || container.textContent || '').slice(0, 2000)
    }

    const sampleText = gathered.trim().slice(0, 2500)
    const result = detectTextLanguage(sampleText)

    return {
      ...result,
      sampleText: sampleText.slice(0, 120),
    }
  } catch (err) {
    console.warn('[LanguageDetector] Error during DOM analysis:', err)
    return {
      code: 'en',
      fullCode: 'en-IN',
      name: 'English',
      native: 'English',
      flag: '🇬🇧',
      confidence: 0.5,
      reason: 'Error sampling DOM: ' + err.message,
      sampleText: '',
    }
  }
}
