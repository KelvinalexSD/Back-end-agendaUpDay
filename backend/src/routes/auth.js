const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Importa a biblioteca de criptografia
const User = require('../models/User'); // Importa o modelo User

// ROTA: POST /api/auth/register (Cadastro de Usuário)
router.post('/register', async (req, res) => {
    // 1. Desestruturar os dados do corpo da requisição
    const { name, email, password } = req.body;

    try {
        // 2. Verificar se o usuário já existe
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe.' });
        }

        // 3. Criar uma nova instância do usuário (sem salvar ainda)
        user = new User({
            name,
            email,
            password
        });

        // 4. Gerar um salt e fazer o hash da senha
        // O salt é o fator de segurança para a criptografia.
        const salt = await bcrypt.genSalt(10);
        
        // A senha criptografada será salva no banco (conforme artefato 1)
        user.password = await bcrypt.hash(password, salt);

        // 5. Salvar o usuário no MongoDB
        await user.save();

        // 6. Resposta de Sucesso
        res.status(201).json({ 
            msg: 'Usuário registrado com sucesso!', 
            userId: user._id 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

const jwt = require('jsonwebtoken'); // Importa o JWT

// ROTA: POST /api/auth/login (Login de Usuário)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar se o usuário existe
        // Usa .select('+password') para trazer o campo password (que definimos como select: false no modelo)
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            // 400 Bad Request, informando que as credenciais são inválidas
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 2. Comparar a senha fornecida com o hash armazenado
        // bcrypt.compare() faz o hashing da senha digitada e compara com o hash salvo
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 3. Se a senha for válida, gerar o JWT
        const payload = {
            user: {
                id: user.id // Payload que será incluído no token
            }
        };
        
        // Assina o token com a chave secreta e define um tempo de expiração (ex: 1 hora)
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                // 4. Resposta de Sucesso: Retorna o token para o cliente
                res.json({ token }); 
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;