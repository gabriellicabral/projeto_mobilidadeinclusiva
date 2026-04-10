/*
  script.js - versão didática
  ---------------------------
  Este arquivo controla as interações do site:
  1) Navegação entre seções
  2) Cadastro e Busca de CEP
  3) Escolha de Planos
  4) Login e Perfil do Usuário
  5) Ferramentas de Acessibilidade
*/

// =========================
// TROCA DE TELAS
// =========================

// Objeto que mapeia o nome da página para a sua classe CSS no HTML
const MAPA_TELAS = {
  home: '.secao_home',
  sobre: '.secao_sobre',
  cadastro: '.secao_cadastro',
  planos: '.secao_planos',
  login: '.secao_login',
  usuario: '.secao_usuario',
  trabalhe: '.secao_trabalhe_conosco',
};

// Seleciona todas as seções do main e todos os links que navegam
const todasAsSecoes = document.querySelectorAll('main section');
const linksDePagina = document.querySelectorAll('[data-pagina]');

// Função que esconde todas as telas e mostra apenas a selecionada
function abrirTela(nomeTela) {
  const seletor = MAPA_TELAS[nomeTela] || MAPA_TELAS.home;
  const tela = document.querySelector(seletor);

  // Remove a classe 'tela_ativa' de todas para esconder
  todasAsSecoes.forEach((secao) => secao.classList.remove('tela_ativa'));

  // Adiciona 'tela_ativa' apenas na tela que queremos ver
  if (tela) tela.classList.add('tela_ativa');

  // Atualiza o # na URL (ex: site.com/#sobre)
  window.location.hash = nomeTela;
}

// Verifica o # da URL para abrir a tela correta ao carregar a página
function abrirTelaPelaHash() {
  const nomeTela = window.location.hash.replace('#', '') || 'home';
  abrirTela(nomeTela);
}

// Adiciona o evento de clique em cada link de navegação
linksDePagina.forEach((link) => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault(); // Evita o recarregamento da página
    const nomeTela = link.dataset.pagina;
    abrirTela(nomeTela);
  });
});

// Se o usuário clicar em "Voltar" no navegador, a tela muda automaticamente
window.addEventListener('hashchange', abrirTelaPelaHash);
abrirTelaPelaHash();

// =========================
//  CADASTRO + CEP
// =========================

const formCadastro = document.querySelector('.formulario_cadastro');
const campoCep = document.getElementById('cep');
const campoEndereco = document.getElementById('endereco');

// Remove tudo que não for número (limpa pontos e traços)
function somenteNumeros(texto) {
  return (texto || '').replace(/\D/g, '');
}

// Quando o usuário sai do campo CEP, busca o endereço na API ViaCEP
campoCep?.addEventListener('blur', async () => {
  const cepLimpo = somenteNumeros(campoCep.value);

  if (cepLimpo.length !== 8) return;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      alert('CEP não encontrado.');
      return;
    }

    // Preenche o campo de endereço com os dados recebidos
    campoEndereco.value = `${dados.logradouro} - ${dados.bairro}, ${dados.localidade}/${dados.uf}`;
  } catch (erro) {
    alert('Não foi possível consultar o CEP agora.');
  }
});

// Salva os dados do cadastro no LocalStorage (memória do navegador)
formCadastro?.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const dados = new FormData(formCadastro);

  const cadastro = {
    nome: dados.get('nome')?.toString().trim(),
    cpf: somenteNumeros(dados.get('cpf')?.toString()),
    senha: dados.get('senha')?.toString(),
    cep: dados.get('cep')?.toString(),
    endereco: `${dados.get('endereco') || ''}, Nº ${dados.get('numero') || ''}`,
    nomePassageiro: dados.get('nomePassageiro')?.toString().trim(),
    deficiencia: dados.get('deficiencia')?.toString().trim(),
    necessidades: dados.get('necessidades')?.toString().trim(),
    cadeira: dados.get('cadeira')?.toString(),
    plano: '',
  };

  if (!cadastro.cpf || cadastro.cpf.length < 11) {
    alert('Informe um CPF válido.');
    return;
  }

  localStorage.setItem('cadastro_mobilidade', JSON.stringify(cadastro));
  alert('Cadastro salvo com sucesso! Agora escolha um plano.');
  abrirTela('planos');
});

// =========================
//  PLANOS(THAMYRIS)
// =========================


// =========================
//  LOGIN 
// =========================




// Valida se o CPF e Senha batem com o que foi cadastrado
const formLogin = document.querySelector('.formulario_login');

formLogin?.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const cadastro = JSON.parse(localStorage.getItem('cadastro_mobilidade') || '{}');
  const cpfDigitado = somenteNumeros(document.getElementById('loginCpf').value);
  const senhaDigitada = document.getElementById('loginSenha').value;

  if (cpfDigitado === cadastro.cpf && senhaDigitada === cadastro.senha) {
    preencherAreaUsuario(cadastro);
    abrirTela('usuario');
  } else {
    alert('CPF ou senha inválidos.');
  }
});

// =========================
//  ÁREA DO USUÁRIO(LUIZ)
// =========================



// =========================
//  TRABALHE CONOSCO (BRUNA)
// =========================






// =========================
//  ACESSIBILIDADE
// =========================

const botaoAcessibilidade = document.getElementById('botao_acessibilidade');
const painelAcessibilidade = document.getElementById('painel_acessibilidade');
const botoesModo = document.querySelectorAll('[funcao_acessibilidade]');
const btnLer = document.getElementById('btn-ler');
const btnParar = document.getElementById('btn-parar');

const mapaModos = {
  fonte: 'fonte-grande',
  contraste: 'alto-contraste',
  daltonismo: 'modo-daltonismo',
};

// Abre/fecha o menu lateral de acessibilidade
botaoAcessibilidade?.addEventListener('click', () => {
  painelAcessibilidade.classList.toggle('aberto');
});

// Ao abrir o site, verifica se o usuário já tinha ligado algum modo antes
Object.entries(mapaModos).forEach(([chave, classe]) => {
  if (localStorage.getItem(chave) === 'true') {
    document.body.classList.add(classe);
  }
});

// Liga ou desliga as classes CSS de acessibilidade e salva a escolha
botoesModo.forEach((botao) => {
  botao.addEventListener('click', () => {
    const classe = botao.getAttribute('funcao_acessibilidade');
    const chave = botao.getAttribute('palavra-chave');

    const ativo = document.body.classList.toggle(classe);
    localStorage.setItem(chave, String(ativo));
  });
});

// Transforma texto em voz (Sintetizador de voz do navegador)
btnLer?.addEventListener('click', () => {
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(document.body.innerText);
  fala.lang = 'pt-BR';
  window.speechSynthesis.speak(fala);
});

btnParar?.addEventListener('click', () => {
  window.speechSynthesis.cancel();
});