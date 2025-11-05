const nodemailer = require('nodemailer');

// 1. Configurar o Transportador para Outlook/Office 365
// Ele usará as variáveis EMAIL_USER e EMAIL_PASS (Senha de Aplicativo) do .env
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Servidor SMTP oficial do Outlook/Office 365
    port: 587, // Porta padrão segura para STARTTLS
    secure: false, // Use 'false' para a porta 587
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail dedicado
        pass: process.env.EMAIL_PASS, // Sua Senha de Aplicativo (App Password)
    },
    tls: {
        ciphers: 'SSLv3' 
    }
});

/**
 * Envia um e-mail de notificação de evento.
 * Requer que o objeto 'user' tenha o campo 'email'.
 * @param {Object} user - Objeto do usuário (deve conter o campo 'email' e 'name').
 * @param {Object} event - Objeto do evento.
 */
async function sendEventNotificationEmail(user, event) {
    // Validação básica
    if (!user || !user.email) {
        console.warn(`Aviso: Usuário associado ao evento ${event._id} não possui e-mail válido.`);
        return;
    }

    // Formatação da data e hora para o corpo do e-mail
    const eventDate = new Date(event.date).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
    });

    const mailOptions = {
        from: `"AgendaUpday" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Lembrete: Seu evento "${event.title}" está próximo!`,
        html: `
            <h1>Lembrete de Evento</h1>
            <p>Olá ${user.name || 'usuário'},</p>
            <p>Seu evento <b>${event.title}</b> está agendado para:</p>
            
            <p>📅 <b>Data e Hora:</b> ${eventDate}</p>
            <p>⏳ <b>Duração:</b> ${event.duration} minutos</p>
            <p>📌 <b>Descrição:</b> ${event.description || 'Nenhuma descrição fornecida.'}</p>
            
            <p>Atenciosamente, AgendaUpday Team.</p>
        `,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`✅ E-mail de notificação enviado para ${user.email}. ID: ${info.messageId}`);
    } catch (error) {
        console.error('❌ ERRO ao enviar e-mail de notificação:', error);
    }
}

module.exports = {
    sendEventNotificationEmail,
};