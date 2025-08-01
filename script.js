document.addEventListener('DOMContentLoaded', () => {

    // --- Global Variables & Elements ---
    let currentMode = 'chase';
    let hungerInterval;
    let chaseAnimation;
    let chaseAnimationId; // To store the animation frame ID
    let catPosition = { x: 50, y: 50 };
    let cursorPos = { x: 300, y: 200 };
    const allModes = document.querySelectorAll('.game-mode-container');
    const modeSelector = document.querySelector('.mode-selector');

    // --- Event Listeners ---
    modeSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('mode-btn')) {
            switchMode(e.target.dataset.mode);
        }
    });

    // --- Mode Switching ---
    function switchMode(mode) {
        if (!mode) return;
        currentMode = mode;

        // Stop all active processes
        stopAllModes();

        // Hide all mode containers
        allModes.forEach(container => container.classList.add('hidden'));

        // Show the selected mode container
        const activeContainer = document.getElementById(`${mode}Mode`);
        if (activeContainer) {
            activeContainer.classList.remove('hidden');
        }

        // Initialize the new mode
        switch (mode) {
            case 'chase':
                initChaseMode();
                break;
            case 'chatbot':
                initChatbot();
                break;
            case 'rating':
                initRatingMode();
                break;
            case 'horoscope':
                initHoroscopeMode();
                break;
            case 'translator':
                initTranslatorMode();
                break;
            case 'feeding':
                initFeedingMode();
                break;
        }
    }

    function stopAllModes() {
        // Stop chase mode
        document.body.classList.remove('chase-active');
        if (chaseAnimation) cancelAnimationFrame(chaseAnimation);

        // Stop feeding mode
        if (hungerInterval) clearInterval(hungerInterval);
        document.getElementById('dramaticText').classList.remove('active');
    }

    // --- Chase Mode ---
    function initChaseMode() {
        const gameArea = document.getElementById('chaseMode');
        const cat = document.getElementById('chaseCat');
        const cursorMouse = document.getElementById('cursorMouse'); // The new visual cursor
        const catEyes = document.getElementById('catEyes');

        // Listen for the real mouse moving over the game area
        gameArea.addEventListener('mousemove', (e) => {
            const rect = gameArea.getBoundingClientRect();
            cursorPos.x = e.clientX - rect.left;
            cursorPos.y = e.clientY - rect.top;

            // Make the visual cursor div follow the real cursor perfectly
            cursorMouse.style.left = cursorPos.x - 15 + 'px';
            cursorMouse.style.top = cursorPos.y - 15 + 'px';
        });

        // The continuous animation loop
        function gameLoop() {
            // Calculate distance and direction from cat to cursor
            const dx = cursorPos.x - catPosition.x;
            const dy = cursorPos.y - catPosition.y;

            // Move the cat towards the cursor (a fraction of the distance each frame)
            // The 0.05 value controls the "lag" or chase speed. Lower is slower.
            catPosition.x += dx * 0.05;
            catPosition.y += dy * 0.05;

            // Update the cat's visual position
            cat.style.left = catPosition.x - 30 + 'px'; // -30 to center the 60px cat
            cat.style.top = catPosition.y - 30 + 'px';

            // --- Bonus: Make the cat's eyes follow the mouse ---
            const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Get angle in degrees
            catEyes.style.transform = `rotate(${angle + 90}deg)`;

            // Request the next frame to continue the loop
            chaseAnimationId = requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    }

    // --- Chatbot Mode ---
    function initChatbot() {
        const messagesDiv = document.getElementById('chatMessages');
        messagesDiv.innerHTML = '<div class="message cat-message">🧘‍♀️ Meow, young padawan. What knowledge do you seek? 😼</div>';
        showChatOptions([
            "What's the meaning of life?",
            "Should I buy more cat food?",
            "Why do cats knock things off tables?",
        ]);
    }

    function showChatOptions(options) {
        const container = document.getElementById('chatOptions');
        container.innerHTML = '';
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => handleChatResponse(option);
            container.appendChild(btn);
        });
    }

    function handleChatResponse(userMessage) {
        const messagesDiv = document.getElementById('chatMessages');
        const userDiv = document.createElement('div');
        userDiv.className = 'message user-message';
        userDiv.textContent = userMessage;
        messagesDiv.appendChild(userDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        const responses = {
            "What's the meaning of life?": "🙄 To serve cats and open cans. Next.",
            "Should I buy more cat food?": "😑 Is that a trick question? The answer is ALWAYS yes.",
            "Why do cats knock things off tables?": "🤔 For science. To test gravity. Duh.",
            "Why won't you come when called?": "My schedule is very busy. It's filled with naps. I'll pencil you in for next Tuesday.",
            "What's wrong with my outfit?": "It's not covered in cat hair. A glaring oversight."
        };
        const catResponse = responses[userMessage] || "Have you considered taking a nap instead?";

        document.getElementById('chatOptions').innerHTML = 'Thinking...';

        setTimeout(() => {
            const catDiv = document.createElement('div');
            catDiv.className = 'message cat-message';
            catDiv.textContent = catResponse;
            messagesDiv.appendChild(catDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            const newOptions = Object.keys(responses).sort(() => 0.5 - Math.random()).slice(0, 3);
            showChatOptions(newOptions);
        }, 1500);
    }

    // --- Image Rating Mode ---
    function initRatingMode() {
        document.getElementById('uploadZone').onclick = () => document.getElementById('imageInput').click();
        document.getElementById('imageInput').onchange = (e) => rateImage(e.target);
        document.getElementById('ratingResult').innerHTML = ''; // Clear previous result
    }

    function rateImage(input) {
        if (!input.files || !input.files[0]) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const resultDiv = document.getElementById('ratingResult');
            const rating = Math.floor(Math.random() * 10) + 1;
            const judgments = ["Needs more cats.", "I've seen better.", "Pleasing... slightly.", "Not enough nap spots.", "Where are the treats?", "Acceptable.", "I would knock this off a table.", "Lacks proper cat worship.", "This will do.", "Perfection!"];
            resultDiv.innerHTML = `
                <div>${rating}/10 ⭐</div>
                <div style="font-size: 1.5rem; margin-top: 20px;">${judgments[rating - 1]}</div>
                <div style="margin-top: 20px;"><img src="${e.target.result}" style="max-width: 300px; max-height: 300px; border-radius: 15px;"></div>
            `;
        };
        reader.readAsDataURL(input.files[0]);
    }

    // --- Horoscope Mode ---
    function initHoroscopeMode() {
        document.querySelectorAll('.zodiac-sign').forEach(sign => {
            sign.onclick = () => generateHoroscope(sign.dataset.sign);
        });
        document.getElementById('horoscopeResult').innerHTML = '';
    }

    function generateHoroscope(sign) {
        const horoscopes = {
            tuna: "A can opener brings good fortune. Avoid cucumbers.",
            box: "A small space will bring great joy. Resist attempts to throw away your happiness.",
            laser: "You will chase something you cannot catch. This is normal. Trust no red dots.",
            yarn: "Your life will become wonderfully complicated. Ignore anyone who tries to 'help'.",
            catnip: "You will experience enlightenment. Reality may become questionable around 3 PM.",
            windowsill: "You will see something outside that demands immediate staring. Your vigilance is key."
        };
        const resultDiv = document.getElementById('horoscopeResult');
        resultDiv.innerHTML = `<h3>🔮 Your Paw-roscope 🔮</h3><p>${horoscopes[sign]}</p>`;
    }

    // --- Translator Mode ---
    function initTranslatorMode() {
        document.getElementById('translateToCatBtn').onclick = translateText;
        document.getElementById('translatorInput').value = '';
        document.getElementById('translationResult').textContent = 'Translation will appear here...';
    }

    function translateText() {
        const input = document.getElementById('translatorInput').value;
        const resultDiv = document.getElementById('translationResult');
        if (input.trim() === '') {
            resultDiv.textContent = 'Meow? (You have to type something!)';
            return;
        }
        const meows = ["Meow", "Purrr", "Mrow", "Meeeoow", "Hiss", "Mrrr"];
        let translation = input.split(' ').map(() => meows[Math.floor(Math.random() * meows.length)]).join(' ');
        resultDiv.textContent = translation + ".";
    }

    // --- Feeding Mode ---
    function initFeedingMode() {
        let hunger = 100;
        let catScale = 1;
        const chonkyCat = document.getElementById('chonkyCat');
        const hungerFill = document.getElementById('hungerFill');
        const dramaticText = document.getElementById('dramaticText');

        chonkyCat.style.transform = `scale(1)`;
        chonkyCat.classList.remove('floating');

        chonkyCat.onclick = () => {
            if (chonkyCat.classList.contains('floating')) return;
            hunger = Math.min(100, hunger + 25);
            catScale += 0.2;
            chonkyCat.style.transform = `scale(${catScale})`;
            
            if (catScale >= 3) {
                chonkyCat.style.setProperty('--cat-scale', catScale);
                chonkyCat.classList.add('floating');
                setTimeout(initFeedingMode, 4000); // Reset after floating away
            }
        };

        hungerInterval = setInterval(() => {
            if (currentMode !== 'feeding') return;
            hunger = Math.max(0, hunger - 2); // Depletes fast!
            hungerFill.style.width = `${hunger}%`;

            if (hunger < 30) {
                dramaticText.textContent = 'Chonky is STARVING!';
                dramaticText.classList.add('active');
            } else {
                dramaticText.textContent = '';
                dramaticText.classList.remove('active');
            }
        }, 500);
    }


    // --- Initial Load ---
    switchMode('chase'); // Start with chase mode active
});