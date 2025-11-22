// Configuração
const DESTINATION_URL = 'https://t.me/minesdocr';

// Elementos
const video = document.querySelector('#mainVideo');
const ctaButtonLocked = document.querySelector('.cta-button.locked');
const ctaButtonUnlocked = document.querySelector('.cta-button.unlocked');
const vembetButton = document.querySelector('#vembetButton');
const instagramButton = document.querySelector('#instagramButton');

let videoEnded = false;
let videoStarted = false;

// Configuração de tempo dos botões (em segundos)
const BUTTON_TIMINGS = {
    vembet: { show: 48, hide: 130 },         // 0:48 até 2:10
    robot: { show: 132, hide: 150 },         // 2:12 até 2:40
    instagram: { show: 502, hide: 522 }      // 8:22 até 8:42 (20 segundos)
};

let time = 0;

setInterval(() => {
    time++;

    if (time === BUTTON_TIMINGS.vembet.show) {
        showButton(vembetButton, 'VemBet');
    }

    if (time === BUTTON_TIMINGS.robot.show) {
        showButton(ctaButtonLocked, 'Robô');
    } else if (time === BUTTON_TIMINGS.robot.hide) {
        hideButton(ctaButtonLocked, 'Robô');
        unlockButton();
    }

    if (time === BUTTON_TIMINGS.instagram.show) {
        showButton(instagramButton, 'Instagram');
    } else if (time === BUTTON_TIMINGS.instagram.hide) {
        hideButton(instagramButton, 'Instagram');
    }
    if (time >= 523) {
        showAllButtonsPermanently();
    }
}, 1000);

const VIDEO_DURATION = 8 * 60; // 8 minutos em segundos

// Função para mostrar todos os botões permanentemente
function showAllButtonsPermanently() {
    console.log('🎬 Fim do vídeo - mostrando todos os botões');

    // Remove classes de animação anterior
    const allButtons = [vembetButton, instagramButton];
    allButtons.forEach(btn => {
        if (btn) {
            btn.classList.remove('button-exit');
        }
    });

    // Garante que o botão bloqueado está escondido
    if (ctaButtonLocked) {
        ctaButtonLocked.style.display = 'none';
        ctaButtonLocked.classList.remove('button-enter', 'button-exit');
    }

    // Mostra apenas VemBet e Instagram permanentemente com animação escalonada
    const buttons = [
        { element: vembetButton, delay: 0, name: 'VemBet' },
        { element: instagramButton, delay: 200, name: 'Instagram' }
    ];

    buttons.forEach(({ element, delay, name }) => {
        if (element) {
            setTimeout(() => {
                element.style.display = 'flex';
                setTimeout(() => {
                    element.classList.add('button-enter');
                    console.log(`✨ Botão ${name} mostrado permanentemente`);
                }, 10);
            }, delay);
        }
    });
}

// Variáveis para controle do YouTube
let player;
let timeCheckInterval;
let buttonsState = {
    vembet: { shown: false, hidden: false },
    robot: { shown: false, hidden: false },
    instagram: { shown: false, hidden: false }
};

// Função para mostrar botão com animação
function showButton(button, buttonName) {
    if (!button) return;
    button.style.display = 'flex';
    setTimeout(() => {
        button.classList.add('button-enter');
        console.log(`✨ Botão ${buttonName} mostrado com animação`);
    }, 10);
}

// Função para esconder botão com animação
function hideButton(button, buttonName) {
    if (!button) return;
    button.classList.remove('button-enter');
    button.classList.add('button-exit');
    console.log(`🔄 Iniciando animação de saída: ${buttonName}`);

    setTimeout(() => {
        if (!videoEnded) {
            button.style.display = 'none';
            button.classList.remove('button-exit');
            console.log(`⏰ Botão ${buttonName} escondido`);
        }
    }, 500);
}

// Função para verificar o tempo do vídeo e mostrar/esconder botões
function checkVideoTime() {
    if (!player || !player.getCurrentTime) return;

    const currentTime = Math.floor(player.getCurrentTime());

    // VemBet - 0:48 até 2:10
    if (!buttonsState.vembet.shown && currentTime >= BUTTON_TIMINGS.vembet.show) {
        buttonsState.vembet.shown = true;
        console.log(`⏰ ${currentTime}s - Mostrando botão VemBet`);
        showButton(vembetButton, 'VemBet');
    }
    if (buttonsState.vembet.shown && !buttonsState.vembet.hidden && currentTime >= BUTTON_TIMINGS.vembet.hide) {
        buttonsState.vembet.hidden = true;
        console.log(`⏰ ${currentTime}s - Escondendo botão VemBet`);
        hideButton(vembetButton, 'VemBet');
    }

    // Robô - 2:12 até 8:28
    if (!buttonsState.robot.shown && currentTime >= BUTTON_TIMINGS.robot.show) {
        buttonsState.robot.shown = true;
        console.log(`⏰ ${currentTime}s - Mostrando botão Robô`);
        showButton(ctaButtonLocked, 'Robô');
    }
    if (buttonsState.robot.shown && !buttonsState.robot.hidden && currentTime >= BUTTON_TIMINGS.robot.hide) {
        buttonsState.robot.hidden = true;
        console.log(`⏰ ${currentTime}s - Escondendo botão Robô`);
        hideButton(ctaButtonLocked, 'Robô');
        unlockButton();
    }

    // Instagram - 8:22 até 8:42
    if (!buttonsState.instagram.shown && currentTime >= BUTTON_TIMINGS.instagram.show) {
        buttonsState.instagram.shown = true;
        console.log(`⏰ ${currentTime}s - Mostrando botão Instagram`);
        showButton(instagramButton, 'Instagram');
    }
    if (buttonsState.instagram.shown && !buttonsState.instagram.hidden && currentTime >= BUTTON_TIMINGS.instagram.hide) {
        buttonsState.instagram.hidden = true;
        console.log(`⏰ ${currentTime}s - Escondendo botão Instagram`);
        hideButton(instagramButton, 'Instagram');
    }
}

