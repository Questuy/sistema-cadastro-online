document.addEventListener("DOMContentLoaded", () => {
  const botao = document.createElement("button");
  botao.innerHTML = "⮌ Menu";
  botao.title = "Voltar ao Menu";

  botao.style.position = "fixed";
  botao.style.top = "15px";
  botao.style.left = "15px";
  botao.style.backgroundColor = "white";
  botao.style.color = "#007bff";
  botao.style.fontSize = "14px";
  botao.style.fontWeight = "bold";
  botao.style.border = "1px solid #007bff";
  botao.style.borderRadius = "4px";
  botao.style.padding = "4px 10px";
  botao.style.cursor = "pointer";
  botao.style.zIndex = "1000";
  botao.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
  botao.style.width = "auto";         // 👈 evita largura cheia
  botao.style.display = "inline-block"; // 👈 evita comportamento tipo "barra"

  botao.onclick = () => {
    window.location.href = "home.html";
  };

  document.body.appendChild(botao);
});

