document.addEventListener("DOMContentLoaded", () => {

    const countdownEl = document.getElementById("countdown");
    const canvas = document.getElementById("petalCanvas");
    const ctx = canvas.getContext("2d");
    const englishText = document.getElementById("englishText");
    const tamilText = document.getElementById("tamilText");
    const sound = document.getElementById("pongalSound");
    const startOverlay = document.getElementById("startOverlay");

    /* CANVAS SETUP */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* PERFORMANCE SETTINGS */
    const isMobile = window.innerWidth < 768;
    const MAX_PETALS = isMobile ? 40 : 100;
    let petalRate = isMobile ? 2 : 5;

    let petals = [];
    let animationId;

    class Petal {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 6 + 4;
            this.speed = Math.random() * 2 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.02;
        }
        update() {
            this.y += this.speed;
            this.angle += this.spin;
            if (this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = "#f5c542";
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function addPetals() {
        for (let i = 0; i < petalRate && petals.length < MAX_PETALS; i++) {
            petals.push(new Petal());
        }
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => { p.update(); p.draw(); });
        animationId = requestAnimationFrame(animatePetals);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(animationId);
        else animatePetals();
    });

    startOverlay.addEventListener("click", () => {
        sound.play().then(() => {
            sound.pause();
            sound.currentTime = 0;
        }).catch(() => {});

        startOverlay.remove();
        startCountdown();
    }, { once: true });

    function startCountdown() {
        let count = 3;
        countdownEl.textContent = count;

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.textContent = count;
            } else {
                clearInterval(timer);
                countdownEl.remove();
                document.body.classList.add("festive-bg");

                sound.play().catch(() => {});

                addPetals();
                animatePetals();

                setTimeout(() => petalRate = 1, 6000);

                englishText.classList.add("show");

                setTimeout(() => {
                    englishText.classList.remove("show");
                    englishText.classList.add("hide");
                }, 2200);

                setTimeout(() => tamilText.classList.add("show"), 3000);
            }
        }, 1000);
    }

});
