CREATE DATABASE barberpro;

USE barberpro;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    data_nascimento DATE,
    observacoes TEXT
);

CREATE TABLE barbeiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    especialidade VARCHAR(100),
    horario_inicio TIME,
    horario_fim TIME,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    duracao INT NOT NULL,
    descricao TEXT
);

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    barbeiro_id INT NOT NULL,
    servico_id INT NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'Agendado',
    observacoes TEXT,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

INSERT INTO servicos (nome, preco, duracao, descricao) VALUES
('Corte', 40.00, 30, 'Corte masculino'),
('Barba', 25.00, 20, 'Modelagem de barba'),
('Corte + Barba', 60.00, 50, 'Pacote completo'),
('Sobrancelha', 15.00, 10, 'Design de sobrancelha'),
('Alisamento Americano', 90.00, 90, 'Alisamento masculino');

INSERT INTO clientes
(nome, cpf, telefone, email)
VALUES
('Leonardo Dias', '123.456.789-00', '(41)99999-2222', 'leo@email.com');