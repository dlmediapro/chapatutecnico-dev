/* ==========================================================
   Chapa Tu Técnico — Lógica Interactiva para "Ver Solicitud"
   ========================================================== */
(function() {
    'use strict';

    // Estados posibles para la demostración académica
    var STATES = {
        1: {
            title: "🟡 BUSCANDO TÉCNICO",
            badgeClass: "badge-searching",
            mainText: "Buscando al técnico verificado más cercano en tu distrito...",
            eta: "BUSCANDO",
            stepIndex: 1,
            showTech: false,
            showMap: false,
            canCancel: true,
            techName: "Buscando...",
            techStatus: "Escaneando especialistas en Miraflores en un radio de 5km"
        },
        2: {
            title: "🔵 TÉCNICO ASIGNADO",
            badgeClass: "badge-assigned",
            mainText: "El técnico <span class='highlight-tech'>Carlos Rivas</span> ha aceptado tu servicio y prepara sus herramientas",
            eta: "PREPARANDO",
            stepIndex: 2,
            showTech: true,
            showMap: false,
            canCancel: true,
            techName: "Carlos Rivas",
            techStatus: "⚡ Técnico Electricista Colegiado (Cert. N° EL-4910)"
        },
        3: {
            title: "🟣 EN CAMINO",
            badgeClass: "badge-on-the-way",
            mainText: "El técnico <span class='highlight-tech'>Carlos Rivas</span> está en camino a tu domicilio",
            eta: "12 MIN",
            stepIndex: 3,
            showTech: true,
            showMap: true,
            canCancel: true,
            techName: "Carlos Rivas",
            techStatus: "⚡ Técnico Electricista Colegiado (Cert. N° EL-4910)"
        },
        4: {
            title: "🟠 EN REPARACIÓN",
            badgeClass: "badge-in-progress",
            mainText: "<span class='highlight-tech'>Carlos Rivas</span> se encuentra en tu domicilio realizando el diagnóstico y reparación",
            eta: "EN CURSO",
            stepIndex: 4,
            showTech: true,
            showMap: false,
            canCancel: false,
            techName: "Carlos Rivas",
            techStatus: "⚡ Trabajo técnico en ejecución • Garantía en proceso"
        },
        5: {
            title: "🟢 FINALIZADO",
            badgeClass: "badge-completed",
            mainText: "¡Servicio completado! Revisa el trabajo realizado y emite tu calificación",
            eta: "COMPLETADO",
            stepIndex: 4,
            isCompleted: true,
            showTech: true,
            showMap: false,
            canCancel: false,
            techName: "Carlos Rivas",
            techStatus: "⚡ Servicio concluido con satisfacción • Garantía de 30 días activa"
        }
    };

    var currentStep = 3; // Por defecto arrancamos en "En camino (12 min)"

    // Toast de notificaciones
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

    // Actualizar vista completa según el paso seleccionado
    function applyState(stepNum) {
        currentStep = stepNum;
        var st = STATES[stepNum];
        if (!st) return;

        // 1. Botones de Simulación
        var simBtns = document.querySelectorAll('.ux-simulator-bar .sim-btn');
        simBtns.forEach(function(b) {
            b.classList.toggle('active', parseInt(b.getAttribute('data-step'), 10) === stepNum);
        });

        // 2. Textos principales
        var statusText = document.getElementById('tracking-status-text');
        var badgeTitle = document.getElementById('badge-status-title');
        var liveBadge = document.getElementById('live-status-badge');
        var etaTime = document.getElementById('eta-time-val');
        var etaBox = document.getElementById('eta-box');

        if (statusText) statusText.innerHTML = st.mainText;
        if (badgeTitle) badgeTitle.textContent = st.title.replace(/^[^\s]+\s/, '');
        if (liveBadge) liveBadge.className = 'status-badge-live ' + st.badgeClass;
        if (etaTime) etaTime.textContent = st.eta;

        // 3. Stepper
        var stepItems = document.querySelectorAll('#stepper-list .step-item');
        stepItems.forEach(function(item) {
            var idx = parseInt(item.getAttribute('data-index'), 10);
            item.classList.remove('step-completed', 'step-current');

            if (st.isCompleted) {
                item.classList.add('step-completed');
                item.querySelector('.step-circle').textContent = '✓';
            } else if (idx < st.stepIndex) {
                item.classList.add('step-completed');
                item.querySelector('.step-circle').textContent = '✓';
            } else if (idx === st.stepIndex) {
                item.classList.add('step-current');
                item.querySelector('.step-circle').textContent = idx;
            } else {
                item.querySelector('.step-circle').textContent = idx;
            }
        });

        // 4. Tarjeta del Técnico
        var techCard = document.getElementById('technician-card');
        if (techCard) {
            techCard.style.display = st.showTech ? 'block' : 'none';
        }

        // 5. Mapa en vivo
        var mapCard = document.getElementById('live-map-card');
        if (mapCard) {
            mapCard.style.display = st.showMap ? 'block' : 'none';
        }

        // 6. Botones de acción
        var btnCancel = document.getElementById('btn-open-cancel-modal');
        var btnFinish = document.getElementById('btn-simulate-finish');

        if (btnCancel) {
            btnCancel.style.display = st.canCancel ? 'block' : 'none';
        }
        if (btnFinish) {
            btnFinish.style.display = (stepNum === 5) ? 'block' : 'none';
        }

        // Animación suave de scroll
        liveBadge.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Configurar botones de simulación
    function setupSimulator() {
        var simBtns = document.querySelectorAll('.ux-simulator-bar .sim-btn');
        simBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var step = parseInt(btn.getAttribute('data-step'), 10);
                applyState(step);
                showToast("Cambiado a estado: " + STATES[step].title);
            });
        });
    }

    // Modal Cancelar Solicitud
    function setupCancelModal() {
        var modal = document.getElementById('modal-cancel-request');
        var btnOpen = document.getElementById('btn-open-cancel-modal');
        var btnClose = document.getElementById('btn-close-cancel-modal');
        var btnAbort = document.getElementById('btn-abort-cancel');
        var form = document.getElementById('form-cancel-request');

        if (!modal) return;

        if (btnOpen) {
            btnOpen.addEventListener('click', function() {
                if (typeof modal.showModal === 'function') modal.showModal();
                else modal.setAttribute('open', '');
            });
        }

        function closeModal() {
            if (typeof modal.close === 'function') modal.close();
            else modal.removeAttribute('open');
            if (form) form.reset();
        }

        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnAbort) btnAbort.addEventListener('click', closeModal);

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                closeModal();
                showToast("Solicitud cancelada correctamente. No se aplicaron penalidades.", "info");

                // Pasar a estado de cancelación visual
                var statusText = document.getElementById('tracking-status-text');
                var liveBadge = document.getElementById('live-status-badge');
                if (statusText) statusText.innerHTML = "❌ Solicitud Cancelada por el Usuario";
                if (liveBadge) {
                    liveBadge.className = 'status-badge-live badge-cancelled';
                    liveBadge.innerHTML = "CANCELADA";
                }
                var btnCancel = document.getElementById('btn-open-cancel-modal');
                if (btnCancel) btnCancel.style.display = 'none';
            });
        }
    }

    // Modal de Calificación
    function setupRateModal() {
        var modal = document.getElementById('modal-rate-service');
        var btnSimulate = document.getElementById('btn-simulate-finish');
        var btnSubmit = document.getElementById('btn-submit-rating');
        var starButtons = document.querySelectorAll('#rating-stars-picker .star-btn');

        if (!modal) return;

        if (btnSimulate) {
            btnSimulate.addEventListener('click', function() {
                if (typeof modal.showModal === 'function') modal.showModal();
                else modal.setAttribute('open', '');
            });
        }

        starButtons.forEach(function(star, idx) {
            star.addEventListener('click', function() {
                starButtons.forEach(function(s, i) {
                    s.classList.toggle('active', i <= idx);
                });
            });
        });

        if (btnSubmit) {
            btnSubmit.addEventListener('click', function() {
                if (typeof modal.close === 'function') modal.close();
                else modal.removeAttribute('open');

                showToast("✓ ¡Muchas gracias! Tu calificación fue enviada y la boleta llegó a tu correo.");
                if (btnSimulate) {
                    btnSimulate.textContent = "✓ Servicio Calificado";
                    btnSimulate.disabled = true;
                }
            });
        }
    }

    // Inicializar
    document.addEventListener('DOMContentLoaded', function() {
        setupSimulator();
        setupCancelModal();
        setupRateModal();
        applyState(3); // Estado inicial: En Camino
    });
})();

