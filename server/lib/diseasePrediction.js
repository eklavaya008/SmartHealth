// Disease prediction logic based on symptoms
const diseaseMap = {
  // Cardiac symptoms
  'chest pain': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
  'chest discomfort': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
  'heart palpitations': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
  'shortness of breath': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
  'heartburn': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
  'chest tightness': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
  
  // Respiratory symptoms
  'cough': { disease: 'Respiratory Infection', specialty: 'Pulmonology' },
  'fever': { disease: 'Respiratory Infection', specialty: 'Pulmonology' },
  'sore throat': { disease: 'Respiratory Infection', specialty: 'Pulmonology' },
  'runny nose': { disease: 'Common Cold', specialty: 'Pulmonology' },
  'congestion': { disease: 'Common Cold', specialty: 'Pulmonology' },
  'wheezing': { disease: 'Asthma', specialty: 'Pulmonology' },
  'difficulty breathing': { disease: 'Respiratory Issue', specialty: 'Pulmonology' },
  
  // Gastrointestinal symptoms
  'stomach pain': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  'abdominal pain': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  'nausea': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  'vomiting': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  'diarrhea': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  'constipation': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  'indigestion': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
  
  // Neurological symptoms
  'headache': { disease: 'Neurological Issue', specialty: 'Neurology' },
  'migraine': { disease: 'Neurological Issue', specialty: 'Neurology' },
  'dizziness': { disease: 'Neurological Issue', specialty: 'Neurology' },
  'seizures': { disease: 'Neurological Issue', specialty: 'Neurology' },
  'memory loss': { disease: 'Neurological Issue', specialty: 'Neurology' },
  'confusion': { disease: 'Neurological Issue', specialty: 'Neurology' },
  'numbness': { disease: 'Neurological Issue', specialty: 'Neurology' },
  
  // Dermatological symptoms
  'rash': { disease: 'Skin Condition', specialty: 'Dermatology' },
  'itching': { disease: 'Skin Condition', specialty: 'Dermatology' },
  'skin irritation': { disease: 'Skin Condition', specialty: 'Dermatology' },
  'acne': { disease: 'Skin Condition', specialty: 'Dermatology' },
  'eczema': { disease: 'Skin Condition', specialty: 'Dermatology' },
  
  // Orthopedic symptoms
  'joint pain': { disease: 'Joint Problem', specialty: 'Orthopedics' },
  'back pain': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
  'knee pain': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
  'shoulder pain': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
  'bone fracture': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
  
  // Rheumatological symptoms
  'arthritis': { disease: 'Rheumatological Condition', specialty: 'Rheumatology' },
  'joint stiffness': { disease: 'Rheumatological Condition', specialty: 'Rheumatology' },
  'swollen joints': { disease: 'Rheumatological Condition', specialty: 'Rheumatology' },
  
  // General symptoms
  'fatigue': { disease: 'General Health Issue', specialty: 'General Medicine' },
  'weakness': { disease: 'General Health Issue', specialty: 'General Medicine' },
  'weight loss': { disease: 'General Health Issue', specialty: 'General Medicine' },
  'weight gain': { disease: 'General Health Issue', specialty: 'General Medicine' }
};

function predictDisease(symptoms) {
  if (!symptoms || typeof symptoms !== 'string') {
    return { disease: 'General Health Issue', specialty: 'General Medicine', confidence: 'low' };
  }

  const symptomsLower = symptoms.toLowerCase();
  const matches = [];
  
  // Check for symptom matches
  for (const [symptom, prediction] of Object.entries(diseaseMap)) {
    if (symptomsLower.includes(symptom)) {
      matches.push(prediction);
    }
  }

  if (matches.length === 0) {
    return { disease: 'General Health Issue', specialty: 'General Medicine', confidence: 'low' };
  }

  // Count occurrences of each disease and specialty
  const diseaseCounts = {};
  const specialtyCounts = {};
  
  matches.forEach(match => {
    diseaseCounts[match.disease] = (diseaseCounts[match.disease] || 0) + 1;
    specialtyCounts[match.specialty] = (specialtyCounts[match.specialty] || 0) + 1;
  });

  // Get most common disease and specialty
  const predictedDisease = Object.keys(diseaseCounts).reduce((a, b) => 
    diseaseCounts[a] > diseaseCounts[b] ? a : b
  );
  
  const predictedSpecialty = Object.keys(specialtyCounts).reduce((a, b) => 
    specialtyCounts[a] > specialtyCounts[b] ? a : b
  );

  const confidence = matches.length > 2 ? 'high' : matches.length > 1 ? 'medium' : 'low';

  return {
    disease: predictedDisease,
    specialty: predictedSpecialty,
    confidence
  };
}

module.exports = { predictDisease };

