
// cadastro.js — versão corrigida e com logs de debug
(() => {
  let tipoCadastro = null;

  const btnPublico = document.getElementById("cadPublicoBtn");
  const btnArqueo = document.getElementById("cadArqueologoBtn");
  const btnEnviar = document.getElementById("cadastrarBtn");

  function atualizaBadgeTipo() {
    // apenas visual simples se quiser; segura se não houver CSS
    if (!btnPublico || !btnArqueo) return;
    btnPublico.style.opacity = tipoCadastro === "publico" ? "1" : "0.6";
    btnArqueo.style.opacity = tipoCadastro === "arqueologo" ? "1" : "0.6";
  }

  if (btnPublico) {
    btnPublico.addEventListener("click", () => {
      tipoCadastro = "publico";
      // salva IMEDIATAMENTE para garantir persistência
      localStorage.setItem("cadastroType", tipoCadastro);
      console.log("[cadastro.js] tipo selecionado ->", tipoCadastro);
      atualizaBadgeTipo();
      alert("Cadastro Público selecionado (teste)");
    });
  }

  if (btnArqueo) {
    btnArqueo.addEventListener("click", () => {
      tipoCadastro = "arqueologo";
      // salva IMEDIATAMENTE para garantir persistência
      localStorage.setItem("cadastroType", tipoCadastro);
      console.log("[cadastro.js] tipo selecionado ->", tipoCadastro);
      atualizaBadgeTipo();
      alert("Cadastro Arqueólogo selecionado (teste)");
    });
  }

  if (btnEnviar) {
    btnEnviar.addEventListener("click", () => {
      const email = document.getElementById("cadEmail")?.value?.trim();
      const senha = document.getElementById("cadSenha")?.value;
      const confirm = document.getElementById("cadConfirm")?.value;

      // validação básica
      if (!tipoCadastro) {
        alert("Escolha um tipo de cadastro primeiro!");
        return;
      }
      if (!email || !senha || !confirm) {
        alert("Preencha todos os campos!");
        return;
      }
      if (senha !== confirm) {
        alert("As senhas não coincidem!");
        return;
      }

      // salva dados de forma simples para TESTE
      const userObj = {
        email,
        type: tipoCadastro,
        createdAt: new Date().toISOString()
      };

      // salva no localStorage: chave 'user' para simular login, e 'cadastroType' também (duplo) para redundância
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("cadastroType", tipoCadastro);

      console.log("[cadastro.js] cadastro salvo ->", userObj);

      alert("Cadastro criado com sucesso! Voltando ao login...");
      // volta para o login oficial (mesmo diretório)
      window.location.href = "LoginScreen.html";
    });
  }

  // ao carregar, se já existir algo no localStorage, sincroniza variáveis
  document.addEventListener("DOMContentLoaded", () => {
    const existing = localStorage.getItem("cadastroType");
    if (existing) {
      tipoCadastro = existing;
      atualizaBadgeTipo();
      console.log("[cadastro.js] tipo restaurado do storage ->", tipoCadastro);
    }
  });
})();
