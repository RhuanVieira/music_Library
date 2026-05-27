-- CreateTable
CREATE TABLE `Musicas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `album` VARCHAR(191) NOT NULL,
    `ano_lancamento` VARCHAR(191) NOT NULL,
    `link_musica` VARCHAR(191) NOT NULL,
    `link_imagem` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
