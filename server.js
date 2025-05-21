// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conexão com o banco MySQL do Railway
const db = mysql.createConnection({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'FUwQhhMCeKYROdPEdjwFlmwFbKDmnKaB',
  database: 'railway',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conectado ao banco de dados!');
  }
});

// Rota para cadastrar aluno
app.post('/api/cadastrar-aluno', (req, res) => {
  const a = req.body;
  const sql = `
    INSERT INTO alunos 
    (nome, idade, sexo, data_nascimento, cpf, peso, altura, rua, numero, bairro, cidade, cep, telefone, email, graduacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    a.nome, a.idade, a.sexo, a.dataNascimento, a.cpf, a.peso, a.altura,
    a.endereco.rua, a.endereco.numero, a.endereco.bairro,
    a.endereco.cidade, a.endereco.cep,
    a.telefone, a.email, a.graduacao
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir no banco:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar aluno' });
    }
    res.json({ message: 'Aluno cadastrado com sucesso!' });
  });
});

// Rota para login
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
  db.query(sql, [usuario, senha], (err, results) => {
    if (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
  });
});

// Rota para listar todos os alunos
app.get('/api/alunos', (req, res) => {
  db.query(`
    SELECT id, nome, idade, sexo, email, telefone, cpf, peso, graduacao
    FROM alunos
  `, (err, results) => {
    if (err) {
      console.error('Erro ao buscar alunos:', err);
      return res.status(500).json({ message: 'Erro ao buscar alunos' });
    }
    res.json(results);
  });
});

// Rota para buscar aluno por ID
app.get('/api/alunos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM alunos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar aluno:', err);
      return res.status(500).json({ message: 'Erro ao buscar aluno' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(results[0]);
  });
});

// Rota para atualizar aluno
app.put('/api/alunos/:id', (req, res) => {
  const { id } = req.params;
  const a = req.body;

  const sql = `
    UPDATE alunos SET
      nome = ?, idade = ?, sexo = ?, data_nascimento = ?, cpf = ?, peso = ?, altura = ?,
      rua = ?, numero = ?, bairro = ?, cidade = ?, cep = ?, telefone = ?, email = ?, graduacao = ?
    WHERE id = ?
  `;

  const values = [
    a.nome, a.idade, a.sexo, a.dataNascimento, a.cpf, a.peso, a.altura,
    a.rua, a.numero, a.bairro, a.cidade, a.cep, a.telefone, a.email, a.graduacao,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar aluno:', err);
      return res.status(500).json({ message: 'Erro ao atualizar aluno' });
    }
    res.json({ message: 'Aluno atualizado com sucesso!' });
  });
});

// Rota para deletar aluno
app.delete('/api/alunos/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM alunos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar aluno:', err);
      return res.status(500).json({ message: 'Erro ao deletar aluno' });
    }
    res.json({ message: 'Aluno excluído com sucesso!' });
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// ⚠️ ROTA TEMPORÁRIA para criar tabelas (usar apenas uma vez)
app.get('/criar-tabelas', (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS alunos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      idade INT,
      sexo ENUM('M', 'F') NOT NULL,
      data_nascimento DATE,
      cpf VARCHAR(14),
      peso FLOAT,
      altura FLOAT,
      rua VARCHAR(100),
      numero VARCHAR(10),
      bairro VARCHAR(100),
      cidade VARCHAR(100),
      cep VARCHAR(9),
      telefone VARCHAR(20),
      email VARCHAR(100),
      graduacao VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50) NOT NULL UNIQUE,
      senha VARCHAR(100) NOT NULL
    );
  `;

  db.query(sql, err => {
    if (err) {
      console.error('Erro ao criar tabelas:', err);
      return res.status(500).send('Erro ao criar tabelas');
    }
    res.send('Tabelas criadas com sucesso!');
  });
});
