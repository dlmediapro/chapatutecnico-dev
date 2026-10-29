/* ==========================================================
   Chapa Tu Técnico — Lógica Interactiva para "Mi Cuenta" (Cliente)
   ========================================================== */
(function() {
    'use strict';

    // Datos por defecto si no existen en localStorage
    var DEFAULT_PROFILE = {
        firstname: "Carlos Alberto",
        lastname: "Medina Rojas",
        docType: "DNI",
        docNumber: "72849102",
        phone: "998 204 667",
        email: "carlos.medina@gmail.com",
        birthdate: "1996-05-18",
        emergencyContact: "987 112 334"
    };

    var DEFAULT_ADDRESSES = [
        {
            id: "addr_1",
            alias: "Mi Departamento (Miraflores)",
            district: "Miraflores",
            line: "Av. Benavides 1240, Dpto 402",
            reference: "Frente al parque Reducto",
            isDefault: true
        },
        {
            id: "addr_2",
            alias: "Oficina San Isidro",
            district: "San Isidro",
            line: "Calle Las Begonias 441, Piso 6",
            reference: "Cerca a la estación Canaval y Moreyra",
            isDefault: false
        }
    ];

    // Cargar del localStorage
    function getStoredProfile() {
        var raw = localStorage.getItem('ctt_profile');
        if (!raw) return DEFAULT_PROFILE;
        try { return JSON.parse(raw); } catch(e) { return DEFAULT_PROFILE; }
    }

    function saveStoredProfile(data) {
        localStorage.setItem('ctt_profile', JSON.stringify(data));
    }

    function getStoredAddresses() {
        var raw = localStorage.getItem('ctt_addresses');
        if (!raw) return DEFAULT_ADDRESSES;
        try { return JSON.parse(raw); } catch(e) { return DEFAULT_ADDRESSES; }
    }

    function saveStoredAddresses(arr) {
        localStorage.setItem('ctt_addresses', JSON.stringify(arr));
    }

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

    // Inicialización de Tabs
    function setupTabs() {
        var tabButtons = document.querySelectorAll('.account-tabs-nav .tab-btn');
        var tabPanes = document.querySelectorAll('.account-tabs-container .tab-pane');

        tabButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var targetPaneId = btn.getAttribute('aria-controls');

                tabButtons.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanes.forEach(function(p) {
                    p.classList.remove('active');
                    p.hidden = true;
                });

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                var targetPane = document.getElementById(targetPaneId);
                if (targetPane) {
                    targetPane.classList.add('active');
                    targetPane.hidden = false;
                }
            });
        });
    }

    // Renderizar datos del perfil
    function renderProfile() {
        var profile = getStoredProfile();

        var fullName = (profile.firstname + " " + profile.lastname).trim();
        var displayFullName = document.getElementById('display-fullname');
        var displayPhone = document.getElementById('display-phone');
        var displayEmail = document.getElementById('display-email');

        if (displayFullName) displayFullName.textContent = fullName || "Usuario";
        if (displayPhone) displayPhone.textContent = profile.phone;
        if (displayEmail) displayEmail.textContent = profile.email;

        var inputFirstname = document.getElementById('input-firstname');
        var inputLastname = document.getElementById('input-lastname');
        var inputDocType = document.getElementById('input-doc-type');
        var inputDocNumber = document.getElementById('input-doc-number');
        var inputPhone = document.getElementById('input-phone');
        var inputEmail = document.getElementById('input-email');
        var inputBirthdate = document.getElementById('input-birthdate');
        var inputEmergency = document.getElementById('input-emergency-contact');

        if (inputFirstname) inputFirstname.value = profile.firstname;
        if (inputLastname) inputLastname.value = profile.lastname;
        if (inputDocType) inputDocType.value = profile.docType;
        if (inputDocNumber) inputDocNumber.value = profile.docNumber;
        if (inputPhone) inputPhone.value = profile.phone;
        if (inputEmail) inputEmail.value = profile.email;
        if (inputBirthdate) inputBirthdate.value = profile.birthdate;
        if (inputEmergency) inputEmergency.value = profile.emergencyContact;
    }

    // Guardar cambios del perfil
    function setupProfileForm() {
        var form = document.getElementById('form-personal-data');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var data = {
                firstname: document.getElementById('input-firstname').value.trim(),
                lastname: document.getElementById('input-lastname').value.trim(),
                docType: document.getElementById('input-doc-type').value,
                docNumber: document.getElementById('input-doc-number').value.trim(),
                phone: document.getElementById('input-phone').value.trim(),
                email: document.getElementById('input-email').value.trim(),
                birthdate: document.getElementById('input-birthdate').value,
                emergencyContact: document.getElementById('input-emergency-contact').value.trim()
            };

            if (!data.firstname || !data.phone || !data.email) {
                showToast("Por favor completa los campos requeridos.", "error");
                return;
            }

            saveStoredProfile(data);
            renderProfile();
            showToast("✓ Tus datos se actualizaron correctamente.");
        });

        var btnReset = document.getElementById('btn-reset-profile');
        if (btnReset) {
            btnReset.addEventListener('click', function() {
                saveStoredProfile(DEFAULT_PROFILE);
                renderProfile();
                showToast("Datos restablecidos a los valores predeterminados.");
            });
        }
    }

    // Renderizar Direcciones
    function renderAddresses() {
        var addresses = getStoredAddresses();
        var container = document.getElementById('addresses-list-container');
        var counter = document.getElementById('address-counter');

        if (counter) counter.textContent = addresses.length;
        if (!container) return;

        if (addresses.length === 0) {
            container.innerHTML = '<div class="empty-state-card"><p>No tienes direcciones registradas todavía.</p></div>';
            return;
        }

        var html = '';
        addresses.forEach(function(addr) {
            html += 
            '<article class="address-card ' + (addr.isDefault ? 'is-default' : '') + '">' +
                '<div class="address-card-header">' +
                    '<div class="address-title-group">' +
                        '<h4>📍 ' + escapeHtml(addr.alias) + '</h4>' +
                        (addr.isDefault ? '<span class="badge-default">Principal</span>' : '') +
                    '</div>' +
                    '<button type="button" class="btn-delete-addr" data-id="' + addr.id + '" title="Eliminar dirección" aria-label="Eliminar dirección">🗑️</button>' +
                '</div>' +
                '<div class="address-card-body">' +
                    '<p class="addr-line"><strong>' + escapeHtml(addr.line) + '</strong></p>' +
                    '<p class="addr-district">Distrito: ' + escapeHtml(addr.district) + ', Lima</p>' +
                    (addr.reference ? '<p class="addr-ref">Ref: ' + escapeHtml(addr.reference) + '</p>' : '') +
                '</div>' +
                '<div class="address-card-footer">' +
                    (!addr.isDefault ? 
                        '<button type="button" class="btn-set-default" data-id="' + addr.id + '">Establecer como principal</button>' : 
                        '<span class="text-default-active">✓ Dirección predeterminada para visitas</span>') +
                '</div>' +
            '</article>';
        });

        container.innerHTML = html;

        container.querySelectorAll('.btn-delete-addr').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                var updated = getStoredAddresses().filter(function(a) { return a.id !== id; });
                saveStoredAddresses(updated);
                renderAddresses();
                showToast("Dirección eliminada.");
            });
        });

        container.querySelectorAll('.btn-set-default').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                var updated = getStoredAddresses().map(function(a) {
                    a.isDefault = (a.id === id);
                    return a;
                });
                saveStoredAddresses(updated);
                renderAddresses();
                showToast("Dirección principal actualizada.");
            });
        });
    }

    // Modal de Nueva Dirección
    function setupAddressModal() {
        var modal = document.getElementById('modal-address');
        var btnOpen = document.getElementById('btn-open-address-modal');
        var btnClose = document.getElementById('btn-close-address-modal');
        var btnCancel = document.getElementById('btn-cancel-address');
        var form = document.getElementById('form-new-address');

        if (!modal) return;

        if (btnOpen) {
            btnOpen.addEventListener('click', function() {
                if (typeof modal.showModal === 'function') {
                    modal.showModal();
                } else {
                    modal.setAttribute('open', '');
                }
            });
        }

        function closeModal() {
            if (typeof modal.close === 'function') {
                modal.close();
            } else {
                modal.removeAttribute('open');
            }
            if (form) form.reset();
        }

        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var alias = document.getElementById('modal-addr-alias').value.trim();
                var district = document.getElementById('modal-addr-district').value;
                var line = document.getElementById('modal-addr-line').value.trim();
                var ref = document.getElementById('modal-addr-ref').value.trim();
                var isDef = document.getElementById('modal-addr-default').checked;

                if (!alias || !district || !line) {
                    showToast("Por favor completa los datos obligatorios de la dirección.", "error");
                    return;
                }

                var list = getStoredAddresses();
                if (isDef) {
                    list.forEach(function(a) { a.isDefault = false; });
                }

                list.push({
                    id: "addr_" + Date.now(),
                    alias: alias,
                    district: district,
                    line: line,
                    reference: ref,
                    isDefault: isDef || list.length === 0
                });

                saveStoredAddresses(list);
                renderAddresses();
                closeModal();
                showToast("✓ Dirección añadida con éxito.");
            });
        }
    }

    // Modal Cerrar Sesión
    function setupLogoutModal() {
        var modal = document.getElementById('modal-logout');
        var btnTrigger = document.getElementById('btn-logout-trigger');
        var btnCancel = document.getElementById('btn-cancel-logout');
        var btnConfirm = document.getElementById('btn-confirm-logout');

        if (!modal || !btnTrigger) return;

        btnTrigger.addEventListener('click', function() {
            if (typeof modal.showModal === 'function') modal.showModal();
            else modal.setAttribute('open', '');
        });

        function closeLogout() {
            if (typeof modal.close === 'function') modal.close();
            else modal.removeAttribute('open');
        }

        if (btnCancel) btnCancel.addEventListener('click', closeLogout);

        if (btnConfirm) {
            btnConfirm.addEventListener('click', function() {
                closeLogout();
                showToast("Sesión cerrada. Redirigiendo al inicio...", "info");
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 1200);
            });
        }
    }

    // Filtros de Historial
    function setupHistoryFilters() {
        var chips = document.querySelectorAll('.history-filters .filter-chip');
        var cards = document.querySelectorAll('#history-items-list .history-card');

        chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                var filter = chip.getAttribute('data-filter');

                chips.forEach(function(c) { c.classList.remove('active'); });
                chip.classList.add('active');

                cards.forEach(function(card) {
                    var status = card.getAttribute('data-status');
                    if (filter === 'all' || status === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', function() {
        setupTabs();
        renderProfile();
        setupProfileForm();
        renderAddresses();
        setupAddressModal();
        setupLogoutModal();
        setupHistoryFilters();
    });
})();
