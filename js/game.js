const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const menuBallCanvas = document.getElementById('menuBallCanvas');
        const menuBallCtx = menuBallCanvas.getContext('2d');

        const scoreEl = document.getElementById('scoreDisplay');
        const livesContainer = document.getElementById('livesContainer');
        const menuScreen = document.getElementById('menuScreen');
        const levelScreen = document.getElementById('levelScreen');
        const storeScreen = document.getElementById('storeScreen');
        const storeBalanceEl = document.getElementById('storeBalance');
        const levelGrid = document.getElementById('levelGrid');
        const storeGrid = document.getElementById('storeGrid');
        const hud = document.getElementById('hud');
        const mobileControls = document.getElementById('mobileControls');
        const playBtn = document.getElementById('playBtn');
        const backToMenuFromLevels = document.getElementById('backToMenuFromLevels');
        const backToMenuFromStore = document.getElementById('backToMenuFromStore');
        const exitBtn = document.getElementById('exitBtn');
        const finalScoreContainer = document.getElementById('finalScoreContainer');
        const finalScoreEl = document.getElementById('finalScore');
        const settingsBtnMenu = document.getElementById('settingsBtnMenu');
        const storeBtnMenu = document.getElementById('storeBtnMenu');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');
        const levelCompleteText = document.getElementById('levelCompleteText');
        const selectLevelText = document.getElementById('selectLevelText');
        const storeTitle = document.getElementById('storeTitle');
        const balanceText = document.getElementById('balanceText');
        const settingsTitle = document.getElementById('settingsTitle');
        const langLabel = document.getElementById('langLabel');
        const musicLabel = document.getElementById('musicLabel');
        const soundLabel = document.getElementById('soundLabel');
        const moodLabel = document.getElementById('moodLabel');
        const completedCountEl = document.getElementById('completedCount');
        const langSelect = document.getElementById('langSelect');
        const musicToggle = document.getElementById('musicToggle');
        const soundToggle = document.getElementById('soundToggle');
        const moodSelect = document.getElementById('moodSelect');
        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');
        const btnJump = document.getElementById('btnJump');

        const GRAVITY = 0.6, FRICTION = 0.85, MOVE_SPEED = 0.8, MAX_SPEED = 9, JUMP_FORCE = -15;

        let gameState = 'MENU', currentLevelIdx = 0, totalMoney = 0, levelScore = 0, lives = 3, frameCount = 0, cameraX = 0, unlockedLevels = 10, lastGameResult = 'PLAY', currentStoreTab = 'colors';
        let completedLevels = new Set();

        let playerConfig = {
            color: '#3b82f6', colorType: 'solid', gradientColors: null, defaultMood: 'HAPPY',
            accessories: { glasses: false, hat: false, headphones: false, bowtie: false, crown: false, cape: false, wings: false, mask: false, halo: false, horns: false, monocle: false, bandana: false }
        };

        let inventory = { colors: [{id:'blue', type:'solid', value:'#3b82f6'}], accessories: [], creatures: ['ball'] };
        const keys = { ArrowLeft: false, ArrowRight: false, Space: false, ArrowUp: false, KeyW: false, KeyA: false, KeyD: false };

        const translations = {
            en: { play: "PLAY", nextLevel: "NEXT LEVEL", playAgain: "PLAY AGAIN", levelComplete: "Level Complete!", gameOver: "Game Over", selectLevel: "SELECT LEVEL", back: "BACK", store: "STORE", settings: "SETTINGS", balance: "Balance", language: "Language", music: "Music", sound: "SFX", mood: "Default Mood", owned: "OWNED", buy: "BUY", equip: "EQUIP", unequip: "REMOVE", completed: "COMPLETED" },
            es: { play: "JUGAR", nextLevel: "SIGUIENTE", playAgain: "REINTENTAR", levelComplete: "¡Nivel Completado!", gameOver: "Fin del Juego", selectLevel: "SELECCIONAR NIVEL", back: "ATRÁS", store: "TIENDA", settings: "AJUSTES", balance: "Saldo", language: "Idioma", music: "Música", sound: "Sonido", mood: "Estado de Ánimo", owned: "COMPRADO", buy: "COMPRAR", equip: "USAR", unequip: "QUITAR", completed: "COMPLETADO" },
            fr: { play: "JOUER", nextLevel: "SUIVANT", playAgain: "REJOUER", levelComplete: "Niveau Terminé!", gameOver: "Partie Terminée", selectLevel: "CHOISIR NIVEAU", back: "RETOUR", store: "BOUTIQUE", settings: "PARAMÈTRES", balance: "Solde", language: "Langue", music: "Musique", sound: "Son", mood: "Humeur", owned: "ACHETÉ", buy: "ACHETER", equip: "ÉQUIPER", unequip: "RETIRER", completed: "TERMINÉ" },
            de: { play: "SPIELEN", nextLevel: "WEITER", playAgain: "NOCHMAL", levelComplete: "Level Abgeschlossen!", gameOver: "Spiel Vorbei", selectLevel: "LEVEL WÄHLEN", back: "ZURÜCK", store: "LADEN", settings: "EINSTELLUNGEN", balance: "Guthaben", language: "Sprache", music: "Musik", sound: "Ton", mood: "Stimmung", owned: "GEKAUFT", buy: "KAUFEN", equip: "ANLEGEN", unequip: "ABLEGEN", completed: "ABGESCHLOSSEN" },
            jp: { play: "プレイ", nextLevel: "次へ", playAgain: "もう一度", levelComplete: "レベルクリア！", gameOver: "ゲームオーバー", selectLevel: "レベル選択", back: "戻る", store: "ストア", settings: "設定", balance: "残高", language: "言語", music: "音楽", sound: "効果音", mood: "気分", owned: "所持済み", buy: "購入", equip: "装着", unequip: "外す", completed: "クリア済み" }
        };
        let currentLang = 'en';

        const storeItems = {
            colors: [
                { id: 'c_red', type: 'solid', name: 'Crimson Red', price: 100, value: '#ef4444', preview: ['#ef4444'] },
                { id: 'c_green', type: 'solid', name: 'Neon Green', price: 150, value: '#22c55e', preview: ['#22c55e'] },
                { id: 'c_gold', type: 'solid', name: 'Royal Gold', price: 300, value: '#eab308', preview: ['#eab308'] },
                { id: 'c_purple', type: 'solid', name: 'Mystic Purple', price: 200, value: '#a855f7', preview: ['#a855f7'] },
                { id: 'c_pink', type: 'solid', name: 'Hot Pink', price: 200, value: '#ec4899', preview: ['#ec4899'] },
                { id: 'c_cyan', type: 'solid', name: 'Electric Cyan', price: 150, value: '#06b6d4', preview: ['#06b6d4'] },
                { id: 'c_orange', type: 'solid', name: 'Sunset Orange', price: 150, value: '#f97316', preview: ['#f97316'] },
                { id: 'c_white', type: 'solid', name: 'Pure White', price: 250, value: '#f8fafc', preview: ['#f8fafc'] },
                { id: 'c_black', type: 'solid', name: 'Void Black', price: 250, value: '#1e293b', preview: ['#1e293b'] },
                { id: 'c_lime', type: 'solid', name: 'Acid Lime', price: 180, value: '#84cc16', preview: ['#84cc16'] },
                { id: 'g_fire', type: 'gradient', name: 'Fire Storm', price: 500, value: {colors: ['#fbbf24','#ef4444','#7f1d1d']}, preview: ['#fbbf24','#ef4444','#7f1d1d'] },
                { id: 'g_ice', type: 'gradient', name: 'Frozen Ice', price: 500, value: {colors: ['#e0f2fe','#38bdf8','#1e40af']}, preview: ['#e0f2fe','#38bdf8','#1e40af'] },
                { id: 'g_rainbow', type: 'gradient', name: 'Rainbow', price: 800, value: {colors: ['#ef4444','#eab308','#22c55e','#3b82f6','#a855f7']}, preview: ['#ef4444','#eab308','#22c55e','#3b82f6','#a855f7'] },
                { id: 'g_neon', type: 'gradient', name: 'Neon Glow', price: 600, value: {colors: ['#06b6d4','#a855f7','#ec4899']}, preview: ['#06b6d4','#a855f7','#ec4899'] },
                { id: 'g_sunset', type: 'gradient', name: 'Sunset', price: 550, value: {colors: ['#fbbf24','#f97316','#ec4899']}, preview: ['#fbbf24','#f97316','#ec4899'] },
                { id: 'g_ocean', type: 'gradient', name: 'Deep Ocean', price: 600, value: {colors: ['#0ea5e9','#1e40af','#0f172a']}, preview: ['#0ea5e9','#1e40af','#0f172a'] },
                { id: 'g_forest', type: 'gradient', name: 'Forest', price: 500, value: {colors: ['#84cc16','#166534','#14532d']}, preview: ['#84cc16','#166534','#14532d'] },
                { id: 'g_galaxy', type: 'gradient', name: 'Galaxy', price: 900, value: {colors: ['#a855f7','#6366f1','#1e1b4b']}, preview: ['#a855f7','#6366f1','#1e1b4b'] },
                { id: 'g_lava', type: 'gradient', name: 'Lava Flow', price: 700, value: {colors: ['#fde047','#dc2626','#450a0a']}, preview: ['#fde047','#dc2626','#450a0a'] },
                { id: 'g_mint', type: 'gradient', name: 'Mint Fresh', price: 450, value: {colors: ['#a7f3d0','#10b981','#064e3b']}, preview: ['#a7f3d0','#10b981','#064e3b'] },
            ],
            accessories: [
                { id: 'a_glasses', type: 'accessory', name: 'Sunglasses', price: 150, value: 'glasses', icon: '🕶️' },
                { id: 'a_hat', type: 'accessory', name: 'Top Hat', price: 200, value: 'hat', icon: '🎩' },
                { id: 'a_headphones', type: 'accessory', name: 'Headphones', price: 250, value: 'headphones', icon: '🎧' },
                { id: 'a_bowtie', type: 'accessory', name: 'Bow Tie', price: 100, value: 'bowtie', icon: '🎀' },
                { id: 'a_crown', type: 'accessory', name: 'Royal Crown', price: 500, value: 'crown', icon: '👑' },
                { id: 'a_cape', type: 'accessory', name: 'Hero Cape', price: 400, value: 'cape', icon: '🦸' },
                { id: 'a_wings', type: 'accessory', name: 'Angel Wings', price: 600, value: 'wings', icon: '🪽' },
                { id: 'a_mask', type: 'accessory', name: 'Ninja Mask', price: 350, value: 'mask', icon: '🥷' },
                { id: 'a_monocle', type: 'accessory', name: 'Monocle', price: 300, value: 'monocle', icon: '🧐' },
                { id: 'a_halo', type: 'accessory', name: 'Golden Halo', price: 700, value: 'halo', icon: '😇' },
                { id: 'a_horns', type: 'accessory', name: 'Devil Horns', price: 450, value: 'horns', icon: '😈' },
                { id: 'a_bandana', type: 'accessory', name: 'Bandana', price: 180, value: 'bandana', icon: '🏴‍☠️' },
            ],
            creatures: [
                { id: 'cr_ball', type: 'creature', name: 'Red Ball', price: 0, value: 'ball', icon: '🔴', owned: true },
                { id: 'cr_spike', type: 'creature', name: 'Spike Beast', price: 200, value: 'spike', icon: '🔺' },
                { id: 'cr_ghost', type: 'creature', name: 'Green Ghost', price: 250, value: 'ghost', icon: '👻' },
                { id: 'cr_robot', type: 'creature', name: 'Cyber Bot', price: 300, value: 'robot', icon: '🤖' },
                { id: 'cr_skull', type: 'creature', name: 'Skull Lord', price: 350, value: 'skull', icon: '💀' },
                { id: 'cr_bat', type: 'creature', name: 'Shadow Bat', price: 400, value: 'bat', icon: '🦇' },
                { id: 'cr_snake', type: 'creature', name: 'Toxic Snake', price: 450, value: 'snake', icon: '🐍' },
                { id: 'cr_crab', type: 'creature', name: 'Lava Crab', price: 500, value: 'crab', icon: '🦀' },
            ]
        };

        // FIXED LEVELS: Enemy Y positions corrected to sit properly on platforms (y = platform.y - 20)
        const levels = [
            { id: 1, name: "Neon Dawn", difficulty: "Easy", theme: 1, winX: 3500,
              platforms: [{x:-100,y:500,w:900,h:200},{x:900,y:480,w:200,h:20},{x:1200,y:450,w:200,h:20},{x:1500,y:420,w:200,h:20},{x:1800,y:450,w:300,h:20},{x:2200,y:420,w:200,h:20},{x:2500,y:400,w:300,h:20},{x:2900,y:380,w:200,h:20},{x:3200,y:400,w:400,h:20}],
              hazards: [],
              enemies: [{x:1300,y:430,range:80,type:'ball'}],
              coins: [{x:400,y:450},{x:1000,y:430},{x:1600,y:370},{x:2000,y:400},{x:2600,y:350},{x:3000,y:330}] },
            { id: 2, name: "Cyber Streets", difficulty: "Easy", theme: 1, winX: 4500,
              platforms: [{x:-100,y:500,w:700,h:200},{x:800,y:470,w:200,h:20},{x:1100,y:440,w:200,h:20},{x:1400,y:410,w:250,h:20},{x:1750,y:440,w:300,h:20},{x:2150,y:410,w:200,h:20},{x:2450,y:380,w:200,h:20},{x:2750,y:410,w:300,h:20},{x:3150,y:380,w:200,h:20},{x:3450,y:350,w:200,h:20},{x:3750,y:380,w:300,h:20},{x:4150,y:400,w:400,h:20}],
              hazards: [{x:1650,y:550,w:100,h:50}],
              enemies: [{x:1500,y:390,range:120,type:'ball'},{x:2850,y:390,range:150,type:'spike'}],
              coins: [{x:500,y:450},{x:900,y:420},{x:1200,y:390},{x:1850,y:390},{x:2250,y:360},{x:2550,y:330},{x:3250,y:330},{x:3550,y:300},{x:3850,y:330}] },
            { id: 3, name: "Sky High", difficulty: "Medium", theme: 1, winX: 5500,
              platforms: [{x:-100,y:500,w:600,h:200},{x:700,y:460,w:150,h:20},{x:950,y:420,w:150,h:20},{x:1200,y:380,w:150,h:20},{x:1450,y:420,w:200,h:20},{x:1750,y:380,w:150,h:20},{x:2000,y:340,w:150,h:20},{x:2250,y:300,w:200,h:20},{x:2550,y:340,w:150,h:20},{x:2800,y:380,w:200,h:20},{x:3100,y:340,w:150,h:20},{x:3350,y:300,w:150,h:20},{x:3600,y:260,w:200,h:20},{x:3900,y:300,w:200,h:20},{x:4200,y:340,w:200,h:20},{x:4500,y:380,w:200,h:20},{x:4800,y:420,w:300,h:20},{x:5200,y:400,w:400,h:20}],
              hazards: [{x:1650,y:550,w:100,h:50},{x:2700,y:550,w:100,h:50}],
              enemies: [{x:1500,y:400,range:100,type:'spike'},{x:2300,y:280,range:100,type:'ghost'},{x:3650,y:240,range:100,type:'robot'},{x:4900,y:400,range:150,type:'ball'}],
              coins: [{x:400,y:450},{x:800,y:410},{x:1050,y:370},{x:1300,y:330},{x:1850,y:330},{x:2100,y:290},{x:2650,y:290},{x:2900,y:330},{x:3200,y:290},{x:3450,y:250},{x:4000,y:250},{x:4300,y:290},{x:4600,y:330},{x:4900,y:370}] },
            { id: 4, name: "Neon Rush", difficulty: "Medium", theme: 1, winX: 6500,
              platforms: [{x:-100,y:500,w:500,h:200},{x:600,y:460,w:120,h:20},{x:820,y:420,w:120,h:20},{x:1040,y:380,w:120,h:20},{x:1260,y:340,w:150,h:20},{x:1510,y:380,w:120,h:20},{x:1730,y:420,w:120,h:20},{x:1950,y:380,w:200,h:20},{x:2250,y:340,w:120,h:20},{x:2470,y:300,w:120,h:20},{x:2690,y:260,w:150,h:20},{x:2940,y:300,w:120,h:20},{x:3160,y:340,w:120,h:20},{x:3380,y:380,w:200,h:20},{x:3680,y:340,w:120,h:20},{x:3900,y:300,w:120,h:20},{x:4120,y:260,w:150,h:20},{x:4370,y:300,w:120,h:20},{x:4590,y:340,w:120,h:20},{x:4810,y:380,w:200,h:20},{x:5110,y:340,w:150,h:20},{x:5360,y:300,w:150,h:20},{x:5610,y:340,w:200,h:20},{x:5910,y:380,w:200,h:20},{x:6200,y:400,w:400,h:20}],
              hazards: [{x:1410,y:550,w:100,h:50},{x:2150,y:550,w:100,h:50},{x:3580,y:550,w:100,h:50}],
              enemies: [{x:1300,y:320,range:80,type:'spike'},{x:2000,y:360,range:100,type:'ghost'},{x:2750,y:240,range:80,type:'robot'},{x:3450,y:360,range:120,type:'skull'},{x:4850,y:360,range:100,type:'ball'},{x:5650,y:320,range:100,type:'spike'}],
              coins: [{x:300,y:450},{x:700,y:410},{x:920,y:370},{x:1140,y:330},{x:1600,y:330},{x:1830,y:370},{x:2350,y:290},{x:2570,y:250},{x:3040,y:250},{x:3260,y:290},{x:3780,y:290},{x:4000,y:250},{x:4470,y:250},{x:4690,y:290},{x:5200,y:290},{x:5450,y:250},{x:5700,y:290},{x:6000,y:330}] },
            { id: 5, name: "City Core", difficulty: "Hard", theme: 1, winX: 7500,
              platforms: [{x:-100,y:500,w:400,h:200},{x:400,y:460,w:100,h:20},{x:600,y:420,w:100,h:20},{x:800,y:380,w:100,h:20},{x:1000,y:340,w:100,h:20},{x:1200,y:380,w:100,h:20},{x:1400,y:420,w:150,h:20},{x:1650,y:380,w:100,h:20},{x:1850,y:340,w:100,h:20},{x:2050,y:300,w:100,h:20},{x:2250,y:260,w:100,h:20},{x:2450,y:300,w:150,h:20},{x:2700,y:340,w:100,h:20},{x:2900,y:380,w:100,h:20},{x:3100,y:340,w:100,h:20},{x:3300,y:300,w:100,h:20},{x:3500,y:260,w:100,h:20},{x:3700,y:220,w:100,h:20},{x:3900,y:260,w:150,h:20},{x:4150,y:300,w:100,h:20},{x:4350,y:340,w:100,h:20},{x:4550,y:380,w:100,h:20},{x:4750,y:340,w:100,h:20},{x:4950,y:300,w:100,h:20},{x:5150,y:260,w:100,h:20},{x:5350,y:300,w:150,h:20},{x:5600,y:340,w:100,h:20},{x:5800,y:380,w:100,h:20},{x:6000,y:420,w:150,h:20},{x:6250,y:380,w:150,h:20},{x:6500,y:340,w:150,h:20},{x:6750,y:380,w:200,h:20},{x:7050,y:400,w:500,h:20}],
              hazards: [{x:500,y:550,w:100,h:50},{x:1550,y:550,w:100,h:50},{x:2600,y:550,w:100,h:50},{x:4050,y:550,w:100,h:50},{x:5500,y:550,w:100,h:50}],
              enemies: [{x:1050,y:320,range:50,type:'robot'},{x:2100,y:280,range:50,type:'ghost'},{x:3550,y:240,range:50,type:'spike'},{x:4800,y:320,range:50,type:'skull'},{x:5200,y:240,range:50,type:'robot'},{x:6300,y:360,range:80,type:'ghost'},{x:6800,y:360,range:100,type:'skull'}],
              coins: [{x:200,y:450},{x:500,y:410},{x:700,y:370},{x:900,y:330},{x:1300,y:330},{x:1500,y:370},{x:1750,y:330},{x:1950,y:290},{x:2150,y:250},{x:2550,y:250},{x:2800,y:290},{x:3000,y:330},{x:3200,y:290},{x:3400,y:250},{x:3600,y:210},{x:4000,y:210},{x:4250,y:250},{x:4450,y:290},{x:4650,y:330},{x:4850,y:290},{x:5050,y:250},{x:5250,y:210},{x:5700,y:290},{x:5900,y:330},{x:6100,y:370},{x:6350,y:330},{x:6600,y:290},{x:6850,y:330},{x:7200,y:350}] },
            { id: 6, name: "Dark Woods", difficulty: "Easy", theme: 2, winX: 5000,
              platforms: [{x:-100,y:500,w:700,h:200},{x:700,y:470,w:200,h:20},{x:1000,y:440,w:200,h:20},{x:1300,y:410,w:200,h:20},{x:1600,y:440,w:250,h:20},{x:1950,y:410,w:200,h:20},{x:2250,y:380,w:200,h:20},{x:2550,y:410,w:250,h:20},{x:2900,y:380,w:200,h:20},{x:3200,y:350,w:200,h:20},{x:3500,y:380,w:250,h:20},{x:3850,y:410,w:200,h:20},{x:4150,y:440,w:250,h:20},{x:4500,y:420,w:600,h:20}],
              hazards: [{x:1850,y:550,w:100,h:50}],
              enemies: [{x:1400,y:390,range:120,type:'ghost'},{x:2650,y:390,range:150,type:'skull'},{x:3950,y:390,range:100,type:'ball'}],
              coins: [{x:400,y:450},{x:800,y:420},{x:1100,y:390},{x:1400,y:360},{x:1700,y:390},{x:2050,y:360},{x:2350,y:330},{x:2650,y:360},{x:3000,y:330},{x:3300,y:300},{x:3600,y:330},{x:3950,y:360},{x:4250,y:390}] },
            { id: 7, name: "Swamp Path", difficulty: "Medium", theme: 2, winX: 6500,
              platforms: [{x:-100,y:500,w:500,h:200},{x:600,y:460,w:150,h:20},{x:850,y:420,w:150,h:20},{x:1100,y:380,w:150,h:20},{x:1350,y:420,w:200,h:20},{x:1650,y:380,w:150,h:20},{x:1900,y:340,w:150,h:20},{x:2150,y:300,w:200,h:20},{x:2450,y:340,w:150,h:20},{x:2700,y:380,w:150,h:20},{x:2950,y:340,w:150,h:20},{x:3200,y:300,w:200,h:20},{x:3500,y:340,w:150,h:20},{x:3750,y:380,w:150,h:20},{x:4000,y:340,w:150,h:20},{x:4250,y:300,w:200,h:20},{x:4550,y:340,w:150,h:20},{x:4800,y:380,w:150,h:20},{x:5050,y:420,w:200,h:20},{x:5350,y:380,w:200,h:20},{x:5650,y:420,w:300,h:20},{x:6050,y:400,w:500,h:20}],
              hazards: [{x:1550,y:550,w:100,h:50},{x:2350,y:550,w:100,h:50},{x:3400,y:550,w:100,h:50},{x:4450,y:550,w:100,h:50}],
              enemies: [{x:1400,y:400,range:120,type:'spike'},{x:2200,y:280,range:100,type:'robot'},{x:3250,y:280,range:100,type:'ghost'},{x:4300,y:280,range:100,type:'skull'},{x:5450,y:360,range:120,type:'ball'},{x:5750,y:400,range:150,type:'spike'}],
              coins: [{x:300,y:450},{x:700,y:410},{x:950,y:370},{x:1200,y:330},{x:1450,y:370},{x:1750,y:330},{x:2000,y:290},{x:2550,y:290},{x:2800,y:330},{x:3050,y:290},{x:3300,y:250},{x:3600,y:290},{x:3850,y:330},{x:4100,y:290},{x:4350,y:250},{x:4650,y:290},{x:4900,y:330},{x:5150,y:370},{x:5450,y:330},{x:5750,y:370},{x:6200,y:350}] },
            // FIXED LEVEL 8: Corrected Y positions for enemies at x:3350, x:4600, x:5650
            { id: 8, name: "Ancient Ruins", difficulty: "Hard", theme: 2, winX: 7500,
              platforms: [{x:-100,y:500,w:400,h:200},{x:400,y:460,w:100,h:20},{x:600,y:420,w:100,h:20},{x:800,y:380,w:100,h:20},{x:1000,y:340,w:100,h:20},{x:1200,y:300,w:150,h:20},{x:1450,y:340,w:100,h:20},{x:1650,y:380,w:100,h:20},{x:1850,y:340,w:100,h:20},{x:2050,y:300,w:100,h:20},{x:2250,y:260,w:100,h:20},{x:2450,y:300,w:150,h:20},{x:2700,y:340,w:100,h:20},{x:2900,y:300,w:100,h:20},{x:3100,y:260,w:100,h:20},{x:3300,y:220,w:100,h:20},{x:3500,y:260,w:150,h:20},{x:3750,y:300,w:100,h:20},{x:3950,y:340,w:100,h:20},{x:4150,y:300,w:100,h:20},{x:4350,y:260,w:100,h:20},{x:4550,y:220,w:100,h:20},{x:4750,y:260,w:150,h:20},{x:5000,y:300,w:100,h:20},{x:5200,y:340,w:100,h:20},{x:5400,y:300,w:100,h:20},{x:5600,y:260,w:100,h:20},{x:5800,y:300,w:150,h:20},{x:6050,y:340,w:100,h:20},{x:6250,y:380,w:100,h:20},{x:6450,y:340,w:150,h:20},{x:6700,y:380,w:200,h:20},{x:7000,y:400,w:600,h:20}],
              hazards: [{x:500,y:550,w:100,h:50},{x:1350,y:550,w:100,h:50},{x:2600,y:550,w:100,h:50},{x:3650,y:550,w:100,h:50},{x:4900,y:550,w:100,h:50},{x:6150,y:550,w:100,h:50}],
              enemies: [{x:1050,y:320,range:50,type:'robot'},{x:2100,y:280,range:50,type:'skull'},{x:3350,y:200,range:50,type:'ghost'},{x:4600,y:200,range:50,type:'spike'},{x:5650,y:240,range:50,type:'robot'},{x:6500,y:320,range:80,type:'skull'},{x:6800,y:360,range:100,type:'ghost'},{x:7100,y:380,range:150,type:'spike'}],
              coins: [{x:200,y:450},{x:500,y:410},{x:700,y:370},{x:900,y:330},{x:1100,y:290},{x:1300,y:250},{x:1550,y:290},{x:1750,y:330},{x:1950,y:290},{x:2150,y:250},{x:2350,y:210},{x:2800,y:290},{x:3000,y:250},{x:3200,y:210},{x:3400,y:170},{x:3850,y:250},{x:4050,y:290},{x:4250,y:250},{x:4450,y:210},{x:4650,y:170},{x:5100,y:250},{x:5300,y:290},{x:5500,y:250},{x:5700,y:210},{x:5900,y:250},{x:6150,y:290},{x:6350,y:330},{x:6550,y:290},{x:6800,y:330},{x:7100,y:350}] },
            { id: 9, name: "Twilight Zone", difficulty: "Very Hard", theme: 2, winX: 8500,
              platforms: [{x:-100,y:500,w:350,h:200},{x:350,y:460,w:80,h:20},{x:530,y:420,w:80,h:20},{x:710,y:380,w:80,h:20},{x:890,y:340,w:80,h:20},{x:1070,y:300,w:120,h:20},{x:1290,y:340,w:80,h:20},{x:1470,y:380,w:80,h:20},{x:1650,y:340,w:80,h:20},{x:1830,y:300,w:80,h:20},{x:2010,y:260,w:80,h:20},{x:2190,y:300,w:120,h:20},{x:2410,y:340,w:80,h:20},{x:2590,y:300,w:80,h:20},{x:2770,y:260,w:80,h:20},{x:2950,y:220,w:80,h:20},{x:3130,y:260,w:120,h:20},{x:3350,y:300,w:80,h:20},{x:3530,y:340,w:80,h:20},{x:3710,y:300,w:80,h:20},{x:3890,y:260,w:80,h:20},{x:4070,y:220,w:80,h:20},{x:4250,y:260,w:120,h:20},{x:4470,y:300,w:80,h:20},{x:4650,y:340,w:80,h:20},{x:4830,y:300,w:80,h:20},{x:5010,y:260,w:80,h:20},{x:5190,y:220,w:80,h:20},{x:5370,y:260,w:120,h:20},{x:5590,y:300,w:80,h:20},{x:5770,y:340,w:80,h:20},{x:5950,y:300,w:80,h:20},{x:6130,y:260,w:80,h:20},{x:6310,y:300,w:120,h:20},{x:6530,y:340,w:80,h:20},{x:6710,y:380,w:80,h:20},{x:6890,y:340,w:80,h:20},{x:7070,y:300,w:80,h:20},{x:7250,y:340,w:120,h:20},{x:7470,y:380,w:120,h:20},{x:7690,y:420,w:200,h:20},{x:7990,y:400,w:600,h:20}],
              hazards: [{x:430,y:550,w:100,h:50},{x:1190,y:550,w:100,h:50},{x:2310,y:550,w:100,h:50},{x:3250,y:550,w:100,h:50},{x:4370,y:550,w:100,h:50},{x:5490,y:550,w:100,h:50},{x:6430,y:550,w:100,h:50},{x:7370,y:550,w:100,h:50}],
              enemies: [{x:1120,y:280,range:50,type:'skull'},{x:2240,y:280,range:50,type:'robot'},{x:3180,y:240,range:50,type:'ghost'},{x:4300,y:240,range:50,type:'spike'},{x:5420,y:240,range:50,type:'skull'},{x:6360,y:280,range:50,type:'robot'},{x:7120,y:280,range:50,type:'ghost'},{x:7520,y:360,range:60,type:'spike'},{x:7740,y:400,range:100,type:'skull'},{x:8100,y:380,range:150,type:'robot'}],
              coins: [{x:150,y:450},{x:430,y:410},{x:610,y:370},{x:790,y:330},{x:970,y:290},{x:1150,y:250},{x:1370,y:290},{x:1550,y:330},{x:1730,y:290},{x:1910,y:250},{x:2090,y:210},{x:2490,y:290},{x:2670,y:250},{x:2850,y:210},{x:3030,y:170},{x:3430,y:250},{x:3610,y:290},{x:3790,y:250},{x:3970,y:210},{x:4150,y:170},{x:4550,y:250},{x:4730,y:290},{x:4910,y:250},{x:5090,y:210},{x:5270,y:170},{x:5670,y:250},{x:5850,y:290},{x:6030,y:250},{x:6210,y:210},{x:6610,y:290},{x:6790,y:330},{x:6970,y:290},{x:7150,y:250},{x:7350,y:290},{x:7570,y:330},{x:7790,y:370},{x:8100,y:350}] },
            // FIXED LEVEL 10: Corrected Y position for enemy at x:7700
            { id: 10, name: "Shadow Realm", difficulty: "EXTREME", theme: 2, winX: 9500,
              platforms: [{x:-100,y:500,w:300,h:200},{x:300,y:460,w:70,h:20},{x:470,y:420,w:70,h:20},{x:640,y:380,w:70,h:20},{x:810,y:340,w:70,h:20},{x:980,y:300,w:70,h:20},{x:1150,y:260,w:100,h:20},{x:1350,y:300,w:70,h:20},{x:1520,y:340,w:70,h:20},{x:1690,y:300,w:70,h:20},{x:1860,y:260,w:70,h:20},{x:2030,y:220,w:70,h:20},{x:2200,y:260,w:100,h:20},{x:2400,y:300,w:70,h:20},{x:2570,y:260,w:70,h:20},{x:2740,y:220,w:70,h:20},{x:2910,y:180,w:70,h:20},{x:3080,y:220,w:100,h:20},{x:3280,y:260,w:70,h:20},{x:3450,y:300,w:70,h:20},{x:3620,y:260,w:70,h:20},{x:3790,y:220,w:70,h:20},{x:3960,y:180,w:70,h:20},{x:4130,y:220,w:100,h:20},{x:4330,y:260,w:70,h:20},{x:4500,y:300,w:70,h:20},{x:4670,y:260,w:70,h:20},{x:4840,y:220,w:70,h:20},{x:5010,y:180,w:70,h:20},{x:5180,y:220,w:100,h:20},{x:5380,y:260,w:70,h:20},{x:5550,y:300,w:70,h:20},{x:5720,y:260,w:70,h:20},{x:5890,y:220,w:70,h:20},{x:6060,y:260,w:100,h:20},{x:6260,y:300,w:70,h:20},{x:6430,y:340,w:70,h:20},{x:6600,y:300,w:70,h:20},{x:6770,y:260,w:70,h:20},{x:6940,y:300,w:100,h:20},{x:7140,y:340,w:70,h:20},{x:7310,y:300,w:70,h:20},{x:7480,y:260,w:70,h:20},{x:7650,y:300,w:100,h:20},{x:7850,y:340,w:70,h:20},{x:8020,y:380,w:70,h:20},{x:8190,y:340,w:70,h:20},{x:8360,y:380,w:100,h:20},{x:8560,y:420,w:150,h:20},{x:8810,y:400,w:800,h:20}],
              hazards: [{x:370,y:550,w:100,h:50},{x:1250,y:550,w:100,h:50},{x:2300,y:550,w:100,h:50},{x:3180,y:550,w:100,h:50},{x:4230,y:550,w:100,h:50},{x:5280,y:550,w:100,h:50},{x:6160,y:550,w:100,h:50},{x:7040,y:550,w:100,h:50},{x:7750,y:550,w:100,h:50},{x:8460,y:550,w:100,h:50}],
              enemies: [{x:1200,y:240,range:40,type:'skull'},{x:2250,y:240,range:40,type:'robot'},{x:3130,y:200,range:40,type:'ghost'},{x:4180,y:200,range:40,type:'spike'},{x:5230,y:200,range:40,type:'skull'},{x:6110,y:240,range:40,type:'robot'},{x:6990,y:280,range:40,type:'ghost'},{x:7700,y:280,range:40,type:'spike'},{x:8410,y:360,range:40,type:'skull'},{x:8610,y:400,range:60,type:'robot'},{x:8900,y:380,range:100,type:'ghost'},{x:9200,y:380,range:150,type:'spike'}],
              coins: [{x:100,y:450},{x:370,y:410},{x:540,y:370},{x:710,y:330},{x:880,y:290},{x:1050,y:250},{x:1200,y:210},{x:1400,y:250},{x:1590,y:290},{x:1760,y:250},{x:1930,y:210},{x:2100,y:170},{x:2450,y:250},{x:2640,y:210},{x:2810,y:170},{x:2980,y:130},{x:3330,y:210},{x:3520,y:250},{x:3690,y:210},{x:3860,y:170},{x:4030,y:130},{x:4380,y:210},{x:4570,y:250},{x:4740,y:210},{x:4910,y:170},{x:5080,y:130},{x:5430,y:210},{x:5620,y:250},{x:5790,y:210},{x:5960,y:170},{x:6310,y:250},{x:6500,y:290},{x:6670,y:250},{x:6840,y:210},{x:7190,y:290},{x:7380,y:250},{x:7550,y:210},{x:7900,y:290},{x:8090,y:330},{x:8260,y:290},{x:8410,y:330},{x:8610,y:370},{x:8900,y:350},{x:9200,y:350}] }
        ];

        const AudioSys = {
            ctx: null, enabled: true, musicEnabled: true,
            init: function() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); },
            playTone: function(freq, type, duration, vol = 0.1, delay = 0) {
                if (!this.enabled || !this.ctx) return;
                const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
                osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
                gain.gain.setValueAtTime(vol, this.ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(this.ctx.currentTime + delay); osc.stop(this.ctx.currentTime + delay + duration);
            },
            click: function() { if(this.enabled) this.playTone(800, 'sine', 0.05, 0.05); },
            buy: function() { if(!this.enabled) return; this.playTone(600, 'sine', 0.1, 0.1, 0); this.playTone(900, 'sine', 0.1, 0.1, 0.1); this.playTone(1200, 'sine', 0.2, 0.1, 0.2); },
            equip: function() { if(!this.enabled) return; this.playTone(500, 'triangle', 0.1, 0.1, 0); this.playTone(700, 'triangle', 0.15, 0.1, 0.1); },
            error: function() { if(this.enabled) this.playTone(150, 'sawtooth', 0.2, 0.1); },
            jump: function() { 
                if(!this.enabled || !this.ctx) return;
                const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
                osc.frequency.setValueAtTime(300, this.ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(); osc.stop(this.ctx.currentTime + 0.2);
            },
            coin: function() { if(!this.enabled) return; this.playTone(1200, 'sine', 0.1, 0.1, 0); this.playTone(1800, 'sine', 0.2, 0.1, 0.05); },
            hurt: function() { if(!this.enabled) return; this.playTone(150, 'sawtooth', 0.4, 0.2, 0); this.playTone(100, 'sawtooth', 0.4, 0.2, 0.1); },
            land: function() { if(!this.enabled) return; this.playTone(100, 'triangle', 0.1, 0.05); },
            stomp: function() { if(!this.enabled) return; this.playTone(200, 'square', 0.1, 0.1); },
            levelComplete: function() {
                if(!this.enabled) return;
                this.playTone(659, 'triangle', 0.12, 0.12, 0);
                this.playTone(784, 'triangle', 0.12, 0.12, 0.12);
                this.playTone(988, 'triangle', 0.12, 0.12, 0.24);
                this.playTone(1319, 'triangle', 0.3, 0.15, 0.36);
            },
            gameOver: function() { if(!this.enabled) return; this.playTone(400, 'sawtooth', 0.3, 0.1, 0); this.playTone(300, 'sawtooth', 0.3, 0.1, 0.2); this.playTone(200, 'sawtooth', 0.3, 0.1, 0.4); this.playTone(100, 'sawtooth', 0.6, 0.1, 0.6); },
            musicInterval: null,
            startMusic: function(levelIdx = -1) {
                if (!this.musicEnabled) return;
                if (this.musicInterval) clearInterval(this.musicInterval);
                const musicData = {
                    '-1': {chords:[[220,261,329],[196,246,293],[174,220,261],[196,246,293]], tempo:200, bass:'sawtooth', melody:'sine'},
                    '0': {chords:[[261,329,392],[220,261,329],[174,220,261],[196,246,293]], tempo:160, bass:'sine', melody:'triangle'},
                    '1': {chords:[[220,261,329],[196,246,293],[174,220,261],[164,196,246]], tempo:140, bass:'sawtooth', melody:'square'},
                    '2': {chords:[[293,370,440],[261,329,392],[329,415,493],[349,440,523]], tempo:180, bass:'square', melody:'sine'},
                    '3': {chords:[[293,349,440],[261,329,392],[246,311,370],[220,261,329]], tempo:170, bass:'sawtooth', melody:'triangle'},
                    '4': {chords:[[174,220,261],[196,246,293],[220,261,329],[164,196,246]], tempo:130, bass:'sawtooth', melody:'sine'},
                    '5': {chords:[[164,196,246],[146,174,220],[130,155,196],[146,174,220]], tempo:150, bass:'triangle', melody:'sine'},
                    '6': {chords:[[130,155,196],[123,146,185],[116,138,174],[123,146,185]], tempo:120, bass:'sawtooth', melody:'triangle'},
                    '7': {chords:[[146,185,220],[164,207,246],[130,164,196],[155,196,233]], tempo:145, bass:'triangle', melody:'sine'},
                    '8': {chords:[[174,220,261],[155,196,233],[164,207,246],[146,185,220]], tempo:160, bass:'sine', melody:'triangle'},
                    '9': {chords:[[110,130,164],[103,123,155],[98,116,146],[110,130,164]], tempo:190, bass:'sawtooth', melody:'square'}
                };
                const data = musicData[String(levelIdx)] || musicData['0'];
                let step = 0;
                this.musicInterval = setInterval(() => {
                    if (gameState === 'MENU' && levelIdx !== -1) { this.stopMusic(); return; }
                    if (gameState !== 'PLAYING' && gameState !== 'MENU') return;
                    const chordIdx = Math.floor(step / 8) % 4;
                    const chord = data.chords[chordIdx];
                    if (step % 4 === 0) this.playTone(chord[0] / 2, data.bass, 0.3, 0.05);
                    const noteIdx = step % 3;
                    this.playTone(chord[noteIdx] * 2, data.melody, 0.15, 0.03);
                    if (step % 2 === 0) this.playTone(8000, 'square', 0.02, 0.01);
                    step++;
                }, data.tempo);
            },
            stopMusic: function() { if (this.musicInterval) clearInterval(this.musicInterval); }
        };

        document.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => AudioSys.click()));

        let menuBallAngle = 0, menuBallFloat = 0, menuBallBlink = false, menuBallBlinkTimer = 0;
        let menuSparkles = [];
        
        function drawMenuBall() {
            const dpr = window.devicePixelRatio || 1;
            const displayWidth = menuBallCanvas.clientWidth;
            const displayHeight = menuBallCanvas.clientHeight;
            if (menuBallCanvas.width !== displayWidth * dpr || menuBallCanvas.height !== displayHeight * dpr) {
                menuBallCanvas.width = displayWidth * dpr;
                menuBallCanvas.height = displayHeight * dpr;
                menuBallCtx.scale(dpr, dpr);
            }
            menuBallCtx.clearRect(0, 0, displayWidth, displayHeight);
            const centerX = displayWidth / 2, centerY = displayHeight / 2 + Math.sin(menuBallFloat) * 8;
            const radius = Math.min(displayWidth, displayHeight) * 0.23;
            if (frameCount % 15 === 0) {
                menuSparkles.push({
                    x: centerX + (Math.random() - 0.5) * displayWidth * 0.75,
                    y: centerY + (Math.random() - 0.5) * displayHeight * 0.75,
                    life: 1, size: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5, vy: -Math.random() * 0.5 - 0.2
                });
            }
            menuSparkles.forEach((s, idx) => {
                s.x += s.vx; s.y += s.vy; s.life -= 0.02;
                if (s.life <= 0) { menuSparkles.splice(idx, 1); return; }
                menuBallCtx.save();
                menuBallCtx.globalAlpha = s.life;
                menuBallCtx.fillStyle = '#fff';
                menuBallCtx.shadowBlur = 8; menuBallCtx.shadowColor = '#06b6d4';
                menuBallCtx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const r = i % 2 === 0 ? s.size * 2 : s.size * 0.5;
                    const angle = (i / 8) * Math.PI * 2;
                    const px = s.x + Math.cos(angle) * r;
                    const py = s.y + Math.sin(angle) * r;
                    if (i === 0) menuBallCtx.moveTo(px, py);
                    else menuBallCtx.lineTo(px, py);
                }
                menuBallCtx.closePath(); menuBallCtx.fill(); menuBallCtx.restore();
            });
            menuBallCtx.save();
            menuBallCtx.translate(centerX, centerY);
            menuBallCtx.shadowBlur = 30; menuBallCtx.shadowColor = getPlayerColor();
            menuBallCtx.strokeStyle = getPlayerColor();
            menuBallCtx.globalAlpha = 0.3 + Math.sin(menuBallFloat * 2) * 0.15;
            menuBallCtx.lineWidth = 2;
            menuBallCtx.beginPath();
            menuBallCtx.arc(0, 0, radius + 12 + Math.sin(menuBallFloat * 2) * 3, 0, Math.PI * 2);
            menuBallCtx.stroke(); menuBallCtx.globalAlpha = 1;
            menuBallCtx.rotate(menuBallAngle);
            let grad;
            if (playerConfig.colorType === 'gradient' && playerConfig.gradientColors) {
                grad = menuBallCtx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
                playerConfig.gradientColors.forEach((c, i) => grad.addColorStop(i / (playerConfig.gradientColors.length - 1), c));
            } else {
                let r = parseInt(playerConfig.color.slice(1,3), 16), g = parseInt(playerConfig.color.slice(3,5), 16), b = parseInt(playerConfig.color.slice(5,7), 16);
                grad = menuBallCtx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
                grad.addColorStop(0, `rgb(${Math.min(r+150,255)}, ${Math.min(g+150,255)}, ${Math.min(b+150,255)})`);
                grad.addColorStop(0.4, playerConfig.color);
                grad.addColorStop(1, `rgb(${Math.max(r-80,0)}, ${Math.max(g-80,0)}, ${Math.max(b-80,0)})`);
            }
            menuBallCtx.shadowBlur = 25; menuBallCtx.shadowColor = getPlayerColor();
            menuBallCtx.fillStyle = grad;
            menuBallCtx.beginPath(); menuBallCtx.arc(0, 0, radius, 0, Math.PI * 2); menuBallCtx.fill();
            menuBallCtx.shadowBlur = 0;
            const highlightGrad = menuBallCtx.createRadialGradient(-radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 0.5);
            highlightGrad.addColorStop(0, 'rgba(255,255,255,0.85)');
            highlightGrad.addColorStop(0.3, 'rgba(255,255,255,0.3)');
            highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
            menuBallCtx.fillStyle = highlightGrad;
            menuBallCtx.beginPath(); menuBallCtx.arc(-radius * 0.4, -radius * 0.4, radius * 0.5, 0, Math.PI * 2); menuBallCtx.fill();
            menuBallCtx.fillStyle = 'rgba(255,255,255,0.7)';
            menuBallCtx.beginPath(); menuBallCtx.arc(-radius * 0.55, -radius * 0.55, radius * 0.12, 0, Math.PI * 2); menuBallCtx.fill();
            drawAccessoriesOnBall(menuBallCtx, radius, true);
            drawFaceOnBall(menuBallCtx, radius, menuBallBlink, 'HAPPY');
            drawAccessoriesOnBallFront(menuBallCtx, radius, true);
            menuBallCtx.restore();
            menuBallAngle += 0.008; menuBallFloat += 0.04; menuBallBlinkTimer++;
            if (menuBallBlinkTimer > 180) { menuBallBlink = true; if (menuBallBlinkTimer > 192) { menuBallBlink = false; menuBallBlinkTimer = 0; } }
        }

        function getPlayerColor() {
            if (playerConfig.colorType === 'gradient' && playerConfig.gradientColors) {
                return playerConfig.gradientColors[Math.floor(playerConfig.gradientColors.length / 2)];
            }
            return playerConfig.color;
        }

        function createBallGradient(ctx, radius) {
            if (playerConfig.colorType === 'gradient' && playerConfig.gradientColors) {
                const grad = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
                playerConfig.gradientColors.forEach((c, i) => grad.addColorStop(i / (playerConfig.gradientColors.length - 1), c));
                return grad;
            }
            let r = parseInt(playerConfig.color.slice(1,3), 16), g = parseInt(playerConfig.color.slice(3,5), 16), b = parseInt(playerConfig.color.slice(5,7), 16);
            const grad = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
            grad.addColorStop(0, `rgb(${Math.min(r+120,255)}, ${Math.min(g+120,255)}, ${Math.min(b+120,255)})`);
            grad.addColorStop(0.4, playerConfig.color);
            grad.addColorStop(1, `rgb(${Math.max(r-60,0)}, ${Math.max(g-60,0)}, ${Math.max(b-60,0)})`);
            return grad;
        }

        function drawAccessoriesOnBall(ctx, radius) {
            const acc = playerConfig.accessories;
            if (acc.cape) {
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.moveTo(-radius * 0.7, radius * 0.3);
                ctx.quadraticCurveTo(-radius * 1.3, radius * 1.2, -radius * 0.3, radius * 1.4);
                ctx.lineTo(radius * 0.3, radius * 1.4);
                ctx.quadraticCurveTo(radius * 1.3, radius * 1.2, radius * 0.7, radius * 0.3);
                ctx.fill();
            }
            if (acc.wings) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.beginPath(); ctx.ellipse(-radius * 1.2, 0, radius * 0.6, radius * 0.9, -0.3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(radius * 1.2, 0, radius * 0.6, radius * 0.9, 0.3, 0, Math.PI * 2); ctx.fill();
            }
        }

        function drawAccessoriesOnBallFront(ctx, radius) {
            const acc = playerConfig.accessories;
            if (acc.halo) {
                ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
                ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24';
                ctx.beginPath(); ctx.ellipse(0, -radius - 8, radius * 0.7, 4, 0, 0, Math.PI * 2); ctx.stroke();
                ctx.shadowBlur = 0;
            }
            if (acc.crown) {
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(-radius * 0.6, -radius - 2); ctx.lineTo(-radius * 0.6, -radius - 12);
                ctx.lineTo(-radius * 0.3, -radius - 6); ctx.lineTo(0, -radius - 14);
                ctx.lineTo(radius * 0.3, -radius - 6); ctx.lineTo(radius * 0.6, -radius - 12);
                ctx.lineTo(radius * 0.6, -radius - 2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#dc2626';
                ctx.beginPath(); ctx.arc(-radius * 0.3, -radius - 5, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(0, -radius - 8, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(radius * 0.3, -radius - 5, 2, 0, Math.PI * 2); ctx.fill();
            }
            if (acc.horns) {
                ctx.fillStyle = '#7f1d1d';
                ctx.beginPath(); ctx.moveTo(-radius * 0.5, -radius + 2); ctx.quadraticCurveTo(-radius * 0.8, -radius - 15, -radius * 0.3, -radius - 10); ctx.fill();
                ctx.beginPath(); ctx.moveTo(radius * 0.5, -radius + 2); ctx.quadraticCurveTo(radius * 0.8, -radius - 15, radius * 0.3, -radius - 10); ctx.fill();
            }
            if (acc.hat) {
                ctx.fillStyle = '#111';
                ctx.fillRect(-radius * 0.8, -radius - 3, radius * 1.6, 4);
                ctx.fillRect(-radius * 0.55, -radius - 18, radius * 1.1, 16);
                ctx.fillStyle = '#800';
                ctx.fillRect(-radius * 0.55, -radius - 5, radius * 1.1, 3);
            }
            if (acc.bandana) {
                ctx.fillStyle = '#dc2626';
                ctx.fillRect(-radius * 0.9, -radius * 0.3, radius * 1.8, 6);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-radius * 0.3, -radius * 0.3, 4, 6);
            }
            if (acc.headphones) {
                ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(0, 0, radius + 2, Math.PI * 0.8, Math.PI * 0.2, true); ctx.stroke();
                ctx.fillStyle = '#333';
                ctx.fillRect(-radius - 4, -5, 6, 12); ctx.fillRect(radius - 2, -5, 6, 12);
            }
            if (acc.glasses) {
                ctx.fillStyle = '#000';
                ctx.fillRect(-radius * 0.6, -radius * 0.35, radius * 0.5, radius * 0.3);
                ctx.fillRect(radius * 0.1, -radius * 0.35, radius * 0.5, radius * 0.3);
                ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-radius * 0.1, -radius * 0.2); ctx.lineTo(radius * 0.1, -radius * 0.2); ctx.stroke();
            }
            if (acc.monocle) {
                ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(radius * 0.3, -radius * 0.2, radius * 0.25, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(radius * 0.3, -radius * 0.2 + radius * 0.25); ctx.lineTo(radius * 0.3, radius * 0.3); ctx.stroke();
            }
            if (acc.mask) {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-radius * 0.7, -radius * 0.45, radius * 1.4, radius * 0.4);
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.ellipse(-radius * 0.3, -radius * 0.25, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(radius * 0.3, -radius * 0.25, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
            }
            if (acc.bowtie) {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.moveTo(0, radius * 0.6); ctx.lineTo(-radius * 0.4, radius * 0.4); ctx.lineTo(-radius * 0.4, radius * 0.8); ctx.fill();
                ctx.beginPath(); ctx.moveTo(0, radius * 0.6); ctx.lineTo(radius * 0.4, radius * 0.4); ctx.lineTo(radius * 0.4, radius * 0.8); ctx.fill();
                ctx.fillStyle = '#991b1b';
                ctx.beginPath(); ctx.arc(0, radius * 0.6, radius * 0.1, 0, Math.PI * 2); ctx.fill();
            }
        }

        function drawFaceOnBall(ctx, radius, isBlinking, emotion) {
            ctx.fillStyle = 'white'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
            if (emotion === 'COOL') {
                ctx.fillStyle = '#000';
                ctx.fillRect(-radius * 0.45, -radius * 0.3, radius * 0.35, radius * 0.1);
                ctx.fillRect(radius * 0.1, -radius * 0.3, radius * 0.35, radius * 0.1);
            } else if (isBlinking) {
                ctx.beginPath();
                ctx.moveTo(-radius * 0.45, -radius * 0.2); ctx.lineTo(-radius * 0.1, -radius * 0.2);
                ctx.moveTo(radius * 0.1, -radius * 0.2); ctx.lineTo(radius * 0.45, -radius * 0.2);
                ctx.stroke();
            } else {
                ctx.fillStyle = 'white'; ctx.beginPath();
                if (emotion === 'SURPRISED' || emotion === 'SCARED') {
                    ctx.arc(-radius * 0.3, -radius * 0.2, radius * 0.2, 0, Math.PI * 2);
                    ctx.arc(radius * 0.3, -radius * 0.2, radius * 0.2, 0, Math.PI * 2);
                } else {
                    ctx.ellipse(-radius * 0.3, -radius * 0.2, radius * 0.15, radius * 0.25, 0, 0, Math.PI * 2);
                    ctx.ellipse(radius * 0.3, -radius * 0.2, radius * 0.15, radius * 0.25, 0, 0, Math.PI * 2);
                }
                ctx.fill();
                ctx.fillStyle = '#0f172a'; ctx.beginPath();
                ctx.arc(-radius * 0.28, -radius * 0.2, radius * 0.08, 0, Math.PI * 2);
                ctx.arc(radius * 0.32, -radius * 0.2, radius * 0.08, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff'; ctx.beginPath();
                ctx.arc(-radius * 0.32, -radius * 0.25, radius * 0.04, 0, Math.PI * 2);
                ctx.arc(radius * 0.28, -radius * 0.25, radius * 0.04, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.strokeStyle = emotion === 'ANGRY' ? '#0f172a' : 'white'; ctx.lineWidth = 2; ctx.beginPath();
            if (emotion === 'HAPPY' || emotion === 'COOL') {
                ctx.arc(0, radius * 0.1, radius * 0.35, 0.2, Math.PI - 0.2); ctx.stroke();
            } else if (emotion === 'SURPRISED') {
                ctx.fillStyle = '#0f172a';
                ctx.ellipse(0, radius * 0.25, radius * 0.15, radius * 0.25, 0, 0, Math.PI * 2); ctx.fill();
            } else if (emotion === 'WORRIED' || emotion === 'SAD') {
                ctx.arc(0, radius * 0.4, radius * 0.25, Math.PI + 0.2, -0.2); ctx.stroke();
            } else if (emotion === 'SCARED') {
                ctx.fillStyle = '#0f172a';
                ctx.ellipse(0, radius * 0.25, radius * 0.2, radius * 0.3, 0, 0, Math.PI * 2); ctx.fill();
            } else if (emotion === 'ANGRY') {
                ctx.moveTo(-radius * 0.35, radius * 0.2); ctx.lineTo(radius * 0.35, radius * 0.1); ctx.stroke();
            }
        }

        class Particle {
            constructor(x, y, color) {
                this.x = x; this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
                this.life = 1.0; this.color = color; this.size = Math.random() * 4 + 1; this.decay = Math.random() * 0.03 + 0.02;
            }
            update() { this.x += this.vx; this.y += this.vy; this.vy += 0.2; this.life -= this.decay; this.size *= 0.95; }
            draw(ctx, camX) {
                ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color;
                ctx.beginPath(); ctx.arc(this.x - camX, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        const CreatureTypes = {
            ball: { color: "#ef4444", draw: (ctx, r) => {
                ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI*2); ctx.arc(5, -5, 3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-5, -5, 1, 0, Math.PI*2); ctx.arc(5, -5, 1, 0, Math.PI*2); ctx.fill();
            }},
            spike: { color: "#dc2626", draw: (ctx, r) => {
                ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = '#7f1d1d';
                for(let i=0; i<8; i++) { const a = (i/8)*Math.PI*2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r); ctx.lineTo(Math.cos(a)*(r+6), Math.sin(a)*(r+6)); ctx.lineTo(Math.cos(a+0.2)*r, Math.sin(a+0.2)*r); ctx.fill(); }
                ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-4, -4, 2, 0, Math.PI*2); ctx.arc(4, -4, 2, 0, Math.PI*2); ctx.fill();
            }},
            ghost: { color: "#22c55e", draw: (ctx, r) => {
                ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(0, -5, r, Math.PI, 0); ctx.lineTo(r, r); ctx.lineTo(r/2, r-5); ctx.lineTo(0, r); ctx.lineTo(-r/2, r-5); ctx.lineTo(-r, r); ctx.fill();
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI*2); ctx.arc(5, -5, 3, 0, Math.PI*2); ctx.fill();
            }},
            robot: { color: "#9ca3af", draw: (ctx, r) => {
                ctx.fillStyle = '#9ca3af'; ctx.fillRect(-r, -r, r*2, r*2);
                ctx.fillStyle = '#000'; ctx.fillRect(-r+2, -r+2, r*2-4, r*2-4);
                ctx.fillStyle = '#ef4444'; ctx.fillRect(-r+5, -r+5, 5, 5); ctx.fillRect(r-10, -r+5, 5, 5);
                ctx.fillStyle = '#3b82f6'; ctx.fillRect(-r+5, r-10, r*2-10, 5);
            }},
            skull: { color: "#f3f4f6", draw: (ctx, r) => {
                ctx.fillStyle = '#f3f4f6'; ctx.beginPath(); ctx.arc(0, -2, r, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-6, -2, 4, 0, Math.PI*2); ctx.arc(6, -2, 4, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(-2, 5); ctx.lineTo(0, 8); ctx.lineTo(2, 5); ctx.fill();
            }},
            bat: { color: "#6b21a8", draw: (ctx, r) => {
                ctx.fillStyle = '#6b21a8';
                ctx.beginPath(); ctx.ellipse(0, 0, r*0.6, r*0.8, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(-r*0.5, 0); ctx.quadraticCurveTo(-r*1.3, -r*0.8, -r, r*0.3); ctx.quadraticCurveTo(-r*0.7, 0, -r*0.5, 0); ctx.fill();
                ctx.beginPath(); ctx.moveTo(r*0.5, 0); ctx.quadraticCurveTo(r*1.3, -r*0.8, r, r*0.3); ctx.quadraticCurveTo(r*0.7, 0, r*0.5, 0); ctx.fill();
                ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(-4, -3, 2, 0, Math.PI*2); ctx.arc(4, -3, 2, 0, Math.PI*2); ctx.fill();
            }},
            snake: { color: "#16a34a", draw: (ctx, r) => {
                ctx.fillStyle = '#16a34a'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(-5, -4, 3, 0, Math.PI*2); ctx.arc(5, -4, 3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-5, -4, 1, 0, Math.PI*2); ctx.arc(5, -4, 1, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(-2, 6); ctx.lineTo(0, 10); ctx.lineTo(2, 6); ctx.fill();
            }},
            crab: { color: "#ea580c", draw: (ctx, r) => {
                ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.ellipse(0, 0, r, r*0.7, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#c2410c'; ctx.beginPath(); ctx.arc(-r*0.8, -r*0.3, r*0.3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(r*0.8, -r*0.3, r*0.3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-3, -2, 2, 0, Math.PI*2); ctx.arc(3, -2, 2, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-3, -2, 1, 0, Math.PI*2); ctx.arc(3, -2, 1, 0, Math.PI*2); ctx.fill();
            }}
        };

        class Enemy {
            constructor(x, y, range, typeKey = 'ball') {
                this.startX = x; this.x = x; this.y = y; this.radius = 20; this.range = range;
                this.speed = 2; this.dir = 1; this.angle = 0;
                this.typeKey = typeKey; this.typeData = CreatureTypes[typeKey] || CreatureTypes.ball;
            }
            update() { this.x += this.speed * this.dir; this.angle += 0.1; if (this.x > this.startX + this.range) this.dir = -1; if (this.x < this.startX) this.dir = 1; }
            draw(ctx, camX) {
                const drawX = this.x - camX;
                if (drawX < -50 || drawX > canvas.width + 50) return;
                ctx.save(); ctx.translate(drawX, this.y);
                ctx.shadowBlur = 15; ctx.shadowColor = this.typeData.color;
                this.typeData.draw(ctx, this.radius);
                ctx.restore();
            }
        }

        class Player {
            constructor(x, y) {
                this.x = x; this.y = y; this.radius = 22; this.vx = 0; this.vy = 0; this.angle = 0;
                this.grounded = false; this.dead = false; this.respawnTimer = 0; this.trail = [];
                this.emotion = playerConfig.defaultMood; this.blinkTimer = 0; this.isBlinking = false;
            }
            update(platforms, hazards, coins, enemies) {
                if (this.dead) { this.respawnTimer--; if (this.respawnTimer <= 0) this.respawn(); return; }
                if (keys.ArrowRight || keys.KeyD) this.vx += MOVE_SPEED;
                if (keys.ArrowLeft || keys.KeyA) this.vx -= MOVE_SPEED;
                this.vx *= FRICTION; this.vx = Math.max(Math.min(this.vx, MAX_SPEED), -MAX_SPEED);
                this.vy += GRAVITY; this.x += this.vx; this.y += this.vy; this.angle += this.vx * 0.1;
                if (frameCount % 3 === 0 && (Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1)) {
                    this.trail.push({x: this.x, y: this.y, alpha: 0.6});
                }
                if (this.trail.length > 8) this.trail.shift();
                this.trail.forEach(t => t.alpha -= 0.05);
                this.grounded = false;
                let prevGrounded = this.grounded;
                for (let plat of platforms) {
                    if (this.x + this.radius > plat.x && this.x - this.radius < plat.x + plat.w) {
                        const prevY = this.y - this.vy;
                        if (this.y + this.radius >= plat.y && prevY - this.radius <= plat.y && this.vy >= 0) {
                            if (!prevGrounded && this.vy > 5) AudioSys.land();
                            this.y = plat.y - this.radius; this.vy = 0; this.grounded = true;
                            if (keys.Space || keys.ArrowUp || keys.KeyW) {
                                this.vy = JUMP_FORCE; this.emotion = 'SURPRISED'; AudioSys.jump();
                                createParticles(this.x, this.y + this.radius, getPlayerColor(), 8);
                            }
                        } else if (this.y - this.radius <= plat.y + plat.h && prevY + this.radius >= plat.y + plat.h && this.vy < 0) {
                             this.y = plat.y + plat.h + this.radius; this.vy = 0;
                        }
                    }
                    if (this.y + this.radius > plat.y + 5 && this.y - this.radius < plat.y + plat.h - 5) {
                         if (this.x + this.radius > plat.x && this.x - this.radius < plat.x + 10 && this.vx > 0) { this.x = plat.x - this.radius; this.vx = 0; }
                         if (this.x - this.radius < plat.x + plat.w && this.x + this.radius > plat.x + plat.w - 10 && this.vx < 0) { this.x = plat.x + plat.w + this.radius; this.vx = 0; }
                    }
                }
                for (let haz of hazards) {
                    if (this.x + this.radius > haz.x && this.x - this.radius < haz.x + haz.w && this.y + this.radius > haz.y && this.y - this.radius < haz.y + haz.h) this.die();
                }
                for (let i = enemies.length - 1; i >= 0; i--) {
                    let e = enemies[i]; let dx = this.x - e.x; let dy = this.y - e.y; let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < this.radius + e.radius) {
                        if (this.vy > 0 && this.y < e.y - 5) {
                            enemies.splice(i, 1); this.vy = JUMP_FORCE * 0.7; levelScore += 50; scoreEl.innerText = levelScore;
                            AudioSys.stomp(); createParticles(e.x, e.y, e.typeData.color, 15); this.emotion = 'HAPPY';
                        } else this.die();
                    }
                }
                for (let i = coins.length - 1; i >= 0; i--) {
                    let c = coins[i]; let dx = this.x - c.x; let dy = this.y - c.y; let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < this.radius + c.radius) {
                        coins.splice(i, 1); levelScore += 10; scoreEl.innerText = levelScore; AudioSys.coin(); this.emotion = 'HAPPY';
                        createParticles(c.x, c.y, '#fbbf24', 15);
                    }
                }
                if (this.y > canvas.height + 100) this.die();
                this.updateEmotion();
            }
            updateEmotion() {
                this.blinkTimer++;
                if (this.blinkTimer > 150 + Math.random() * 100) { this.isBlinking = true; if (this.blinkTimer > 160 + Math.random() * 100) { this.isBlinking = false; this.blinkTimer = 0; } }
                if (!this.grounded) {
                    if (this.vy < -5) this.emotion = 'SURPRISED';
                    else if (this.vy > 5) this.emotion = 'WORRIED';
                    else this.emotion = playerConfig.defaultMood;
                } else this.emotion = playerConfig.defaultMood;
            }
            die() {
                if (this.dead) return;
                this.dead = true; this.emotion = 'SCARED'; lives--; updateLivesDisplay(); AudioSys.hurt();
                createParticles(this.x, this.y, getPlayerColor(), 30);
                if (lives <= 0) setTimeout(() => { AudioSys.gameOver(); endGame(); }, 1000);
                else this.respawnTimer = 60;
            }
            respawn() { this.dead = false; this.vx = 0; this.vy = 0; this.x = 100; this.y = 300; this.trail = []; this.emotion = 'SURPRISED'; }
            draw(ctx, camX) {
                if (this.dead) return;
                this.trail.forEach(t => {
                    if (t.alpha <= 0) return;
                    ctx.globalAlpha = t.alpha * 0.5; ctx.fillStyle = getPlayerColor();
                    ctx.beginPath(); ctx.arc(t.x - camX, t.y, this.radius * 0.8, 0, Math.PI * 2); ctx.fill();
                });
                ctx.globalAlpha = 1.0;
                const drawX = this.x - camX, drawY = this.y;
                ctx.save(); ctx.translate(drawX, drawY); ctx.rotate(this.angle);
                ctx.shadowBlur = 20; ctx.shadowColor = getPlayerColor();
                drawAccessoriesOnBall(ctx, this.radius);
                ctx.fillStyle = createBallGradient(ctx, this.radius);
                ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
                const highlightGrad = ctx.createRadialGradient(-this.radius * 0.35, -this.radius * 0.35, 0, -this.radius * 0.35, -this.radius * 0.35, this.radius * 0.5);
                highlightGrad.addColorStop(0, 'rgba(255,255,255,0.8)');
                highlightGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
                highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = highlightGrad;
                ctx.beginPath(); ctx.arc(-this.radius * 0.35, -this.radius * 0.35, this.radius * 0.5, 0, Math.PI * 2); ctx.fill();
                drawAccessoriesOnBallFront(ctx, this.radius);
                drawFaceOnBall(ctx, this.radius, this.isBlinking, this.emotion);
                ctx.restore();
            }
        }

        let platforms = [], hazards = [], coins = [], enemies = [], particles = [], player;
        let bgBuildings = [], midBuildings = [];

        function generateCityscape(theme) {
            bgBuildings = []; midBuildings = [];
            let x = -500;
            while(x < 12000) {
                let w = 100 + Math.random() * 200, h = 200 + Math.random() * 400;
                bgBuildings.push({x, w, h, windows: []});
                for(let wy = 10; wy < h - 20; wy += 30) for(let wx = 10; wx < w - 20; wx += 20) if(Math.random() > 0.3) bgBuildings[bgBuildings.length-1].windows.push({x: wx, y: wy});
                x += w - 20;
            }
            x = -500;
            while(x < 12000) {
                let w = 150 + Math.random() * 300, h = 100 + Math.random() * 300;
                let hue = theme === 1 ? (220 + Math.random()*40) : (100 + Math.random()*40);
                midBuildings.push({x, w, h, color: `hsl(${hue}, 40%, ${15 + Math.random()*10}%)`});
                x += w + 50;
            }
        }

        function initLevel(levelIdx) {
            const levelData = levels[levelIdx];
            platforms = JSON.parse(JSON.stringify(levelData.platforms));
            hazards = JSON.parse(JSON.stringify(levelData.hazards));
            coins = levelData.coins.map(c => ({...c, radius: 12}));
            enemies = levelData.enemies.map(e => new Enemy(e.x, e.y, e.range, e.type));
            particles = []; player = new Player(100, 300);
            generateCityscape(levelData.theme);
        }

        function createParticles(x, y, color, count) { for(let i=0; i<count; i++) particles.push(new Particle(x, y, color)); }

        function drawBackground(camX) {
            let skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            if (levels[currentLevelIdx] && levels[currentLevelIdx].theme === 2) { skyGrad.addColorStop(0, '#052e16'); skyGrad.addColorStop(1, '#14532d'); }
            else { skyGrad.addColorStop(0, '#020617'); skyGrad.addColorStop(1, '#1e1b4b'); }
            ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.2)'; ctx.shadowBlur = 50; ctx.shadowColor = '#a855f7';
            ctx.beginPath(); ctx.arc(canvas.width - 100, 100, 60, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
            const parallaxFar = camX * 0.2;
            ctx.fillStyle = '#0f172a';
            for (let b of bgBuildings) {
                let bx = b.x - parallaxFar;
                if (bx + b.w > 0 && bx < canvas.width) {
                    let by = canvas.height - b.h; ctx.fillRect(bx, by, b.w, b.h);
                    ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
                    for(let w of b.windows) if ((frameCount + w.x) % 100 < 50) ctx.fillRect(bx + w.x, by + w.y, 10, 15);
                    ctx.fillStyle = '#0f172a';
                }
            }
            const parallaxMid = camX * 0.5;
            for (let b of midBuildings) {
                let bx = b.x - parallaxMid;
                if (bx + b.w > 0 && bx < canvas.width) {
                    let by = canvas.height - b.h; ctx.fillStyle = b.color; ctx.fillRect(bx, by, b.w, b.h);
                    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, b.w, b.h);
                }
            }
        }

        function drawFinishFlag(winX, camX) {
            const fx = winX - camX;
            if (fx < -100 || fx > canvas.width + 100) return;
            const baseY = 400;
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(fx - 2, baseY - 150, 4, 150);
            const wave = Math.sin(frameCount * 0.1) * 5;
            ctx.fillStyle = '#22c55e'; ctx.shadowBlur = 15; ctx.shadowColor = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(fx + 2, baseY - 150);
            ctx.quadraticCurveTo(fx + 30 + wave, baseY - 140, fx + 50, baseY - 130);
            ctx.lineTo(fx + 2, baseY - 110); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
            ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px Orbitron'; ctx.textAlign = 'center';
            ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24';
            ctx.fillText('FINISH', fx, baseY - 160); ctx.shadowBlur = 0;
        }

        function update() {
            if (gameState !== 'PLAYING') return;
            player.update(platforms, hazards, coins, enemies);
            enemies.forEach(e => e.update());
            let targetCamX = player.x - canvas.width * 0.3;
            cameraX += (targetCamX - cameraX) * 0.1;
            if (cameraX < 0) cameraX = 0;
            for (let i = particles.length - 1; i >= 0; i--) { particles[i].update(); if (particles[i].life <= 0) particles.splice(i, 1); }
            if (player.x > levels[currentLevelIdx].winX) completeLevel();
        }

        function draw() {
            drawBackground(cameraX);
            for (let plat of platforms) {
                const px = plat.x - cameraX;
                if (px + plat.w > 0 && px < canvas.width) {
                    ctx.fillStyle = '#1e293b'; ctx.fillRect(px, plat.y, plat.w, plat.h);
                    ctx.shadowBlur = 10; ctx.shadowColor = '#06b6d4'; ctx.fillStyle = '#06b6d4';
                    ctx.fillRect(px, plat.y, plat.w, 4); ctx.shadowBlur = 0;
                    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.beginPath();
                    for(let i=0; i<plat.w; i+=20) { ctx.moveTo(px+i, plat.y); ctx.lineTo(px+i, plat.y+plat.h); }
                    ctx.stroke();
                }
            }
            ctx.fillStyle = '#ef4444'; ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
            for (let haz of hazards) {
                const hx = haz.x - cameraX;
                if (hx + haz.w > 0 && hx < canvas.width) {
                    ctx.beginPath(); const spikeCount = Math.floor(haz.w / 20);
                    for(let i=0; i<spikeCount; i++) { ctx.moveTo(hx + i*20, haz.y + haz.h); ctx.lineTo(hx + i*20 + 10, haz.y); ctx.lineTo(hx + i*20 + 20, haz.y + haz.h); }
                    ctx.fill();
                }
            }
            ctx.shadowBlur = 0;
            const bobOffset = Math.sin(frameCount * 0.1) * 5;
            ctx.shadowBlur = 15; ctx.shadowColor = '#fbbf24'; ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
            for (let c of coins) {
                const cx = c.x - cameraX, cy = c.y + bobOffset;
                if (cx > -20 && cx < canvas.width + 20) {
                    ctx.beginPath(); ctx.arc(cx, cy, c.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = '#b45309'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('$', cx, cy); ctx.fillStyle = '#fbbf24';
                }
            }
            ctx.shadowBlur = 0;
            enemies.forEach(e => e.draw(ctx, cameraX));
            drawFinishFlag(levels[currentLevelIdx].winX, cameraX);
            player.draw(ctx, cameraX);
            for (let p of particles) p.draw(ctx, cameraX);
        }

        function loop() {
            frameCount++;
            if (gameState === 'MENU') drawMenuBall();
            update(); draw();
            requestAnimationFrame(loop);
        }

        function updateLivesDisplay() {
            livesContainer.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const heart = document.createElement('span');
                heart.className = `text-lg md:text-2xl ${i < lives ? 'text-red-500' : 'text-gray-700'}`;
                heart.innerHTML = '♥'; livesContainer.appendChild(heart);
            }
        }

        function showLevelSelect() { menuScreen.classList.add('hidden'); levelScreen.classList.remove('hidden'); renderLevelGrid(); }

        function renderLevelGrid() {
            levelGrid.innerHTML = '';
            const t = translations[currentLang];
            completedCountEl.textContent = completedLevels.size;
            levels.forEach((lvl, idx) => {
                const isLocked = idx >= unlockedLevels;
                const isCompleted = completedLevels.has(idx);
                const div = document.createElement('div');
                let cardClass = 'level-card border p-3 md:p-4 rounded-xl flex flex-col items-center justify-center relative';
                if (isLocked) cardClass += ' locked border-gray-700';
                else if (isCompleted) cardClass += ' completed';
                else cardClass += ' border-purple-500/30';
                div.className = cardClass;
                if (!isLocked) div.onclick = () => startLevel(idx);
                const diffColors = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-orange-400', 'Very Hard': 'text-red-400', EXTREME: 'text-purple-400' };
                let statusIcon = isCompleted ? `<div class="completed-badge">✓</div>` : '';
                let centerIcon = isLocked ? '🔒' : (isCompleted ? '⭐' : '▶');
                let statusText = isCompleted ? `<p class="text-green-400 text-[10px] uppercase tracking-widest font-bold mt-1">${t.completed}</p>` : 
                                 (!isLocked ? `<p class="text-gray-500 text-[10px] uppercase tracking-widest">Lv ${lvl.id}</p>` : '');
                div.innerHTML = `${statusIcon}
                    <div class="absolute top-0 right-0 p-1.5 text-[9px] md:text-[10px] font-bold ${diffColors[lvl.difficulty] || 'text-cyan-400'} bg-black/20 rounded-bl-lg" style="font-family: 'Orbitron', sans-serif;">${lvl.difficulty}</div>
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 mb-2 flex items-center justify-center text-lg md:text-xl border ${isCompleted ? 'border-green-400' : 'border-gray-700'}">${centerIcon}</div>
                    <h3 class="text-xs md:text-sm font-bold text-white text-center leading-tight" style="font-family: 'Orbitron', sans-serif;">${lvl.name}</h3>
                    ${statusText}`;
                levelGrid.appendChild(div);
            });
        }

        function startLevel(idx) {
            currentLevelIdx = idx; levelScore = 0; lives = 3; scoreEl.innerText = levelScore; updateLivesDisplay();
            levelScreen.classList.add('hidden'); menuScreen.classList.add('hidden');
            hud.classList.remove('hidden');
            gameState = 'PLAYING'; AudioSys.init(); AudioSys.startMusic(idx); initLevel(idx);
        }

        function completeLevel() {
            gameState = 'GAMEOVER'; AudioSys.stopMusic(); AudioSys.levelComplete();
            completedLevels.add(currentLevelIdx);
            totalMoney += levelScore; lastGameResult = 'WIN';
            menuScreen.classList.remove('hidden'); hud.classList.add('hidden');
            finalScoreContainer.classList.remove('hidden'); finalScoreEl.innerText = '$' + levelScore;
            if (currentLevelIdx + 1 >= unlockedLevels && unlockedLevels < levels.length) unlockedLevels++;
            updateTexts();
        }

        function endGame() {
            gameState = 'GAMEOVER'; AudioSys.stopMusic();
            totalMoney += levelScore; lastGameResult = 'LOSE';
            menuScreen.classList.remove('hidden'); hud.classList.add('hidden');
            finalScoreContainer.classList.remove('hidden'); finalScoreEl.innerText = '$' + levelScore;
            updateTexts();
        }

        function handlePlayButtonClick() {
            if (lastGameResult === 'WIN') { let nextIdx = currentLevelIdx + 1; if (nextIdx >= levels.length) nextIdx = 0; startLevel(nextIdx); }
            else if (lastGameResult === 'LOSE') startLevel(currentLevelIdx);
            else showLevelSelect();
        }

        function exitToMenu() {
            gameState = 'MENU'; lastGameResult = 'PLAY'; AudioSys.stopMusic(); AudioSys.startMusic(-1);
            hud.classList.add('hidden');
            menuScreen.classList.remove('hidden'); levelScreen.classList.add('hidden'); storeScreen.classList.add('hidden');
            finalScoreContainer.classList.add('hidden'); updateTexts();
        }

        function showStore() { menuScreen.classList.add('hidden'); storeScreen.classList.remove('hidden'); storeBalanceEl.innerText = totalMoney; renderStore(); }

        function drawStorePreview(canvasEl, item) {
            const pctx = canvasEl.getContext('2d');
            const size = canvasEl.clientWidth;
            const dpr = window.devicePixelRatio || 1;
            if (canvasEl.width !== size * dpr) { canvasEl.width = size * dpr; canvasEl.height = size * dpr; pctx.scale(dpr, dpr); }
            pctx.clearRect(0, 0, size, size);
            const cx = size / 2, cy = size / 2, r = size / 2 - 4;
            if (item.type === 'solid') {
                let rC = parseInt(item.value.slice(1,3), 16), gC = parseInt(item.value.slice(3,5), 16), bC = parseInt(item.value.slice(5,7), 16);
                const grad = pctx.createRadialGradient(cx - r*0.35, cy - r*0.35, r*0.1, cx, cy, r);
                grad.addColorStop(0, `rgb(${Math.min(rC+120,255)}, ${Math.min(gC+120,255)}, ${Math.min(bC+120,255)})`);
                grad.addColorStop(0.5, item.value);
                grad.addColorStop(1, `rgb(${Math.max(rC-60,0)}, ${Math.max(gC-60,0)}, ${Math.max(bC-60,0)})`);
                pctx.fillStyle = grad;
                pctx.beginPath(); pctx.arc(cx, cy, r, 0, Math.PI * 2); pctx.fill();
            } else if (item.type === 'gradient') {
                const grad = pctx.createRadialGradient(cx - r*0.35, cy - r*0.35, r*0.1, cx, cy, r);
                item.preview.forEach((c, i) => grad.addColorStop(i / (item.preview.length - 1), c));
                pctx.fillStyle = grad;
                pctx.beginPath(); pctx.arc(cx, cy, r, 0, Math.PI * 2); pctx.fill();
            } else if (item.type === 'accessory') {
                pctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
                pctx.beginPath(); pctx.arc(cx, cy, r, 0, Math.PI * 2); pctx.fill();
                pctx.font = `${r * 1.2}px sans-serif`; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
                pctx.fillText(item.icon, cx, cy);
            } else if (item.type === 'creature') {
                pctx.save(); pctx.translate(cx, cy);
                const creatureData = CreatureTypes[item.value];
                if (creatureData) creatureData.draw(pctx, r * 0.7);
                pctx.restore();
            }
        }

        function renderStore() {
            storeGrid.innerHTML = '';
            const t = translations[currentLang];
            const items = storeItems[currentStoreTab] || [];
            items.forEach(item => {
                let isOwned = false, isEquipped = false;
                if (item.type === 'solid' || item.type === 'gradient') {
                    isOwned = inventory.colors.some(c => c.id === item.id);
                    isEquipped = isOwned && playerConfig.colorType === item.type && 
                        (item.type === 'solid' ? playerConfig.color === item.value : JSON.stringify(playerConfig.gradientColors) === JSON.stringify(item.value.colors));
                } else if (item.type === 'accessory') {
                    isOwned = inventory.accessories.includes(item.value);
                    isEquipped = isOwned && playerConfig.accessories[item.value];
                } else if (item.type === 'creature') {
                    isOwned = inventory.creatures.includes(item.value);
                    isEquipped = false;
                }
                const div = document.createElement('div');
                div.className = `store-item border ${isEquipped ? 'equipped' : (isOwned ? 'owned' : 'border-yellow-500/30')} p-2 md:p-3 rounded-xl flex flex-col items-center relative`;
                div.innerHTML = `<canvas class="preview-canvas mb-1.5" style="width: 55px; height: 55px;"></canvas>
                    <h3 class="text-[11px] md:text-sm font-bold text-white text-center mb-0.5 leading-tight">${item.name}</h3>
                    <p class="text-yellow-400 font-bold text-[10px] md:text-xs mb-1.5">$${item.price}</p>
                    <div class="w-full flex flex-col gap-1">
                        ${isEquipped ? 
                            `<button class="action-btn w-full py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">${t.unequip}</button>` :
                            (isOwned ? 
                                `<button class="action-btn w-full py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-green-600/20 text-green-400 border border-green-500/30">${t.equip}</button>` :
                                `<button class="action-btn w-full py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-yellow-500 hover:bg-yellow-400 text-black">${t.buy}</button>`
                            )
                        }
                    </div>`;
                const canvasEl = div.querySelector('canvas');
                setTimeout(() => drawStorePreview(canvasEl, item), 0);
                const btn = div.querySelector('.action-btn');
                btn.onclick = (e) => { e.stopPropagation(); handleStoreAction(item, isOwned, isEquipped); };
                storeGrid.appendChild(div);
            });
        }

        function handleStoreAction(item, isOwned, isEquipped) {
            if (isEquipped) {
                if (item.type === 'solid' || item.type === 'gradient') {
                    playerConfig.colorType = 'solid'; playerConfig.color = '#3b82f6'; playerConfig.gradientColors = null;
                } else if (item.type === 'accessory') { playerConfig.accessories[item.value] = false; }
                AudioSys.equip(); renderStore();
            } else if (isOwned) {
                if (item.type === 'solid') { playerConfig.colorType = 'solid'; playerConfig.color = item.value; playerConfig.gradientColors = null; }
                else if (item.type === 'gradient') { playerConfig.colorType = 'gradient'; playerConfig.gradientColors = item.value.colors; }
                else if (item.type === 'accessory') { playerConfig.accessories[item.value] = true; }
                AudioSys.equip(); renderStore();
            } else {
                if (totalMoney >= item.price) {
                    totalMoney -= item.price; storeBalanceEl.innerText = totalMoney; AudioSys.buy();
                    if (item.type === 'solid' || item.type === 'gradient') { inventory.colors.push({id: item.id, type: item.type, value: item.value}); }
                    else if (item.type === 'accessory') { inventory.accessories.push(item.value); }
                    else if (item.type === 'creature') { inventory.creatures.push(item.value); }
                    renderStore();
                } else { AudioSys.error(); alert("Not enough money!"); }
            }
        }

        function updateTexts() {
            const t = translations[currentLang];
            if (lastGameResult === 'WIN') { playBtn.innerText = t.nextLevel; levelCompleteText.innerText = t.levelComplete; }
            else if (lastGameResult === 'LOSE') { playBtn.innerText = t.playAgain; levelCompleteText.innerText = t.gameOver; }
            else { playBtn.innerText = t.play; levelCompleteText.innerText = t.levelComplete; }
            selectLevelText.innerText = t.selectLevel; storeTitle.innerText = t.store; balanceText.innerText = t.balance;
            settingsTitle.innerText = t.settings; langLabel.innerText = t.language; musicLabel.innerText = t.music;
            soundLabel.innerText = t.sound; moodLabel.innerText = t.mood;
            storeBtnMenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> ${t.store}`;
            settingsBtnMenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> ${t.settings}`;
            if (!storeScreen.classList.contains('hidden')) renderStore();
        }

        playBtn.addEventListener('click', handlePlayButtonClick);
        backToMenuFromLevels.addEventListener('click', () => { levelScreen.classList.add('hidden'); menuScreen.classList.remove('hidden'); });
        backToMenuFromStore.addEventListener('click', () => { storeScreen.classList.add('hidden'); menuScreen.classList.remove('hidden'); });
        exitBtn.addEventListener('click', exitToMenu);
        storeBtnMenu.addEventListener('click', showStore);
        settingsBtnMenu.addEventListener('click', () => settingsModal.classList.remove('hidden'));

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active'); currentStoreTab = btn.dataset.tab; renderStore();
            });
        });

        langSelect.addEventListener('change', (e) => { currentLang = e.target.value; updateTexts(); });
        musicToggle.addEventListener('change', (e) => { AudioSys.musicEnabled = e.target.checked; if (!AudioSys.musicEnabled) AudioSys.stopMusic(); else if (gameState === 'MENU') AudioSys.startMusic(-1); });
        soundToggle.addEventListener('change', (e) => { AudioSys.enabled = e.target.checked; });
        moodSelect.addEventListener('change', (e) => { playerConfig.defaultMood = e.target.value; });
        closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

        const handleKey = (code, state) => {
            if(keys.hasOwnProperty(code)) keys[code] = state;
            if (code === 'KeyW') keys.Space = state;
            if (code === 'KeyA') keys.ArrowLeft = state;
            if (code === 'KeyD') keys.ArrowRight = state;
            if (code === 'ArrowUp') keys.Space = state;
        };
        window.addEventListener('keydown', (e) => { if(e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') e.preventDefault(); handleKey(e.code, true); });
        window.addEventListener('keyup', (e) => { handleKey(e.code, false); if (e.code === 'KeyW') keys.Space = keys.ArrowUp; });

        const addTouch = (elem, code) => {
            const start = (e) => { e.preventDefault(); keys[code] = true; elem.classList.add('pressed'); };
            const end = (e) => { e.preventDefault(); keys[code] = false; elem.classList.remove('pressed'); };
            elem.addEventListener('touchstart', start, { passive: false });
            elem.addEventListener('touchend', end, { passive: false });
            elem.addEventListener('touchcancel', end, { passive: false });
            elem.addEventListener('mousedown', start);
            elem.addEventListener('mouseup', end);
            elem.addEventListener('mouseleave', end);
        };
        addTouch(btnLeft, 'ArrowLeft'); addTouch(btnRight, 'ArrowRight'); addTouch(btnJump, 'Space');

        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize); 
        window.addEventListener('orientationchange', () => setTimeout(resize, 100));
        resize();

        document.addEventListener('gesturestart', e => e.preventDefault());
        document.addEventListener('gesturechange', e => e.preventDefault());
        document.addEventListener('gestureend', e => e.preventDefault());
        document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

        document.body.addEventListener('click', () => { 
            if (gameState === 'MENU' && !AudioSys.musicInterval) { AudioSys.init(); AudioSys.startMusic(-1); } 
        }, { once: true });

        initLevel(0); loop();
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}        