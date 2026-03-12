const lunchMenus = [
  "김치찌개와 공깃밥",
  "제육덮밥",
  "된장찌개",
  "바삭한 돈까스",
  "뜨끈한 순대국",
  "짜장면",
  "짬뽕",
  "김밥과 라면 세트",
  "비빔밥",
  "육개장",
  "뼈해장국",
  "샌드위치와 커피",
  "쌀국수",
  "햄버거 세트",
  "우동과 김밥 1줄",
  "순두부찌개",
  "부대찌개",
  "돌솥비빔밥"
];

const menuDisplay = document.getElementById('menu-display');
const recommendBtn = document.getElementById('recommend-btn');

recommendBtn.addEventListener('click', () => {
  menuDisplay.classList.remove('pop');
  menuDisplay.innerText = "메뉴 선정 중...";
  
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * lunchMenus.length);
    const selectedMenu = lunchMenus[randomIndex];
    
    menuDisplay.innerText = selectedMenu;
    menuDisplay.classList.add('pop');
  }, 400);
});
