document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.message === 'Login bem-sucedido') {
        window.location.href = 'home.html';
      }
    })
    .catch(err => {
      console.error('Erro no login:', err);
      alert('Erro ao tentar fazer login');
    });
});
