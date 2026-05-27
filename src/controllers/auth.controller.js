const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "email e senha sao obrigatorios"
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if (!usuario || !usuario.senha) {
            return res.status(404).json({
                erro: "usuario nao encontrado"
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "senha invalida"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id
            },
            'SEGREDO_SUPER_FORTE',
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            mensagem: "login realizado",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "erro no login"
        });
    }
};

module.exports = {
    login
};