// Função para desbloquear botão
function unlockButton() {
    if (!videoEnded) {
        videoEnded = true;

        // Inicia animação de saída do botão bloqueado
        if (ctaButtonLocked && ctaButtonLocked.style.display !== 'none') {
            ctaButtonLocked.classList.remove('button-enter');
            ctaButtonLocked.classList.add('button-exit');

            setTimeout(() => {
                ctaButtonLocked.style.display = 'none';
                ctaButtonLocked.classList.remove('button-exit');
            }, 500);
        } else {
            // Se já estava escondido, apenas garante que está oculto
            if (ctaButtonLocked) ctaButtonLocked.style.display = 'none';
        }

        // Mostra botão desbloqueado com animação após o bloqueado sair
        setTimeout(() => {
            ctaButtonUnlocked.style.display = 'flex';
            ctaButtonUnlocked.href = DESTINATION_URL;

            setTimeout(() => {
                ctaButtonUnlocked.classList.add('button-enter');
            }, 10);

            // Efeito de confete
            createConfetti();

            // Scroll suave até o botão
            setTimeout(() => {
                ctaButtonUnlocked.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }, 600);
    }
}

// Inicializa API do YouTube
if (video && video.tagName === 'IFRAME' && video.src.includes('youtube.com')) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('mainVideo', {
            events: {
                'onStateChange': onPlayerStateChange,
                'onReady': onPlayerReady
            }
        });
    };
}

// Quando o player estiver pronto
function onPlayerReady(event) {
    console.log('✅ Player do YouTube carregado');

    // Força a maior qualidade disponível
    try {
        // Tenta configurar para HD (1080p ou 720p)
        const availableQualityLevels = player.getAvailableQualityLevels();
        if (availableQualityLevels && availableQualityLevels.length > 0) {
            // O primeiro item é sempre a maior qualidade disponível
            player.setPlaybackQuality(availableQualityLevels[0]);
            console.log(`🎬 Qualidade configurada: ${availableQualityLevels[0]}`);
        }
    } catch (e) {
        console.log('ℹ️ Configuração de qualidade automática');
    }
}

// Monitora mudanças de estado do player
function onPlayerStateChange(event) {
    // Quando o vídeo está tocando
    if (event.data === YT.PlayerState.PLAYING) {
        if (!videoStarted) {
            videoStarted = true;
            console.log('▶️ Vídeo iniciado - monitoramento de tempo ativado');

            // Tracking
            trackEvent('VideoPlay');

            // Inicia verificação de tempo a cada segundo
            timeCheckInterval = setInterval(checkVideoTime, 1000);
        }
    }

    // Quando o vídeo está pausado
    if (event.data === YT.PlayerState.PAUSED) {
        console.log('⏸️ Vídeo pausado');
    }

    // Quando o vídeo termina
    if (event.data === YT.PlayerState.ENDED) {
        console.log('🎬 Vídeo finalizado');

        // Tracking
        trackEvent('VideoCompleted');

        // Para o monitoramento de tempo
        if (timeCheckInterval) {
            clearInterval(timeCheckInterval);
        }

        // Mostra todos os botões e desbloqueia
        showAllButtonsPermanently();
        unlockButton();
    }
}

// Efeito de confete
function createConfetti() {
    const colors = ['#cfe322', '#d9ed4a', '#ffffff'];
    const confettiCount = 40;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 2.5s ease-out;
            `;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.opacity = '0';
                confetti.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 200 - 100}px)`;
            }, 50);

            setTimeout(() => confetti.remove(), 2600);
        }, i * 20);
    }
}

// Atalho para teste (CTRL + SHIFT + U) - remova em produção
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        unlockButton();
        console.log('🔓 Botão desbloqueado (modo teste)');
    }
});

// Tracking (opcional - integre com Google Analytics, Facebook Pixel, etc)
function trackEvent(eventName) {
    console.log('📊 Evento:', eventName);

    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName);
    }
}

// Tracking de eventos
document.addEventListener('DOMContentLoaded', () => {
    trackEvent('PageView');

    if (video) {
        const isHTML5 = video.tagName === 'VIDEO';

        if (isHTML5) {
            video.addEventListener('play', () => trackEvent('VideoPlay'), { once: true });
            video.addEventListener('ended', () => trackEvent('VideoCompleted'), { once: true });
        }
    }
});

