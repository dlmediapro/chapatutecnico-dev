/* ==========================================================
   Chapa Tu Técnico — Lógica del Panel Técnico (perfil.js)
   ========================================================== */
(function() {
    'use strict';

    function showToast(message, type) {
        var toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'toast-notification show ' + (type || 'success');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function() {
            toast.className = 'toast-notification';
        }, 3200);
    }

    // 1. Aceptar Trabajos Interactivamente
    function setupAcceptJobButtons() {
        var acceptButtons = document.querySelectorAll('.btn-job-accept');
        var inProgressCounter = document.getElementById('stat-in-progress');
        var newRequestsCounter = document.getElementById('stat-new-requests');
        var badgeCounter = document.getElementById('badge-counter-work');

        acceptButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (btn.classList.contains('accepted')) {
                    showToast("Este trabajo ya fue aceptado. Revisa tu sección de 'Solicitudes'.", "info");
                    return;
                }

                btn.classList.add('accepted');
                btn.textContent = "✓ Aceptado";
                btn.style.background = "#059669";
                btn.style.color = "#ffffff";
                btn.style.cursor = "default";

                if (inProgressCounter) {
                    var currentProgress = parseInt(inProgressCounter.textContent, 10) || 3;
                    inProgressCounter.textContent = currentProgress + 1;
                }

                if (newRequestsCounter) {
                    var currentNew = parseInt(newRequestsCounter.textContent, 10) || 5;
                    var updatedNew = Math.max(0, currentNew - 1);
                    newRequestsCounter.textContent = updatedNew;
                    if (badgeCounter) badgeCounter.textContent = updatedNew + " nuevas";
                }

                showToast("¡Trabajo aceptado con éxito! Se ha agregado a tus trabajos en proceso.", "success");
            });
        });
    }

    // 2. Filtro de Categorías
    function setupCategoryFilter() {
        var select = document.getElementById('select-category-filter');
        var cards = document.querySelectorAll('#work-cards-list .job-card');

        if (!select) return;

        select.addEventListener('change', function() {
            var filter = select.value;

            cards.forEach(function(card) {
                var cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'grid';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 3. Selección de Disponibilidad en el Calendario
    function setupCalendarSelector() {
        var dayCards = document.querySelectorAll('#calendar-days-row .cal-day-card');

        dayCards.forEach(function(card) {
            card.addEventListener('click', function() {
                dayCards.forEach(function(c) { c.classList.remove('active'); });
                card.classList.add('active');

                var dayName = card.querySelector('.cal-day-name').textContent;
                var dayNum = card.querySelector('.cal-day-number').textContent;
                showToast("Disponibilidad seleccionada: " + dayName + " " + dayNum + " de Octubre", "info");
            });
        });

        var btnToggle = document.getElementById('btn-toggle-all-calendar');
        if (btnToggle) {
            btnToggle.addEventListener('click', function(e) {
                e.preventDefault();
                showToast("Abriendo calendario completo de turnos...", "info");
            });
        }
    }

    // 4. Cerrar Sesión
    function setupLogout() {
        var btnSidebar = document.getElementById('btn-sidebar-logout');
        var btnHeader = document.getElementById('btn-quick-logout');

        function doLogout() {
            if (confirm("¿Deseas cerrar la sesión de técnico de Rodrigo Rojas?")) {
                showToast("Cerrando sesión de técnico...", "info");
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 1000);
            }
        }

        if (btnSidebar) btnSidebar.addEventListener('click', doLogout);
        if (btnHeader) btnHeader.addEventListener('click', doLogout);
    }

    document.addEventListener('DOMContentLoaded', function() {
        setupAcceptJobButtons();
        setupCategoryFilter();
        setupCalendarSelector();
        setupLogout();
    });
})();

