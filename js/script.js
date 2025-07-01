// js/script.js 파일

// 상수 정의 (Magic Number 제거)
const TYPING_TEXT_1 = "가을에 바람이 불면\n더 깊어진 눈빛으로\n당신을 사랑한다고 말하겠습니다.\n- 가을에, 이해인 -";
const TYPING_TEXT_2 = "저희, 결혼합니다.";
const TYPING_SPEED = 120; // ms
const FADE_OUT_DURATION = 700; // ms
const TEXT_TRANSITION_DELAY = 1000; // ms (첫 텍스트 완료 후 다음 텍스트까지 대기 시간)

const GALLERY_IMAGE_COUNT = 27; // 전체 갤러리 이미지 개수
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
const copyMessageTextEl = document.getElementById('copyMessageText'); // 메시지 텍스트를 표시할 요소
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

// 배경 음악 관련 DOM 요소
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle.querySelector('i');
const musicText = document.getElementById('musicText'); // 추가된 음악 텍스트 요소

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

// 배경 음악 자동 재생 시도 및 토글 관련 로직
let hasUserInteracted = false; // 사용자의 첫 상호작용 여부 플래그

// '배경음악이 있습니다.' 문구를 숨기는 함수
function hideMusicTextWithAnimation() {
    if (musicText) {
        // 텍스트와 토글 버튼에 애니메이션 클래스 추가
        musicText.classList.add('hide-animation');
        musicToggle.classList.add('hide-animation');

        // 애니메이션 완료 후 텍스트 숨기기 및 공간 제거
        setTimeout(() => {
            musicText.style.display = 'none'; // 완전히 숨김
            // musicToggle의 width가 'auto'에서 줄어들었으므로,
            // 이후 flexbox 계산에 영향 주지 않도록 flex-basis: 0; 같은 처리도 고려 가능.
            // 하지만 animation forwards로 최종 상태 유지되므로 일단은 이렇게.
        }, 500); // CSS 애니메이션 시간과 동일하게
    }
}

// 갤러리 라이트박스 더블 탭 줌 방지
let lastTapTimeBody = 0; // 바디 전용 시간 변수
document.body.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTimeBody;

    // 더블 탭으로 간주되는 시간 범위 (일반적으로 300ms 이내)
    if (tapLength < 300 && tapLength > 0) {
        e.preventDefault(); // 기본 더블 탭 동작 방지
    }
    lastTapTimeBody = currentTime;
}, { passive: false }); // `passive: false`를 사용하여 `preventDefault`가 작동하도록 함



// 첫 사용자 상호작용 (클릭/터치) 시 음악 재생 시도
function handleFirstUserInteraction() {
    if (!hasUserInteracted) {
        backgroundMusic.play().then(() => {
            // 재생 성공 시 아이콘 업데이트
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
            hasUserInteracted = true;
        }).catch(error => {
            console.log("자동 재생이 차단되었습니다. 사용자 상호작용이 필요합니다.", error);
            hasUserInteracted = true; // 이후 수동 재생은 가능하도록 플래그 설정
        });
        // 첫 상호작용 후 리스너 제거 (한 번만 실행되도록)
        document.removeEventListener('click', handleFirstUserInteraction);
        document.removeEventListener('touchstart', handleFirstUserInteraction);

        // 2초 뒤에 문구 숨기기 애니메이션 시작
        setTimeout(hideMusicTextWithAnimation, 2000); // 2초 (2000ms) 후에 애니메이션 시작
    }
}

// 음악 토글 기능
musicToggle.addEventListener('click', () => {
    // 만약 텍스트가 아직 보이고 있다면, 즉시 숨김
    if (musicText && musicText.style.display !== 'none') {
        musicText.classList.add('hide-animation');
        musicToggle.classList.add('hide-animation');
        setTimeout(() => {
            musicText.style.display = 'none';
        }, 500);
    }

    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
        }).catch(error => {
            console.error("음악 재생에 실패했습니다:", error);
        });
    } else {
        backgroundMusic.pause();
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-volume-mute');
    }
});

// 음악 재생/일시정지 상태 변화 시 아이콘 업데이트
backgroundMusic.addEventListener('play', () => {
    musicIcon.classList.remove('fa-volume-mute');
    musicIcon.classList.add('fa-volume-up');
});

backgroundMusic.addEventListener('pause', () => {
    musicIcon.classList.remove('fa-volume-up');
    musicIcon.classList.add('fa-volume-mute');
});

// 초기 아이콘 상태 설정 (대부분의 브라우저에서 초기에는 재생되지 않으므로 음소거로 시작)
musicIcon.classList.add('fa-volume-mute');


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

/**
 * 라이트박스에 현재 인덱스 기준으로 이미지를 로드하고 표시하는 함수
 * 슬라이드를 위해 현재, 이전, 다음 이미지를 로드하고 배치합니다.
 * @param {number} index - 현재 보여줄 이미지의 인덱스
 */
