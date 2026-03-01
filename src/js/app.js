// ROTAS MINIMAS - TESTE SEM BANCO
const rotas = {
  publico: "../screens/GaleriaPublico.html",
  arqueologo: "../screens/GaleriaArqueologo.html"
};

document.addEventListener("DOMContentLoaded", () => {
  const tipo = localStorage.getItem("cadastroType");
  console.log("[app.js] cadastroType lido no login ->", tipo);

  const botao = document.getElementById("loginBtn"); // seu id
  if (botao) {
    botao.addEventListener("click", () => {
      const tipoAtual = localStorage.getItem("cadastroType");
      console.log("[app.js] ao clicar login, cadastroType atual ->", tipoAtual);

      if (!tipoAtual) {
        alert("Faça o cadastro primeiro!");
        return;
      }
      const destino = rotas[tipoAtual];
      if (!destino) {
        alert("Tipo de cadastro desconhecido: " + tipoAtual);
        return;
      }
      window.location.href = destino;
    });
  } else {
    console.warn("[app.js] botão de login (id=loginBtn) não encontrado na página atual.");
  }
});


let tipoCadastro = null;

window.setCadastroType = function(tipo) {
  tipoCadastro = tipo;
  console.log("Tipo de cadastro selecionado:", tipo);
}

window.cadastrar = function() {
  const email = document.getElementById('cadEmail').value;
  const senha = document.getElementById('cadSenha').value;
  const confirm = document.getElementById('cadConfirm').value;

  if (!email || !senha || !confirm) {
    alert("Preencha email, senha e confirmação!");
    return;
  }

  if (senha !== confirm) {
    alert("As senhas não coincidem!");
    return;
  }

  alert("Cadastro realizado com sucesso!");

  // Navegação de teste baseada no tipo clicado
  if (tipoCadastro === "normal") {
    navegarPara("galeria-publico");
  } else if (tipoCadastro === "arqueologo") {
    navegarPara("galeria-arqueologos");
  } else {
    alert("Escolha o tipo de cadastro primeiro!");
  }
}

// Elementos da interface
const btnAddMap = document.getElementById('btnAddMap');
const mapModal = document.getElementById('mapModal');
const pointDetailsModal = document.getElementById('pointDetailsModal');
const closeMapModal = document.getElementById('closeMapModal');
const closePointDetailsModal = document.getElementById('closePointDetailsModal');
const notification = document.getElementById('notification');
const interactiveMap = document.getElementById('interactiveMap');
const mapArea = document.getElementById('mapArea');
const mapPlaceholder = document.getElementById('mapPlaceholder');
const totalFindings = document.getElementById('totalFindings');
const zeroPoints = document.getElementById('zeroPoints');
const lastUpdate = document.getElementById('lastUpdate');
const artifactsGrid = document.getElementById('artifactsGrid');
const tabs = document.querySelectorAll('.tab');
const fileInput = document.getElementById('fileInput');
const imageInput = document.getElementById('imageInput');

// Elementos da tela do mapa detalhado
const mainScreen = document.querySelector('.main-screen');
const mapDetailScreen = document.querySelector('.map-detail-screen');
const backButton = document.getElementById('backButton');
const detailedMapCanvas = document.getElementById('detailedMapCanvas');
const coordinatesDisplay = document.getElementById('coordinatesDisplay');
const mapGrid = document.getElementById('mapGrid');
const detailedMapPoints = document.getElementById('detailedMapPoints');
const addingModeIndicator = document.getElementById('addingModeIndicator');
const addingModeText = document.getElementById('addingModeText');
const cancelAddMode = document.getElementById('cancelAddMode');
const btnAddZeroPoint = document.getElementById('btnAddZeroPoint');
const btnAddCommonPoint = document.getElementById('btnAddCommonPoint');

// Opções dos modais
const optionGallery = document.getElementById('optionGallery');
const optionFiles = document.getElementById('optionFiles');

