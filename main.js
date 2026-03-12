const initialMenus = [
  "김치찌개와 공깃밥", "제육덮밥", "된장찌개", "바삭한 돈까스", "뜨끈한 순대국",
  "짜장면", "짬뽕", "김밥과 라면 세트", "비빔밥", "육개장", "뼈해장국",
  "샌드위치와 커피", "쌀국수", "햄버거 세트", "우동과 김밥 1줄", "순두부찌개",
  "부대찌개", "돌솥비빔밥"
];

let currentMenus = [...initialMenus];
let lastRecommended = "";

const menuDisplay = document.getElementById('menu-display');
const recommendBtn = document.getElementById('recommend-btn');
const excludeBtn = document.getElementById('exclude-btn');
const actionButtons = document.getElementById('action-buttons');
const mapLink = document.getElementById('map-link');
const shareBtn = document.getElementById('share-btn');
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggle = document.getElementById('theme-toggle');
const modeIcon = themeToggle.querySelector('.mode-icon');

// 메뉴 추천 로직 (슬롯머신 효과)
const recommendMenu = () => {
  if (currentMenus.length === 0) {
    alert("모든 메뉴를 제외하셨습니다! 리스트를 초기화합니다.");
    currentMenus = [...initialMenus];
  }

  recommendBtn.disabled = true;
  excludeBtn.classList.add('hidden');
  actionButtons.classList.add('hidden');
  menuDisplay.classList.add('rolling');

  // 슬롯머신 효과를 위해 메뉴명을 빠르게 바꿈
  let rollingInterval = setInterval(() => {
    const tempIndex = Math.floor(Math.random() * currentMenus.length);
    menuDisplay.innerText = currentMenus[tempIndex];
  }, 100);

  setTimeout(() => {
    clearInterval(rollingInterval);
    menuDisplay.classList.remove('rolling');
    
    const randomIndex = Math.floor(Math.random() * currentMenus.length);
    const selectedMenu = currentMenus[randomIndex];
    
    lastRecommended = selectedMenu;
    menuDisplay.innerText = selectedMenu;
    menuDisplay.classList.add('pop');
    
    // 결과 액션 버튼 및 제외 버튼 표시
    actionButtons.classList.remove('hidden');
    excludeBtn.classList.remove('hidden');
    recommendBtn.disabled = false;
    
    // 지도 링크 업데이트 (카카오맵 검색)
    mapLink.href = `https://map.kakao.com/link/search/${encodeURIComponent(selectedMenu)}`;
    
    // 히스토리 저장
    saveToHistory(selectedMenu);
  }, 1500); // 1.5초 동안 구름
};

recommendBtn.addEventListener('click', recommendMenu);

// 메뉴 제외 로직
excludeBtn.addEventListener('click', () => {
  if (lastRecommended) {
    currentMenus = currentMenus.filter(menu => menu !== lastRecommended);
    alert(`'${lastRecommended}' 메뉴를 이번 목록에서 제외했습니다.`);
    recommendMenu(); // 제외 후 즉시 다시 뽑기
  }
});

// 공유 기능 (클립보드 복사)
shareBtn.addEventListener('click', () => {
  if (lastRecommended) {
    const text = `오늘 점심은 [${lastRecommended}] 어때요? 여기서 골라봤어요! ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("추천 결과가 클립보드에 복사되었습니다! 친구에게 전달해 보세요.");
    });
  }
});

// 히스토리 관리
const saveToHistory = (menu) => {
  let history = JSON.parse(localStorage.getItem('lunch_history') || "[]");
  history.unshift({ menu, date: new Date().toLocaleTimeString() });
  history = history.slice(0, 5); // 최근 5개만 저장
  localStorage.setItem('lunch_history', JSON.stringify(history));
  renderHistory();
};

const renderHistory = () => {
  const history = JSON.parse(localStorage.getItem('lunch_history') || "[]");
  if (history.length > 0) {
    historySection.classList.remove('hidden');
    historyList.innerHTML = history.map(item => `<li>[${item.date}] ${item.menu}</li>`).join('');
  } else {
    historySection.classList.add('hidden');
  }
};

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('lunch_history');
  renderHistory();
});

// 테마 관리
const getCurrentTheme = () => document.documentElement.getAttribute('data-theme');
const reloadDisqus = () => {
  if (typeof DISQUS !== 'undefined') {
    DISQUS.reset({ reload: true, config: function () { this.page.identifier = window.location.pathname; this.page.url = window.location.href; } });
  }
};
const updateThemeUI = (theme) => { modeIcon.innerText = theme === 'dark' ? '☀️' : '🌙'; };
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeUI(theme);
  reloadDisqus();
};

updateThemeUI(getCurrentTheme());
themeToggle.addEventListener('click', () => {
  const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// 초기 실행
renderHistory();
