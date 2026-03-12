const lunchMenus = [
  "김치찌개와 공깃밥 (9,000원)",
  "제육덮밥 (10,000원)",
  "된장찌개 (8,500원)",
  "바삭한 돈까스 (11,000원)",
  "뜨끈한 순대국 (9,000원)",
  "짜장면 (7,500원)",
  "짬뽕 (9,000원)",
  "김밥과 라면 세트 (8,500원)",
  "비빔밥 (10,000원)",
  "육개장 (10,000원)",
  "뼈해장국 (10,000원)",
  "샌드위치와 커피 (8,500원)",
  "쌀국수 (11,000원)",
  "햄버거 세트 (9,000원)",
  "우동과 김밥 1줄 (10,000원)",
  "순두부찌개 (9,000원)",
  "부대찌개 (10,000원)",
  "돌솥비빔밥 (11,000원)"
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
