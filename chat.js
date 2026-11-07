/**
 * Chapa Tu Técnico — Lógica del Chat Directo y Propuesta #CTT-804
 * Vanilla JS modular, asíncrono y desacoplado (< 250 líneas)
 */
(function() {
    'use strict';

    var elements = {
        stream: null,
        form: null,
        input: null,
        btnCta: null,
        suggestions: null,
        urgencyBadge: null,
        problemsTitle: null,
        summaryText: null
    };

    function init() {
        elements.stream = document.getElementById('chat-stream');
        elements.form = document.getElementById('chat-send-form');
        elements.input = document.getElementById('chat-input-text');
        elements.btnCta = document.getElementById('btn-aceptar-contratar');
        elements.suggestions = document.getElementById('chat-quick-suggestions');
        elements.urgencyBadge = document.getElementById('chat-summary-urgency');
        elements.problemsTitle = document.getElementById('chat-summary-problems');
        elements.summaryText = document.getElementById('chat-summary-text');

        hydrateFromStorage();
        bindEvents();
        scrollToBottom(false);
    }

    function hydrateFromStorage() {
        try {
            var raw = localStorage.getItem('chapa_consulta_actual');
            if (!raw) return;
            var data = JSON.parse(raw);
            if (data && data.problema) {
                if (elements.urgencyBadge && data.problema.urgencia === 'programar') {
                    elements.urgencyBadge.textContent = '📅 AGENDADO: ' + (data.problema.fechaProgramada || 'Próxima fecha');
                }
                if (elements.problemsTitle && data.problema.chips && data.problema.chips.length > 0) {
                    elements.problemsTitle.textContent = '⚡ ' + data.problema.chips.join(' • ');
                }
                if (elements.summaryText && data.problema.mensaje) {
                    elements.summaryText.textContent = data.problema.mensaje;
                }
            }
        } catch (_) {}
    }

    function bindEvents() {
        if (elements.form) {
            elements.form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleUserSend();
            });
        }

        if (elements.suggestions) {
            elements.suggestions.addEventListener('click', function(e) {
                var target = e.target.closest('.suggestion-chip');
                if (target && target.dataset.msg) {
                    sendUserMessage(target.dataset.msg);
                }
            });
        }

        if (elements.btnCta) {
            elements.btnCta.addEventListener('click', handleAcceptContract);
        }
    }

    function handleUserSend() {
        if (!elements.input) return;
        var text = elements.input.value.trim();
        if (!text) return;
        elements.input.value = '';
        sendUserMessage(text);
    }

    function sendUserMessage(text) {
        if (!elements.stream) return;

        var row = document.createElement('div');
        row.className = 'chat-bubble-row msg-out';

        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-user-msg';

        var p = document.createElement('p');
        p.textContent = text;
        bubble.appendChild(p);

        var timeSpan = document.createElement('span');
        timeSpan.className = 'user-msg-time';
        timeSpan.innerHTML = formatTime(new Date()) + ' <span class="chat-check-read" aria-hidden="true">✓✓</span>';
        bubble.appendChild(timeSpan);

        row.appendChild(bubble);
        elements.stream.appendChild(row);
        scrollToBottom(true);

        simulateTechReply(text);
    }

    function simulateTechReply(userText) {
        if (!elements.stream) return;

        var lower = userText.toLowerCase();
        var replyText = '¡Perfecto, María! Ya tomé nota. Puedes pulsar "ACEPTAR Y CONTRATAR" en la propuesta superior para reservar y salgo de inmediato.';

        if (lower.includes('material') || lower.includes('incluye')) {
            replyText = 'El monto de S/ 85.00 cubre el diagnóstico y la intervención de tablero. Si requieres repuestos mayores de llave térmica, los instalamos a precio directo de distribuidor sin recargos.';
        } else if (lower.includes('tiempo') || lower.includes('dura') || lower.includes('demora')) {
            replyText = 'El trabajo toma aproximadamente entre 35 y 50 minutos para dejar el circuito seguro, balanceado y operativo.';
        } else if (lower.includes('boleta') || lower.includes('factura') || lower.includes('garantía')) {
            replyText = 'Por supuesto, emitimos boleta o factura electrónica y tu servicio cuenta con la garantía de 30 días de Chapa Tu Técnico.';
        }

        setTimeout(function() {
            var replyRow = document.createElement('div');
            replyRow.className = 'chat-bubble-row msg-in';

            var replyBubble = document.createElement('div');
            replyBubble.className = 'chat-bubble tech-reply';

            var rp = document.createElement('p');
            rp.textContent = replyText;
            replyBubble.appendChild(rp);

            var rTime = document.createElement('span');
            rTime.className = 'tech-msg-time';
            rTime.textContent = formatTime(new Date());
            replyBubble.appendChild(rTime);

            replyRow.appendChild(replyBubble);
            elements.stream.appendChild(replyRow);
            scrollToBottom(true);
        }, 600);
    }

    function handleAcceptContract() {
        if (!elements.btnCta) return;

        elements.btnCta.style.pointerEvents = 'none';
        elements.btnCta.style.opacity = '0.9';
        elements.btnCta.innerHTML = '<span aria-hidden="true">✓</span> ¡Servicio Contratado! Redirigiendo...';

        var reserva = {
            id: 'CTT-804',
            tecnico: 'Roberto Rojas',
            especialidad: 'Especialista en instalaciones eléctricas',
            avatar: 'assets/img/tecnicos/roberto-rojas-avatar.webp',
            servicio: 'Instalaciones Eléctricas - Cortocircuito',
            monto: 85,
            montoEstimado: 'S/ 85.00',
            distrito: 'Surco, Lima',
            urgencia: 'En camino (25 - 35 min)',
            cliente: 'María González',
            fecha: new Date().toISOString()
        };

        try {
            localStorage.setItem('chapa_reserva_activa', JSON.stringify(reserva));
        } catch (_) {}

        setTimeout(function() {
            window.location.href = 'seguimiento.html?servicio=electricidad&tecnico=roberto-rojas&codigo=CTT-804';
        }, 350);
    }

    function scrollToBottom(smooth) {
        if (!elements.stream) return;
        try {
            elements.stream.scrollTo({
                top: elements.stream.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        } catch (_) {
            elements.stream.scrollTop = elements.stream.scrollHeight;
        }
    }

    function formatTime(d) {
        var h = d.getHours();
        var m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        var mStr = m < 10 ? '0' + m : m;
        return h + ':' + mStr + ' ' + ampm;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

