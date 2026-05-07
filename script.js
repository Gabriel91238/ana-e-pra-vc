const musica = document.getElementById('musica');

function toggleMusica() {
    const btn = document.getElementById('btnMusica');
    if (musica.paused) {
        if (musica.currentTime === 0) musica.currentTime = 60; // Começa em 1:00
        musica.play();
        btn.innerText = "🎵 Som: ON";
    } else {
        musica.pause();
        btn.innerText = "🎵 Som: OFF";
    }
}

function proximaPagina() {
    document.getElementById('pagina1').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('pagina1').style.display = 'none';
        document.getElementById('pagina2').style.display = 'block';
        startParticles(); // Inicia o coração E o texto
        habilitarArrastar();
    }, 1000);
}

function habilitarArrastar() {
    const fotos = document.querySelectorAll('.foto-mural');
    fotos.forEach(foto => {
        let isDragging = false;
        let x, y;
        foto.addEventListener('mousedown', (e) => {
            isDragging = true;
            x = e.clientX - foto.offsetLeft;
            y = e.clientY - foto.offsetTop;
            foto.style.zIndex = 200;
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            foto.style.left = (e.clientX - x) + 'px';
            foto.style.top = (e.clientY - y) + 'px';
        });
        document.addEventListener('mouseup', () => isDragging = false);
    });
}

function startParticles() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // --- Mapeamento do Texto "EU TE AMO, ANA" ---
    // A gente escreve o texto num canvas invisível para saber onde colocar as partículas
    ctx.fillStyle = "white";
    ctx.font = "bold 50px Arial"; // Ajuste o tamanho da fonte se necessário
    ctx.textAlign = "center";
    ctx.fillText("EU TE AMO, ANA", canvas.width / 2, canvas.height / 2 - 150);
    
    // Pega os dados dos pixels do texto
    const textData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Limpa o canvas para começar a animação real
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cria partículas nos pixels onde o texto foi escrito
    for (let y = 0; y < canvas.height; y += 4) { // Pula de 4 em 4 pixels para desempenho
        for (let x = 0; x < canvas.width; x += 4) {
            // Se o pixel for opaco (faz parte do texto)
            if (textData.data[(y * canvas.width + x) * 4 + 3] > 128) {
                particles.push(new Particle(x, y, '#ffffff')); // Texto branco
            }
        }
    }

    // --- Criação das Partículas do Coração ---
    for (let i = 0; i < 1200; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = 15;
        const tx = r * 16 * Math.pow(Math.sin(t), 3);
        const ty = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        // O coração fica um pouco mais para baixo que o texto
        particles.push(new Particle(tx + canvas.width/2, ty + canvas.height/2 + 80, '#ff4d6d'));
    }

    // Classe de Partícula Inteligente
    function Particle(tx, ty, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = tx;
        this.targetY = ty;
        this.color = color;
        this.vx = 0;
        this.vy = 0;

        this.update = function() {
            // Força de atração para o formato final (texto ou coração)
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            this.vx += dx * 0.01;
            this.vy += dy * 0.01;

            // Interação com o Mouse (Efeito Repulsão)
            let mDx = mouse.x - this.x;
            let mDy = mouse.y - this.y;
            let dist = Math.sqrt(mDx*mDx + mDy*mDy);
if (dist < 90) {
                this.vx -= mDx * 0.2;
                this.vy -= mDy * 0.2;
            }

            // Resistência e movimento
            this.vx *= 0.85;
            this.vy *= 0.85;
            this.x += this.vx;
            this.y += this.vy;
        };

        this.draw = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.3, 0, Math.PI * 2);
            ctx.fill();
        };
    }

    // Loop de Animação Principal
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Fundo preto semi-transparente para rastro
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
