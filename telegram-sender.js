// Конфигурация
const TELEGRAM_BOT_TOKEN = '8504668447:AAEdjn4KO8EmgfWDNabSNu1os6vNlOOvkGw'; 
const TELEGRAM_CHAT_ID = 'kjfdskjh_bot'; // ID чата/канала

// Инициализация формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('telegramForm');
    const statusMessage = document.getElementById('statusMessage');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Сбор данных формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };
        
        // Валидация
        if (!validateForm(formData)) {
            return;
        }
        
        // Показываем загрузку
        showStatus('Идет отправка...', 'info');
        
        try {
            // Формируем сообщение для Telegram
            const telegramMessage = formatTelegramMessage(formData);
            
            // Отправляем в Telegram
            await sendToTelegram(telegramMessage);
            
            // Успех
            showStatus('✅ Сообщение успешно отправлено!', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            showStatus('❌ Ошибка при отправке. Попробуйте позже.', 'error');
        }
    });
});

// Функция отправки в Telegram
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
    
    const data = await response.json();
    
    if (!data.ok) {
        throw new Error(data.description || 'Ошибка Telegram API');
    }
    
    return data;
}

// Форматирование сообщения для Telegram
function formatTelegramMessage(data) {
    return `
<b>📨 НОВОЕ СООБЩЕНИЕ С САЙТА</b>

<b>👤 Имя:</b> ${escapeHtml(data.name)}
<b>📞 Телефон:</b> ${escapeHtml(data.phone)}
<b>📧 Email:</b> ${data.email ? escapeHtml(data.email) : 'не указан'}
<b>📌 Тема:</b> ${escapeHtml(data.subject)}

<b>💬 Сообщение:</b>
${escapeHtml(data.message)}

<em>🕐 ${new Date().toLocaleString('ru-RU')}</em>
    `.trim();
}

// Валидация формы
function validateForm(data) {
    const statusMessage = document.getElementById('statusMessage');
    
    if (!data.name || data.name.length < 2) {
        showStatus('Введите корректное имя (минимум 2 символа)', 'error');
        return false;
    }
    
    if (!data.phone || data.phone.length < 5) {
        showStatus('Введите корректный номер телефона', 'error');
        return false;
    }
    
    if (!data.subject) {
        showStatus('Выберите тему сообщения', 'error');
        return false;
    }
    
    if (!data.message || data.message.length < 5) {
        showStatus('Введите сообщение (минимум 5 символов)', 'error');
        return false;
    }
    
    return true;
}

// Показать статус
function showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = 'status ' + type;
    statusElement.style.display = 'block';
    
    // Автоскрытие успешных сообщений
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Дополнительно: можно добавить маску для телефона
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        value = '+7 (' + value.substring(1, 4) + ') ' + 
                value.substring(4, 7) + '-' + 
                value.substring(7, 9) + '-' + 
                value.substring(9, 11);
    }
    
    e.target.value = value;
});