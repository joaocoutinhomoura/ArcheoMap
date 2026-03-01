/**
 * ARQUIVO: archeomap-master/js/firebase-config.js
 * DESCRIÇÃO: Centraliza a conexão com o servidor (Firebase).
 * IMPORTANTE: Você precisará criar um projeto no site console.firebase.google.com
 * e substituir os dados abaixo pelas suas chaves reais.
 */

// Importa as funções do Firebase via CDN (serão carregadas no HTML)
// A configuração abaixo é um EXEMPLO. Você deve pegar a sua no Console do Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyCaD-dhe_1UBH85eYa4ZMFKpjNFFYUYkMM",
  authDomain: "coliceu-26c31.firebaseapp.com",
  databaseURL: "https://coliceu-26c31-default-rtdb.firebaseio.com",
  projectId: "coliceu-26c31",
  storageBucket: "coliceu-26c31.firebasestorage.app",
  messagingSenderId: "655852907270",
  appId: "1:655852907270:web:228fb29e47c2446a1bcc87"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // Banco de dados em tempo real
const auth = firebase.auth();         // Sistema de autenticação

console.log("[Firebase] Conectado ao servidor.");

/**
 * FUNÇÕES AUXILIARES DE BANCO DE DADOS
 */

// Função para salvar dados globais (ex: novo mapa)
function salvarNoServidor(caminho, dados) {
    return database.ref(caminho).set(dados)
        .then(() => console.log(`Dados salvos em ${caminho}`))
        .catch((erro) => console.error("Erro ao salvar:", erro));
}

// Função para ler dados uma vez
function lerDoServidor(caminho) {
    return database.ref(caminho).once('value').then((snapshot) => {
        return snapshot.val();
    });
}