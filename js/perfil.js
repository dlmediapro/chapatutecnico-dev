/* ==========================================================================
   Chapa Tu Técnico — Lógica del Panel Técnico (js/perfil.js)
   Fidelidad Figma, 4 Estados Asíncronos, WCAG 2.1 AA & Emil Kowalski Motion
   ========================================================================== */
(function () {
    'use strict';

    var MOCK_JOBS = [
        {
            id: 1,
            solicitudId: 'CT-2026-084',
            category: 'Plomeria',
            tag: 'Nuevo',
            tagClass: 'pill-tag-cyan',
            iconSvg: '<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>',
            title: 'Reparación de fuga de agua',
            desc: 'Se presenta una fuga en el lavadero de la cocina. El agua sale por la parte inferior del mueble.',
            location: 'Miraflores',
            time: 'Hoy, 10:00 a. m.',
            price: 'S/ 80 - 120'
        },
        {
            id: 2,
            solicitudId: 'CT-2026-085',
            category: 'Electricista',
            tag: 'Nuevo',
            tagClass: 'pill-tag-cyan',
            iconSvg: '<path d="M12 23c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 .69 0 1.35.08 2 .22-2.22 1.34-3.72 3.8-3.72 6.6 0 4.29 3.49 7.78 7.78 7.78.47 0 .93-.05 1.38-.13A8.99 8.99 0 0112 23z"/>',
            title: 'Instalación de luminaria',
            desc: 'Se necesita instalar una luminaria de techo en la sala. Ya cuenta con el punto eléctrico.',
            location: 'Surco',
            time: 'Hoy, 2:00 p. m.',
            price: 'S/ 60 - 100'
        },
        {
            id: 3,
            solicitudId: 'CT-2026-086',
            category: 'Gasfiteria',
            tag: 'Ninguno',
            tagClass: 'pill-tag-yellow',
            iconSvg: '<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>',
            title: 'Mantenimiento de terma',
            desc: 'La terma no calienta correctamente. Se requiere revisión y mantenimiento general.',
            location: 'San Isidro',
            time: 'Mañana, 5:00 p. m.',
            price: 'S/ 90 - 130'
        }
    ];

    function showToast(message, type) {
        var toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'toast-notification show ' + (type || 'success');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.className = 'toast-notification';
        }, 3200);
    }

    function getLoggedInTechnician() {
        try {
            var rawTech = localStorage.getItem('ctt_tech_profile') || localStorage.getItem('chapa_tech_user');
            var rawProfile = localStorage.getItem('ctt_profile') || localStorage.getItem('chapa_auth_user');
            var raw = rawTech || rawProfile;
            if (raw) {
                var p = JSON.parse(raw);
                var fullName = p.nombre || (p.firstname ? (p.firstname + (p.lastname ? ' ' + p.lastname : '')).trim() : null) || p.name;
                if (fullName) {
                    return {
                        name: fullName,
                        specialty: p.specialty || p.especialidad || 'Revisa y administra tus solicitudes de trabajo',
                        rating: p.rating || '9.5',
                        stats: p.stats || { newRequests: 5, inProgress: 3, completed: 15 }
                    };
                }
            }
        } catch (_) {}
        return {
            name: 'Rodrigo Rojas',
            specialty: 'Revisa y administra tus solicitudes de trabajo',
            rating: '9.5',
            stats: { newRequests: 5, inProgress: 3, completed: 15 }
        };
    }

    function hydrateTechnicianUI(tech) {
        var nameEl = document.getElementById('tech-user-name');
        var specEl = document.getElementById('tech-user-specialty');
        var statNew = document.getElementById('stat-new-requests');
        var statProg = document.getElementById('stat-in-progress');
        var statComp = document.getElementById('stat-completed');
        var statRate = document.getElementById('stat-rating');
        var badgeWork = document.getElementById('badge-counter-work');

        if (nameEl) nameEl.textContent = tech.name;
        if (specEl) specEl.textContent = tech.specialty;
        if (statNew) statNew.textContent = tech.stats.newRequests;
        if (statProg) statProg.textContent = tech.stats.inProgress;
        if (statComp) statComp.textContent = tech.stats.completed;
        if (statRate) statRate.textContent = tech.rating;
        if (badgeWork) badgeWork.textContent = tech.stats.newRequests + ' nuevas';
    }

    // 4 Estados Asíncronos
    function renderLoadingSkeletons(container) {
        container.setAttribute('aria-busy', 'true');
        container.innerHTML = [1, 2, 3].map(function () {
            return '<div class="job-card is-skeleton" aria-hidden="true">' +
                '<div class="skeleton-circle skeleton-box"></div>' +
                '<div><div class="skeleton-title skeleton-box"></div><div class="skeleton-desc skeleton-box"></div></div>' +
                '<div style="min-width:120px;"><div class="skeleton-line skeleton-box"></div></div>' +
                '<div style="min-width:130px;"><div class="skeleton-btn skeleton-box"></div></div>' +
                '</div>';
        }).join('');
    }

    function renderEmptyState(container, categoryName) {
        container.removeAttribute('aria-busy');
        var catText = categoryName && categoryName !== 'all' ? ' en ' + categoryName : '';
        container.innerHTML = '<div class="work-empty-box" role="status">' +
            '<p style="font-size:1.1rem;font-weight:700;color:#1e293b;margin-bottom:6px;">No tienes solicitudes pendientes' + catText + '</p>' +
            '<p style="font-size:0.9rem;color:#64748b;margin:0;">¡Todo al día! Te avisaremos tan pronto ingrese un nuevo requerimiento.</p>' +
            '</div>';
    }

    function renderErrorState(container, onRetry) {
        container.removeAttribute('aria-busy');
        container.innerHTML = '<div class="work-error-box" role="alert">' +
            '<p style="font-weight:700;font-size:1.1rem;margin:0 0 6px;">Error al cargar las solicitudes</p>' +
            '<p style="font-size:0.88rem;margin:0;">No se pudo conectar con el servidor para sincronizar tu bandeja.</p>' +
            '<button type="button" class="btn-job-retry" id="btn-retry-requests">Reintentar conexión</button>' +
            '</div>';
        var retryBtn = document.getElementById('btn-retry-requests');
        if (retryBtn && onRetry) retryBtn.addEventListener('click', onRetry);
    }

    function renderSuccessCards(container, jobs) {
        container.removeAttribute('aria-busy');
        if (!jobs || jobs.length === 0) {
            renderEmptyState(container);
            return;
        }

        container.innerHTML = jobs.map(function (job) {
            return '<article class="job-card" data-category="' + job.category + '">' +
                '<div class="job-icon-col">' +
                '<div class="job-round-icon purple-bg">' +
                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + job.iconSvg + '</svg>' +
                '</div>' +
                '</div>' +
                '<div class="job-info-col">' +
                '<div class="job-tag-row">' +
                '<span class="' + job.tagClass + '">' + job.tag + '</span>' +
                '<span class="job-cat-name">' + job.category + '</span>' +
                '</div>' +
                '<h3 class="job-title">' + job.title + '</h3>' +
                '<p class="job-desc">' + job.desc + '</p>' +
                '<div class="job-meta-row">' +
                '<span class="meta-location">' +
                '<svg viewBox="0 0 24 24" fill="currentColor" class="meta-icon-pin" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' +
                '<strong>' + job.location + '</strong>' +
                '</span>' +
                '<span class="meta-time">' +
                '<svg viewBox="0 0 24 24" fill="currentColor" class="meta-icon-clock" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>' +
                job.time +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="job-price-col">' +
                '<strong class="job-price-range">' + job.price + '</strong>' +
                '<span class="job-price-sub">Precio estimado</span>' +
                '</div>' +
                '<div class="job-actions-col">' +
                '<a href="solicitud.html?id=' + job.solicitudId + '" class="btn-job-view">Ver solicitud</a>' +
                '<button type="button" class="btn-job-accept" data-job-id="' + job.id + '">Aceptar trabajo</button>' +
                '</div>' +
                '</article>';
        }).join('');

        setupAcceptJobButtons();
    }

    function setupAcceptJobButtons() {
        var buttons = document.querySelectorAll('.btn-job-accept');
        var inProgress = document.getElementById('stat-in-progress');
        var newReqs = document.getElementById('stat-new-requests');
        var badge = document.getElementById('badge-counter-work');

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (btn.classList.contains('accepted')) {
                    showToast('Este trabajo ya fue aceptado. Revisa tus solicitudes en curso.', 'info');
                    return;
                }
                btn.classList.add('accepted');
                btn.textContent = '✓ Aceptado';
                if (inProgress) inProgress.textContent = (parseInt(inProgress.textContent, 10) || 0) + 1;
                if (newReqs) {
                    var updated = Math.max(0, (parseInt(newReqs.textContent, 10) || 0) - 1);
                    newReqs.textContent = updated;
                    if (badge) badge.textContent = updated + ' nuevas';
                }
                showToast('¡Trabajo aceptado con éxito! Se ha añadido a tus servicios en proceso.', 'success');
            });
        });
    }

    function setupCategoryFilter() {
        var select = document.getElementById('select-category-filter');
        var container = document.getElementById('work-cards-list');
        if (!select || !container) return;

        select.addEventListener('change', function () {
            var cat = select.value;
            var filtered = cat === 'all' ? MOCK_JOBS : MOCK_JOBS.filter(function (j) { return j.category === cat; });
            if (filtered.length === 0) {
                renderEmptyState(container, select.options[select.selectedIndex].text);
            } else {
                renderSuccessCards(container, filtered);
            }
        });
    }

    function setupCalendarSelector() {
        var cards = document.querySelectorAll('#calendar-days-row .cal-day-card');
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                cards.forEach(function (c) { c.classList.remove('active'); });
                card.classList.add('active');
                var name = card.querySelector('.cal-day-name') ? card.querySelector('.cal-day-name').textContent : '';
                var num = card.querySelector('.cal-day-number') ? card.querySelector('.cal-day-number').textContent : '';
                showToast('Disponibilidad actualizada para el ' + name + ' ' + num, 'info');
            });
        });
    }

    function setupLogout() {
        var btn = document.getElementById('btn-sidebar-logout');
        if (!btn) return;
        btn.addEventListener('click', function () {
            localStorage.removeItem('ctt_tech_profile');
            localStorage.removeItem('ctt_is_authenticated');
            window.dispatchEvent(new Event('chapa-auth-updated'));
            showToast('Cerrando sesión de técnico...', 'info');
            setTimeout(function () { window.location.href = 'index.html'; }, 600);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('work-cards-list');
        var tech = getLoggedInTechnician();
        hydrateTechnicianUI(tech);
        setupCategoryFilter();
        setupCalendarSelector();
        setupLogout();

        if (container) {
            renderLoadingSkeletons(container);
            setTimeout(function () {
                renderSuccessCards(container, MOCK_JOBS);
            }, 300);
        }
    });
})();
