-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/09/2025 às 23:57
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `mymental`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `chat_global`
--

CREATE TABLE `chat_global` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `image_url` text NOT NULL,
  `sent_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `chat_global`
--

INSERT INTO `chat_global` (`id`, `user_id`, `message`, `image_url`, `sent_at`) VALUES
(1, 1, 'olaaaaa', '/uploads/1757368534559.png', '2025-09-08 18:55:34');

-- --------------------------------------------------------

--
-- Estrutura para tabela `diario_pessoal`
--

CREATE TABLE `diario_pessoal` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entrada` text NOT NULL,
  `data_entrada` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `forum_posts`
--

CREATE TABLE `forum_posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `conteudo` varchar(255) NOT NULL,
  `foto_url` text NOT NULL,
  `data_postagem` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `metas_pessoais`
--

CREATE TABLE `metas_pessoais` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meta` text NOT NULL,
  `data_meta` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `profissionais`
--

CREATE TABLE `profissionais` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `especialidade` varchar(255) NOT NULL,
  `preco` int(255) NOT NULL,
  `localizacao` varchar(255) NOT NULL,
  `biografia` text NOT NULL,
  `foto_url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `profissionais`
--

INSERT INTO `profissionais` (`id`, `nome`, `especialidade`, `preco`, `localizacao`, `biografia`, `foto_url`) VALUES
(1, 'Lucas', 'Nutrição', 200, 'Online', 'ola sou lucas', '/uploads/1757367288752.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `registro_emocoes`
--

CREATE TABLE `registro_emocoes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `emocao` text NOT NULL,
  `data_emocao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `email`, `senha`) VALUES
(1, 'Maelyson18', 'maelysonpinheiro5@gmail.com', '$2b$10$aAgc6l1SjYJft5m1E47qyu2h8WEP/0A4xiB6n2sZIfMy/YBLeQf6C');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `chat_global`
--
ALTER TABLE `chat_global`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `diario_pessoal`
--
ALTER TABLE `diario_pessoal`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `metas_pessoais`
--
ALTER TABLE `metas_pessoais`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `profissionais`
--
ALTER TABLE `profissionais`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `registro_emocoes`
--
ALTER TABLE `registro_emocoes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chat_global`
--
ALTER TABLE `chat_global`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `diario_pessoal`
--
ALTER TABLE `diario_pessoal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `forum_posts`
--
ALTER TABLE `forum_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `metas_pessoais`
--
ALTER TABLE `metas_pessoais`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `profissionais`
--
ALTER TABLE `profissionais`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `registro_emocoes`
--
ALTER TABLE `registro_emocoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
