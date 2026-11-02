/**
 * CHAPA TU TÉCNICO - Login & Autenticación (Figma Frame 1423:848)
 * Heurísticas Jakob Nielsen (#1, #4, #5, #6, #7, #8) - < 250 líneas
 */
(function () {
    'use strict';
    let currentRole = 'cliente', toastTimeout = null;

    const $ = (id) => document.getElementById(id);
    const tabClient = $('tab-client'), tabTech = $('tab-technician'), subtitle = $('auth-role-subtitle');
    const form = $('auth-login-form'), inId = $('auth-identifier'), inPwd = $('auth-password');
    const wrapId = $('wrapper-identifier'), wrapPwd = $('wrapper-password');
    const errId = $('identifier-error'), errPwd = $('password-error');
    const btnTogglePwd = $('btn-toggle-password'), btnSubmit = $('btn-submit-login'), toast = $('auth-toast');
    const modalOtp = $('modal-otp'), modalForgot = $('modal-forgot');

    function showToast(msg, type = 'info') {
        if (!toast) return;
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.textContent = msg;
        toast.className = 'auth-toast active ' + type;
        toastTimeout = setTimeout(() => { toast.className = 'auth-toast'; }, 4000);
    }

    // 1. Selector de Rol Dual
    function switchRole(role) {
        currentRole = role;
        const isClient = role === 'cliente';
        [tabClient, tabTech].forEach(t => {
            if (!t) return;
            const active = (t === tabClient && isClient) || (t === tabTech && !isClient);
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
            const check = t.querySelector('.auth-tab-check');
            if (check) check.style.display = active ? 'inline-flex' : 'none';
        });
        if (subtitle) {
            subtitle.textContent = isClient
                ? 'Bienvenido de nuevo. Ingresa a tu cuenta de Cliente.'
                : 'Bienvenido de nuevo. Ingresa a tu panel de Técnico especialista.';
        }
    }
    tabClient?.addEventListener('click', () => switchRole('cliente'));
    tabTech?.addEventListener('click', () => switchRole('tecnico'));

    // 2. Toggle Contraseña
    btnTogglePwd?.addEventListener('click', () => {
        const isPwd = inPwd.getAttribute('type') === 'password';
        inPwd.setAttribute('type', isPwd ? 'text' : 'password');
        btnTogglePwd.setAttribute('aria-label', isPwd ? 'Ocultar contraseña' : 'Mostrar contraseña');
        btnTogglePwd.setAttribute('title', isPwd ? 'Ocultar contraseña' : 'Mostrar contraseña');
        const eyeOpen = btnTogglePwd.querySelector('.icon-eye-open');
        const eyeClosed = btnTogglePwd.querySelector('.icon-eye-closed');
        if (eyeOpen) eyeOpen.style.display = isPwd ? 'none' : 'block';
        if (eyeClosed) eyeClosed.style.display = isPwd ? 'block' : 'none';
    });

    // 3. Validaciones en tiempo real
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, phoneRe = /^9\d{8}$/;
    const validateId = (v) => {
        const c = v.replace(/\s+/g, '');
        if (!c) return 'Ingresa tu correo o tu número celular.';
        return (!emailRe.test(c) && !phoneRe.test(c)) ? 'Ingresa un correo válido o celular de 9 dígitos.' : '';
    };
    const validatePwd = (v) => (!v ? 'Ingresa tu contraseña.' : v.length < 6 ? 'Mínimo 6 caracteres.' : '');

    function setErr(input, wrap, errEl, msg) {
        wrap?.classList.toggle('error', !!msg);
        msg ? input?.setAttribute('aria-invalid', 'true') : input?.removeAttribute('aria-invalid');
        if (errEl) errEl.textContent = msg;
    }

    [[inId, wrapId, errId, validateId], [inPwd, wrapPwd, errPwd, validatePwd]].forEach(([inp, wrap, err, fn]) => {
        inp?.addEventListener('blur', () => setErr(inp, wrap, err, fn(inp.value.trim())));
        inp?.addEventListener('input', () => { if (wrap?.classList.contains('error')) setErr(inp, wrap, err, fn(inp.value.trim())); });
    });

    // 4. Envío Formulario
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const e1 = validateId(inId?.value || ''), e2 = validatePwd(inPwd?.value || '');
        setErr(inId, wrapId, errId, e1);
        setErr(inPwd, wrapPwd, errPwd, e2);
        if (e1 || e2) { (e1 ? inId : inPwd)?.focus(); return; }

        btnSubmit.disabled = true;
        const orig = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<span class="auth-btn-spinner" aria-hidden="true"></span><span>Verificando...</span>';
        setTimeout(() => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = orig;
            showToast('¡Sesión iniciada con éxito! Redirigiendo...', 'success');
            setTimeout(() => { window.location.href = currentRole === 'cliente' ? 'cuenta.html' : 'perfil.html'; }, 900);
        }, 1000);
    });

    // 5. Manejo de Modales Accesibles
    function toggleModal(m, open) {
        if (!m) return;
        m.classList.toggle('active', open);
        m.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    function wireModal(btnOpen, m, btnClose, formEl, onSubmit) {
        btnOpen?.addEventListener('click', (e) => { e.preventDefault?.(); toggleModal(m, true); m.querySelector('input')?.focus(); });
        btnClose?.addEventListener('click', () => toggleModal(m, false));
        m?.addEventListener('click', (e) => { if (e.target === m) toggleModal(m, false); });
        formEl?.addEventListener('submit', (e) => { e.preventDefault(); onSubmit(); });
    }

    wireModal($('btn-quick-whatsapp'), modalOtp, $('btn-close-otp'), $('form-otp'), () => {
        const p = $('otp-phone')?.value.replace(/\s+/g, '') || '';
        if (!phoneRe.test(p)) {
            const err = $('otp-phone-error');
            if (err) err.textContent = 'Ingresa un celular válido de 9 dígitos (inicia con 9).';
            $('otp-phone')?.focus();
            return;
        }
        $('otp-phone-error').textContent = '';
        toggleModal(modalOtp, false);
        showToast('Código de verificación enviado a tu WhatsApp +51 ' + p, 'success');
    });

    wireModal($('btn-forgot-password'), modalForgot, $('btn-close-forgot'), $('form-forgot'), () => {
        const val = $('forgot-identifier')?.value.trim() || '';
        const msg = validateId(val);
        if (msg) {
            $('forgot-error').textContent = msg;
            $('forgot-identifier')?.focus();
            return;
        }
        $('forgot-error').textContent = '';
        toggleModal(modalForgot, false);
        showToast('Enlace de recuperación enviado. Revisa tu correo.', 'success');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { toggleModal(modalOtp, false); toggleModal(modalForgot, false); }
    });

    // 6. Accesos OAuth (Google Identity Services)
    const GOOGLE_CLIENT_ID = '708739576455-gbe3ep4mn95ihsdnoebu312tka3jk68j.apps.googleusercontent.com';
    let googleTokenClient = null;

    function initGoogleAuth() {
        if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
            return;
        }

        try {
            googleTokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                callback: async (tokenResponse) => {
                    if (tokenResponse.error) {
                        showToast('Acceso con Google cancelado o no completado.', 'error');
                        return;
                    }

                    try {
                        showToast('Verificando cuenta de Google...', 'info');
                        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                        });

                        if (!res.ok) throw new Error('Error al obtener perfil');
                        const userInfo = await res.json();

                        const fullName = (userInfo.name || '').trim();
                        const parts = fullName ? fullName.split(' ') : [];
                        const firstname = userInfo.given_name || parts[0] || 'Usuario';
                        const lastname = userInfo.family_name || (parts.length > 1 ? parts.slice(1).join(' ') : '');

                        const userProfile = {
                            firstname: firstname,
                            lastname: lastname,
                            email: userInfo.email || '',
                            picture: userInfo.picture || '',
                            authProvider: 'google',
                            docType: 'DNI',
                            docNumber: '',
                            phone: '',
                            birthdate: '',
                            emergencyContact: ''
                        };

                        localStorage.setItem('ctt_profile', JSON.stringify(userProfile));
                        localStorage.setItem('ctt_is_authenticated', 'true');
                        window.dispatchEvent(new Event('chapa-auth-updated'));

                        showToast(`¡Bienvenido(a), ${firstname}! Redirigiendo...`, 'success');
                        setTimeout(() => {
                            window.location.href = currentRole === 'cliente' ? 'cuenta.html' : 'perfil.html';
                        }, 1000);
                    } catch (err) {
                        showToast('Error al conectar con tu perfil de Google.', 'error');
                    }
                }
            });
        } catch (e) {
            // Manejo seguro en caso de bloqueo de cookies de terceros
        }
    }

    $('btn-quick-google')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (googleTokenClient) {
            googleTokenClient.requestAccessToken();
        } else if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
            initGoogleAuth();
            if (googleTokenClient) {
                googleTokenClient.requestAccessToken();
            } else {
                showToast('Inicializando conexión con Google. Reintenta en breve.', 'info');
            }
        } else {
            showToast('Cargando servicio de Google... Intenta de nuevo en un segundo.', 'info');
        }
    });

    $('btn-quick-apple')?.addEventListener('click', () => showToast('Conexión con Apple ID disponible próximamente.', 'info'));

    if (document.readyState === 'complete') {
        initGoogleAuth();
    } else {
        window.addEventListener('load', initGoogleAuth);
    }
})();
