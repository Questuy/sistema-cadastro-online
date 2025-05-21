USE trabalho;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade INT,
  sexo ENUM('Masculino', 'Feminino', 'Outro'),
  data_nascimento DATE,
  cpf VARCHAR(14) UNIQUE,
  peso DECIMAL(5,2),
  altura DECIMAL(4,2),
  rua VARCHAR(100),
  numero VARCHAR(10),
  bairro VARCHAR(50),
  cidade VARCHAR(50),
  cep VARCHAR(10),
  telefone VARCHAR(20),
  email VARCHAR(100),
  graduacao ENUM(
    'Fixa Branca','Fixa Amarela','Fixa Laranja',
    'Fixa Verde','Fixa Azul','Fixa Roxa',
    'Fixa Marrom','Fixa Preta'
  )
);


