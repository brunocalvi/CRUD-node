CREATE TABLE `usuarios` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100),
	`usuario` VARCHAR(100),
	`email` VARCHAR(100),
	`sobre` VARCHAR(255),
	`senha` VARCHAR(255),
	`postagem_blog` TINYINT DEFAULT 0, 
	`boletim_noticias` TINYINT DEFAULT 0,
	`ofertas_pessoais` TINYINT DEFAULT 0
);

INSERT INTO `usuarios`(`boletim_noticias`, `email`, `nome`, `ofertas_pessoais`, `postagem_blog`, `senha`, `sobre`, `usuario`)
VALUE (0, '1723841543262@teste.com.br', '1723841543262 Teste', 0, 0, '1723841543262uAk1729-McG', 'Usuário para o Jest fazer o teste. | uAk1729-McG', '1723841543262.teste');

SELECT * FROM usuarios;