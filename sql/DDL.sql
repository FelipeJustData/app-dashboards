--
-- Banco de dados: `DB_PLATAFORMA_DATAVIZ`
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

-- --------------------------------------------------------

--
-- Estrutura para tabela `users_modules`
--

CREATE TABLE `users_modules` (
  `id_user_module` int NOT NULL,
  `name_module` varchar(255) NOT NULL,
  `typ_permission` varchar(255) NOT NULL,
  `access` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `user_permissions`
--

CREATE TABLE `user_permissions` (
  `id_user_permissions` int NOT NULL,
  `des_project_access` tinyint(1) NOT NULL,
  `des_dashboard_access` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_user` int DEFAULT NULL,
  `id_project` int DEFAULT NULL,
  `id_dashboard` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id_customer`);

--
-- Índices de tabela `dashboards`
--
ALTER TABLE `dashboards`
  ADD PRIMARY KEY (`id_dashboard`),
  ADD KEY `id_project` (`id_project`);

--
-- Índices de tabela `metadata`
--
ALTER TABLE `metadata`
  ADD PRIMARY KEY (`id_metadata`),
  ADD KEY `id_user` (`id_user`);

--
-- Índices de tabela `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id_project`),
  ADD KEY `id_customer` (`id_customer`);

--
-- Índices de tabela `url_dashboards`
--
ALTER TABLE `url_dashboards`
  ADD PRIMARY KEY (`id_url_dashboard`),
  ADD KEY `id_dashboard` (`id_dashboard`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Índices de tabela `users_modules`
--
ALTER TABLE `users_modules`
  ADD PRIMARY KEY (`id_user_module`),
  ADD KEY `id_user` (`id_user`);

--
-- Índices de tabela `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`id_user_permissions`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_project` (`id_project`),
  ADD KEY `id_dashboard` (`id_dashboard`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `customers`
--
ALTER TABLE `customers`
  MODIFY `id_customer` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `dashboards`
--
ALTER TABLE `dashboards`
  MODIFY `id_dashboard` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `metadata`
--
ALTER TABLE `metadata`
  MODIFY `id_metadata` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `projects`
--
ALTER TABLE `projects`
  MODIFY `id_project` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `url_dashboards`
--
ALTER TABLE `url_dashboards`
  MODIFY `id_url_dashboard` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users_modules`
--
ALTER TABLE `users_modules`
  MODIFY `id_user_module` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_permissions`
--
ALTER TABLE `user_permissions`
  MODIFY `id_user_permissions` int NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `dashboards`
--
ALTER TABLE `dashboards`
  ADD CONSTRAINT `dashboards_ibfk_1` FOREIGN KEY (`id_project`) REFERENCES `projects` (`id_project`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `metadata`
--
ALTER TABLE `metadata`
  ADD CONSTRAINT `metadata_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id_customer`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `url_dashboards`
--
ALTER TABLE `url_dashboards`
  ADD CONSTRAINT `url_dashboards_ibfk_1` FOREIGN KEY (`id_dashboard`) REFERENCES `dashboards` (`id_dashboard`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `users_modules`
--
ALTER TABLE `users_modules`
  ADD CONSTRAINT `users_modules_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`id_project`) REFERENCES `projects` (`id_project`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_permissions_ibfk_3` FOREIGN KEY (`id_dashboard`) REFERENCES `dashboards` (`id_dashboard`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
