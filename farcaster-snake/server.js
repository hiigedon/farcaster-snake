// server.js

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST_URL = process.env.HOST_URL || `http://localhost:${PORT}`;

app.use(express.json());

// Serving file statis dari folder public
app.use(express.static(path.join(__dirname, 'public'))); 

// =========================================================
// FRAME FARCASTER ENDPOINTS
// =========================================================

// 1. Endpoint Frame Utama (GET untuk rendering awal di feed)
app.get('/frame', (req, res) => {
    // Ganti dengan URL gambar Anda yang sebenarnya
    const frameImageUrl = `${HOST_URL}/images/start_screen.png`;

    // HTML dengan metadata Frame
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Farcaster Snake Game</title>
    <meta property="og:title" content="Farcaster Snake Game" />
    <meta property="og:image" content="${frameImageUrl}" />
    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${frameImageUrl}" />
    <meta property="fc:frame:post_url" content="${HOST_URL}/api/action" />
    
    <meta property="fc:frame:button:1" content="Mulai Main 🚀" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${HOST_URL}" />
    
    <meta property="fc:frame:button:2" content="Cek High Score" />
</head>
<body>
    </body>
</html>
    `;
    res.send(html);
});

// 2. Endpoint untuk menangani aksi Frame (POST dari tombol)
app.post('/api/action', (req, res) => {
    // Di sini Anda bisa mengambil data dari req.body jika diperlukan,
    // seperti user ID atau button index yang diklik
    
    const highscoreImageUrl = `${HOST_URL}/images/highscore_screen.png`;
    const latestScore = Math.floor(Math.random() * 100); // Contoh skor (ganti dengan DB asli)

    const highscoreHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>High Score Frame</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${highscoreImageUrl}" />
    <meta property="fc:frame:post_url" content="${HOST_URL}/frame" />
    <meta property="fc:frame:button:1" content="Skor Tertinggi: ${latestScore}" />
    <meta property="fc:frame:button:2" content="Kembali" />
</head>
<body>
</body>
</html>
    `;
    
    res.send(highscoreHtml);
});

// =========================================================

app.listen(PORT, () => {
    console.log(`Server berjalan di ${HOST_URL}`);
});