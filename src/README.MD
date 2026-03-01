🏺 ArchaeoMap – Sistema de Mapeamento de Sítios Arqueológicos
O ArchaeoMap é um sistema completo de apoio a escavações arqueológicas, unindo robótica competitiva, geolocalização, visão computacional e automação.
 O objetivo é digitalizar o processo de exploração de campo, reduzindo erros, acelerando análises e permitindo que equipes trabalhem com precisão e organização desde o primeiro minuto de escavação.

🚀 Principais Funcionalidades <br>
🗺️ 1. Mapeamento Interativo de Sítios Arqueológicos <br>
Identificação automática do ponto zero (referência do terreno).


Mapeamento contínuo conforme o arqueólogo ou robô se desloca.


Inserção de marcadores no local dos achados.


Geração automática de cartões de identificação, contendo:


Nome do artefato


Descrição


Coordenadas


Data e hora


Imagem do local


Opção de baixar a imagem do ponto marcado diretamente no app.



🏠 2. Página Inicial <br>
Interface intuitiva com as seções principais: <br>
Acesso ao mapa interativo


Listagem de equipamentos


Artefatos descobertos


Login / Logout



🧰 3. Gestão de Equipamentos <br>
Listagem completa dos equipamentos utilizados na escavação: <br>
Nome do item


Estado (disponível, em uso, manutenção)


Responsável no momento


Histórico de movimentação (em desenvolvimento)



🔐 4. Sistema de Login e Permissões <br>
Autenticação por usuário + senha (com JWT / OAuth 2.0).


Controle de permissões:


Arqueólogos → acesso total à operação do mapa e marcações.


Público geral → acesso somente à listagem de artefatos publicados.


Redirecionamento automático após login.


Sessões seguras com expiração configurável.



🏺 5. Listagem Pública de Artefatos <br>
Página aberta onde o público pode visualizar artefatos já catalogados. <br>
Inclui:
Imagens reais do achado


Descrição técnica


Localização aproximada (protegida por privacy layer)


Status da pesquisa


Possibilidade futura de filtro por período histórico



🧭 Metodologia – SCRUM
O ArchaeoMap é desenvolvido seguindo Scrum, garantindo melhoria contínua e releases frequentes.
Papéis
Product Owner: André Siqueira


Scrum Master: Guilherme Marques


Equipe de Desenvolvimento:
 Miguel Boa Viagem
 Bruno Ferreira
 José Clayton
 João Gabriel Coutinho
 Rafael


Planejamento & Organização
📌 Trello do projeto:
 <a href="https://trello.com/invite/b/690c84ee5613cbbddf11c46a/ATTI05d4c6dd2e427e012300288210981de2B7EA257A/como-ajudar-os-arqueologos-no-dia-a-dia" target="_blank">Clique para acessar</a>

🧪 Status Atual
🚧 Em Desenvolvimento
 As funcionalidades principais estão sendo implementadas e testadas junto ao protótipo do robô de escaneamento.
 O objetivo é validar o mapeamento em campo e o fluxo de marcação dos artefatos.

🔧 Instalação e Configuração do Ambiente (CONTRIBUTING.md integrado)
Esta seção é essencial para qualquer pessoa que queira rodar o projeto localmente ou contribuir.

📦 1. Pré-requisitos
Você deve ter instalado:
Git


Node.js (v18+)


NPM ou Yarn


Navegador moderno (Chrome, Edge, Firefox)



📥 2. Clonando o repositório
git clone https://github.com/<seu-usuario>/<seu-repositorio>.git
cd <seu-repositorio>


⚙️ 3. Instalando dependências
npm install

Se usar yarn:
yarn


▶️ 4. Rodando o projeto
Com Live Server (VS Code):
Clique com botão direito no index.html


Selecione Open with Live Server


Ou via terminal:
npx http-server .

O sistema abrirá em:
http://localhost:8080


🤝 Como Contribuir
Quer ajudar o ArchaeoMap a evoluir? Siga estas regras simples.

1. Crie uma nova branch
git checkout -b feature/nome-da-feature


2. Faça seus commits de forma clara
Padrão recomendado:
feat: adiciona novo sistema de marcadores
fix: corrige erro no login
refactor: melhora a organização do código


3. Submeta sua alteração
git push origin feature/nome-da-feature

Abra um Pull Request e descreva:
O que foi feito


Como testar


Screenshots (se houver interface)



📁 Estrutura do Projeto
/archeomap
│── index.html
│── screens/
│   ├── Login/LoginScreen.html
│   ├── Mapa/MapScreen.html
│   ├── Equipamentos/EquipamentosScreen.html
│   └── Publico/ArtefatosPublicos.html
│── css/
│── js/
└── assets/


Tela de login: 

<img width="602" height="852" alt="image" src="https://github.com/user-attachments/assets/3a964d86-6f20-48c1-bba0-9b0ea69f5b2a" />

Tela de cadastro: 

<img width="480" height="862" alt="image" src="https://github.com/user-attachments/assets/445270f3-3f36-4c7b-b33e-9f84cfaa8122" /> <br>
Se o usuário for um arqueólogo ele deve usar um código especifico para cadastro. <br>

Tela inicial:

<img width="482" height="858" alt="image" src="https://github.com/user-attachments/assets/838a6d65-262c-4d3d-8d21-fa3313651a6d" /> <br>
Aqui o usuário ver os mapas catalogados no sistema. <br>

Tela do trabalho:

<img width="403" height="857" alt="image" src="https://github.com/user-attachments/assets/cd0cca08-e18e-4cb7-8945-cf7984ec524c" /> <br>
O usuário visualiza o mapa, o ponto zero e os artefatos marcados no mapa.

Mapa:

<img width="1907" height="857" alt="image" src="https://github.com/user-attachments/assets/1e265e41-a04d-4175-8704-6881850a7a3e" /> <br>
O usuário, se for arqueologo, pode visualizar o mapa e interagir com os dois botões acima, marcando novos artefatos e o ponto zero. Já um usuário público, apenas visualiza.





