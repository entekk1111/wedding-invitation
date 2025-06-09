// js/script.js 파일

// 타이핑 효과 스크립트
const text1 = "가을에 바람이 불면\n더 깊어진 눈빛으로\n당신을 사랑한다고 말하겠습니다.\n- 가을에, 이해인 -";
const text2 = "저희, 결혼합니다.";
const el = document.getElementById("typingText");

let typingIndex = 0;
let currentText = text1;


function typeCharacter() {
    if (typingIndex < currentText.length) {
        let char = currentText.charAt(typingIndex);
        if (char === '\n') {
            el.innerHTML += '<br>';
        } else {
            el.innerHTML += char;
        }
        typingIndex++;
        setTimeout(typeCharacter, 120);
    } else {
        if (currentText === text1) {
            setTimeout(fadeOutAndTypeNext, 1000);
        } else if (currentText === text2) {
            console.log("두 번째 텍스트 타이핑 완료");
        }
    }
}

function fadeOutAndTypeNext() {
    el.classList.add('fade-out');
    setTimeout(() => {
        el.classList.remove('fade-out');
        el.innerHTML = '';

        // 텍스트 크기 변경
        el.classList.remove('text-l');
        el.classList.add('text-2xl');

        typingIndex = 0;
        currentText = text2;
        typeCharacter();
    }, 700);
}

function startTyping(textToType) {
    currentText = textToType;
    typingIndex = 0;
    el.innerHTML = '';
    el.classList.remove('fade-out');
    // 첫 번째 텍스트는 기본 크기(text-l)로 시작
    el.classList.remove('text-2xl');
    el.classList.add('text-l');

    // 메인 이미지 가져오기 및 페이드인 시작
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.style.opacity = 1;
    }

    typeCharacter();
}


// 갤러리 및 Lightbox 스크립트
const galleryGrid = document.getElementById('galleryGrid');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightboxBtn = document.getElementById('closeLightbox');
const prevImageBtn = document.getElementById('prevImage');
const nextImageBtn = document.getElementById('nextImage');

// 이미지 파일 목록 (img1.jpg ~ img40.jpg로 자동 생성)
const images = [];
for (let i = 1; i <= 40; i++) {
    images.push(`./images/gallery/img${i}.jpg`);
}

let currentImageIndex = 0;
let isTransitioning = false; // 애니메이션 중복 방지 플래그

function displayGallery() {
    galleryGrid.innerHTML = '';
    const numberOfThumbnailsToShow = 9;

    for (let i = 0; i < numberOfThumbnailsToShow && i < images.length; i++) {
        const imagePath = images[i];
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Gallery Image ${i + 1}`;
        img.dataset.index = i;
        galleryGrid.appendChild(img);
    }
}

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = images[currentImageIndex]; // 첫 이미지 로드
    lightboxModal.classList.add('visible'); // CSS visible 클래스 추가하여 보이게 함
    document.body.style.overflow = 'hidden'; // body 스크롤 방지
    addSwipeListeners(); // Lightbox 열릴 때 스와이프 리스너 추가
    isTransitioning = false; // 모달 열릴 때 트랜지션 상태 초기화
    lightboxImage.classList.remove('image-fade-out'); // 혹시 모를 잔여 페이드아웃 클래스 제거
}

function closeLightbox() {
    lightboxModal.classList.remove('visible'); // CSS visible 클래스 제거하여 숨김
    document.body.style.overflow = ''; // body 스크롤 허용
    removeSwipeListeners(); // Lightbox 닫힐 때 스와이프 리스너 제거
}

// 다음 이미지 보여주기 함수 (애니메이션 적용)
function showNextImage() {
    if (isTransitioning) return;
    isTransitioning = true;

    lightboxImage.classList.add('image-fade-out'); // 페이드아웃 시작

    setTimeout(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];

        lightboxImage.classList.remove('image-fade-out');

        isTransitioning = false;
    }, 300); // CSS transition 시간과 일치 또는 약간 길게 설정 (ms)
}

// 이전 이미지 보여주기 함수 (애니메이션 적용)
function showPrevImage() {
    if (isTransitioning) return;
    isTransitioning = true;

    lightboxImage.classList.add('image-fade-out'); // 페이드아웃 시작

    setTimeout(() => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];

        lightboxImage.classList.remove('image-fade-out');

        isTransitioning = false;
    }, 300); // CSS transition 시간과 일치 또는 약간 길게 설정 (ms)
}


// 갤러리 이벤트 리스너 연결
galleryGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const index = parseInt(e.target.dataset.index);
        openLightbox(index);
    }
});

// Lightbox 버튼 이벤트 리스너 연결
closeLightboxBtn.addEventListener('click', closeLightbox);
prevImageBtn.addEventListener('click', showPrevImage);
nextImageBtn.addEventListener('click', showNextImage);

// 키보드 방향키로 이동 (선택 사항)
document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('visible')) {
        if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});


// 스와이프 기능 관련 JavaScript
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // 스와이프로 인식할 최소 이동 거리 (px)

function handleTouchStart(e) {
    if (isTransitioning) return;
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchMove(e) {
    if (isTransitioning) return;
    touchEndX = e.changedTouches[0].screenX;
}

function handleTouchEnd() {
    if (isTransitioning) return;

    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) { // 오른쪽으로 스와이프 (이전 사진)
            showPrevImage();
        } else { // 왼쪽으로 스와이프 (다음 사진)
            showNextImage();
        }
    }
    touchStartX = 0;
    touchEndX = 0;
}

// Lightbox 이미지에 터치 이벤트 리스너를 추가/제거하는 함수
function addSwipeListeners() {
    lightboxImage.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightboxImage.addEventListener('touchmove', handleTouchMove, { passive: true });
    lightboxImage.addEventListener('touchend', handleTouchEnd);
}

function removeSwipeListeners() {
    lightboxImage.removeEventListener('touchstart', handleTouchStart);
    lightboxImage.removeEventListener('touchmove', handleTouchMove);
    lightboxImage.removeEventListener('touchend', handleTouchEnd);
}


// 스크롤 리빌 애니메이션 JavaScript
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const offset = 100;
    return (
        rect.top < window.innerHeight - offset &&
        rect.bottom > 0
    );
}

function revealOnScroll() {
    scrollRevealElements.forEach(element => {
        if (!element.classList.contains('visible') && isInViewport(element)) {
            element.classList.add('visible');
        }
        // else if (element.classList.contains('visible') && !isInViewport(element) && rect.bottom < 0) {
        //     element.classList.remove('visible');
        // }
    });
}

// 페이지 로드 완료 시 실행
window.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드 시 첫 번째 텍스트 타이핑 시작
    startTyping(text1); // startTyping 함수 내부에서 메인 이미지 페이드인 시작

    // 갤러리 표시 (이제 9개만)
    displayGallery();

    // 스크롤 리빌 초기 실행 및 이벤트 리스너 등록
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
});
