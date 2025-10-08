   const wordDisplay = document.getElementById('word-display');
        const hintText = document.getElementById('hint-text');
        const wrongGuessesCount = document.getElementById('wrong-guesses-count');
        const keyboardDiv = document.getElementById('keyboard');
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const correctWordSpan = document.getElementById('correct-word');
        const playAgainBtn = document.getElementById('play-again-btn');
        const animationContainer = document.getElementById('animation-container');
        const scoreDisplay = document.getElementById('score-display');

        const wordList = [
            { word: "ATMIYAUNIVERSITY", hint: "The name of your university"},
            { word: "PYTHON", hint: "A programming language named after a snake" },
            { word: "PLANET", hint: "Orbits around a star" },
            { word: "JAVASCRIPT", hint: "Popular web scripting language" },
            { word: "HANGMAN", hint: "A classic word guessing game" },
            { word: "DEVELOPER", hint: "A person who writes code" },
            { word: "LIBRARY", hint: "Place full of books"},
            { word: "OXYGEN", hint: "Essential gas for breathing"},
            { word: "ALGORITHM", hint: "Step-by-step procedure for solving a problem"},
            { word: "DATABASE", hint: "Organized collection of data"},
            { word: "BINARY", hint: "Number system using 0s and 1s"},
            { word: "CHOCOLATE", hint: "Sweet treat made from cocoa"},
            { word: "RAINBOW", hint: "Colors appearing after rain"},
            { word: "LAPTOP", hint: "Portable computer"},
            { word: "HEADPHONES", hint: "Used to listen to music privately"},
            { word: "BOOK", hint: "Collection of written pages"},
            { word: "SOFTWARE", hint: "Programs used by a computer" },
            { word: "HARDWARE", hint: "The physical parts of a computer" },
            { word: "INTERNET", hint: "A global network of computers" },
            { word: "KEYBOARD", hint: "Input device for typing" },
            { word: "NETWORK", hint: "A group of connected computers" }
        ];

        let availableWords = [];
        let currentWord, correctLetters, wrongGuessCount;
        let score = 0;
        const maxGuesses = 6;

        const getNewWord = () => {
            if (availableWords.length === 0) {
                availableWords = [...wordList];
            }
            const wordIndex = Math.floor(Math.random() * availableWords.length);
            const selectedWord = availableWords[wordIndex];
            availableWords.splice(wordIndex, 1);
            return selectedWord;
        };

        const resetGame = () => {
            correctLetters = [];
            wrongGuessCount = 0;
            
            const { word, hint } = getNewWord();
            currentWord = word;

            hintText.innerText = hint;
            wrongGuessesCount.innerText = `${wrongGuessCount} / ${maxGuesses}`;
            scoreDisplay.innerText = score;
            
            document.querySelectorAll('.hangman-part').forEach(part => part.classList.remove('visible'));

            wordDisplay.innerHTML = currentWord.split("").map(() => `
                <div class="letter-box">
                    <div class="letter-inner">
                        <div class="letter-front"></div>
                        <div class="letter-back"></div>
                    </div>
                </div>
            `).join("");

            keyboardDiv.innerHTML = "";
            for (let i = 65; i <= 90; i++) {
                const button = document.createElement('button');
                button.innerText = String.fromCharCode(i);
                button.className = 'key';
                keyboardDiv.appendChild(button);
                button.addEventListener('click', (e) => handleGuess(e.target, e.target.innerText));
            }

            modal.classList.remove('active');
            animationContainer.innerHTML = '';
        };

        const handleGuess = (button, letter) => {
            if (button.disabled) return;
            button.disabled = true;

            if (currentWord.includes(letter)) {
                button.classList.add('correct');
                [...currentWord].forEach((char, index) => {
                    if (char === letter) {
                        correctLetters.push(char);
                        const letterBoxes = wordDisplay.querySelectorAll('.letter-box');
                        const letterBox = letterBoxes[index];
                        letterBox.classList.add('revealed');
                        letterBox.querySelector('.letter-back').innerText = char;
                    }
                });
            } else {
                button.classList.add('wrong');
                wrongGuessCount++;
                const partsToDraw = Array.from(document.querySelectorAll('.hangman-part'));
                if(wrongGuessCount <= partsToDraw.length) {
                    partsToDraw[wrongGuessCount - 1].classList.add('visible');
                }
            }
            
            wrongGuessesCount.innerText = `${wrongGuessCount} / ${maxGuesses}`;
            checkGameState();
        };

        const createConfetti = () => {
            const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'];
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.animationDelay = Math.random() * 5 + 's';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                animationContainer.appendChild(confetti);
            }
        };

        const checkGameState = () => {
            if (wrongGuessCount >= maxGuesses) {
                [...currentWord].forEach((char, index) => {
                    const letterBox = wordDisplay.querySelectorAll('.letter-box')[index];
                    if (!letterBox.classList.contains('revealed')) {
                        letterBox.classList.add('revealed');
                        const letterBack = letterBox.querySelector('.letter-back');
                        letterBack.innerText = char;
                        letterBack.style.color = 'var(--wrong-color)';
                    }
                });

                setTimeout(() => {
                    modalTitle.innerText = "Game Over!";
                    modalText.innerHTML = `The correct word was: <strong class="text-blue-400">${currentWord}</strong>`;
                    modal.classList.add('active');
                }, 1200);
            }

            const uniqueCorrectLetters = new Set(correctLetters);
            const uniqueWordLetters = new Set(currentWord.split(''));
            
            if (uniqueCorrectLetters.size === uniqueWordLetters.size) {
                 score++;
                 setTimeout(() => {
                    modalTitle.innerText = "You Win!";
                    modalText.innerHTML = `You found the word: <strong class="text-blue-400">${currentWord}</strong>`;
                    createConfetti();
                    modal.classList.add('active');
                }, 800);
            }
        };

        playAgainBtn.addEventListener('click', resetGame);
        
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active')) return;
            
            const key = e.key.toUpperCase();
            if (key >= 'A' && key <= 'Z') {
                const buttons = keyboardDiv.getElementsByTagName('button');
                for (let button of buttons) {
                    if (button.innerText === key && !button.disabled) {
                        handleGuess(button, key);
                        break;
                    }
                }
            }
        });

        // --- Cursor Effect ---
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // --- Cosmic Stars Background ---
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        document.body.insertBefore(canvas, document.body.firstChild);
        const ctx = canvas.getContext('2d');

        let particlesArray = [];
        const numberOfParticles = 200;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 2;
                this.speedX = (Math.random() * 0.5) - 0.25;
                this.speedY = (Math.random() * 0.5) - 0.25;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // reset particle if it goes off screen
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                let spikes = 5;
                let outerRadius = this.size * 1.5;
                let innerRadius = this.size * 0.7;
                let rot = Math.PI / 2 * 3;
                let x = this.x;
                let y = this.y;
                let step = Math.PI / spikes;

                ctx.moveTo(this.x, this.y - outerRadius);
                for (let i = 0; i < spikes; i++) {
                    x = this.x + Math.cos(rot) * outerRadius;
                    y = this.y + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += step;

                    x = this.x + Math.cos(rot) * innerRadius;
                    y = this.y + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += step;
                }
                ctx.lineTo(this.x, this.y - outerRadius);
                ctx.closePath();
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 26, 1)';
            ctx.fillRect(0,0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animate);
        }
        
        resizeCanvas();
        animate();
        resetGame();