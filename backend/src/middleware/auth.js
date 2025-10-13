const jwt = require('jsonwebtoken');

// Função de Middleware para proteger rotas
module.exports = function (req, res, next) {
    // 1. Obter o token do cabeçalho
    // O token geralmente é enviado como: "Bearer TOKEN_AQUI"
    const token = req.header('x-auth-token'); 
    
    // Se você usou "Authorization" como cabeçalho no frontend, mude a linha acima
    // para: const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Verificar se o token existe
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Token não encontrado.' });
    }

    try {
        // 3. Verificar e decodificar o token
        // Usa o JWT_SECRET para verificar se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Injetar o ID do usuário na requisição (req.user)
        // Isso permite que as rotas saibam qual usuário está logado
        req.user = decoded.user;
        
        // 5. Passar para a próxima função (a rota real)
        next(); 

    } catch (err) {
        // Token é inválido (expirado, adulterado, etc.)
        res.status(401).json({ msg: 'Token inválido.' });
    }
};