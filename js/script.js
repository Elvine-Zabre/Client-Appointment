// Données initiales
let appointments = [
    {
        id: "RDV1254",
        client: "M. Diallo",
        provider: "Dr. Traoré",
        date: "2023-12-15",
        time: "14:30",
        type: "consultation",
        description: "Douleurs abdominales persistantes depuis 3 jours",
        status: "confirmed"
    },
    {
        id: "RDV1253",
        client: "Mme. Sow",
        provider: "Mme. Diallo",
        date: "2023-12-14",
        time: "10:00",
        type: "entretien",
        description: "Entretien d'embauche",
        status: "pending"
    },
    {
        id: "RDV1252",
        client: "M. Keita",
        provider: "Dr. Traoré",
        date: "2023-12-13",
        time: "16:15",
        type: "consultation",
        description: "Suivi médical",
        status: "canceled"
    }
];

// Chargement initial de la page
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
    updateStats();
    setupEventListeners();
});

// Charge les rendez-vous dans le tableau
function loadAppointments() {
    const tbody = document.getElementById('appointments-body');
    tbody.innerHTML = '';

    appointments.forEach(appointment => {
        const tr = document.createElement('tr');
        
        // Formatage de la date
        const dateObj = new Date(appointment.date);
        const formattedDate = dateObj.toLocaleDateString('fr-FR');
        
        // Détermination du statut
        let statusClass, statusText;
        switch(appointment.status) {
            case 'pending':
                statusClass = 'pending';
                statusText = 'En attente';
                break;
            case 'confirmed':
                statusClass = 'confirmed';
                statusText = 'Confirmé';
                break;
            case 'canceled':
                statusClass = 'canceled';
                statusText = 'Annulé';
                break;
        }

        tr.innerHTML = `
            <td>#${appointment.id}</td>
            <td>${appointment.client}</td>
            <td>${appointment.provider}</td>
            <td>${formattedDate} - ${appointment.time}</td>
            <td>${appointment.type === 'consultation' ? 'Consultation' : 'Entretien'}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button class="action-btn btn-edit" data-id="${appointment.id}"><i class="fas fa-edit"></i></button>
                ${appointment.status !== 'confirmed' ? 
                    `<button class="action-btn btn-confirm" data-id="${appointment.id}"><i class="fas fa-check"></i></button>` : ''}
                ${appointment.status !== 'canceled' ? 
                    `<button class="action-btn btn-cancel" data-id="${appointment.id}"><i class="fas fa-times"></i></button>` : ''}
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Met à jour les statistiques
function updateStats() {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const canceled = appointments.filter(a => a.status === 'canceled').length;

    document.querySelector('.stat-card .value').textContent = total;
    document.querySelector('.stat-card.pending .value').textContent = pending;
    document.querySelector('.stat-card.confirmed .value').textContent = confirmed;
    document.querySelector('.stat-card.canceled .value').textContent = canceled;
}

// Configure les écouteurs d'événements
function setupEventListeners() {
    // Modal
    document.querySelectorAll('.action-btn.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editAppointment(id);
        });
    });

    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.querySelector('.btn-secondary').addEventListener('click', closeModal);

    // Confirmer/Annuler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-confirm') || 
            e.target.closest('.btn-confirm')) {
            const btn = e.target.classList.contains('btn-confirm') ? 
                        e.target : e.target.closest('.btn-confirm');
            const id = btn.getAttribute('data-id');
            changeAppointmentStatus(id, 'confirmed');
        }
        
        if (e.target.classList.contains('btn-cancel') || 
            e.target.closest('.btn-cancel')) {
            const btn = e.target.classList.contains('btn-cancel') ? 
                        e.target : e.target.closest('.btn-cancel');
            const id = btn.getAttribute('data-id');
            changeAppointmentStatus(id, 'canceled');
        }
    });

    // Formulaire
    document.getElementById('editForm').addEventListener('submit', saveAppointment);

    // Fermer modal en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('editModal')) {
            closeModal();
        }
    });
}

// Ouvre le modal d'édition
function editAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;

    document.getElementById('appointment-id').value = appointment.id;
    document.getElementById('client').value = appointment.client;
    document.getElementById('provider').value = appointment.provider;
    document.getElementById('date').value = appointment.date;
    document.getElementById('time').value = appointment.time;
    document.getElementById('type').value = appointment.type;
    document.getElementById('description').value = appointment.description;
    document.getElementById('status').value = appointment.status;

    document.getElementById('editModal').style.display = 'flex';
}

// Ferme le modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Sauvegarde les modifications
function saveAppointment(e) {
    e.preventDefault();
    
    const id = document.getElementById('appointment-id').value;
    const appointment = appointments.find(a => a.id === id);
    
    if (appointment) {
        appointment.provider = document.getElementById('provider').value;
        appointment.date = document.getElementById('date').value;
        appointment.time = document.getElementById('time').value;
        appointment.type = document.getElementById('type').value;
        appointment.description = document.getElementById('description').value;
        appointment.status = document.getElementById('status').value;
        
        loadAppointments();
        updateStats();
        closeModal();
        alert('Modifications enregistrées avec succès!');
    }
}

// Change le statut d'un rendez-vous
function changeAppointmentStatus(id, status) {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
        appointment.status = status;
        loadAppointments();
        updateStats();
        alert(`Rendez-vous ${status === 'confirmed' ? 'confirmé' : 'annulé'}!`);
    }
}

// Sauvegarde dans localStorage (optionnel)
function saveToLocalStorage() {
    localStorage.setItem('adminAppointments', JSON.stringify(appointments));
}

// Charge depuis localStorage (optionnel)
function loadFromLocalStorage() {
    const saved = localStorage.getItem('adminAppointments');
    if (saved) {
        appointments = JSON.parse(saved);
        loadAppointments();
        updateStats();
    }
}