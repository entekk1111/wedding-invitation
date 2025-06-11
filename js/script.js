// js/script.js 파일

// 상수 정의 (Magic Number 제거)
const TYPING_TEXT_1 = "가을에 바람이 불면\n더 깊어진 눈빛으로\n당신을 사랑한다고 말하겠습니다.\n- 가을에, 이해인 -";
const TYPING_TEXT_2 = "저희, 결혼합니다.";
const TYPING_SPEED = 120; // ms
const FADE_OUT_DURATION = 700; // ms
const TEXT_TRANSITION_DELAY = 1000; // ms (첫 텍스트 완료 후 다음 텍스트까지 대기 시간)

const GALLERY_IMAGE_COUNT = 21; // 전체 갤러리 이미지 개수
const INITIAL_DISPLAY_COUNT = 9; // 처음 보여줄 썸네일 개수
const EXPANDED_DISPLAY_COUNT = GALLERY_IMAGE_COUNT; // '더보기' 클릭 시 보여줄 썸네일 개수

const SWIPE_THRESHOLD = 50; // 스와이프로 인식할 최소 이동 거리 (px)
const SCROLL_REVEAL_OFFSET = 100; // 스크롤 리빌 요소가 화면에 나타나기 시작하는 오프셋

// DOM 요소 캐싱
const typingTextEl = document.getElementById("typingText");
const mainImageEl = document.getElementById('mainImage');
const galleryGridEl = document.getElementById('galleryGrid');
const lightboxModalEl = document.getElementById('lightboxModal');
const lightboxImageContainerEl = document.getElementById('lightboxImageContainer');
const closeLightboxBtn = document.getElementById('closeLightbox');
const prevImageBtn = document.getElementById('prevImage');
const nextImageBtn = document.getElementById('nextImage');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const imageCounterEl = document.getElementById('imageCounter');
const copySuccessModalEl = document.getElementById('copySuccessModal');
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');


let typingIndex = 0;
let currentTypingText = TYPING_TEXT_1;
let currentDisplayedImageCount = INITIAL_DISPLAY_COUNT;
let currentImageIndex = 0; // Lightbox에 현재 표시된 이미지 인덱스
let isLightboxTransitioning = false; // Lightbox 애니메이션 중복 방지 플래그

// 이미지 파일 목록 생성
const galleryImages = [];
for (let i = 1; i <= GALLERY_IMAGE_COUNT; i++) {
    galleryImages.push(`./images/gallery/img${i}.jpg`);
}

/**
 * 타이핑 효과 함수
 */
function typeCharacter() {
    if (typingIndex < currentTypingText.length) {
        let char = currentTypingText.charAt(typingIndex);
        if (char === '\n') {
            typingTextEl.innerHTML += '<br>';
        } else {
            typingTextEl.innerHTML += char;
        }
        typingIndex++;
        setTimeout(typeCharacter, TYPING_SPEED);
    } else {
        if (currentTypingText === TYPING_TEXT_1) {
            setTimeout(fadeOutAndTypeNext, TEXT_TRANSITION_DELAY);
        } else if (currentTypingText === TYPING_TEXT_2) {
            console.log("두 번째 텍스트 타이핑 완료");
        }
    }
}

function fadeOutAndTypeNext() {
    typingTextEl.classList.add('fade-out');
    setTimeout(() => {
        typingTextEl.classList.remove('fade-out');
        typingTextEl.innerHTML = '';

        // 텍스트 크기 변경 (Tailwind 클래스 활용)
        typingTextEl.classList.remove('text-l');
        typingTextEl.classList.add('text-2xl');

        typingIndex = 0;
        currentTypingText = TYPING_TEXT_2;
        typeCharacter();
    }, FADE_OUT_DURATION);
}

function startTypingProcess() {
    currentTypingText = TYPING_TEXT_1;
    typingIndex = 0;
    typingTextEl.innerHTML = '';
    typingTextEl.classList.remove('fade-out', 'text-2xl');
    typingTextEl.classList.add('text-l'); // 첫 번째 텍스트는 기본 크기(text-l)로 시작

    if (mainImageEl) {
        mainImageEl.style.opacity = 1; // 메인 이미지 페이드인 시작
    }

    typeCharacter();
}


/**
 * 갤러리 관련 함수
 */
