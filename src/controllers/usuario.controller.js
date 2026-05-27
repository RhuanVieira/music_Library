const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt')



/*criar usuario*/ 

const createUser = async (req,res) => {

    try {
        
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "nome, email e senha sao obrigatorios"
            });
        }

        const senhaHash = await bcrypt.hash(senha,10);
        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            }
        });

        res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            erro : "erro ao criar usuario"
        })
    }

}

/*listar usuario*/ 

const getUsers = async (req,res) =>{
    try {
        
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true
            }
        });

        res.status(200).json(usuarios);


    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: "erro ao get"
        })
    }
}

/*atualizar usuario*/ 

const updateUser = async (req,res) =>{
    try {
        const { id } = req.params;
        const usuarioId = Number(id);
        const { nome, email, senha } = req.body;

        if (!usuarioId) {
            return res.status(400).json({
                erro: "id invalido"
            });
        }

        if (!nome && !email && !senha) {
            return res.status(400).json({
                erro: "informe pelo menos um campo para atualizar"
            });
        }

        const data = {};

        if (nome) data.nome = nome;
        if (email) data.email = email;
        if (senha) data.senha = await bcrypt.hash(senha,10);

        const usuario = await prisma.usuario.update({
            where: {
                id: usuarioId
            },
            data
        });

        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        });
    } catch (error) {
        console.error(error)

        if (error.code === 'P2025') {
            return res.status(404).json({
                erro: "usuario nao encontrado"
            });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({
                erro: "email ja cadastrado"
            });
        }

        res.status(500).json({
            erro: "erro ao atualizar usuario"
        });
    }
}

/*deletar usuario*/ 

const deleteUser = async (req,res) =>{
    try {
        const { id } = req.params;
        const usuarioId = Number(id);

        if (!usuarioId) {
            return res.status(400).json({
                erro: "id invalido"
            });
        }

        await prisma.usuario.delete({
            where: {
                id: usuarioId
            }
        });

        res.status(200).json({
            msg: "usuario deletado"
        });
    } catch (error) {
        console.error(error)

        if (error.code === 'P2025') {
            return res.status(404).json({
                erro: "usuario nao encontrado"
            });
        }

        res.status(500).json({
            erro: "erro ao excluir usuario"
        });
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
}
