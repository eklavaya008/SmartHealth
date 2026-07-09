// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize auth functionality
document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initLogout();
    checkAuthForDashboard();
});

// Login form functionality
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        const loginMessage = document.getElementById('loginMessage');

        if (!email || !password) {
            showMessage('loginMessage', 'Please provide email and password', 'error');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('doctor', JSON.stringify(data.doctor));
                
                showMessage('loginMessage', 'Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showMessage('loginMessage', data.message || 'Invalid credentials', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('loginMessage', 'Network error. Please try again.', 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
}

// Logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('doctor');
            window.location.href = '/login';
        });
    }
}

// Check authentication for dashboard
function checkAuthForDashboard() {
    if (window.location.pathname === '/dashboard') {
        const token = localStorage.getItem('token');
        const doctor = localStorage.getItem('doctor');
        
        if (!token || !doctor) {
            window.location.href = '/login';
            return;
        }

        try {
            const doctorData = JSON.parse(doctor);
            const doctorNameEl = document.getElementById('doctorName');
            if (doctorNameEl) {
                doctorNameEl.textContent = doctorData.name;
            }
        } catch (error) {
            console.error('Error parsing doctor data:', error);
        }
    }
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Show message
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds (except for success messages that redirect)
        if (type !== 'success' || !message.includes('Redirecting')) {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }
}

