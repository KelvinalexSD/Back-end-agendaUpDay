const cron = require('node-cron');
const Event = require('../models/Event');

// Define a antecedência em horas para a notificação (ex: 24 horas antes)
const ADVANCE_TIME_HOURS = 24; 

const startNotificationScheduler = () => {
    // Agenda uma tarefa para rodar a CADA MINUTO. 
    // Em produção, isso pode ser ajustado para rodar a cada 5 ou 10 minutos.
    cron.schedule('* * * * *', async () => {
        console.log('--- Executando checagem de eventos para notificação ---');
        
        const now = new Date();
        // Define o limite de tempo: agora + 24 horas
        const limitTime = new Date(now.getTime() + ADVANCE_TIME_HOURS * 60 * 60 * 1000);

        try {
            // Busca eventos que:
            // 1. Estão no futuro, mas antes do nosso limite de 24h
            // 2. A flag notificationSent é 'false'
            const eventsToNotify = await Event.find({
                date: {
                    $gt: now, // Maior que a data atual (no futuro)
                    $lte: limitTime // Menor ou igual ao limite (dentro da janela de 24h)
                },
                notificationSent: false
            });

            if (eventsToNotify.length > 0) {
                console.log(`[ALERTA] Encontrados ${eventsToNotify.length} eventos para notificar!`);
                
                // SIMULAÇÃO DO ENVIO DA NOTIFICAÇÃO
                for (const event of eventsToNotify) {
                    // Onde a lógica de envio de Email/SMS/Telegram seria inserida.
                    console.log(`Simulando envio de notificação para o usuário ${event.userId} sobre: ${event.title}`);
                    
                    // IMPORTANTE: Marca o evento como notificado para não enviar de novo
                    await Event.findByIdAndUpdate(event._id, { notificationSent: true });
                }
            } else {
                console.log('Nenhum evento pendente para notificação.');
            }

        } catch (error) {
            console.error('Erro no agendador de notificações:', error.message);
        }
    });

    console.log('Agendador de notificações iniciado.');
};

module.exports = startNotificationScheduler;