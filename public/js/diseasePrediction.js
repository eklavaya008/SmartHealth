// Disease prediction mapping (same as backend logic)
const diseaseMap = {
    'chest pain': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
    'chest discomfort': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
    'heart palpitations': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
    'shortness of breath': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
    'heartburn': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
    'chest tightness': { disease: 'Cardiac Issue', specialty: 'Cardiology' },
    
    'cough': { disease: 'Respiratory Infection', specialty: 'Pulmonology' },
    'fever': { disease: 'Respiratory Infection', specialty: 'Pulmonology' },
    'sore throat': { disease: 'Respiratory Infection', specialty: 'Pulmonology' },
    'runny nose': { disease: 'Common Cold', specialty: 'Pulmonology' },
    'congestion': { disease: 'Common Cold', specialty: 'Pulmonology' },
    'wheezing': { disease: 'Asthma', specialty: 'Pulmonology' },
    'difficulty breathing': { disease: 'Respiratory Issue', specialty: 'Pulmonology' },
    
    'stomach pain': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    'abdominal pain': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    'nausea': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    'vomiting': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    'diarrhea': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    'constipation': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    'indigestion': { disease: 'Gastrointestinal Issue', specialty: 'Gastroenterology' },
    
    'headache': { disease: 'Neurological Issue', specialty: 'Neurology' },
    'migraine': { disease: 'Neurological Issue', specialty: 'Neurology' },
    'dizziness': { disease: 'Neurological Issue', specialty: 'Neurology' },
    'seizures': { disease: 'Neurological Issue', specialty: 'Neurology' },
    'memory loss': { disease: 'Neurological Issue', specialty: 'Neurology' },
    'confusion': { disease: 'Neurological Issue', specialty: 'Neurology' },
    'numbness': { disease: 'Neurological Issue', specialty: 'Neurology' },
    
    'rash': { disease: 'Skin Condition', specialty: 'Dermatology' },
    'itching': { disease: 'Skin Condition', specialty: 'Dermatology' },
    'skin irritation': { disease: 'Skin Condition', specialty: 'Dermatology' },
    'acne': { disease: 'Skin Condition', specialty: 'Dermatology' },
    'eczema': { disease: 'Skin Condition', specialty: 'Dermatology' },
    
    'joint pain': { disease: 'Joint Problem', specialty: 'Orthopedics' },
    'back pain': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
    'knee pain': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
    'shoulder pain': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
    'bone fracture': { disease: 'Orthopedic Issue', specialty: 'Orthopedics' },
    
    'arthritis': { disease: 'Rheumatological Condition', specialty: 'Rheumatology' },
    'joint stiffness': { disease: 'Rheumatological Condition', specialty: 'Rheumatology' },
    'swollen joints': { disease: 'Rheumatological Condition', specialty: 'Rheumatology' },
    
    'fatigue': { disease: 'General Health Issue', specialty: 'General Medicine' },
    'weakness': { disease: 'General Health Issue', specialty: 'General Medicine' },
    'weight loss': { disease: 'General Health Issue', specialty: 'General Medicine' },
    'weight gain': { disease: 'General Health Issue', specialty: 'General Medicine' }
};

function predictDisease(symptoms) {
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
        return null;
    }

    const symptomsLower = symptoms.toLowerCase();
    const matches = [];
    
    for (const [symptom, prediction] of Object.entries(diseaseMap)) {
        if (symptomsLower.includes(symptom)) {
            matches.push(prediction);
        }
    }

    if (matches.length === 0) {
        return {
            disease: 'General Health Issue',
            specialty: 'General Medicine',
            confidence: 'low'
        };
    }

    const diseaseCounts = {};
    const specialtyCounts = {};
    
    matches.forEach(match => {
        diseaseCounts[match.disease] = (diseaseCounts[match.disease] || 0) + 1;
        specialtyCounts[match.specialty] = (specialtyCounts[match.specialty] || 0) + 1;
    });

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

