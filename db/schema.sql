CREATE TABLE IF NOT EXISTS empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    cnpj VARCHAR(33) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cor VARCHAR(7) NOT NULL,
    ativo INT DEFAULT 1,
    empresa_id INT NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo_barra VARCHAR(13),
    quantidade INT NOT NULL DEFAULT 0,
    data_validade VARCHAR(255),
    data_entrada VARCHAR(255),
    data_saida VARCHAR(255),
    minimo INT DEFAULT 0,
    maximo INT DEFAULT 0,
    ativo INT DEFAULT 1,
    categoria_id INT,
    empresa_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_criacao VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    detalhe VARCHAR(255),
    produto_nome VARCHAR(255) NOT NULL,
    produto_id INT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

CREATE INDEX idx_produto_codigo_barra ON produto(codigo_barra);
CREATE INDEX idx_produto_empresa ON produto(empresa_id);
CREATE INDEX idx_produto_categoria ON produto(categoria_id);
CREATE INDEX idx_categoria_empresa ON categoria(empresa_id);
CREATE INDEX idx_historico_produto ON historico(produto_id);
