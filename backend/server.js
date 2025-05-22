const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Usa variáveis do .env
console.log("🔍 Variáveis carregadas:", process.env);v

// Teste para garantir que variáveis estão vindo corretamente
console.log("🔍 Verificando variáveis .env:");
console.log({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

const app = express();
app.use(cors());
app.use(express.json());

// Cria conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  multipleStatements: true
});


// Testa conexão imediatamente
db.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco de dados!');
});


// Rota para criar tabelas
app.get('/api/criar-tabelas', (req, res) => {
  if (db.state !== 'connected') {
    return res.status(500).json({ message: '❌ Banco de dados não conectado' });
  }

  const sql = `
    CREATE TABLE IF NOT EXISTS alunos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100),
      idade INT,
      sexo VARCHAR(10),
      data_nascimento DATE,
      cpf VARCHAR(15),
      peso FLOAT,
      altura FLOAT,
      rua VARCHAR(100),
      numero VARCHAR(10),
      bairro VARCHAR(50),
      cidade VARCHAR(50),
      cep VARCHAR(10),
      telefone VARCHAR(20),
      email VARCHAR(100),
      graduacao VARCHAR(50)
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50),
      senha VARCHAR(100)
    );
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabelas:', err);
      return res.status(500).json({ message: 'Erro ao criar tabelas', error: err.sqlMessage });
    }
    res.json({ message: '✅ Tabelas criadas com sucesso!' });
  });
});

// Cadastrar aluno
app.post('/api/cadastrar-aluno', (req, res) => {
  const a = req.body;
  const sql = `
    INSERT INTO alunos (
      nome, idade, sexo, data_nascimento, cpf, peso, altura,
      rua, numero, bairro, cidade, cep, telefone, email, graduacao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    a.nome, a.idade, a.sexo, a.dataNascimento, a.cpf, a.peso, a.altura,
    a.endereco.rua, a.endereco.numero, a.endereco.bairro,
    a.endereco.cidade, a.endereco.cep,
    a.telefone, a.email, a.graduacao
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error('❌ Erro ao cadastrar aluno:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar aluno' });
    }
    res.json({ message: '✅ Aluno cadastrado com sucesso!' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';

  db.query(sql, [usuario, senha], (err, results) => {
    if (err) {
      console.error('❌ Erro no login:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
    if (results.length > 0) {
      res.json({ message: '✅ Login bem-sucedido' });
    } else {
      res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
  });
});

// Listar alunos
app.get('/api/alunos', (req, res) => {
  db.query(`
    SELECT id, nome, idade, sexo, email, telefone, cpf, peso, graduacao
    FROM alunos
  `, (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar alunos:', err);
      return res.status(500).json({ message: 'Erro ao buscar alunos' });
    }
    res.json(results);
  });
});

// Buscar aluno por ID
app.get('/api/alunos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM alunos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar aluno:', err);
      return res.status(500).json({ message: 'Erro ao buscar aluno' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(results[0]);
  });
});

// Atualizar aluno
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

  db.query(sql, values, (err) => {
    if (err) {
      console.error('❌ Erro ao atualizar aluno:', err);
      return res.status(500).json({ message: 'Erro ao atualizar aluno' });
    }
    res.json({ message: '✅ Aluno atualizado com sucesso!' });
  });
});

// Deletar aluno
app.delete('/api/alunos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM alunos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('❌ Erro ao deletar aluno:', err);
      return res.status(500).json({ message: 'Erro ao deletar aluno' });
    }
    res.json({ message: '✅ Aluno excluído com sucesso!' });
  });
});

// Rodar o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
