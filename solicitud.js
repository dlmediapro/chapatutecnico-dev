/* ==========================================================================
   Chapa Tu Técnico — Lógica de Interacción: CONSULTA CLIENTE (solicitud.js)
   Fidelidad Figma, WCAG 2.1 AA & Desacoplamiento de Sesión
   ========================================================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', initConsultaCliente);

    function getActiveSessionUser() {
        try {
            var raw = localStorage.getItem('ctt_profile') || localStorage.getItem('chapa_auth_user');
            if (raw) {
                var p = JSON.parse(raw);
                var name = p.nombre || (p.firstname ? (p.firstname + (p.lastname ? ' ' + p.lastname : '')).trim() : null) || p.name;
                if (name) {
                    return {
                        nombre: name,
                        distrito: p.distrito || p.district || 'Surco, Lima',
                        verificado: p.verificado !== undefined ? p.verificado : true
                    };
                }
            }
        } catch (_) {}
        return {
            nombre: 'Diego León',
            distrito: 'Surco, Lima',
            verificado: true
        };
    }

    function hydrateSessionUI(user) {
        var nameEl = document.getElementById('session-user-name');
        var distEl = document.getElementById('session-user-district');
        if (nameEl) nameEl.textContent = user.nombre;
        if (distEl) distEl.textContent = user.distrito;
    }

    function initConsultaCliente() {
        var form = document.getElementById('form-consulta-cliente');
        if (!form) return;

        var currentUser = getActiveSessionUser();
        hydrateSessionUI(currentUser);

        var chips = document.querySelectorAll('.chip-item');
        var textarea = document.getElementById('consulta-mensaje');
        var charCounter = document.getElementById('char-counter');
        var uploadTrigger = document.getElementById('upload-trigger');
        var fileInput = document.getElementById('consulta-file-input');
        var photoCounterBadge = document.getElementById('photo-counter-badge');
        var urgencyRadios = document.querySelectorAll('input[name="urgencia"]');
        var cardHoy = document.getElementById('card-urgencia-hoy');
        var cardProgramar = document.getElementById('card-urgencia-programar');
        var schedulePicker = document.getElementById('schedule-picker');
        var fechaInput = document.getElementById('fecha-servicio');
        var urgencyNoticeBanner = document.getElementById('urgency-notice-banner');
        var urgencyNoticeText = document.getElementById('urgency-notice-text');
        var btnSubmit = document.getElementById('btn-submit-consulta');

        var state = { photosCount: 1, uploadedFiles: [] };

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var isSelected = chip.classList.toggle('is-selected');
                chip.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
                var checkSpan = chip.querySelector('.chip-check');
                if (checkSpan) checkSpan.textContent = isSelected ? '✓' : '';
            });
        });

        if (textarea && charCounter) {
            textarea.addEventListener('input', function () {
                charCounter.textContent = textarea.value.length + ' / 300';
            });
        }

        function updatePhotoCounter() {
            if (photoCounterBadge) {
                photoCounterBadge.textContent = state.photosCount + ' / 3 archivos';
            }
        }

        var btnRemoveInitial = document.getElementById('btn-remove-slot-1');
        if (btnRemoveInitial) {
            btnRemoveInitial.addEventListener('click', function (e) {
                e.stopPropagation();
                var slot1 = document.getElementById('slot-1');
                if (slot1) {
                    slot1.className = 'photo-slot-item is-empty';
                    slot1.setAttribute('role', 'button');
                    slot1.setAttribute('tabindex', '0');
                    slot1.setAttribute('aria-label', 'Añadir foto o video 1');
                    slot1.innerHTML = '<span class="slot-add-icon" aria-hidden="true">+</span>';
                    bindEmptySlotClick(slot1);
                }
                state.photosCount = Math.max(0, state.photosCount - 1);
                updatePhotoCounter();
            });
        }

        if (uploadTrigger && fileInput) {
            uploadTrigger.addEventListener('click', function () {
                if (state.photosCount < 3) fileInput.click();
            });
            uploadTrigger.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    uploadTrigger.click();
                }
            });
        }

        function bindEmptySlotClick(slot) {
            slot.addEventListener('click', function () {
                if (fileInput && state.photosCount < 3) fileInput.click();
            });
            slot.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slot.click();
                }
            });
        }

        document.querySelectorAll('.photo-slot-item.is-empty').forEach(bindEmptySlotClick);

        if (fileInput) {
            fileInput.addEventListener('change', function () {
                var files = Array.from(fileInput.files);
                if (!files.length) return;

                files.forEach(function (file) {
                    if (state.photosCount >= 3) return;
                    var nextEmptySlot = document.querySelector('.photo-slot-item.is-empty');
                    if (!nextEmptySlot) return;

                    var objectUrl = URL.createObjectURL(file);
                    state.uploadedFiles.push({ file: file, url: objectUrl });
                    state.photosCount++;

                    nextEmptySlot.className = 'photo-slot-item is-filled';
                    nextEmptySlot.removeAttribute('role');
                    nextEmptySlot.removeAttribute('tabindex');
                    nextEmptySlot.innerHTML =
                        '<img src="' + objectUrl + '" alt="Vista previa de archivo adjunto" class="slot-preview-image" width="80" height="80">' +
                        '<button type="button" class="btn-remove-photo" aria-label="Eliminar foto">×</button>';

                    var removeBtn = nextEmptySlot.querySelector('.btn-remove-photo');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function (e) {
                            e.stopPropagation();
                            nextEmptySlot.className = 'photo-slot-item is-empty';
                            nextEmptySlot.setAttribute('role', 'button');
                            nextEmptySlot.setAttribute('tabindex', '0');
                            nextEmptySlot.setAttribute('aria-label', 'Añadir foto o video');
                            nextEmptySlot.innerHTML = '<span class="slot-add-icon" aria-hidden="true">+</span>';
                            bindEmptySlotClick(nextEmptySlot);
                            state.photosCount = Math.max(0, state.photosCount - 1);
                            updatePhotoCounter();
                        });
                    }
                });
                updatePhotoCounter();
                fileInput.value = '';
            });
        }

        if (fechaInput) {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var yyyy = tomorrow.getFullYear();
            var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            var dd = String(tomorrow.getDate()).padStart(2, '0');
            fechaInput.min = yyyy + '-' + mm + '-' + dd;
            fechaInput.value = yyyy + '-' + mm + '-' + dd;
        }

        urgencyRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                var isHoy = (radio.value === 'hoy');
                if (cardHoy) cardHoy.classList.toggle('is-checked', isHoy);
                if (cardProgramar) cardProgramar.classList.toggle('is-checked', !isHoy);

                if (schedulePicker) {
                    schedulePicker.style.display = isHoy ? 'none' : 'block';
                    schedulePicker.setAttribute('aria-hidden', isHoy ? 'true' : 'false');
                }

                if (urgencyNoticeBanner && urgencyNoticeText) {
                    var bannerIcon = urgencyNoticeBanner.querySelector('.notice-banner-icon');
                    if (isHoy) {
                        if (bannerIcon) bannerIcon.textContent = '⚠️';
                        urgencyNoticeText.textContent = 'Priorizamos tu solicitud: el técnico verá la urgencia en el primer mensaje del chat.';
                    } else {
                        if (bannerIcon) bannerIcon.textContent = '📅';
                        urgencyNoticeText.textContent = 'Solicitud agendada: coordinarás la confirmación exacta de fecha y hora directamente en el chat.';
                    }
                }
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var selectedChips = [];
            document.querySelectorAll('.chip-item.is-selected').forEach(function (chip) {
                var label = chip.querySelector('.chip-label');
                if (label) selectedChips.push(label.textContent.trim());
            });

            var mensajeTexto = textarea ? textarea.value.trim() : '';
            var radioChecked = document.querySelector('input[name="urgencia"]:checked');
            var urgenciaSeleccionada = radioChecked ? radioChecked.value : 'hoy';
            var fechaProgramada = (urgenciaSeleccionada === 'programar' && fechaInput) ? fechaInput.value : null;
            var horaSelect = document.getElementById('hora-servicio');
            var horaProgramada = (urgenciaSeleccionada === 'programar' && horaSelect) ? horaSelect.value : null;

            if (selectedChips.length === 0 && mensajeTexto.length === 0) {
                var firstChip = document.querySelector('.chip-item');
                if (firstChip) firstChip.focus();
                return;
            }

            var activeUser = getActiveSessionUser();
            var consultaPayload = {
                tecnico: {
                    id: 'roberto-rojas',
                    nombre: 'Roberto Rojas',
                    especialidad: 'Especialista en instalaciones eléctricas',
                    avatar: 'assets/img/tecnicos/roberto-rojas-avatar.webp',
                    rating: 4.9,
                    tiempoRespuesta: '~3 min'
                },
                problema: {
                    chips: selectedChips,
                    mensaje: mensajeTexto || 'Sin mensaje adicional (problema especificado en selección rápida)',
                    fotosCount: state.photosCount,
                    urgencia: urgenciaSeleccionada,
                    fechaProgramada: fechaProgramada,
                    horaProgramada: horaProgramada
                },
                cliente: {
                    nombre: activeUser.nombre,
                    distrito: activeUser.distrito,
                    verificado: activeUser.verificado
                },
                creadoEn: new Date().toISOString()
            };

            try {
                localStorage.setItem('chapa_consulta_actual', JSON.stringify(consultaPayload));
            } catch (_) {}

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.classList.add('is-submitting');
                btnSubmit.innerHTML = '<span class="btn-iniciar-text">✓ CONECTANDO CON ROBERTO ROJAS...</span>';
            }

            setTimeout(function () {
                window.location.href = 'chat.html';
            }, 300);
        });
    }
})();