// Elementos de detalhes do ponto
const pointName = document.getElementById('pointName');
const pointDescription = document.getElementById('pointDescription');
const pointCategory = document.getElementById('pointCategory');
const pointEra = document.getElementById('pointEra');
const pointState = document.getElementById('pointState');
const pointMaterial = document.getElementById('pointMaterial');
const pointCoordinates = document.getElementById('pointCoordinates');
const pointDiscoveryDate = document.getElementById('pointDiscoveryDate');
const pointTags = document.getElementById('pointTags');
const savePointDetails = document.getElementById('savePointDetails');
const cancelPointDetails = document.getElementById('cancelPointDetails');
const pointPhoto = document.getElementById('pointPhoto');
const photoPreview = document.getElementById('photoPreview');

// Estado da aplicação
let mapPoints = [];
let findingsCount = 0;
let zeroPointsCount = 0;
let isMapLoaded = false;
let currentMapImage = null;
let canvasContext = null;
let isGridVisible = true;
let addingPointMode = null;
let currentPointPosition = { x: 0, y: 0 };
let currentPhoto = null;
let editingPointId = null;

// Detectar dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Função para mostrar notificação
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'success' ? 'var(--primary-color)' : 'var(--error-color)';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Função para lidar com upload de foto
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentPhoto = e.target.result;
                photoPreview.innerHTML = `<img src="${currentPhoto}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Por favor, selecione uma imagem válida.', 'error');
        }
    }
}

// Função para adicionar ponto no mapa
function addMapPoint(x, y, title, type = 'common', details = {}) {
    const pointId = Date.now();
    const point = document.createElement('div');
    point.className = `map-point ${type}-point`;
    point.style.left = `${x}%`;
    point.style.top = `${y}%`;
    point.setAttribute('data-title', title);
    point.setAttribute('data-id', pointId);
    
    // Adicionar ícone baseado no tipo
    if (type === 'zero') {
        point.innerHTML = '⭐';
        zeroPointsCount++;
        zeroPoints.textContent = zeroPointsCount;
    } else {
        point.innerHTML = '💜';
        findingsCount++;
        totalFindings.textContent = findingsCount;
    }
    
    point.addEventListener('click', (e) => {
        e.stopPropagation();
        showPointDetails(point);
    });
    
    interactiveMap.appendChild(point);
    
    // Criar objeto do ponto
    const pointObj = {
        id: pointId,
        x, y, title, type,
        details: {
            name: details.name || title,
            description: details.description || '',
            category: details.category || '',
            era: details.era || '',
            state: details.state || '',
            material: details.material || '',
            coordinates: { x, y },
            discoveryDate: details.discoveryDate || new Date().toISOString().split('T')[0],
            tags: details.tags || [],
            altitude: details.altitude || null,
            photo: details.photo || null
        }
    };
    
    mapPoints.push(pointObj);
    
    updateLastUpdateTime();
    
    // Adicionar ao grid de artefatos
    addArtifactToGrid(pointObj);
    
    // Atualizar pontos no mapa detalhado se estiver ativo
    if (mapDetailScreen.classList.contains('active')) {
        renderDetailedPoints();
    }
    
    return pointObj;
}

// Função para adicionar artefato ao grid
function addArtifactToGrid(artifact) {
    const artifactCard = document.createElement('div');
    artifactCard.className = 'artifact-card';
    artifactCard.setAttribute('data-id', artifact.id);
    
    // Determinar conteúdo da imagem - mostrar foto se existir
    let imageContent = '';
    if (artifact.details.photo) {
        imageContent = `<img src="${artifact.details.photo}" alt="${artifact.details.name}" class="artifact-photo">`;
    } else {
        // Determinar ícone baseado na categoria
        let icon = '📦';
        if (artifact.details.category === 'ceramica') icon = '🏺';
        else if (artifact.details.category === 'metal') icon = '⚙️';
        else if (artifact.details.category === 'ferramentas') icon = '🛠️';
        else if (artifact.details.category === 'ossos') icon = '🦴';
        else if (artifact.details.category === 'adornos') icon = '💎';
        
        imageContent = `<div class="artifact-icon">${icon} ${artifact.type === 'zero' ? '⭐' : ''}</div>`;
    }
    
    artifactCard.innerHTML = `
        <div class="artifact-image">
            ${imageContent}
        </div>
        <div class="artifact-info">
            <div class="artifact-name">${artifact.details.name}</div>
            <div class="artifact-details">
                <div class="artifact-detail">📂 ${artifact.details.category || 'Sem categoria'}</div>
                <div class="artifact-detail">🕰️ ${artifact.details.era || 'Sem época'}</div>
                <div class="artifact-detail">📍 ${Math.round(artifact.x)}, ${Math.round(artifact.y)}</div>
                ${artifact.details.altitude ? `<div class="artifact-detail">📏 Altura: ${artifact.details.altitude}m</div>` : ''}
            </div>
            <div class="artifact-tags">
                ${artifact.details.tags.map(tag => `<span class="artifact-tag">${tag}</span>`).join('')}
                ${artifact.type === 'zero' ? '<span class="artifact-tag zero-tag">Ponto Zero</span>' : ''}
            </div>
        </div>
    `;
    
    artifactCard.addEventListener('click', () => {
        showArtifactDetails(artifact);
    });
    
    artifactsGrid.appendChild(artifactCard);
}

// Função para mostrar detalhes do artefato
function showArtifactDetails(artifact) {
    editingPointId = artifact.id;
    
    // Preencher modal de detalhes
    pointName.value = artifact.details.name;
    pointDescription.value = artifact.details.description;
    pointCategory.value = artifact.details.category;
    pointEra.value = artifact.details.era;
    pointState.value = artifact.details.state;
    pointMaterial.value = artifact.details.material;
    pointCoordinates.textContent = `X: ${Math.round(artifact.x)}, Y: ${Math.round(artifact.y)}`;
    pointDiscoveryDate.value = artifact.details.discoveryDate;
    
    // Mostrar foto se existir
    if (artifact.details.photo) {
        photoPreview.innerHTML = `<img src="${artifact.details.photo}" alt="Preview">`;
        currentPhoto = artifact.details.photo;
    } else {
        photoPreview.innerHTML = '';
        currentPhoto = null;
    }
    
    // Marcar tags selecionadas
    const tags = pointTags.querySelectorAll('.tag');
    tags.forEach(tag => {
        if (artifact.details.tags.includes(tag.getAttribute('data-value'))) {
            tag.classList.add('selected');
        } else {
            tag.classList.remove('selected');
        }
    });
    
    // Mostrar modal
    pointDetailsModal.style.display = 'flex';
    pointDetailsModal.classList.add('active');
    
    // Configurar função de salvar para atualizar
    savePointDetails.onclick = updateCurrentPoint;
}

// Função para atualizar o ponto atual
function updateCurrentPoint() {
    const selectedTags = [];
    pointTags.querySelectorAll('.tag.selected').forEach(tag => {
        selectedTags.push(tag.getAttribute('data-value'));
    });
    
    const pointIndex = mapPoints.findIndex(p => p.id === editingPointId);
    if (pointIndex === -1) return;
    
    mapPoints[pointIndex].details = {
        name: pointName.value,
        description: pointDescription.value,
        category: pointCategory.value,
        era: pointEra.value,
        state: pointState.value,
        material: pointMaterial.value,
        coordinates: { x: mapPoints[pointIndex].x, y: mapPoints[pointIndex].y },
        discoveryDate: pointDiscoveryDate.value,
        tags: selectedTags,
        altitude: mapPoints[pointIndex].details.altitude,
        photo: currentPhoto
    };
    
    // Atualizar grid
    updateArtifactGrid();
    
    // Atualizar pontos no mapa detalhado
    if (mapDetailScreen.classList.contains('active')) {
        renderDetailedPoints();
    }
    
    pointDetailsModal.style.display = 'none';
    pointDetailsModal.classList.remove('active');
    currentPhoto = null;
    editingPointId = null;
    showNotification('Achado atualizado com sucesso!');
}

// Função para atualizar grid de artefatos
function updateArtifactGrid() {
    artifactsGrid.innerHTML = '';
    mapPoints.forEach(point => {
        addArtifactToGrid(point);
    });
}

// Função para mostrar detalhes do ponto
function showPointDetails(pointElement) {
    const pointId = pointElement.getAttribute('data-id');
    const point = mapPoints.find(p => p.id == pointId);
    
    if (point) {
        showArtifactDetails(point);
    }
}

// Função para atualizar o tempo da última atualização
function updateLastUpdateTime() {
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Função para alternar aba ativa
function setActiveTab(tabElement) {
    tabs.forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
}

// Função para carregar mapa
function loadMap(imageSrc = null) {
    console.log('Carregando mapa...', imageSrc);
    
    // Limpar pontos existentes
    const existingPoints = interactiveMap.querySelectorAll('.map-point');
    existingPoints.forEach(point => point.remove());
    mapPoints = [];
    findingsCount = 0;
    zeroPointsCount = 0;
    totalFindings.textContent = findingsCount;
    zeroPoints.textContent = zeroPointsCount;
    artifactsGrid.innerHTML = '';
    
    if (imageSrc) {
        // Se uma imagem foi fornecida, usá-la
        interactiveMap.style.backgroundImage = `url(${imageSrc})`;
        interactiveMap.style.backgroundSize = 'cover';
        interactiveMap.style.backgroundPosition = 'center';
        currentMapImage = imageSrc;
        
        // Esconder o botão "Adicionar Mapa" quando um mapa é carregado
        btnAddMap.style.display = 'none';
    } else {
        return;
    }
    
    // Atualizar interface
    mapPlaceholder.style.display = 'none';
    mapArea.classList.add('has-map');
    interactiveMap.style.display = 'block';
    isMapLoaded = true;
    
    showNotification('Mapa carregado com sucesso! Clique no mapa para ver a versão detalhada.');
}

// Função para abrir galeria de imagens
function openImageGallery() {
    console.log('Abrindo galeria...');
    if (isMobile) {
        imageInput.setAttribute('accept', 'image/*');
        imageInput.setAttribute('capture', 'environment');
        imageInput.click();
    } else {
        imageInput.removeAttribute('capture');
        imageInput.click();
    }
}

// Função para abrir seletor de arquivos
function openFileSelector() {
    console.log('Abrindo seletor de arquivos...');
    fileInput.click();
}

// Função para processar imagem selecionada
function handleImageSelection(event) {
    const file = event.target.files[0];
    console.log('Arquivo selecionado:', file);
    
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log('Imagem carregada com sucesso');
                loadMap(e.target.result);
                mapModal.style.display = 'none';
                mapModal.classList.remove('active');
            };
            reader.onerror = function(e) {
                console.error('Erro ao ler arquivo:', e);
                showNotification('Erro ao carregar a imagem.', 'error');
            };
            reader.readAsDataURL(file);
            showNotification('Processando imagem...');
        } else {
            showNotification('Por favor, selecione uma imagem válida.', 'error');
        }
    }
    event.target.value = '';
}

// Função para adicionar ponto zero
function addZeroPoint(x, y) {
    const altura = prompt('Digite a altura do ponto zero:');
    if (altura && !isNaN(parseFloat(altura))) {
        const pointDetails = {
            name: 'Ponto Zero',
            description: 'Ponto mais alto da área de escavação',
            category: 'referencia',
            state: 'identificado',
            tags: ['importante', 'referencia'],
            altitude: parseFloat(altura),
            photo: null
        };
        
        addMapPoint(x, y, pointDetails.name, 'zero', pointDetails);
        showNotification('Ponto Zero adicionado com sucesso!');
    } else if (altura !== null) {
        showNotification('Por favor, insira uma altura válida.', 'error');
    }
}

// Função para adicionar ponto comum com modal IMEDIATO
function addCommonPoint(x, y) {
    // Primeiro adiciona o ponto com dados básicos
    const pointDetails = {
        name: `Achado ${findingsCount + 1}`,
        description: '',
        category: '',
        era: '',
        state: 'identificado',
        material: '',
        tags: ['pesquisado'],
        photo: null
    };
    
    const newPoint = addMapPoint(x, y, pointDetails.name, 'common', pointDetails);
    
    // ABRE O MODAL IMEDIATAMENTE
    editingPointId = newPoint.id;
    
    // Preencher modal com dados básicos
    pointName.value = pointDetails.name;
    pointDescription.value = '';
    pointCategory.value = '';
    pointEra.value = '';
    pointState.value = 'identificado';
    pointMaterial.value = '';
    pointCoordinates.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    pointDiscoveryDate.value = new Date().toISOString().split('T')[0];
    
    // Limpar preview da foto
    photoPreview.innerHTML = '';
    currentPhoto = null;
    
    // Limpar tags selecionadas
    pointTags.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    
    // Selecionar tag "pesquisado" por padrão
    const pesquisadoTag = pointTags.querySelector('[data-value="pesquisado"]');
    if (pesquisadoTag) pesquisadoTag.classList.add('selected');
    
    // Configurar função de salvar
    savePointDetails.onclick = updateCurrentPoint;
    
    // MOSTRAR MODAL IMEDIATAMENTE
    pointDetailsModal.style.display = 'flex';
    pointDetailsModal.classList.add('active');
    
    // Desativar modo de adição após abrir o modal
    deactivateAddingMode();
    
    showNotification('Ponto adicionado! Preencha os detalhes.');
}

// Função para ativar modo de adição
function activateAddingMode(type) {
    addingPointMode = type;
    detailedMapCanvas.style.cursor = 'crosshair';
    addingModeIndicator.style.display = 'flex';
    
    if (type === 'zero') {
        addingModeText.textContent = 'Modo: Ponto Zero - Clique no mapa para adicionar';
        showNotification('Modo Ponto Zero ativado. Clique no mapa para posicionar.');
    } else {
        addingModeText.textContent = 'Modo: Achado Comum - Clique no mapa para adicionar';
        showNotification('Modo Achado Comum ativado. Clique no mapa para posicionar.');
    }
}

// Função para desativar modo de adição
function deactivateAddingMode() {
    addingPointMode = null;
    detailedMapCanvas.style.cursor = 'default';
    addingModeIndicator.style.display = 'none';
}

// Função para inicializar tela do mapa detalhado
function initializeDetailedMap() {
    console.log('Inicializando mapa detalhado...');
    canvasContext = detailedMapCanvas.getContext('2d');
    
    // Ajustar tamanho do canvas
    const container = detailedMapCanvas.parentElement;
    detailedMapCanvas.width = container.clientWidth;
    detailedMapCanvas.height = container.clientHeight;
    
    // Desenhar mapa
    drawDetailedMap();
    
    // Adicionar grade
    if (isGridVisible) {
        drawGrid();
    }
    
    // Adicionar pontos existentes
    renderDetailedPoints();
    
    // Adicionar eventos
    detailedMapCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    detailedMapCanvas.addEventListener('click', handleCanvasClick);
}

// Função para desenhar mapa detalhado
function drawDetailedMap() {
    console.log('Desenhando mapa detalhado...');
    canvasContext.clearRect(0, 0, detailedMapCanvas.width, detailedMapCanvas.height);
    
    if (currentMapImage && currentMapImage !== 'sample') {
        const img = new Image();
        img.onload = function() {
            const scale = Math.min(
                detailedMapCanvas.width / img.width,
                detailedMapCanvas.height / img.height
            );
            const width = img.width * scale;
            const height = img.height * scale;
            const x = (detailedMapCanvas.width - width) / 2;
            const y = (detailedMapCanvas.height - height) / 2;
            
            canvasContext.clearRect(0, 0, detailedMapCanvas.width, detailedMapCanvas.height);
            canvasContext.drawImage(img, x, y, width, height);
        };
        img.onerror = function() {
            console.error('Erro ao carregar imagem para o canvas');
            canvasContext.fillStyle = 'var(--accent-color)';
            canvasContext.fillRect(0, 0, detailedMapCanvas.width, detailedMapCanvas.height);
        };
        img.src = currentMapImage;
    } else {
        canvasContext.fillStyle = 'var(--accent-color)';
        canvasContext.fillRect(0, 0, detailedMapCanvas.width, detailedMapCanvas.height);
    }
}

// Função para desenhar grade
function drawGrid() {
    const gridSize = 50;
    const width = detailedMapCanvas.width;
    const height = detailedMapCanvas.height;
    
    mapGrid.innerHTML = '';
    
    // Linhas verticais
    for (let x = gridSize; x < width; x += gridSize) {
        const line = document.createElement('div');
        line.className = 'grid-line vertical';
        line.style.left = `${x}px`;
        mapGrid.appendChild(line);
        
        const label = document.createElement('div');
        label.className = 'grid-label';
        label.textContent = x;
        label.style.left = `${x}px`;
        label.style.top = '5px';
        mapGrid.appendChild(label);
    }
    
    // Linhas horizontales
    for (let y = gridSize; y < height; y += gridSize) {
        const line = document.createElement('div');
        line.className = 'grid-line horizontal';
        line.style.top = `${y}px`;
        mapGrid.appendChild(line);
        
        const label = document.createElement('div');
        label.className = 'grid-label';
        label.textContent = y;
        label.style.left = '5px';
        label.style.top = `${y}px`;
        mapGrid.appendChild(label);
    }
}

// Função para renderizar pontos no mapa detalhado
function renderDetailedPoints() {
    detailedMapPoints.innerHTML = '';
    
    mapPoints.forEach(point => {
        const detailedPoint = document.createElement('div');
        detailedPoint.className = `detailed-point ${point.type}-point`;
        
        // Converter coordenadas relativas para pixels no canvas
        const pixelX = (point.x / 100) * detailedMapCanvas.width;
        const pixelY = (point.y / 100) * detailedMapCanvas.height;
        
        detailedPoint.style.left = `${pixelX}px`;
        detailedPoint.style.top = `${pixelY}px`;
        detailedPoint.setAttribute('title', point.details.name);
        detailedPoint.setAttribute('data-id', point.id);
        
        if (point.type === 'zero') {
            detailedPoint.innerHTML = '⭐';
        } else {
            detailedPoint.innerHTML = '💜';
        }
        
        detailedPoint.addEventListener('click', () => {
            showArtifactDetails(point);
        });
        
        detailedMapPoints.appendChild(detailedPoint);
    });
}

// Função para lidar com movimento do mouse no canvas
function handleCanvasMouseMove(event) {
    const rect = detailedMapCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    coordinatesDisplay.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
}

// Função para lidar com clique no canvas
function handleCanvasClick(event) {
    if (!addingPointMode) return;
    
    const rect = detailedMapCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Converter para coordenadas relativas (para o mapa principal)
    const relX = (x / detailedMapCanvas.width) * 100;
    const relY = (y / detailedMapCanvas.height) * 100;
    
    if (addingPointMode === 'zero') {
        addZeroPoint(relX, relY);
    } else {
        // O MODAL APARECE IMEDIATAMENTE!
        addCommonPoint(relX, relY);
    }
}

// Função para alternar visibilidade da grade
function toggleGrid() {
    isGridVisible = !isGridVisible;
    mapGrid.style.display = isGridVisible ? 'block' : 'none';
    
    const gridBtn = document.getElementById('btnGridToggle');
    if (isGridVisible) {
        gridBtn.classList.add('active');
        showNotification('Grade ativada');
    } else {
        gridBtn.classList.remove('active');
        showNotification('Grade desativada');
    }
}

// Função para exportar dados
function exportData() {
    try {
        const exportData = {
            mapPoints: mapPoints,
            metadata: {
                exportDate: new Date().toISOString(),
                totalFindings: findingsCount,
                zeroPoints: zeroPointsCount,
                mapImage: currentMapImage ? 'base64_image' : 'sample',
                version: '1.0'
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        // Criar link de download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mapa-colaborativo-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Dados exportados com sucesso!');
    } catch (error) {
        console.error('Erro ao exportar:', error);
        showNotification('Erro ao exportar dados', 'error');
    }
}

// Event Listeners
btnAddMap.addEventListener('click', () => {
    mapModal.style.display = 'flex';
    mapModal.classList.add('active');
});

// Fechar modais
closeMapModal.addEventListener('click', () => {
    mapModal.style.display = 'none';
    mapModal.classList.remove('active');
});

closePointDetailsModal.addEventListener('click', () => {
    pointDetailsModal.style.display = 'none';
    pointDetailsModal.classList.remove('active');
    currentPhoto = null;
    editingPointId = null;
});

cancelPointDetails.addEventListener('click', () => {
    pointDetailsModal.style.display = 'none';
    pointDetailsModal.classList.remove('active');
    currentPhoto = null;
    editingPointId = null;
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === mapModal) {
        mapModal.style.display = 'none';
        mapModal.classList.remove('active');
    }
    if (e.target === pointDetailsModal) {
        pointDetailsModal.style.display = 'none';
        pointDetailsModal.classList.remove('active');
        currentPhoto = null;
        editingPointId = null;
    }
});

// Sistema mínimo de navegação SPA
window.navegarPara = function (id) {
  document.querySelectorAll('.screen').forEach(t => {
    t.classList.remove('active');
    t.style.display = 'none';
  });

  const tela = document.getElementById(id);
  if (tela) {
    tela.classList.add('active');
    tela.style.display = 'block';
    history.pushState({ tela: id }, '', '#' + id);
  }
};

window.voltar = function () {
  history.back();
};
// Patch: iniciar o app no login oficial SEM SPA
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('user')) {
    window.location.href = "screens/Login/LoginScreen.html";
  }
});

window.addEventListener('popstate', event => {
  const id = event.state?.tela || 'tela-login';
  document.querySelectorAll('.screen').forEach(t => {
    t.classList.remove('active');
    t.style.display = 'none';
  });
  const tela = document.getElementById(id);
  if (tela) {
    tela.classList.add('active');
    tela.style.display = 'block';
  }
});

// Opções do modal de mapa
optionGallery.addEventListener('click', openImageGallery);
optionFiles.addEventListener('click', openFileSelector);

// Botões de adição no mapa detalhado
btnAddZeroPoint.addEventListener('click', () => {
    activateAddingMode('zero');
});

btnAddCommonPoint.addEventListener('click', () => {
    activateAddingMode('common');
});

cancelAddMode.addEventListener('click', deactivateAddingMode);

// Input de arquivos
fileInput.addEventListener('change', handleImageSelection);
imageInput.addEventListener('change', handleImageSelection);

// Upload de foto para achados
pointPhoto.addEventListener('change', handlePhotoUpload);

// Sistema de tags
pointTags.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
    });
});

// Navegação por abas
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActiveTab(tab);
        
        if (tab.id === 'tabHome') {
            showNotification('Página inicial');
        } else if (tab.id === 'tabCatalog') {
            showNotification('Catálogo de artefatos');
        } else if (tab.id === 'tabSettings') {
            showNotification('Configurações');
        }
    });
});

// Ferramentas do mapa detalhado
document.getElementById('btnGridToggle').addEventListener('click', toggleGrid);
document.getElementById('btnExport').addEventListener('click', exportData);



// Prevenir comportamento padrão de gestos
document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });