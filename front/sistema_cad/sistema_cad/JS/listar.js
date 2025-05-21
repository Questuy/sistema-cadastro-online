let alunos = [];

function carregarAlunos() {
  fetch('http://localhost:3000/api/alunos')
    .then(res => res.json())
    .then(data => {
      alunos = data;
      exibirAlunos(alunos);
    });
}

function exibirAlunos(lista) {
  const tbody = document.querySelector('#tabelaAlunos tbody');
  tbody.innerHTML = '';

  lista.forEach(aluno => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.sexo}</td>
      <td>${aluno.email}</td>
      <td>${aluno.telefone}</td>
      <td>
        <button onclick="editarAluno(${aluno.id})">Editar</button>
        <button onclick="excluirAluno(${aluno.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function aplicarFiltros() {
  const cpf = document.getElementById('filtroCpf').value.toLowerCase();
  const idade = document.getElementById('filtroIdade').value;
  const sexo = document.getElementById('filtroSexo').value;
  const peso = document.getElementById('filtroPeso').value;
  const graduacao = document.getElementById('filtroGraduacao').value;

  const filtrados = alunos.filter(a => {
    return (!cpf || (a.cpf && a.cpf.toLowerCase().includes(cpf))) &&
           (!idade || a.idade == idade) &&
           (!sexo || a.sexo === sexo) &&
           (!peso || parseFloat(a.peso) == parseFloat(peso)) &&
           (!graduacao || a.graduacao === graduacao);
  });

  exibirAlunos(filtrados);
}

function excluirAluno(id) {
  if (confirm('Tem certeza que deseja excluir este aluno?')) {
    fetch(`http://localhost:3000/api/alunos/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        carregarAlunos();
      });
  }
}

function editarAluno(id) {
  window.location.href = `editar.html?id=${id}`;
}

carregarAlunos();


