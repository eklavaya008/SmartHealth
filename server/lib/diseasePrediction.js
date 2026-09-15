// Rule-based (non-ML) symptom-to-specialty matcher.
//
// Each condition lists the keyword phrases that suggest it. A phrase's weight is its
// word count, so multi-word phrases ("shortness of breath") outweigh single generic
// words ("pain"), and matching is done on whole-word boundaries so e.g. "rash" doesn't
// match inside "harsh". Confidence is an asymptotic function of matched weight, so it
// climbs with more/stronger keyword matches but never claims false certainty.

const CONDITIONS = [
  {
    disease: 'Possible Cardiac Issue',
    specialty: 'Cardiology',
    keywords: ['chest pain', 'chest discomfort', 'heart palpitations', 'shortness of breath', 'chest tightness', 'irregular heartbeat'],
  },
  {
    disease: 'Respiratory Infection',
    specialty: 'Pulmonology',
    keywords: ['cough', 'fever', 'sore throat', 'difficulty breathing', 'wheezing', 'chest congestion'],
  },
  {
    disease: 'Common Cold',
    specialty: 'Pulmonology',
    keywords: ['runny nose', 'congestion', 'sneezing', 'stuffy nose'],
  },
  {
    disease: 'Asthma-related Issue',
    specialty: 'Pulmonology',
    keywords: ['wheezing', 'shortness of breath', 'tight chest when breathing'],
  },
  {
    disease: 'Gastrointestinal Issue',
    specialty: 'Gastroenterology',
    keywords: ['stomach pain', 'abdominal pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'indigestion', 'heartburn', 'bloating'],
  },
  {
    disease: 'Neurological Issue',
    specialty: 'Neurology',
    keywords: ['headache', 'migraine', 'dizziness', 'seizures', 'memory loss', 'confusion', 'numbness', 'tingling sensation'],
  },
  {
    disease: 'Skin Condition',
    specialty: 'Dermatology',
    keywords: ['rash', 'itching', 'skin irritation', 'acne', 'eczema', 'hives', 'dry skin'],
  },
  {
    disease: 'Orthopedic Issue',
    specialty: 'Orthopedics',
    keywords: ['back pain', 'knee pain', 'shoulder pain', 'bone fracture', 'joint pain', 'muscle strain'],
  },
  {
    disease: 'Rheumatological Condition',
    specialty: 'Rheumatology',
    keywords: ['arthritis', 'joint stiffness', 'swollen joints', 'morning stiffness'],
  },
  {
    disease: 'General Health Issue',
    specialty: 'General Medicine',
    keywords: ['fatigue', 'weakness', 'weight loss', 'weight gain', 'loss of appetite', 'general malaise'],
  },
];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const keywordWeight = (keyword) => keyword.trim().split(/\s+/).length;

// score -> confidence% via an asymptotic curve: rewards more/stronger matches with
// diminishing returns, capped below 100 since this is keyword matching, not a diagnosis.
const scoreToConfidence = (score) => Math.round((score / (score + 2)) * 100);

/**
 * @param {string} symptoms free-text symptom description
 * @returns {{ results: Array<{disease:string, specialty:string, confidence:number, matchedSymptoms:string[]}>, hasMatch: boolean }}
 */
function predictConditions(symptoms) {
  if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
    return { results: [], hasMatch: false };
  }

  const text = symptoms.toLowerCase();
  const scored = [];

  for (const condition of CONDITIONS) {
    let score = 0;
    const matchedSymptoms = [];

    for (const keyword of condition.keywords) {
      const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
      if (pattern.test(text)) {
        score += keywordWeight(keyword);
        matchedSymptoms.push(keyword);
      }
    }

    if (score > 0) {
      scored.push({
        disease: condition.disease,
        specialty: condition.specialty,
        score,
        matchedSymptoms,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const results = scored.slice(0, 3).map(({ disease, specialty, score, matchedSymptoms }) => ({
    disease,
    specialty,
    confidence: scoreToConfidence(score),
    matchedSymptoms,
  }));

  return { results, hasMatch: results.length > 0 };
}

const FALLBACK = { disease: 'General Health Issue', specialty: 'General Medicine', confidence: 0, matchedSymptoms: [] };

module.exports = { predictConditions, FALLBACK, CONDITIONS };
