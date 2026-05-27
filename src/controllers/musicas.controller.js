const prisma = require('../lib/prisma')

const createMusic = async (req,res) =>{
    try {
        
        const {titulo, album, ano_lancamento, link_musica, link_imagem} = req.body

        if(!titulo|| !album|| !ano_lancamento|| !link_musica|| !link_imagem){
            res.status(400).json({
                erro: "Faltam campos obrigatórios"
            })
        }
        else{

            const musica = await prisma.musicas.create({
                data : {
                    titulo,
                    album,
                    ano_lancamento,
                    link_musica,
                    link_imagem
                
                }
            })

             res.status(201).json(musica)

        }




    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "erro do servidor"
        })
    }
}

const getMusicas = async (req,res) =>{
    try {
        const musica = await prisma.musicas.findMany();
        res.status(200).json(musica);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro : "Erro por parte do servidor"
        })
    }
}

const deleteMusicas = async (req,res) =>{
    try {
        const {id} = req.params;
        const musicaId = Number(id);

        if (!musicaId) {
            return res.status(400).json({
                msg: "id invalido"
            });
        }

        await prisma.musicas.delete({
            where: {
                id: musicaId
            }

            
        })

        res.status(200).json({
                msg: 'musica deletada'
            })
    } catch (error) {
        res.status(500).json({
            msg: "erro ao excluir musica"
        })
    }
}

const updateMusicas = async (req,res) =>{
    try {
        const {id} = req.params;
        const musicaId = Number(id);
        const {titulo, album, ano_lancamento, link_musica, link_imagem} = req.body

        if (!musicaId) {
            return res.status(400).json({
                msg: "id invalido"
            });
        }

        if (!titulo && !album && !ano_lancamento && !link_musica && !link_imagem) {
            return res.status(400).json({
                msg: "informe pelo menos um campo para atualizar"
            });
        }

        const data = {};

        if (titulo) data.titulo = titulo;
        if (album) data.album = album;
        if (ano_lancamento) data.ano_lancamento = ano_lancamento;
        if (link_musica) data.link_musica = link_musica;
        if (link_imagem) data.link_imagem = link_imagem;

        const musica = await prisma.musicas.update({
            where: {
                id: musicaId
            },
            data
        });

        res.status(200).json(musica);
    } catch (error) {
        console.error(error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                msg: "musica nao encontrada"
            });
        }

        res.status(500).json({
            msg: "erro ao atualizar musica"
        })
    }
}


module.exports = {
    createMusic,
    getMusicas,
    deleteMusicas,
    updateMusicas
}