function displayGallery() {
    galleryGridEl.innerHTML = '';
    for (let i = 0; i < currentDisplayedImageCount && i < galleryImages.length; i++) {
        const imagePath = galleryImages[i];
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Gallery Image ${i + 1}`;
        img.dataset.index = i;
        galleryGridEl.appendChild(img);
    }
    // '더보기' 버튼 표시 여부 결정
    if (currentDisplayedImageCount < EXPANDED_DISPLAY_COUNT && currentDisplayedImageCount < galleryImages.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function updateImageCounter() {
    imageCounterEl.textContent = `${currentImageIndex + 1}/${galleryImages.length}`;
}

function openLightbox(index) {
    currentImageIndex = index;
    isLightboxTransitioning = true; // 라이트박스 열림 시작

    // 라이트박스 컨테이너에 모든 이미지 추가 (이미지 로드 완료 대기)
    lightboxImageContainerEl.innerHTML = '';
    let imagesLoadedCount = 0;
    const totalImagesToLoad = galleryImages.length;

    galleryImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Gallery Image';
        img.onload = () => {
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImagesToLoad) {
                // 모든 이미지가 로드된 후 초기 위치 설정 및 애니메이션 준비

                // --- 버그 수정: 초기 위치 설정 시 트랜지션 일시 비활성화 ---
                lightboxImageContainerEl.style.transition = 'none'; // 트랜지션 비활성화
                lightboxImageContainerEl.style.transform = `translateX(-${currentImageIndex * 100}%)`;

                // 아주 짧은 setTimeout으로 다음 렌더링 사이클에서 트랜지션 복원
                // 이렇게 해야 브라우저가 'transition: none'을 먼저 적용하고 'transform'을 변경한 후,
                // 다시 'transition'을 설정하는 것을 인지합니다.
                setTimeout(() => {
                    lightboxImageContainerEl.style.transition = 'transform 0.3s ease-out'; // 트랜지션 복원
                    isLightboxTransitioning = false; // 모든 이미지 로드 및 초기 위치 설정 완료
                }, 50); // 아주 짧은 지연 시간 (예: 50ms)
                // -----------------------------------------------------------
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImagesToLoad) {
                lightboxImageContainerEl.style.transition = 'none';
                lightboxImageContainerEl.style.transform = `translateX(-${currentImageIndex * 100}%)`;
                setTimeout(() => {
                    lightboxImageContainerEl.style.transition = 'transform 0.3s ease-out';
                    isLightboxTransitioning = false;
                }, 50);
            }
        };
        lightboxImageContainerEl.appendChild(img);
    });

    lightboxModalEl.classList.remove('hidden');
    lightboxModalEl.classList.add('visible');
    document.body.style.overflow = 'hidden'; // body 스크롤 방지
    addSwipeListeners();
    updateImageCounter();
}

function closeLightbox() {
    lightboxModalEl.classList.add('hidden');
    lightboxModalEl.classList.remove('visible');
    document.body.style.overflow = ''; // body 스크롤 허용
    removeSwipeListeners();
    isLightboxTransitioning = false;
}

/**
 * 갤러리 이미지 슬라이드 전환 (컨테이너 이동)
 * @param {string} direction 'next' 또는 'prev'
 */
function navigateLightbox(direction) {
    if (isLightboxTransitioning) return; // 애니메이션 중복 방지
    isLightboxTransitioning = true;

    let newIndex = currentImageIndex;
    if (direction === 'next') {
        newIndex = (currentImageIndex + 1) % galleryImages.length;
    } else {
        newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    currentImageIndex = newIndex;

    // 컨테이너 이동
    lightboxImageContainerEl.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    updateImageCounter();

    // 트랜지션 완료 대기 후 플래그 해제
    // (CSS transition 시간 0.3s와 동일하게)
    setTimeout(() => {
        isLightboxTransitioning = false;
    }, 300);
}


// 갤러리 이벤트 리스너 연결
galleryGridEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const index = parseInt(e.target.dataset.index);
        openLightbox(index);
    }
});

// Lightbox 버튼 이벤트 리스너 연결
closeLightboxBtn.addEventListener('click', closeLightbox);
prevImageBtn.addEventListener('click', () => navigateLightbox('prev'));
nextImageBtn.addEventListener('click', () => navigateLightbox('next'));

// '더보기' 버튼 클릭 이벤트 리스너
loadMoreBtn.addEventListener('click', () => {
    currentDisplayedImageCount = EXPANDED_DISPLAY_COUNT; // 표시할 이미지 개수를 확장된 개수로 변경
    displayGallery(); // 갤러리 다시 그리기
});

// 키보드 방향키로 이동
document.addEventListener('keydown', (e) => {
    if (lightboxModalEl.classList.contains('visible')) {
        if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});


// 스와이프 기능 관련 JavaScript
let touchStartX = 0;
let touchCurrentX = 0; // 현재 터치 위치 추적용
let isDragging = false; // 드래그 시작 여부

function handleTouchStart(e) {
    if (isLightboxTransitioning) return;
    isDragging = true;
    touchStartX = e.changedTouches[0].screenX;
    // 드래그 시작 시 transition 일시 정지 (부드러운 드래그를 위해)
    lightboxImageContainerEl.style.transition = 'none';
}

function handleTouchMove(e) {
    if (!isDragging) return;
    touchCurrentX = e.changedTouches[0].screenX;
    const deltaX = touchCurrentX - touchStartX;

    // 현재 슬라이드 위치를 기준으로 드래그에 따라 실시간으로 컨테이너 이동
    const currentTranslateX = -currentImageIndex * 100; // 현재 이미지의 % 위치
    lightboxImageContainerEl.style.transform = `translateX(${currentTranslateX + (deltaX / window.innerWidth) * 100}%)`;
}

function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    // 트랜지션 다시 활성화
    lightboxImageContainerEl.style.transition = 'transform 0.3s ease-out';

    const deltaX = touchCurrentX - touchStartX;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) { // 오른쪽으로 스와이프 (이전 사진)
            navigateLightbox('prev');
        } else { // 왼쪽으로 스와이프 (다음 사진)
            navigateLightbox('next');
        }
    } else {
        // 임계값 미달 시 원래 위치로 복귀 (애니메이션 적용)
        lightboxImageContainerEl.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }
    touchStartX = 0;
    touchCurrentX = 0;
}

// Lightbox 이미지 컨테이너에 터치 이벤트 리스너를 추가/제거하는 함수
function addSwipeListeners() {
    lightboxImageContainerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightboxImageContainerEl.addEventListener('touchmove', handleTouchMove, { passive: false }); // passive: false로 변경하여 preventDefault 가능성 열어둠
    lightboxImageContainerEl.addEventListener('touchend', handleTouchEnd);
}

function removeSwipeListeners() {
    lightboxImageContainerEl.removeEventListener('touchstart', handleTouchStart);
    lightboxImageContainerEl.removeEventListener('touchmove', handleTouchMove);
    lightboxImageContainerEl.removeEventListener('touchend', handleTouchEnd);
}


/**
 * 스크롤 리빌 애니메이션 JavaScript
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight - SCROLL_REVEAL_OFFSET &&
        rect.bottom > 0
    );
}

function revealOnScroll() {
    scrollRevealElements.forEach(element => {
        if (!element.classList.contains('visible') && isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

function go_navi() {
    Kakao.Navi.start({
        name: '전주 향교',
        x: 35.812774378501416,
        y: 127.15711520010265,
        coordType: 'wgs84',
    });
}

/**
 * 주소/계좌번호 복사 기능 (모달 메시지 사용)
 */
document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
        const textToCopy = button.dataset.copyText;

        try {
            await navigator.clipboard.writeText(textToCopy);

            // 모달 표시
            copySuccessModalEl.classList.add('show');

            // 2초 후 모달 숨기기
            setTimeout(() => {
                copySuccessModalEl.classList.remove('show');
            }, 2000); // 2초 (2000ms) 후에 숨김

            // 아이콘 변경
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('far', 'fa-copy');
                icon.classList.add('fas', 'fa-check'); // 체크 아이콘으로 변경
                setTimeout(() => {
                    icon.classList.remove('fas', 'fa-check');
                    icon.classList.add('far', 'fa-copy'); // 다시 복사 아이콘으로
                }, 1500); // 아이콘 변경은 모달이 사라지기 전에 원상 복구
            }
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
            alert('복사에 실패했습니다. 수동으로 복사해주세요.');
        }
    });
});


// 페이지 로드 완료 시 실행
window.addEventListener("DOMContentLoaded", () => {
    startTypingProcess(); // 페이지 로드 시 첫 번째 텍스트 타이핑 시작
    displayGallery(); // 갤러리 표시 (초기 9개)

    // 스크롤 리빌 초기 실행 및 이벤트 리스너 등록
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
});