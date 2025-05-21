const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  alert('ID não fornecido!');
  window.location.href = 'listar.html';
}

fetch(`http://localhost:3000/api/alunos/${id}`)
  .then(res => res.json())
  .then(aluno => {
    document.getElementById('id').value = aluno.id;
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('idade').value = aluno.idade;
    document.getElementById('sexo').value = aluno.sexo;
    document.getElementById('dataNascimento').value = aluno.data_nascimento.split('T')[0];
    document.getElementById('cpf').value = aluno.cpf;
    document.getElementById('peso').value = aluno.peso;
    document.getElementById('altura').value = aluno.altura;
    document.getElementById('rua').value = aluno.rua;
    document.getElementById('numero').value = aluno.numero;
    document.getElementById('bairro').value = aluno.bairro;
    document.getElementById('cidade').value = aluno.cidade;
    document.getElementById('cep').value = aluno.cep;
    document.getElementById('telefone').value = aluno.telefone;
    document.getElementById('email').value = aluno.email;
    document.getElementById('graduacao').value = aluno.graduacao;
  });

document.getElementById('formEditar').addEventListener('submit', function (e) {
  e.preventDefault();

  const aluno = {
    nome: document.getElementById('nome').value,
    idade: document.getElementById('idade').value,
    sexo: document.getElementById('sexo').value,
    dataNascimento: document.getElementById('dataNascimento').value,
    cpf: document.getElementById('cpf').value,
    peso: parseFloat(document.getElementById('peso').value),
    altura: parseFloat(document.getElementById('altura').value),
    rua: document.getElementById('rua').value,
    numero: document.getElementById('numero').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    cep: document.getElementById('cep').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value,
    graduacao: document.getElementById('graduacao').value
  };

  fetch(`http://localhost:3000/api/alunos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      window.location.href = 'listar.html';
    })
    .catch(err => {
      console.error('Erro ao atualizar aluno:', err);
      alert('Erro ao atualizar aluno');
    });
});