if (ctaButtonUnlocked) {
    ctaButtonUnlocked.addEventListener('click', () => trackEvent('CTAClick'));
}

// ========== SLIDER DE PROVAS ==========
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('proofsSlider');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = document.querySelectorAll('.proof-slide').length;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    let currentSlide = 0;

    // Função para atualizar o slider
    function updateSlider() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Mobile: mostra 1 slide por vez
            const offset = -currentSlide * 100;
            slider.style.transform = `translateX(${offset}%)`;
        } else {
            // Desktop/iPad: mostra 3 slides, desloca 1 por vez
            // Cada slide ocupa 33.333% + gap
            const slidePercentage = 33.333;
            const offset = -currentSlide * slidePercentage;
            slider.style.transform = `translateX(${offset}%)`;
        }

        // Atualiza indicadores em todas as versões
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        console.log(`📸 Slide atual: ${currentSlide + 1}/${totalSlides}`);
    }

    // Calcula o número máximo de posições no slider
    function getMaxSlidePosition() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            return totalSlides - 1; // Mobile: todas as imagens
        } else {
            // Desktop: máximo é quando as últimas 3 imagens estão visíveis
            // Com 5 imagens, mostrando 3: posições 0, 1, 2
            return Math.max(0, totalSlides - 3);
        }
    }

    // Navegação anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            const maxPosition = getMaxSlidePosition();

            if (isMobile) {
                // Mobile: loop infinito normal
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            } else {
                // Desktop: se está na primeira posição, vai para a última válida
                if (currentSlide === 0) {
                    currentSlide = maxPosition;
                } else {
                    currentSlide--;
                }
            }
            updateSlider();
        });
    }

    // Navegação próxima
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            const maxPosition = getMaxSlidePosition();

            if (isMobile) {
                // Mobile: loop infinito normal
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                // Desktop: se está na última posição válida, volta para 0
                if (currentSlide >= maxPosition) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
            }
            updateSlider();
        });
    }

    // Clique nos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Suporte a gestos de swipe (touch)
    let touchStartX = 0;
    let touchEndX = 0;

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
    }

    // ========== LIGHTBOX ==========
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const allImages = Array.from(document.querySelectorAll('.proof-slide img'));
    let currentLightboxIndex = 0;

    // Função para atualizar contador
    function updateLightboxCounter() {
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${allImages.length}`;
        }
    }

    // Função para abrir lightbox
    function openLightbox(index) {
        currentLightboxIndex = index;
        lightbox.classList.add('active');
        lightboxImg.src = allImages[currentLightboxIndex].src;
        lightboxImg.alt = allImages[currentLightboxIndex].alt;
        updateLightboxCounter();
        document.body.style.overflow = 'hidden'; // Previne scroll do body
        console.log(`🔍 Lightbox aberto - Imagem ${currentLightboxIndex + 1}/${allImages.length}`);
    }

    // Função para fechar lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll do body
        console.log('❌ Lightbox fechado');
    }

    // Função para navegar no lightbox
    function navigateLightbox(direction) {
        if (direction === 'next') {
            currentLightboxIndex = (currentLightboxIndex + 1) % allImages.length;
        } else {
            currentLightboxIndex = (currentLightboxIndex - 1 + allImages.length) % allImages.length;
        }
        lightboxImg.src = allImages[currentLightboxIndex].src;
        lightboxImg.alt = allImages[currentLightboxIndex].alt;
        updateLightboxCounter();
        console.log(`📸 Lightbox - Imagem ${currentLightboxIndex + 1}/${allImages.length}`);
    }

    // Abre lightbox ao clicar na imagem (mobile e desktop)
    const proofImages = document.querySelectorAll('.proof-slide img');
    proofImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            openLightbox(index);
        });
    });

    // Navegação no lightbox
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('prev');
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('next');
        });
    }

    // Fecha lightbox ao clicar no X
    if (lightboxClose) {
        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    // Fecha lightbox ao clicar fora da imagem
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Navegação com teclado no lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });

    // Swipe no lightbox para mobile
    let lightboxTouchStartX = 0;
    let lightboxTouchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            if (e.target === lightboxImg || e.target === lightbox) {
                lightboxTouchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.target === lightboxImg || e.target === lightbox) {
                lightboxTouchEndX = e.changedTouches[0].screenX;
                handleLightboxSwipe();
            }
        }, { passive: true });
    }

    function handleLightboxSwipe() {
        const swipeThreshold = 50;

        if (lightboxTouchEndX < lightboxTouchStartX - swipeThreshold) {
            navigateLightbox('next');
        }

        if (lightboxTouchEndX > lightboxTouchStartX + swipeThreshold) {
            navigateLightbox('prev');
        }
    }

    // Atualiza slider ao redimensionar janela
    window.addEventListener('resize', () => {
        const maxPosition = getMaxSlidePosition();
        if (currentSlide > maxPosition) {
            currentSlide = maxPosition;
        }
        updateSlider();
    });

    // Inicializa slider
    updateSlider();
});

