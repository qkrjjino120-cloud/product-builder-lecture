const URL = "https://teachablemachine.withgoogle.com/models/NtcC_wQuN/";

let model, webcam, labelContainer, maxPredictions;
let isWebcamMode = false;

// DOM 요소들
const webcamBtn = document.getElementById('webcam-btn');
const imageUpload = document.getElementById('image-upload');
const webcamContainer = document.getElementById('webcam-container');
const facePreview = document.getElementById('face-preview');
const labelContainerEl = document.getElementById('label-container');
const resultDisplay = document.getElementById('result-display');
const topPredictionEl = document.getElementById('top-prediction');
const mbtiDescriptionEl = document.getElementById('mbti-description');
const resetBtn = document.getElementById('reset-btn');

const mbtiDescriptions = {
  "ISTP": "조용하고 과묵하며 상황을 파악하는 능력이 뛰어난 당신, 손재주가 좋고 도구를 잘 활용하네요!",
  "ISFP": "다정하고 온화하며 겸손한 예술가 기질의 당신, 삶의 여유를 즐길 줄 아는 사람입니다.",
  "ESTP": "현실적인 문제 해결에 능숙하고 활동적인 당신, 주변 사람들에게 즐거움을 주는 분위기 메이커!",
  "ESFP": "사교적이고 활동적이며 수용적인 당신, 어떤 상황에서도 긍정적인 에너지를 발산합니다.",
  "ISTJ": "실제 사실에 대하여 정확하고 체계적으로 기억하며 신중한 당신, 책임감이 아주 강하시군요!",
  "ISFJ": "조용하고 차분하며 친절한 당신, 주변 사람들을 세심하게 챙기는 따뜻한 마음을 가졌습니다.",
  "ESTJ": "실질적이고 현실적이며 지도력이 있는 당신, 계획을 세우고 실천하는 능력이 탁월합니다.",
  "ESFJ": "동정심이 많고 친절하며 재치 있는 당신, 조화로운 인간관계를 중요하게 생각하시네요!",
  "INFJ": "인내심이 강하고 통찰력이 뛰어난 당신, 사람들에게 영감을 주는 깊은 내면을 가졌습니다.",
  "INFP": "정열적이고 충실하며 낭만적인 당신, 자신만의 신념과 가치를 소중히 여기는군요.",
  "ENFJ": "사교적이고 타인의 의견을 존중하는 당신, 사람들을 이끄는 따뜻한 리더십이 돋보입니다.",
  "ENFP": "열정적이고 창의적인 당신, 새로운 가능성을 찾아내고 사람들에게 에너지를 전달합니다.",
  "INTJ": "독창적이고 분석적이며 신념이 강한 당신, 미래를 설계하고 전략을 세우는 데 능숙합니다.",
  "INTP": "비평적인 관점을 가진 뛰어난 전략가인 당신, 호기심이 많고 논리적인 분석을 즐깁니다.",
  "ENTJ": "철저한 준비를 하며 활기찬 당신, 목표를 달성하기 위해 사람들을 효율적으로 이끕니다.",
  "ENTP": "민첩하고 독창적이며 안목이 넓은 당신, 새로운 도전을 두려워하지 않는 혁신가입니다."
};

// 모델 로드
async function loadModel() {
  if (!model) {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    maxPredictions = model.getTotalClasses();
  }
}

// 웹캠 초기화 및 실행
async function initWebcam() {
  await loadModel();
  isWebcamMode = true;
  
  webcamBtn.classList.add('hidden');
  document.querySelector('.upload-label').classList.add('hidden');
  
  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  webcamContainer.appendChild(webcam.canvas);
  prepareResultUI();
}

async function loop() {
  if (isWebcamMode) {
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(loop);
  }
}

// 이미지 파일 분석 로직
imageUpload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  await loadModel();
  isWebcamMode = false;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    facePreview.src = e.target.result;
    facePreview.classList.remove('hidden');
    
    webcamBtn.classList.add('hidden');
    document.querySelector('.upload-label').classList.add('hidden');
    
    // 이미지 로드 대기 후 분석
    facePreview.onload = async () => {
      prepareResultUI();
      await predict(facePreview);
    };
  };
  reader.readAsDataURL(file);
});

function prepareResultUI() {
  resultDisplay.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  labelContainerEl.innerHTML = "";
  for (let i = 0; i < maxPredictions; i++) {
    labelContainerEl.appendChild(document.createElement("div"));
  }
}

async function predict(imageSource) {
  const prediction = await model.predict(imageSource);
  
  let topMbti = "";
  let topProb = 0;

  for (let i = 0; i < maxPredictions; i++) {
    const prob = prediction[i].probability.toFixed(2);
    const className = prediction[i].className;
    
    if (prob > topProb) {
      topProb = prob;
      topMbti = className;
    }
    
    labelContainerEl.childNodes[i].innerHTML = `
      <div class="prediction-row">
        <span class="mbti-label">${className}</span>
        <div class="bar-container">
          <div class="bar" style="width: ${prob * 100}%"></div>
        </div>
        <span class="prob-label">${(prob * 100).toFixed(0)}%</span>
      </div>
    `;
  }

  topPredictionEl.innerText = topMbti;
  mbtiDescriptionEl.innerText = mbtiDescriptions[topMbti] || "관상을 분석 중입니다.";
}

// 다시 하기
resetBtn.addEventListener('click', () => {
  location.reload();
});

// 테마 관리 로직 추가
const themeToggle = document.getElementById('theme-toggle');
const modeIcon = themeToggle.querySelector('.mode-icon');

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

webcamBtn.addEventListener('click', initWebcam);
