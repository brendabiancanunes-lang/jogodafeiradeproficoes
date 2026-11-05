// Estado do Jogo
let timeLeft = 180; // 3 minutos
let timerInterval = null;
let currentStage = 0;
const evidences = [];

// Iniciar o jogo e o contador de tempo sob pressão
function startGame() {
    currentStage = 1;
    startTimer();
    renderStage();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const sec = String(timeLeft % 60).padStart(2, '0');
        document.getElementById('timer').innerText = `${min}:${sec}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false, "O TEMPO ESGOTOU! A equipe inimiga destruiu a cena do crime.");
        }
    }, 1000);
}

// Gerenciador de Etapas / Ação
function renderStage() {
    const screen = document.getElementById('game-screen');
    const actions = document.getElementById('action-buttons');

    if (currentStage === 1) {
        screen.innerHTML = `
            <h2 class="text-base font-bold text-yellow-500 mb-2">[CENA 1 - CORREDOR PRINCIPAL]</h2>
            <p class="text-xs text-gray-300 mb-4">Você encontra um corpo caído e duas marcas de impacto na parede. Marca de tiro recente!</p>
            <div class="bg-gray-950 p-3 rounded border border-gray-800 text-xs">
                <span class="text-red-400 font-bold">Ação Necessária:</span> Extraia o projétil da parede antes de investigar o terminal de segurança.
            </div>
        `;

        actions.innerHTML = `
            <button onclick="actionCollectProjectile()" class="btn-action bg-red-900/80 hover:bg-red-800 text-white p-2 rounded text-xs font-bold border border-red-700">
                <i class="fa-solid fa-crosshairs"></i> Extrair Projétil (.45 ACP)
            </button>
            <button onclick="actionHackTerminal()" class="btn-action bg-gray-800 hover:bg-gray-700 text-gray-200 p-2 rounded text-xs font-bold border border-gray-700">
                <i class="fa-solid fa-laptop-code"></i> Acessar Servidor de Câmeras
            </button>
        `;
    } 
    else if (currentStage === 2) {
        screen.innerHTML = `
            <h2 class="text-base font-bold text-yellow-500 mb-2">[CENA 2 - SALA DOS SERVIDORES]</h2>
            <p class="text-xs text-gray-300 mb-4">O HD principal está sendo formatado remotamente. Você precisa interceptar a transmissão digitando a chave de cancelamento!</p>
            
            <div class="bg-gray-950 p-3 rounded border border-gray-800 text-xs text-center my-2">
                <p class="text-gray-400 mb-1">CÓDIGO DE INTERCEPTAÇÃO:</p>
                <span class="text-lg font-bold text-green-400 tracking-widest" id="code-target">FORENSIC-99</span>
            </div>
            
            <input type="text" id="code-input" placeholder="Digite o código acima..." class="w-full bg-black border border-gray-700 p-2 rounded text-xs text-center text-yellow-400 font-bold uppercase mb-2">
            <button onclick="verifyCode()" class="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded text-xs font-bold">
                ENVIAR COMANDO DE PARADA
            </button>
        `;
        actions.innerHTML = `<p class="text-xs text-gray-500 col-span-2">Ação focada no terminal acima.</p>`;
    }
}

// Ação: Coleta de Balística
function actionCollectProjectile() {
    evidences.push("Projétil Sub-sônico .45 ACP com estriamento à direita.");
    updateEvidences();
    document.getElementById('ballistics-info').innerHTML = `
        <span class="text-green-400 font-bold">Amostra A-1:</span> Calibre .45 ACP. Compatível apenas com pistolas táticas de uso restrito.
    `;
    currentStage = 2;
    renderStage();
}

// Ação: Hack do Servidor
function actionHackTerminal() {
    evidences.push("Log de Acesso: Login realizado pelo Usuário 'Agente_Viper'.");
    updateEvidences();
    currentStage = 2;
    renderStage();
}

// Verificação do Minigame de Código
function verifyCode() {
    const input = document.getElementById('code-input').value.trim().toUpperCase();
    if (input === 'FORENSIC-99') {
        clearInterval(timerInterval);
        endGame(true, "OPERAÇÃO CONCLUÍDA COM SUCESSO! Você salvou os dados da infraestrutura e identificou o calibre da arma do suspeito.");
    } else {
        alert("CÓDIGO INCORRETO! Tente novamente rápido!");
    }
}

// Atualizar Lista de Evidências na UI
function updateEvidences() {
    const log = document.getElementById('evidence-log');
    log.innerHTML = evidences.map(e => `
        <div class="bg-gray-950 p-2 rounded border border-gray-800 text-yellow-400">
            <i class="fa-solid fa-check text-green-500"></i> ${e}
        </div>
    `).join('');
}

// Fim de Jogo
function endGame(success, message) {
    const screen = document.getElementById('game-screen');
    document.getElementById('action-buttons').innerHTML = '';
    
    screen.innerHTML = `
        <div class="text-center py-6">
            <i class="fa-solid ${success ? 'fa-shield-halved text-green-500' : 'fa-skull text-red-500'} text-5xl mb-4"></i>
            <h2 class="text-xl font-bold ${success ? 'text-green-400' : 'text-red-500'} mb-2">
                ${success ? 'MISSÃO CUMPRIDA' : 'FALHA NA OPERAÇÃO'}
            </h2>
            <p class="text-xs text-gray-300 mb-6">${message}</p>
            <button onclick="location.reload()" class="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded text-xs font-bold border border-gray-600">
                REINICIAR OPERAÇÃO
            </button>
        </div>
    `;
}