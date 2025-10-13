const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    // 1. Campos principais do Evento
    title: {
        type: String,
        required: [true, 'O título do evento é obrigatório.'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'A data e hora do evento são obrigatórias.'],
    },
    category: {
        type: String,
        enum: ['estudo', 'trabalho', 'pessoal', 'outros'], // Sugestão de categorias
        default: 'outros',
    },
    priority: {
        type: String,
        enum: ['baixa', 'media', 'alta'], // Sugestão de prioridades
        default: 'media',
    },
    
    // 2. Chave de Ligação (Crucial para o JWT Middleware)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia a coleção 'User'
        required: true,
    },
    
    // 3. Campo de Controle (Mitigação de Riscos/Notificações)
    notificationSent: {
        type: Boolean,
        default: false, // Indica se o lembrete já foi enviado.
    },

    // 4. Metadados
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Event', EventSchema);