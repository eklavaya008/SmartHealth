// API Base URL is declared in auth.js (loaded before this file)
// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
});

// Load appointments for the logged-in doctor
async function loadAppointments() {
    const token = getAuthToken();
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (!token) {
        window.location.href = '/login';
        return;
    }

    if (appointmentsList) {
        appointmentsList.innerHTML = '<p class="loading">Loading appointments...</p>';
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('doctor');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText || 'Failed to fetch appointments' };
            }
            
            if (appointmentsList) {
                appointmentsList.innerHTML = `<p class="loading" style="color: var(--danger-color);">Error: ${errorData.message || 'Failed to load appointments'}</p>`;
            }
            return;
        }

        const appointments = await response.json();

        if (!Array.isArray(appointments)) {
            if (appointmentsList) {
                appointmentsList.innerHTML = '<p class="loading" style="color: var(--danger-color);">Error: Invalid response format</p>';
            }
            return;
        }

        updateStats(appointments);
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        if (error.name === 'AbortError') {
            if (appointmentsList) {
                appointmentsList.innerHTML = '<p class="loading" style="color: var(--danger-color);">Request timeout. Please check your connection and try again.</p>';
            }
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            if (appointmentsList) {
                appointmentsList.innerHTML = '<p class="loading" style="color: var(--danger-color);">Network error. Please make sure the server is running.</p>';
            }
        } else {
            if (appointmentsList) {
                appointmentsList.innerHTML = `<p class="loading" style="color: var(--danger-color);">Error: ${error.message || 'Failed to load appointments'}</p>`;
            }
        }
    }
}

// Update statistics
function updateStats(appointments) {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    const totalEl = document.getElementById('totalAppointments');
    const pendingEl = document.getElementById('pendingAppointments');
    const confirmedEl = document.getElementById('confirmedAppointments');
    const completedEl = document.getElementById('completedAppointments');

    if (totalEl) totalEl.textContent = total;
    if (pendingEl) pendingEl.textContent = pending;
    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (completedEl) completedEl.textContent = completed;
}

// Display appointments
function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (!appointmentsList) {
        return;
    }

    if (!Array.isArray(appointments)) {
        appointmentsList.innerHTML = '<p class="loading" style="color: var(--danger-color);">Error: Invalid data format</p>';
        return;
    }

    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="loading">No appointments found</p>';
        return;
    }

    appointmentsList.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item';
        
        const preferredDate = new Date(appointment.preferredDateTime);
        const formattedDate = preferredDate.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        appointmentItem.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-info">
                    <h4>${appointment.name}</h4>
                    <p><strong>Age:</strong> ${appointment.age} | <strong>Gender:</strong> ${appointment.gender}</p>
                    <p><strong>Symptoms:</strong> ${appointment.symptoms}</p>
                    <p><strong>Predicted Disease:</strong> ${appointment.predictedDisease}</p>
                    <p><strong>Preferred Date/Time:</strong> ${formattedDate}</p>
                    ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
                </div>
                <span class="status-badge ${appointment.status}">${appointment.status}</span>
            </div>
            <div class="appointment-actions">
                ${getActionButtons(appointment)}
            </div>
        `;

        appointmentsList.appendChild(appointmentItem);

        // Add event listeners to action buttons
        const actionButtons = appointmentItem.querySelectorAll('.btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const action = this.dataset.action;
                const newStatus = this.dataset.status;
                
                if (action === 'update') {
                    await updateAppointmentStatus(appointment._id, newStatus);
                }
            });
        });
    });
}

// Get action buttons based on appointment status
function getActionButtons(appointment) {
    const buttons = [];
    
    if (appointment.status === 'pending') {
        buttons.push(`
            <button class="btn btn-success btn-sm" data-action="update" data-status="confirmed">
                Confirm
            </button>
            <button class="btn btn-danger btn-sm" data-action="update" data-status="cancelled">
                Cancel
            </button>
        `);
    } else if (appointment.status === 'confirmed') {
        buttons.push(`
            <button class="btn btn-success btn-sm" data-action="update" data-status="completed">
                Mark Complete
            </button>
            <button class="btn btn-danger btn-sm" data-action="update" data-status="cancelled">
                Cancel
            </button>
        `);
    } else if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        buttons.push(`
            <span style="color: var(--text-light); font-size: 0.875rem;">
                No actions available
            </span>
        `);
    }
    
    return buttons.join('');
}

// Update appointment status
async function updateAppointmentStatus(appointmentId, newStatus) {
    const token = getAuthToken();
    
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('doctor');
            window.location.href = '/login';
            return;
        }

        const data = await response.json();

        if (response.ok) {
            // Reload appointments
            loadAppointments();
        } else {
            alert(data.message || 'Failed to update appointment');
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        alert('Network error. Please try again.');
    }
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