function loadLightboxImage(index) {
    lightboxImageContainerEl.innerHTML = ''; // 기존 이미지 모두 제거

    // 이전 이미지 인덱스 계산
    const prevIndex = (index - 1 + galleryImages.length) % galleryImages.length;
    // 현재 이미지 인덱스
    const currentIndex = index;
    // 다음 이미지 인덱스 계산
    const nextIndex = (index + 1) % galleryImages.length;

    // 로드할 이미지 인덱스 배열
    const indicesToLoad = [prevIndex, currentIndex, nextIndex];

    // 각 인덱스에 해당하는 이미지를 생성하여 컨테이너에 추가
    indicesToLoad.forEach(idx => {
        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        img.src = galleryImages[idx];
        img.alt = 'Gallery Image';
        imgContainer.appendChild(img);
        lightboxImageContainerEl.appendChild(imgContainer);
    });

    // 현재 이미지가 중앙에 오도록 초기 translateX 위치 설정
    // 각 이미지는 100% 너비를 가지므로, 뷰포트 너비만큼 이동
    lightboxImageContainerEl.style.transform = `translateX(-${window.innerWidth}px)`;
}


function openLightbox(index) {
    currentImageIndex = index;
    isLightboxTransitioning = true; // 라이트박스 열림 시작

    lightboxModalEl.classList.remove('hidden');
    lightboxModalEl.classList.add('visible');
    document.body.style.overflow = 'hidden'; // body 스크롤 방지

    // 라이트박스 열릴 때 현재, 이전, 다음 이미지 로드
    loadLightboxImage(currentImageIndex);
    updateImageCounter();

    // 초기 transform 설정 (애니메이션 없이)
    // 현재 이미지가 중앙에 오도록 초기 위치 설정 (이전 이미지의 너비만큼 왼쪽으로 이동)
    lightboxImageContainerEl.style.transition = 'none';
    lightboxImageContainerEl.style.transform = `translateX(-${window.innerWidth}px)`;

    // 다음 프레임에서 transition 활성화하여 이후 슬라이드에 애니메이션 적용
    requestAnimationFrame(() => {
        lightboxImageContainerEl.style.transition = 'transform 0.3s ease-out';
        isLightboxTransitioning = false; // 로딩 및 초기 위치 설정 완료
    });

    addSwipeListeners();
}

function closeLightbox() {
    lightboxModalEl.classList.add('hidden');
    lightboxModalEl.classList.remove('visible');
    document.body.style.overflow = ''; // body 스크롤 허용
    removeSwipeListeners();
    isLightboxTransitioning = false;
}

/**
 * 갤러리 이미지 슬라이드 전환
 * @param {string} direction 'next' 또는 'prev'
 */
function navigateLightbox(direction) {
    if (isLightboxTransitioning) return; // 애니메이션 중복 방지
    isLightboxTransitioning = true;

    if (direction === 'next') {
        // 다음 이미지로 이동하는 애니메이션 (컨테이너를 왼쪽으로 2칸 이동)
        lightboxImageContainerEl.style.transform = `translateX(-${window.innerWidth * 2}px)`;
    } else { // 'prev'
        // 이전 이미지로 이동하는 애니메이션 (컨테이너를 오른쪽으로 0칸 이동)
        lightboxImageContainerEl.style.transform = `translateX(0px)`;
    }
    
    // 트랜지션이 완료될 시간을 기다린 후, 새 이미지 로드 및 위치 초기화
    setTimeout(() => {
        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        } else { // 'prev'
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        }
        updateImageCounter();

        // 새로운 이미지들(이전, 현재, 다음)을 로드하고 배치
        loadLightboxImage(currentImageIndex);
        
        // 위치를 초기화하여 (현재 이미지가 다시 중앙에 오도록)
        // 트랜지션을 일시 비활성화하고 위치를 설정한 뒤 다시 활성화
        lightboxImageContainerEl.style.transition = 'none';
        lightboxImageContainerEl.style.transform = `translateX(-${window.innerWidth}px)`;
        requestAnimationFrame(() => {
            lightboxImageContainerEl.style.transition = 'transform 0.3s ease-out';
            isLightboxTransitioning = false;
        });
    }, 300); // CSS transition 시간 0.3s와 동일하게
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
    if (!isDragging || isLightboxTransitioning) return;
    touchCurrentX = e.changedTouches[0].screenX; 
    const deltaX = touchCurrentX - touchStartX;
    // 현재 이미지의 기준 위치(window.innerWidth만큼 왼쪽으로 이동된 상태)에서 드래그 양만큼 추가 이동
    lightboxImageContainerEl.style.transform = `translateX(calc(-${window.innerWidth}px + ${deltaX}px))`;
}

