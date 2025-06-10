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
const loadMoreBtn = document.getElementById('loadMoreBtn'); // 새로 추가된 더보기 버튼
const imageCounter = document.getElementById('imageCounter'); // 이미지 카운터 요소

// 이미지 파일 목록 (img1.jpg ~ img40.jpg로 자동 생성)
const images = [];
for (let i = 1; i <= 21; i++) {
    images.push(`./images/gallery/img${i}.jpg`);
}

// 갤러리에 처음 보여줄 이미지 개수 및 전체 이미지 개수 설정
const initialImageCount = 9; // 처음 보여줄 썸네일 개수
const expandedImageCount = 21; // '더보기' 클릭 시 보여줄 썸네일 개수 (img21까지 포함)
let currentDisplayedImageCount = initialImageCount;
let currentImageIndex = 0; // Lightbox에 현재 표시된 이미지 인덱스
let isTransitioning = false; // 애니메이션 중복 방지 플래그 (애니메이션 없지만 유지)

function displayGallery() {
    galleryGrid.innerHTML = '';
    // 현재 표시할 이미지 개수만큼만 반복
    for (let i = 0; i < currentDisplayedImageCount && i < images.length; i++) {
        const imagePath = images[i];
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Gallery Image ${i + 1}`;
        img.dataset.index = i;
        galleryGrid.appendChild(img);
    }
    // '더보기' 버튼 표시 여부 결정
    if (currentDisplayedImageCount < expandedImageCount && currentDisplayedImageCount < images.length) {
        loadMoreBtn.style.display = 'block'; // 아직 더 보여줄 이미지가 있고, 전체 확장 개수보다 적으면 버튼 표시
    } else {
        loadMoreBtn.style.display = 'none'; // 아니면 버튼 숨김
    }
}

function updateImageCounter() {
    imageCounter.textContent = `${currentImageIndex + 1}/${images.length}`;
}

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = images[currentImageIndex]; // 이미지 즉시 로드
    lightboxModal.classList.remove('hidden'); // Tailwind 'hidden' 클래스 제거
    lightboxModal.classList.add('visible'); // 사용자 정의 'visible' 클래스 추가
    document.body.style.overflow = 'hidden'; // body 스크롤 방지
    addSwipeListeners();
    updateImageCounter(); // 카운터 업데이트
    isTransitioning = false;
    // 애니메이션 관련 클래스 모두 제거 (초기 로드 시에도)
    lightboxImage.classList.remove('slide-next-in', 'slide-prev-in', 'slide-next-out', 'slide-prev-out', 'initial-load');
    lightboxImage.style.opacity = 1; // 이미지는 항상 보이도록
}

function closeLightbox() {
    lightboxModal.classList.add('hidden'); // Tailwind 'hidden' 클래스 추가
    lightboxModal.classList.remove('visible'); // 사용자 정의 'visible' 클래스 제거
    document.body.style.overflow = ''; // body 스크롤 허용
    removeSwipeListeners();
    isTransitioning = false; // 닫을 때 애니메이션 플래그 초기화
}

// 다음 이미지 보여주기 함수 (애니메이션 없음)
function showNextImage() {
    if (isTransitioning) return; // 애니메이션이 없어도, 빠른 클릭 방지용으로 유지
    isTransitioning = true; // 잠시 true로 설정하여 빠른 클릭 방지

    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImage.src = images[currentImageIndex]; // 이미지 즉시 변경
    updateImageCounter(); // 카운터 업데이트

    isTransitioning = false; // 이미지 변경 후 바로 false로 설정
}

// 이전 이미지 보여주기 함수 (애니메이션 없음)
function showPrevImage() {
    if (isTransitioning) return; // 애니메이션이 없어도, 빠른 클릭 방지용으로 유지
    isTransitioning = true; // 잠시 true로 설정하여 빠른 클릭 방지

    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentImageIndex]; // 이미지 즉시 변경
    updateImageCounter(); // 카운터 업데이트

    isTransitioning = false; // 이미지 변경 후 바로 false로 설정
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

// '더보기' 버튼 클릭 이벤트 리스너
loadMoreBtn.addEventListener('click', () => {
    currentDisplayedImageCount = expandedImageCount; // 표시할 이미지 개수를 확장된 개수로 변경
    displayGallery(); // 갤러리 다시 그리기
});


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
    if (isTransitioning) return; // 빠른 터치 방지용으로 유지
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchMove(e) {
    if (isTransitioning) return; // 빠른 터치 방지용으로 유지
    touchEndX = e.changedTouches[0].screenX;
}

function handleTouchEnd() {
    if (isTransitioning) return; // 빠른 터치 방지용으로 유지

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
    });
}

// 주소 복사 기능 (모달 메시지 사용)
document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
        const textToCopy = button.dataset.copyText;
        const copySuccessModal = document.getElementById('copySuccessModal'); // 모달 요소 가져오기

        try {
            await navigator.clipboard.writeText(textToCopy);

            // 모달 표시
            copySuccessModal.classList.add('show');

            // 2초 후 모달 숨기기
            setTimeout(() => {
                copySuccessModal.classList.remove('show');
            }, 2000); // 2초 (2000ms) 후에 숨김

            // 아이콘 변경 (선택 사항)
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
            // 복사 실패 시에는 alert 유지 (대체 불가 시)
            alert('주소 복사에 실패했습니다. 수동으로 복사해주세요.');
        }
    });
});


// 페이지 로드 완료 시 실행
window.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드 시 첫 번째 텍스트 타이핑 시작
    startTyping(text1); // startTyping 함수 내부에서 메인 이미지 페이드인 시작

    // 갤러리 표시 (초기 9개)
    displayGallery();

    // 스크롤 리빌 초기 실행 및 이벤트 리스너 등록
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
});