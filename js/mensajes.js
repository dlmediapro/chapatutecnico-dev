/**
 * Módulo de Mensajes y Chat (mensajes.html) - Límite estricto: < 250 líneas
 * Separación de responsabilidades, 4 estados asíncronos y micro-interacciones a 60fps
 */
(function () {
  'use strict';

  const CHATS_DATA = [
    {
      id: 'chat-1', name: 'Carlos Rojas', role: 'Técnico Gasfitero', status: 'En línea', unread: 2, time: '10:42',
      proposal: { title: 'Propuesta de Servicio Técnico', desc: 'Gasfitería - Reparación de fuga de agua bajo lavadero', price: 'S/ 65.00', status: 'pending' },
      messages: [
        { sender: 'incoming', text: 'Hola, buenos días. Soy Carlos, el técnico asignado a tu solicitud. Te escribo para coordinar la atención de tu servicio de gasfitería.', time: '10:42', checks: '✓✓' },
        { sender: 'outgoing', text: 'Hola Carlos. Buenos días, gracias por comunicarte conmigo.', time: '10:44', checks: '✓✓' },
        { sender: 'incoming', text: 'Con gusto. Ya revisé los detalles sobre la fuga bajo el lavadero. Tengo programada tu atención para las 12:00 pm.', time: '10:45', checks: '✓✓' }
      ]
    },
    {
      id: 'chat-2', name: 'Rodrigo Rojas', role: 'Técnico Electricista', status: 'En línea', unread: 1, time: '09:15', proposal: null,
      messages: [
        { sender: 'incoming', text: 'Hola, soy Rodrigo. ¿Pudiste revisar las especificaciones del tablero eléctrico?', time: '09:15', checks: '✓✓' },
        { sender: 'outgoing', text: 'Hola Rodrigo, sí. El técnico anterior me comentó sobre la llave diferencial.', time: '09:20', checks: '✓✓' }
      ]
    },
    {
      id: 'chat-3', name: 'Ana Torres', role: 'Atención al Cliente', status: 'Ausente', unread: 0, time: 'Ayer', proposal: null,
      messages: [{ sender: 'incoming', text: 'Hola, tu pago de garantía ha sido validado correctamente. ¡Gracias por elegirnos!', time: 'Ayer', checks: '✓✓' }]
    },
    {
      id: 'chat-4', name: 'Sofia Mendazo', role: 'Soporte Técnico', status: 'En línea', unread: 0, time: 'Lun', proposal: null,
      messages: [{ sender: 'incoming', text: 'Tu ticket #4812 fue resuelto con éxito. ¿Tienes alguna otra duda?', time: 'Lun', checks: '✓✓' }]
    }
  ];

  let activeChatId = 'chat-1';
  let chats = JSON.parse(JSON.stringify(CHATS_DATA));

  function getActiveChat() {
    return chats.find(c => c.id === activeChatId) || chats[0];
  }

  function showToast(msg) {
    const toast = document.getElementById('chat-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function renderConversationsList() {
    const container = document.getElementById('conversation-list-container');
    if (!container) return;
    container.innerHTML = '';

    chats.forEach(chat => {
      const item = document.createElement('div');
      item.className = 'chat-item' + (chat.id === activeChatId ? ' chat-item-activo' : '');
      item.setAttribute('role', 'listitem');
      item.setAttribute('tabindex', '0');
      item.setAttribute('data-chat-id', chat.id);

      const lastMsg = chat.messages[chat.messages.length - 1];
      const snippet = lastMsg ? lastMsg.text : 'Sin mensajes';

      item.innerHTML = `
        <div class="chat-avatar-wrap" aria-hidden="true">👤</div>
        <div class="chat-item-content">
          <div class="chat-item-top"><h3 class="chat-nombre">${chat.name}</h3><span class="chat-hora">${chat.time}</span></div>
          <div class="chat-item-bottom"><p class="chat-snippet">${snippet}</p>${chat.unread > 0 ? `<span class="chat-unread-badge">${chat.unread}</span>` : ''}</div>
        </div>
      `;

      item.addEventListener('click', () => switchChat(chat.id));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchChat(chat.id); }
      });
      container.appendChild(item);
    });

    const badge = document.getElementById('badge-total-chats');
    if (badge) {
      const totalUnread = chats.reduce((acc, c) => acc + (c.unread || 0), 0);
      badge.textContent = String(totalUnread || chats.length);
    }
  }

  function renderChatHeader(chat) {
    const nameEl = document.getElementById('chat-active-name');
    const statusEl = document.getElementById('chat-active-status');
    if (nameEl) nameEl.textContent = chat.name;
    if (statusEl) {
      statusEl.innerHTML = `<span class="status-dot-green" aria-hidden="true"></span> ${chat.status}`;
    }
  }

  function renderProposalCard(chat) {
    const container = document.getElementById('chat-proposal-container');
    if (!container) return;
    container.innerHTML = '';
    if (!chat.proposal) return;

    const prop = chat.proposal;
    const card = document.createElement('div');
    card.className = 'chat-proposal-card';

    if (prop.status === 'accepted') {
      card.innerHTML = `
        <div class="proposal-info"><span class="proposal-title">${prop.title}</span><p class="proposal-desc">${prop.desc} - <strong class="proposal-price">${prop.price}</strong></p></div>
        <span class="proposal-status-badge proposal-status-accepted">✓ Servicio Aceptado</span>
      `;
    } else if (prop.status === 'rejected') {
      card.innerHTML = `
        <div class="proposal-info"><span class="proposal-title">${prop.title}</span><p class="proposal-desc">${prop.desc} - <strong class="proposal-price">${prop.price}</strong></p></div>
        <span class="proposal-status-badge proposal-status-rejected">✗ Servicio Declinado</span>
      `;
    } else {
      card.innerHTML = `
        <div class="proposal-info"><span class="proposal-title">${prop.title}</span><p class="proposal-desc">${prop.desc} - <strong class="proposal-price">${prop.price}</strong></p></div>
        <div class="proposal-actions">
          <button type="button" class="btn-chat-action btn-service-accept" id="btn-service-accept">ACEPTAR SERVICIO</button>
          <button type="button" class="btn-chat-action btn-service-reject" id="btn-service-reject">RECHAZAR</button>
        </div>
      `;
      card.querySelector('#btn-service-accept').addEventListener('click', () => handleProposalAction('accepted'));
      card.querySelector('#btn-service-reject').addEventListener('click', () => handleProposalAction('rejected'));
    }
    container.appendChild(card);
  }

  function renderMessagesStream(chat) {
    const stream = document.getElementById('chat-stream');
    if (!stream) return;
    stream.innerHTML = '';

    if (!chat.messages || chat.messages.length === 0) {
      stream.innerHTML = '<div class="chat-empty-state" style="text-align:center;padding:40px;color:#64748b;">No tienes mensajes en esta conversación aún.</div>';
      return;
    }

    chat.messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `mensaje-bubble msg-${msg.sender}`;
      bubble.innerHTML = `
        ${msg.sender === 'incoming' ? '<span class="msg-avatar-mini" aria-hidden="true">👤</span>' : ''}
        <div class="msg-bubble-content"><p></p><span class="msg-time">${msg.time} <span class="msg-checks">${msg.checks || '✓'}</span></span></div>
        ${msg.sender === 'outgoing' ? '<span class="msg-avatar-mini" aria-hidden="true">👤</span>' : ''}
      `;
      bubble.querySelector('p').textContent = msg.text;
      stream.appendChild(bubble);
    });

    stream.scrollTop = stream.scrollHeight;
  }

  function switchChat(chatId) {
    activeChatId = chatId;
    const chat = getActiveChat();
    chat.unread = 0;
    renderConversationsList();
    renderChatHeader(chat);
    renderProposalCard(chat);
    renderMessagesStream(chat);
  }

  function handleProposalAction(action) {
    const chat = getActiveChat();
    if (!chat.proposal) return;
    chat.proposal.status = action;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (action === 'accepted') {
      chat.messages.push({
        sender: 'outgoing', text: `He aceptado la propuesta de servicio (${chat.proposal.price}). Coordinemos tu llegada al domicilio.`,
        time: timeStr, checks: '✓✓'
      });
      showToast('¡Servicio aceptado con éxito! Se notificó al técnico.');
    } else {
      chat.messages.push({
        sender: 'outgoing', text: 'He declinado la propuesta de servicio para revisar opciones.',
        time: timeStr, checks: '✓'
      });
      showToast('Propuesta de servicio declinada.');
    }
    renderProposalCard(chat);
    renderMessagesStream(chat);
    renderConversationsList();
  }

  function handleSendMessage(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('mensaje-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const chat = getActiveChat();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    chat.messages.push({ sender: 'outgoing', text: text, time: timeStr, checks: '✓' });
    input.value = '';
    renderMessagesStream(chat);
    renderConversationsList();
  }

  function init() {
    const chat = getActiveChat();
    renderConversationsList();
    renderChatHeader(chat);
    renderProposalCard(chat);
    renderMessagesStream(chat);

    const form = document.getElementById('chat-form');
    if (form) form.addEventListener('submit', handleSendMessage);

    const micBtn = document.getElementById('btn-chat-mic');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        showToast('Grabación de audio simulada iniciada...');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
