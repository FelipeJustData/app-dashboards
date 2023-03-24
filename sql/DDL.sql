-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: sql.freedb.tech
-- Tempo de geração: 24/03/2023 às 14:57
-- Versão do servidor: 8.0.28
-- Versão do PHP: 8.0.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `freedb_appjust`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `customers`
--

CREATE TABLE `customers` (
  `id_customer` int NOT NULL,
  `name_customer` varchar(255) NOT NULL,
  `logotipo_customer` mediumblob,
  `des_mode` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `dashboards`
--

CREATE TABLE `dashboards` (
  `id_dashboard` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `des_status` varchar(255) NOT NULL,
  `dat_expiration` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_project` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `metadata`
--

CREATE TABLE `metadata` (
  `id_metadata` int NOT NULL,
  `des_change` varchar(255) NOT NULL,
  `dat_change` datetime NOT NULL,
  `des_before_information` varchar(255) DEFAULT NULL,
  `typ_change` varchar(255) NOT NULL,
  `des_new_information` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projects`
--

CREATE TABLE `projects` (
  `id_project` int NOT NULL,
  `nam_project` varchar(255) NOT NULL,
  `des_autoplay` varchar(255) DEFAULT NULL,
  `des_autoplay_timing` varchar(255) DEFAULT NULL,
  `des_project_image_desktop` mediumblob,
  `des_project_image_mobile` mediumblob,
  `dat_expiration` datetime DEFAULT NULL,
  `des_principal_color` varchar(255) DEFAULT NULL,
  `des_secundary_color` varchar(255) DEFAULT NULL,
  `des_menu_color` varchar(255) DEFAULT NULL,
  `des_options_colors` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_customer` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `url_dashboards`
--

CREATE TABLE `url_dashboards` (
  `id_url_dashboard` int NOT NULL,
  `url_dashboard` varchar(255) NOT NULL,
  `typ_screen` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `typ_database` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_dashboard` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `name_user` varchar(255) NOT NULL,
  `email_user` varchar(255) NOT NULL,
  `typ_user` varchar(255) NOT NULL,
  `password_user` varchar(255) NOT NULL,
  `is_just` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- Erro ao ler dados para tabela freedb_appjust.users: #1226 - Usuário 'freedb_user-app' tem excedido o 'max_questions' recurso (atual valor: 800)
<div class="alert alert-danger" role="alert"><h1>Erro</h1><p><strong>Query SQL:</strong>  <a href="#" class="copyQueryBtn" data-text="SET SQL_QUOTE_SHOW_CREATE = 1">Copiar</a>
<a href="index.php?route=/database/sql&sql_query=SET+SQL_QUOTE_SHOW_CREATE+%3D+1&show_query=1&db=freedb_appjust"><span class="nowrap"><img src="themes/dot.gif" title="Editar" alt="Editar" class="icon ic_b_edit">&nbsp;Editar</span></a>    </p>
<p>
<code class="sql"><pre>
SET SQL_QUOTE_SHOW_CREATE = 1
</pre></code>
</p>
<p>
    <strong>Mensagem do MySQL: </strong><a href="./url.php?url=https%3A%2F%2Fdev.mysql.com%2Fdoc%2Frefman%2F8.0%2Fen%2Fserver-error-reference.html" target="mysql_doc"><img src="themes/dot.gif" title="Documentação" alt="Documentação" class="icon ic_b_help"></a>
</p>
<code>#1226 - Usuário 'freedb_user-app' tem excedido o 'max_questions' recurso (atual valor: 800)</code><br></div>