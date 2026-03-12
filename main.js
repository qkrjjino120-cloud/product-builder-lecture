const menus = [
  "김치찌개와 계란말이",
  "제육볶음과 쌈채소",
  "된장찌개와 고등어구이",
  "바삭한 돈까스",
  "뜨끈한 순대국밥",
  "매콤한 떡볶이와 튀김",
  "치킨과 맥주 (치맥)",
  "피자와 콜라",
  "초밥과 우동",
  "스테이크와 샐러드",
  "시원한 평양냉면",
  "짜장면과 탕수육",
  "마라탕과 꿔바로우",
  "햄버거 세트",
  "보쌈과 막국수",
  "부대찌개",
  "감자탕",
  "파스타와 리조또"
];

const menuDisplay = document.getElementById('menu-display');
const recommendBtn = document.getElementById('recommend-btn');

recommendBtn.addEventListener('click', () => {
  // 버튼 클릭 시 애니메이션 초기화
  menuDisplay.classList.remove('pop');
  
  // 추천 중임을 시각적으로 표시
  menuDisplay.innerText = "추천 중...";
  
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * menus.length);
    const selectedMenu = menus[randomIndex];
    
    menuDisplay.innerText = selectedMenu;
    menuDisplay.classList.add('pop');
  }, 300);
});
