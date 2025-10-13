const mongoose = require('mongoose');

// 1. Define o Subdocumento para Preferências de Notificação
// Usando o padrão de documento embutido (Embedded Pattern)
const NotificationPreferencesSchema = new mongoose.Schema({
    email: { 
        type: Boolean, 
        default: true 
    },
    telegram: { 
        type: Boolean, 
        default: false 
    },
    advanceTime: { 
        type: Number, 
        default: 24 // Horas de antecedência
    }
});

// 2. Define o Schema Principal do Usuário
const UserSchema = new mongoose.Schema({
    // _id é gerado automaticamente pelo Mongoose
    name: {
        type: String,
        required: [true, 'O nome é obrigatório.'], // Nome do usuário.
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório.'],
        unique: true, // Garante que o e-mail seja único.
        lowercase: true,
        trim: true, // E-mail do usuário.
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória.'], // Senha criptografada.
        select: false // Não retorna a senha automaticamente em consultas
    },
    notificationPreferences: NotificationPreferencesSchema, // Subdocumento definido acima.
    
    // Campos de metadados
    createdAt: {
        type: Date,
        default: Date.now, // Data e hora de criação.
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', UserSchema);