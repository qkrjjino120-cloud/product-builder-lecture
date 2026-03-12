const URL = "https://teachablemachine.withgoogle.com/models/NtcC_wQuN/";

let model, webcam, labelContainer, maxPredictions;

const startBtn = document.getElementById('start-btn');
const webcamContainer = document.getElementById('webcam-container');
const labelContainerEl = document.getElementById('label-container');
const resultDisplay = document.getElementById('result-display');
const topPredictionEl = document.getElementById('top-prediction');
const mbtiDescriptionEl = document.getElementById('mbti-description');

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

async function init() {
  startBtn.innerText = "모델 로드 중...";
  startBtn.disabled = true;

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(250, 250, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  webcamContainer.appendChild(webcam.canvas);
  labelContainer = labelContainerEl;
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  startBtn.classList.add('hidden');
  resultDisplay.classList.remove('hidden');
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  
  // 가장 높은 확률의 MBTI 찾기
  let topMbti = "";
  let topProb = 0;

  for (let i = 0; i < maxPredictions; i++) {
    const prob = prediction[i].probability.toFixed(2);
    const className = prediction[i].className;
    
    if (prob > topProb) {
      topProb = prob;
      topMbti = className;
    }
    
    // 확률 바 표시 (선택 사항)
    labelContainer.childNodes[i].innerHTML = `
      <div class="prediction-row">
        <span class="mbti-label">${className}</span>
        <div class="bar-container">
          <div class="bar" style="width: ${prob * 100}%"></div>
        </div>
        <span class="prob-label">${(prob * 100).toFixed(0)}%</span>
      </div>
    `;
  }

  // 상위 결과 강조
  topPredictionEl.innerText = topMbti;
  mbtiDescriptionEl.innerText = mbtiDescriptions[topMbti] || "인공지능이 당신의 관상을 분석 중입니다.";
}

startBtn.addEventListener('click', init);
