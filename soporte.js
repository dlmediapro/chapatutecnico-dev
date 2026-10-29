/**
 * Chapa Tu Técnico — Controlador modular para la vista de Soporte
 * Gestiona el acordeón FAQ accesible, filtrado por categorías,
 * búsqueda predictiva en vivo y los 4 estados asíncronos del formulario de tickets.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initSupport);

  function initSupport() {
    initFaqAccordion();
    initFaqFilters();
    initFaqLiveSearch();
    initTicketForm();
  }

  /* ==========================================================
     1. Acordeón Interactivo Accesible (WAI-ARIA + Teclado)
     ========================================================== */
  function initFaqAccordion() {
    var accordion = document.getElementById('faq-accordion');
    if (!accordion) return;

    var triggers = accordion.querySelectorAll('.faq-trigger');

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener('click', function () {
        toggleItem(trigger);
      });

      trigger.addEventListener('keydown', function (e) {
        var key = e.key;
        var nextIndex;

        if (key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (index + 1) % triggers.length;
          triggers[nextIndex].focus();
        } else if (key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (index - 1 + triggers.length) % triggers.length;
          triggers[nextIndex].focus();
        } else if (key === 'Home') {
          e.preventDefault();
          triggers[0].focus();
        } else if (key === 'End') {
          e.preventDefault();
          triggers[triggers.length - 1].focus();
        }
      });
    });

    function toggleItem(btn) {
      var item = btn.closest('.faq-item');
      var content = item ? item.querySelector('.faq-content') : null;
      if (!item || !content) return;

      var isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar otros elementos del mismo grupo si se desea acordeón exclusivo
      var allItems = accordion.querySelectorAll('.faq-item');
      allItems.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          var otherBtn = otherItem.querySelector('.faq-trigger');
          var otherContent = otherItem.querySelector('.faq-content');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.setAttribute('hidden', '');
        }
      });

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        content.setAttribute('hidden', '');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        content.removeAttribute('hidden');
      }
    }
  }

  /* ==========================================================
     2. Filtro de Categorías FAQ
     ========================================================== */
  function initFaqFilters() {
    var filterBar = document.getElementById('faq-filters');
    var items = document.querySelectorAll('.faq-item');
    if (!filterBar || !items.length) return;

    filterBar.addEventListener('click', function (e) {
      var chip = e.target.closest('.faq-chip');
      if (!chip) return;

      var active = filterBar.querySelector('.faq-chip.active');
      if (active) active.classList.remove('active');
      chip.classList.add('active');

      var cat = chip.dataset.category || 'all';
      applyFilters(cat, getSearchQuery());
    });
  }

  /* ==========================================================
     3. Buscador en Vivo de Preguntas
     ========================================================== */
  var currentSearchQuery = '';

  function getSearchQuery() {
    return currentSearchQuery;
  }

  function initFaqLiveSearch() {
    var input = document.getElementById('faq-search-input');
    var clearBtn = document.getElementById('faq-search-clear');
    if (!input) return;

    input.addEventListener('input', function () {
      currentSearchQuery = normalizeText(input.value);
      if (clearBtn) {
        clearBtn.style.display = currentSearchQuery ? 'inline-flex' : 'none';
      }
      var activeChip = document.querySelector('.faq-chip.active');
      var currentCategory = activeChip ? activeChip.dataset.category || 'all' : 'all';
      applyFilters(currentCategory, currentSearchQuery);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        currentSearchQuery = '';
        clearBtn.style.display = 'none';
        input.focus();
        var activeChip = document.querySelector('.faq-chip.active');
        var currentCategory = activeChip ? activeChip.dataset.category || 'all' : 'all';
        applyFilters(currentCategory, '');
      });
    }
  }

  function applyFilters(category, query) {
    var items = document.querySelectorAll('.faq-item');
    var emptyState = document.getElementById('faq-empty-state');
    var visibleCount = 0;

    items.forEach(function (item) {
      var itemCategory = item.dataset.category || '';
      var itemText = normalizeText(item.textContent || '');

      var matchCategory = category === 'all' || itemCategory === category;
      var matchQuery = !query || itemText.indexOf(query) !== -1;

      if (matchCategory && matchQuery) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
        var btn = item.querySelector('.faq-trigger');
        var content = item.querySelector('.faq-content');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (content) content.setAttribute('hidden', '');
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function normalizeText(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /* ==========================================================
     4. Formulario de Soporte con 4 Estados Asíncronos
        (Idle -> Loading -> Error / Success con Retry)
     ========================================================== */
  function initTicketForm() {
    var form = document.getElementById('support-ticket-form');
    var feedbackContainer = document.getElementById('form-feedback');
    var submitBtn = document.getElementById('btn-submit-ticket');
    if (!form || !feedbackContainer || !submitBtn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre = (form.querySelector('#ticket-name') || {}).value || '';
      var contacto = (form.querySelector('#ticket-contact') || {}).value || '';
      var servicio = (form.querySelector('#ticket-service') || {}).value || '';
      var mensaje = (form.querySelector('#ticket-message') || {}).value || '';

      // Validación client-side
      if (!nombre.trim() || !contacto.trim() || !servicio || !mensaje.trim()) {
        showFeedback('error', 'Por favor, completa todos los campos requeridos para enviar tu consulta.', true);
        return;
      }

      // 1. Estado: LOADING
      setFormState('loading');
      showFeedback('loading', 'Generando ticket de atención y conectando con el equipo...');

      // Simulación de envío asíncrono robusto
      setTimeout(function () {
        // Generar número aleatorio de ticket institucional
        var ticketId = 'CPT-' + Math.floor(1000 + Math.random() * 9000);
        setFormState('success');
        showSuccessState(ticketId, nombre, contacto);
      }, 1200);
    });

    function setFormState(state) {
      if (state === 'loading') {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Enviando...';
      } else {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.innerHTML = 'ENVIAR CONSULTA';
      }
    }

    function showFeedback(type, message, canRetry) {
      feedbackContainer.className = 'form-feedback ' + type;
      feedbackContainer.innerHTML =
        '<p class="feedback-text">' + escapeHtml(message) + '</p>' +
        (canRetry ? '<button type="button" class="btn-retry" id="btn-feedback-retry">Reintentar</button>' : '');
      feedbackContainer.style.display = 'block';

      var retryBtn = feedbackContainer.querySelector('#btn-feedback-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', function () {
          feedbackContainer.style.display = 'none';
          var firstInput = form.querySelector('input:invalid, textarea:invalid, input, textarea');
          if (firstInput) firstInput.focus();
        });
      }
    }

    function showSuccessState(ticketId, nombre, contacto) {
      form.style.display = 'none';
      feedbackContainer.className = 'form-feedback success-state-card';
      feedbackContainer.innerHTML =
        '<div class="success-icon" aria-hidden="true">✓</div>' +
        '<h3>¡Tu consulta ha sido registrada!</h3>' +
        '<p class="ticket-code">Ticket N.° <strong>' + escapeHtml(ticketId) + '</strong></p>' +
        '<p class="success-detail">Gracias <strong>' + escapeHtml(nombre) + '</strong>. Un asesor de Chapa Tu Técnico se pondrá en contacto a través de <strong>' + escapeHtml(contacto) + '</strong> en un plazo máximo de 15 minutos.</p>' +
        '<div class="success-actions">' +
          '<a href="https://wa.me/51998204667?text=' + encodeURIComponent('Hola Chapa Tu Técnico, he registrado el ticket ' + ticketId) + '" target="_blank" rel="noopener noreferrer" class="btn-ticket-whatsapp"><img src="img/whatsapp.png" alt="" width="20" height="20"> Notificar por WhatsApp</a>' +
          '<button type="button" class="btn-new-ticket" id="btn-reset-ticket">Enviar otra consulta</button>' +
        '</div>';
      feedbackContainer.style.display = 'block';

      var resetBtn = feedbackContainer.querySelector('#btn-reset-ticket');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          form.reset();
          form.style.display = 'grid';
          feedbackContainer.style.display = 'none';
          feedbackContainer.innerHTML = '';
          setFormState('idle');
        });
      }
    }

    function escapeHtml(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }
})();
