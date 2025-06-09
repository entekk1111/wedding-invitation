// js/script.js 파일

// ★ 타이핑 효과 스크립트 수정 ★
// 첫 번째 텍스트와 두 번째 텍스트 정의
const text1 = "가을에 바람이 불면\n더 깊어진 눈빛으로\n당신을 사랑한다고 말하겠습니다\n- 가을에, 이해인 -";
const text2 = "저희, 결혼합니다.";
const el = document.getElementById("typingText");

let typingIndex = 0; // 현재 타이핑 중인 인덱스
let currentText = text1; // 현재 타이핑할 텍스트 (text1 또는 text2)


function typeCharacter() {
    if (typingIndex < currentText.length) {
        let char = currentText.charAt(typingIndex);
        // \n 문자를 만났을 때 <br> 태그로 변환하여 추가
        if (char === '\n') {
            el.innerHTML += '<br>';
        } else {
            el.innerHTML += char;
        }
        typingIndex++;
        // 다음 글자 타이핑을 예약
        setTimeout(typeCharacter, 120); // 타이핑 속도 (120ms)
    } else {
        // 현재 텍스트의 타이핑이 모두 끝났을 때
        if (currentText === text1) {
            // 첫 번째 텍스트가 끝났으면 잠시 대기 후 페이드아웃 및 다음 텍스트 준비
            setTimeout(fadeOutAndTypeNext, 1000); // 1초 대기 후 fadeOutAndTypeNext 호출
        } else if (currentText === text2) {
            // 두 번째 텍스트가 끝났으면 타이핑 애니메이션 종료
            console.log("두 번째 텍스트 타이핑 완료"); // 콘솔에 완료 메시지 출력 (디버깅용)
            // 여기서 더 이상 할 일이 없으면 함수 종료
        }
    }
}

// 페이드아웃 애니메이션을 시작하고 다음 텍스트 타이핑을 준비하는 함수
function fadeOutAndTypeNext() {
    // 요소에 'fade-out' 클래스를 추가하여 CSS 페이드아웃 애니메이션 발동
    el.classList.add('fade-out');

    // CSS 트랜지션 시간(0.6초)보다 약간 길게 기다린 후 다음 단계 실행
    setTimeout(() => {
        // 페이드아웃 애니메이션이 끝난 후
        el.classList.remove('fade-out'); // 'fade-out' 클래스 제거 (투명도 원래대로 복구)
        el.innerHTML = ''; // 현재 표시된 텍스트 내용을 지움
        typingIndex = 0; // 타이핑 인덱스 초기화
        currentText = text2; // 다음 타이핑할 텍스트를 text2로 설정

        // 이제 두 번째 텍스트 타이핑 시작
        typeCharacter();
    }, 700); // 0.6초(CSS transition) + 0.1초 여유 = 0.7초 대기
}

// 초기 타이핑 시작 함수 (DOMContentLoaded에서 호출)
function startTyping(textToType) {
    currentText = textToType;
    typingIndex = 0;
    el.innerHTML = ''; // 시작 전에 내용을 확실히 비웁니다.
    typeCharacter(); // 타이핑 프로세스 시작
}
// ★------------------------------------------------- ★


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

// 갤러리 썸네일을 화면에 표시하는 함수 (첫 9개만 표시)
function displayGallery() {
    galleryGrid.innerHTML = ''; // 기존 내용을 비웁니다
    const numberOfThumbnailsToShow = 9; // 화면에 보여줄 썸네일 개수

    // images 배열의 첫 9개 항목만 순회합니다 (실제 이미지 개수가 9개 미만일 경우 그만큼만)
    for (let i = 0; i < numberOfThumbnailsToShow && i < images.length; i++) {
    const imagePath = images[i];
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Gallery Image ${i + 1}`; // 대체 텍스트
    img.dataset.index = i; // 클릭 시 Lightbox에서 사용할 전체 이미지 목록에서의 인덱스
    galleryGrid.appendChild(img);
    }
}

// Lightbox 모달을 여는 함수
function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = images[currentImageIndex];
    lightboxModal.classList.add('visible'); // visible 클래스 추가하여 보이게 함
    // body 스크롤 방지 (선택 사항)
    document.body.style.overflow = 'hidden';
}

// Lightbox 모달을 닫는 함수
function closeLightbox() {
    lightboxModal.classList.remove('visible'); // visible 클래스 제거하여 숨김
    // body 스크롤 허용 (선택 사항)
    document.body.style.overflow = '';
}

// 다음 이미지를 보여주는 함수
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length; // 마지막 사진에서 처음으로
    lightboxImage.src = images[currentImageIndex];
}

// 이전 이미지를 보여주는 함수
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; // 처음 사진에서 마지막으로
    lightboxImage.src = images[currentImageIndex];
}

// 갤러리 이벤트 리스너 연결
galleryGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
    const index = parseInt(e.target.dataset.index);
    openLightbox(index);
    }
});

// Lightbox 이벤트 리스너 연결
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


// 스크롤 리빌 애니메이션 JavaScript
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const offset = 100; // 화면 하단에서 요소가 나타나기 시작할 여유 공간
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
        // 선택 사항: 화면 밖으로 나갈 때 visible 클래스 제거하려면 아래 주석 해제
        // else if (element.classList.contains('visible') && !isInViewport(element) && rect.bottom < 0) {
        //     element.classList.remove('visible');
        // }
    });
}

// 페이지 로드 완료 시 실행
window.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드 시 첫 번째 텍스트 타이핑 시작
    startTyping(text1);

    // 갤러리 표시 (이제 9개만)
    displayGallery();

    // 스크롤 리빌 초기 실행 및 이벤트 리스너 등록
    revealOnScroll(); // 페이지 로드 시 이미 보이는 요소 처리
    window.addEventListener('scroll', revealOnScroll); // 스크롤 이벤트에 함수 연결
});

// Helper function to start typing any text (used internally)
function startTyping(textToType) {
    currentText = textToType;
    typingIndex = 0;
    el.innerHTML = ''; // Clear current text before starting
    // Fade-out 클래스가 남아있을 경우 제거 (만약 이전 애니메이션이 중단됐다면)
    el.classList.remove('fade-out');
    typeCharacter(); // 타이핑 프로세스 시작
}
