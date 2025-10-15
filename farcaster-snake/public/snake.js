// public/snake.js

// Konfigurasi Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const TILE_SIZE = 20; 
const GRID_SIZE = canvas.width / TILE_SIZE; 

let snake = [];
let food = {};
let dx = 0; 
let dy = 0; 
let score = 0;
let gameLoopInterval;
let isPlaying = false;

// --- FUNGSI UTAMA GAME ---

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function draw() {
    // 1. Clear Canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Gambar Makanan
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // 3. Gambar Ular
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'lime' : 'green'; 
        ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        // Border
        ctx.strokeStyle = '#333';
        ctx.strokeRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
}

function update() {
    if (!isPlaying) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Cek Game Over (Tabrakan)
    if (
        head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE || 
        checkCollision(head, snake.slice(1)) 
    ) {
        gameOver();
        return;
    }

    // Tambahkan Kepala Baru
    snake.unshift(head);

    // Cek Makan Makanan
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        spawnFood(); 
    } else {
        snake.pop(); // Hapus ekor
    }
}

function checkCollision(head, body) {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    isPlaying = false;
    clearInterval(gameLoopInterval);
    alert(`Game Over! Skor Akhir Anda: ${score}`);
    // Opsi: Panggil init() untuk langsung reset game
}

// Inisialisasi Game
function init() {
    snake = [{ x: 10, y: 10 }];
    dx = 1; 
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `Score: 0`;
    spawnFood();
    isPlaying = true;
    
    // Kecepatan game (100ms per kotak)
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(() => {
        update();
        draw();
    }, 100); 
}

// --- INPUT PENGGUNA ---
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isPlaying && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        init(); // Mulai game saat tombol panah pertama ditekan
    }
    
    // Logika ganti arah
    if (isPlaying) {
        const isMovingHorizontally = dx !== 0;
        const isMovingVertically = dy !== 0;

        switch (key) {
            case 'ArrowUp':
                if (isMovingVertically) return;
                dx = 0;
                dy = -1;
                break;
            case 'ArrowDown':
                if (isMovingVertically) return;
                dx = 0;
                dy = 1;
                break;
            case 'ArrowLeft':
                if (isMovingHorizontally) return;
                dx = -1;
                dy = 0;
                break;
            case 'ArrowRight':
                if (isMovingHorizontally) return;
                dx = 1;
                dy = 0;
                break;
        }
    }
});

// Panggil draw awal sebelum game dimulai
draw();