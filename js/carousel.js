/*
The following code controls the carousel on the About page
The carousel rotates between different pets available for adoption

For accessibility we support screen reader announcements, keyboard control,
respect the less movement setting and allow a user to disable autoplay of the 
carousel.  
*/

const carousel = document.querySelector('.carousel');
const slides = Array.from(carousel.querySelectorAll('.slide'));
const dotsContainer = carousel.querySelector('.dots');
const prevBtn = carousel.querySelector('.prev');
const nextBtn = carousel.querySelector('.next');
const pauseBtn = carousel.querySelector('.pause');
const intervalTime = 5000;
const USER_PAUSED_KEY = "userPausedStorageKey";

let currentIndex = 0;
let autoplayTimer;



/* The when a user pauses the carousel we want to remember that choice
    so we keep the value in localstorage */
function loadUserPausedSetting() {
    return JSON.parse(localStorage.getItem(USER_PAUSED_KEY) ?? 'false');
}

function saveUserPausedSetting(val) {
    if (typeof val !== "boolean") {
        console.warn("received a non boolean value for userPaused");
    }
    localStorage.setItem(USER_PAUSED_KEY, JSON.stringify(val));
}

// Generate the dots for each slide in the carousel to allow direct navigation
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    if (index === 0) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
    }
    dot.addEventListener('click', () => {
        goToSlide(index, true);
    });
    dotsContainer.appendChild(dot);
});
const dots = Array.from(dotsContainer.querySelectorAll('button'));

// Live region for screen reader announcements
// when a user changes the slide via buttons or keyboard input
// this will update and announce the new content
const liveRegion = document.createElement('p');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
carousel.appendChild(liveRegion);

// moves the carousel to the given slide number
// if announce is true (when a user requests the change)
// we update a 1px region on the site to enable a screen reader to 
// announce the change in content
// we do not announce changes that occur due to the autoplay timer
function goToSlide(index, announce = false) {
    // deactivate current slide
    slides[currentIndex].classList.remove('active');
    slides[currentIndex].setAttribute('inert', '');
    dots[currentIndex].classList.remove('active');
    dots[currentIndex].removeAttribute('aria-current');

    // calculate the next slide position
    currentIndex = (index + slides.length) % slides.length;

    // Activate new slide
    slides[currentIndex].classList.add('active');
    slides[currentIndex].removeAttribute('inert');
    dots[currentIndex].classList.add('active');
    dots[currentIndex].setAttribute('aria-current', 'true');

    if (announce) {
        liveRegion.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
    }
}

function startAutoplay() {
    if (loadUserPausedSetting()) return;
    autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), intervalTime);
}

function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
}

nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1, true);
});

prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1, true);
});

function showPlayButton() {
    pauseBtn.textContent = '\u25B6\uFE0E';
    pauseBtn.setAttribute("aria-label", "Play Carousel");
}

function showPauseButton() {
    pauseBtn.textContent = '\u23F8\uFE0E';
    pauseBtn.setAttribute("aria-label", "Pause Carousel");
}

// for a first time visitor requesting less motion, start paused
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && localStorage.getItem(USER_PAUSED_KEY) == null) {
    saveUserPausedSetting(true);
}

loadUserPausedSetting() ? showPlayButton() : showPauseButton();

// when they click the play/pause button check the current state then flip
// always load/save the value to local storage
pauseBtn.addEventListener('click', () => {
    if (loadUserPausedSetting()) {
        saveUserPausedSetting(false);
        showPauseButton();
        goToSlide(currentIndex + 1, true);
    } else {
        saveUserPausedSetting(true);
        showPlayButton();
    }
});

// Keyboard arrow support when focused inside the carousel
// useful for non-visual browsers
carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1, true);
    } else if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1, true);
    }
});

// Pause autoplay on hover or keyboard focus on the carousel
// the user is interactive (to press a button or navigate) lets not autoplay until they are done
carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
carousel.addEventListener('mouseleave', resetAutoplay);
carousel.addEventListener('focusin', () => clearInterval(autoplayTimer));
carousel.addEventListener('focusout', resetAutoplay);

startAutoplay();
