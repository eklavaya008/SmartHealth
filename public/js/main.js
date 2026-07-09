// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initAppointmentForm();
    checkAuthState();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Check authentication state
function checkAuthState() {
    const token = localStorage.getItem('token');
    const authLink = document.getElementById('authLink');
    
    if (authLink) {
        if (token) {
            authLink.textContent = 'Dashboard';
            authLink.href = '/dashboard';
        } else {
            authLink.textContent = 'Login';
            authLink.href = '/login';
        }
    }
}

// Module-level variable for selected doctor
let selectedDoctorId = null;

// Appointment form functionality
function initAppointmentForm() {
    const symptomsInput = document.getElementById('symptoms');
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (!symptomsInput || !appointmentForm) return;

    let predictionTimeout;

    // Real-time disease prediction
    symptomsInput.addEventListener('input', function() {
        clearTimeout(predictionTimeout);
        const symptoms = this.value.trim();

        if (symptoms.length < 3) {
            hidePrediction();
            hideDoctorSelection();
            selectedDoctorId = null;
            return;
        }

        predictionTimeout = setTimeout(() => {
            const prediction = predictDisease(symptoms);
            if (prediction) {
                showPrediction(prediction);
                loadDoctorsBySpecialty(prediction.specialty);
            } else {
                hidePrediction();
                hideDoctorSelection();
                selectedDoctorId = null;
            }
        }, 500);
    });

    // Form submission
    appointmentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get selected doctor from form
        const selectedDoctor = document.querySelector('input[name="doctor"]:checked');
        if (!selectedDoctor) {
            showMessage('formMessage', 'Please select a doctor', 'error');
            return;
        }
        
        selectedDoctorId = selectedDoctor.value;

        const symptoms = symptomsInput.value.trim();
        const prediction = predictDisease(symptoms);
        
        if (!prediction) {
            showMessage('formMessage', 'Please describe your symptoms', 'error');
            return;
        }

        const formData = {
            name: document.getElementById('fullName').value.trim(),
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            symptoms: symptoms,
            preferredDateTime: document.getElementById('preferredDateTime').value,
            predictedDisease: prediction.disease,
            predictedSpecialty: prediction.specialty,
            doctorId: selectedDoctorId
        };

        // Validation
        if (!formData.name || !formData.age || !formData.gender || !formData.symptoms || !formData.preferredDateTime) {
            showMessage('formMessage', 'Please fill in all required fields', 'error');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Booking...';

        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('formMessage', 'Appointment booked successfully!', 'success');
                appointmentForm.reset();
                hidePrediction();
                hideDoctorSelection();
                selectedDoctorId = null;
            } else {
                showMessage('formMessage', data.message || 'Failed to book appointment', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('formMessage', 'Network error. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Appointment';
        }
    });
}

// Show prediction card
function showPrediction(prediction) {
    const predictionCard = document.getElementById('predictionCard');
    const predictedDisease = document.getElementById('predictedDisease');
    const predictedSpecialty = document.getElementById('predictedSpecialty');

    if (predictionCard && predictedDisease && predictedSpecialty) {
        predictedDisease.textContent = prediction.disease;
        predictedSpecialty.textContent = prediction.specialty;
        predictionCard.style.display = 'block';
    }
}

// Hide prediction card
function hidePrediction() {
    const predictionCard = document.getElementById('predictionCard');
    if (predictionCard) {
        predictionCard.style.display = 'none';
    }
}

// Load doctors by specialty
async function loadDoctorsBySpecialty(specialty) {
    const doctorSelection = document.getElementById('doctorSelection');
    const doctorsList = document.getElementById('doctorsList');
    
    if (!doctorSelection || !doctorsList) return;

    doctorSelection.style.display = 'block';
    doctorsList.innerHTML = '<p class="loading">Loading doctors...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/doctors?specialty=${encodeURIComponent(specialty)}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch doctors' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const doctors = await response.json();

        if (!Array.isArray(doctors)) {
            throw new Error('Invalid response format from server');
        }

        if (doctors.length === 0) {
            doctorsList.innerHTML = '<p class="loading">No doctors available for this specialty</p>';
            return;
        }

        doctorsList.innerHTML = '';
        doctors.forEach(doctor => {
            const doctorItem = document.createElement('div');
            doctorItem.className = 'doctor-item';
            doctorItem.innerHTML = `
                <input type="radio" name="doctor" id="doctor-${doctor._id}" value="${doctor._id}" required>
                <label for="doctor-${doctor._id}" class="doctor-info">
                    <h4>Dr. ${doctor.name}</h4>
                    <p><strong>Specialty:</strong> ${doctor.specialty}</p>
                    <p><strong>Hospital:</strong> ${doctor.hospital}</p>
                    <p><strong>Experience:</strong> ${doctor.experience} years</p>
                    <p><strong>Qualifications:</strong> ${doctor.qualifications}</p>
                </label>
            `;
            doctorsList.appendChild(doctorItem);

            // Add event listener for doctor selection
            const radio = doctorItem.querySelector('input[type="radio"]');
            radio.addEventListener('change', function() {
                if (this.checked) {
                    selectedDoctorId = doctor._id;
                }
            });
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
        let errorMessage = 'Error loading doctors. ';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage += 'Server is not responding. Make sure the server is running on port 3000.';
        } else {
            errorMessage += error.message || 'Please try again.';
        }
        doctorsList.innerHTML = `<p class="loading" style="color: var(--danger-color);">${errorMessage}</p>`;
    }
}

// Hide doctor selection
function hideDoctorSelection() {
    const doctorSelection = document.getElementById('doctorSelection');
    if (doctorSelection) {
        doctorSelection.style.display = 'none';
    }
}

// Show message
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