function handleTouchEnd() {
    if (!isDragging || isLightboxTransitioning) return;
    isDragging = false;
    const deltaX = touchCurrentX - touchStartX;

    // 트랜지션 다시 활성화 (스와이프 애니메이션에 사용)
    lightboxImageContainerEl.style.transition = 'transform 0.3s ease-out';

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) { // 오른쪽으로 스와이프 (이전 사진)
            navigateLightbox('prev');
        } else { // 왼쪽으로 스와이프 (다음 사진)
            navigateLightbox('next');
        }
    } else {
        // 임계값 미달 시 원래 위치(현재 이미지가 중앙)로 복귀 (애니메이션 적용)
        lightboxImageContainerEl.style.transform = `translateX(-${window.innerWidth}px)`;
        // 애니메이션 완료 후 isLightboxTransitioning 플래그를 해제해야 다른 동작이 가능해집니다.
        setTimeout(() => {
             isLightboxTransitioning = false;
        }, 300);
    }
    touchStartX = 0;
    touchCurrentX = 0;
}

// Lightbox 이미지 컨테이너에 터치 이벤트 리스너를 추가/제거하는 함수
function addSwipeListeners() {
    lightboxImageContainerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    // touchmove에서 preventDefault를 사용할 수 있도록 passive: false로 설정
    lightboxImageContainerEl.addEventListener('touchmove', handleTouchMove, { passive: false }); 
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

/**
 * 주소/계좌번호 복사 기능 (모달 메시지 사용)
 */
document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
        const textToCopy = button.dataset.copyText;
        const copyType = button.dataset.copyType; // data-copy-type 속성 가져오기

        try {
            await navigator.clipboard.writeText(textToCopy);

            // 메시지 텍스트 동적 설정
            if (copyType === '계좌') {
                copyMessageTextEl.textContent = '계좌가 복사되었습니다.';
            } else if (copyType === '주소') {
                copyMessageTextEl.textContent = '주소가 복사되었습니다.';
            } else {
                copyMessageTextEl.textContent = '복사되었습니다.'; // 기본 메시지
            }
            
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

/**
 * 계좌 정보 표시/숨김 기능 (버튼 클릭 방식) - 아코디언 애니메이션 적용
 * 남편/신부 계좌 정보가 동시에 열릴 수 있도록 수정되었습니다.
 */
document.querySelectorAll('.account-toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const targetElement = document.getElementById(targetId); // account-details div
        const toggleIcon = button.querySelector('.toggle-icon');

        // 요소가 현재 열려 있는지 (즉, 'show' 클래스를 가지고 있는지) 확인
        const isShowing = targetElement.classList.contains('show');

        if (isShowing) {
            // 현재 열려 있다면 닫기 (애니메이션)
            targetElement.classList.remove('show');
            button.classList.remove('active');
            toggleIcon.classList.remove('active');
            // 애니메이션 완료 후 'hidden' 클래스 추가하여 완전히 공간 차지하지 않도록
            setTimeout(() => {
                targetElement.classList.add('hidden');
            }, 500); // CSS transition 시간 (0.5s)과 동일하게
        } else {
            // 현재 닫혀 있다면 열기 (애니메이션)
            targetElement.classList.remove('hidden'); // hidden 클래스 먼저 제거 (display: block으로 전환)
            // 브라우저가 hidden 클래스 제거를 인식하도록 짧은 시간 대기 후 show 클래스 추가
            requestAnimationFrame(() => {
                targetElement.classList.add('show'); // show 클래스 추가 (max-height, opacity 트랜지션 시작)
                button.classList.add('active'); // 버튼 활성화 (아이콘 회전)
                toggleIcon.classList.add('active'); // 아이콘 회전
            });
        }
    });
});


// 페이지 로드 완료 시 실행
window.addEventListener("DOMContentLoaded", () => {
    // 초기 로드 시 모든 account-details를 숨김 상태로 시작
    document.querySelectorAll('.account-details').forEach(detail => {
        detail.classList.add('hidden'); // hidden 클래스 추가하여 숨김
        detail.classList.remove('show'); // 혹시 모를 초기 'show' 상태 제거
    });

    startTypingProcess(); // 페이지 로드 시 첫 번째 텍스트 타이핑 시작
    displayGallery(); // 갤러리 표시 (초기 9개)

    // 스크롤 리빌 초기 실행 및 이벤트 리스너 등록
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // 첫 사용자 상호작용 리스너 등록 (클릭 또는 터치)
    // 이 부분에서 document.body에 대한 dblclick/touchend 방지 로직이 먼저 실행되어야 함.
    // 하지만 이미 위에서 touchend 리스너를 body에 추가했으므로 중복 제거 또는 순서 조정 필요 없음.
    document.addEventListener('click', handleFirstUserInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
});