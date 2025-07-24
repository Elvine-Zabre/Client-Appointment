/**
 * MediSchedule - Script unifié
 * Gère les interactions communes à toutes les pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Gestion de la sidebar (commune à plusieurs pages)
    // =============================================
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }

    // Highlight l'item actif dans la navigation
    const currentPage = window.location.pathname.split('/').pop() || 'userinterface.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.getAttribute('href');
        if (link && link.includes(currentPage)) {
            item.classList.add('active');
        }
        
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // =============================================
    // Gestion des rendez-vous (appointment.html)
    // =============================================
    if (document.getElementById('appointmentList')) {
        // Fonctions déjà définies dans appointment.html
        // On les laisse telles quelles car elles sont spécifiques
    }

    // =============================================
    // Gestion du chat (discussion.html)
    // =============================================
    if (document.getElementById('chatMessages')) {
        // Fonctions déjà définies dans discussion.html
    }

    // =============================================
    // Gestion du profil (profil.html)
    // =============================================
    if (document.getElementById('profileForm')) {
        // Changement de photo de profil
        document.getElementById('changeAvatarBtn').addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('profileAvatar').src = event.target.result;
                        // Mettre à jour aussi l'avatar dans la sidebar
                        const sidebarAvatar = document.querySelector('.user-avatar');
                        if (sidebarAvatar) sidebarAvatar.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });

        // Soumission du formulaire de profil
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Profil mis à jour avec succès!', 'success');
            
            // Mettre à jour le nom dans la sidebar si modifié
            const newName = document.getElementById('fullName').value;
            const sidebarName = document.querySelector('.user-info h3');
            if (sidebarName) sidebarName.textContent = newName;
        });

        // Bouton Annuler
        document.getElementById('cancelBtn').addEventListener('click', function() {
            if (confirm('Annuler les modifications ?')) {
                this.form.reset();
            }
        });
    }

    // =============================================
    // Gestion des notifications (notification.html)
    // =============================================
    if (document.getElementById('notificationList')) {
        // Fonction pour marquer une notification comme lue
        document.querySelectorAll('.notification-card').forEach(card => {
            card.addEventListener('click', function() {
                const notifId = this.getAttribute('data-id');
                // Ici vous pourriez ajouter un appel API
                this.classList.remove('unread');
            });
        });
    }

    // =============================================
    // Gestion de la page d'accueil (userinterface.html)
    // =============================================
    if (document.querySelector('.specialists-grid')) {
        // Gestion des onglets de catégorie
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelector('.tab.active').classList.remove('active');
                this.classList.add('active');
                // Ici vous pourriez filtrer les spécialistes par catégorie
            });
        });

        // Gestion des boutons "Prendre rendez-vous"
        document.querySelectorAll('.specialist-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const specialistName = this.closest('.specialist-body').querySelector('.specialist-name').textContent;
                showToast(`Rendez-vous demandé avec ${specialistName}`, 'info');
                // Redirection ou ouverture d'un modal de prise de RDV
            });
        });
    }
    // =============================================
    // Gestion du profil (profil.html)
    // =============================================
    // =============================================
    // Gestion du profil (profil.html)
    // =============================================
    if (document.getElementById('profileForm')) {
        // Fonction pour mettre à jour toutes les avatars
        const updateAllAvatars = (avatarUrl) => {
            // Mise à jour dans la page profil
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) profileAvatar.src = avatarUrl;
            
            // Mise à jour dans la sidebar
            const sidebarAvatars = document.querySelectorAll('.user-avatar');
            sidebarAvatars.forEach(avatar => {
                avatar.src = avatarUrl;
            });
            
            // Sauvegarde
            localStorage.setItem('userAvatar', avatarUrl);
        };

        // Gestion du changement de photo
        const avatarBtn = document.getElementById('changeAvatarBtn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // Vérification de la taille (optionnel)
                    if (file.size > 2 * 1024 * 1024) {
                        showToast('La photo ne doit pas dépasser 2MB', 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        updateAllAvatars(event.target.result);
                        showToast('Photo de profil mise à jour!', 'success');
                    };
                    reader.readAsDataURL(file);
                };
                
                input.click();
            });
        }
        
        // Au chargement, appliquer l'avatar sauvegardé
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            updateAllAvatars(savedAvatar);
        }
    }

    // =============================================
    // Gestion de l'interface admin (adminA.html)
    // =============================================
    if (document.getElementById('appointments-body')) {
        // Simulation de chargement des rendez-vous
        const appointments = [
            { id: 1, client: "Jean Dupont", provider: "Dr. Martin", date: "2023-07-21 14:00", type: "Consultation", status: "confirmed" },
            { id: 2, client: "Marie Lambert", provider: "Mme. Diallo", date: "2023-07-22 10:30", type: "Entretien", status: "pending" }
        ];

        function renderAppointments() {
            const tbody = document.getElementById('appointments-body');
            tbody.innerHTML = appointments.map(app => `
                <tr>
                    <td>${app.id}</td>
                    <td>${app.client}</td>
                    <td>${app.provider}</td>
                    <td>${app.date}</td>
                    <td>${app.type}</td>
                    <td><span class="status-badge ${app.status}">${app.status === 'confirmed' ? 'Confirmé' : 'En attente'}</span></td>
                    <td>
                        <button class="btn-edit" data-id="${app.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-id="${app.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');

            // Gestion des boutons d'édition
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function() {
                    const appId = this.getAttribute('data-id');
                    const appointment = appointments.find(a => a.id == appId);
                    if (appointment) {
                        openEditModal(appointment);
                    }
                });
            });

            // Gestion des boutons de suppression
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const appId = this.getAttribute('data-id');
                    if (confirm('Supprimer ce rendez-vous ?')) {
                        // Ici vous feriez normalement un appel API
                        showToast('Rendez-vous supprimé', 'success');
                    }
                });
            });
        }

        function openEditModal(appointment) {
            const modal = document.getElementById('editModal');
            document.getElementById('appointment-id').value = appointment.id;
            document.getElementById('client').value = appointment.client;
            document.getElementById('provider').value = appointment.provider;
            document.getElementById('date').value = appointment.date.split(' ')[0];
            document.getElementById('time').value = appointment.date.split(' ')[1];
            document.getElementById('type').value = appointment.type.toLowerCase();
            document.getElementById('status').value = appointment.status;
            
            modal.style.display = 'block';
        }

        // Fermeture du modal
        document.querySelector('.close-btn').addEventListener('click', function() {
            document.getElementById('editModal').style.display = 'none';
        });

        // Soumission du formulaire d'édition
        document.getElementById('editForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const appId = document.getElementById('appointment-id').value;
            // Ici vous feriez normalement un appel API
            showToast('Rendez-vous mis à jour', 'success');
            document.getElementById('editModal').style.display = 'none';
        });

        renderAppointments();
    }


    // =============================================
    // Fonctions utilitaires communes
    // =============================================
    
    /**
     * Affiche une notification toast
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, info)
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    });
// Styles pour les toasts
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.toast.show {
    transform: translateY(0);
    opacity: 1;
}
.toast.success {
    background-color: #2ecc71;
}
.toast.error {
    background-color: #e74c3c;
}
.toast.info {
    background-color: #3498db;
}
`;
document.head.appendChild(toastStyles);
document.addEventListener('DOMContentLoaded', function() {
    // Gestion de l'ouverture du modal
    const appointmentButtons = document.querySelectorAll('.btn-primary');
    const modal = document.getElementById('appointmentModal');
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    const form = document.getElementById('appointmentForm');
    
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupère les infos du spécialiste
            const specialistCard = this.closest('.specialist-card');
            const specialistName = specialistCard.querySelector('.specialist-name').textContent;
            const specialistSpecialty = specialistCard.querySelector('.specialist-specialty').textContent;
            
            // Remplit le formulaire automatiquement
            document.getElementById('appointmentSpecialist').value = `${specialistName} - ${specialistSpecialty}`;
            
            // Affiche le modal
            modal.style.display = 'block';
        });
    });
    
    // Fermeture du modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Fermeture quand on clique en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des données
        const specialist = document.getElementById('appointmentSpecialist').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const reason = document.getElementById('appointmentReason').value;
        
        // Ici vous pourriez ajouter une logique pour envoyer les données à un serveur
        console.log('Nouveau RDV:', { specialist, date, time, reason });
        
        // Affiche un message de confirmation
        alert('Votre rendez-vous a été enregistré avec succès!');
        
        // Réinitialise et ferme le formulaire
        form.reset();
        modal.style.display = 'none';
        
        // Redirige vers la page des rendez-vous (optionnel)
        // window.location.href = 'appointment.html';
    });
    
    // Définir la date minimum à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
});
function updateSidebar(user) {
    if (!user) return;

    // Mise à jour de l'avatar
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        el.src = user.avatar || 'img/default-avatar.jpg';
        el.alt = `${user.firstName} ${user.lastName}`;
    });

    // Mise à jour du nom
    const nameElements = document.querySelectorAll('.user-info h3');
    nameElements.forEach(el => {
        if (user.firstName && user.lastName) {
            el.textContent = `${user.firstName} ${user.lastName}`;
        }
    });

    // Mise à jour de la date d'inscription
    const memberSinceElements = document.querySelectorAll('.user-info p');
    memberSinceElements.forEach(el => {
        if (el.textContent.includes('Membre depuis')) {
            el.textContent = `Membre depuis ${user.memberSince || new Date().getFullYear()}`;
        }
    });

    // Mise à jour de la spécialité si disponible
    if (user.specialty) {
        const specialtyElements = document.querySelectorAll('.user-specialty');
        specialtyElements.forEach(el => {
            el.textContent = user.specialty;
        });
    }
}