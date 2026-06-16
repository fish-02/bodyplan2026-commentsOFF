const quotes = [
  {
    type: "親戚關心型",
    text: "你是不是又胖了？",
  },
  {
    type: "假好意建議型",
    text: "再瘦一點就更好看。",
  },
  {
    type: "路人審美執法型",
    text: "這樣穿不適合你。",
  },
  {
    type: "社群留言區型",
    text: "這臉也敢發？",
  },
  {
    type: "自我內耗型",
    text: "我是不是不夠好看？",
  },
];

const impacts = [
  "不敢穿某件衣服",
  "拍照前先修圖",
  "吃飯前開始計算罪惡感",
  "看鏡子時先找缺點",
  "明明沒事，卻突然想道歉",
];

const effects = [
  {
    name: "碎紙機",
    caption: "碎紙機已啟動：這句話沒有保固，也沒有回收價值。",
    audio: "soundShredder",
  },
  {
    name: "爆炸",
    caption: "審美標準傳送失敗：已炸成語言廢墟。",
    audio: "soundExplosion",
  },
  {
    name: "沖水",
    caption: "已沖走：謝謝指教，但本身體沒有開放評論功能。",
    audio: "soundFlush",
  },
];

const state = {
  quote: quotes[0].text,
  quoteType: quotes[0].type,
  impact: impacts[0],
};

const screens = document.querySelectorAll(".screen");
const quoteOptions = document.querySelector("#quoteOptions");
const impactOptions = document.querySelector("#impactOptions");
const customQuote = document.querySelector("#customQuote");
const customImpact = document.querySelector("#customImpact");
const quoteNext = document.querySelector("#quoteNext");
const impactNext = document.querySelector("#impactNext");
const quoteFragment = document.querySelector("#quoteFragment");
const recycleButton = document.querySelector("#recycleButton");
const recycleChamber = document.querySelector("#recycleChamber");
const glitchCloud = document.querySelector("#glitchCloud");
const effectCaption = document.querySelector("#effectCaption");
const shareCanvas = document.querySelector("#shareCanvas");
const shareButton = document.querySelector("#shareButton");
const downloadButton = document.querySelector("#downloadButton");
const restartButton = document.querySelector("#restartButton");
const ticketLink = document.querySelector("#ticketLink");
const dollImagePaths = [
  "塑膠娃娃朋友們/1.png",
  "塑膠娃娃朋友們/2.png",
  "塑膠娃娃朋友們/3.png",
  "塑膠娃娃朋友們/4.png",
  "塑膠娃娃朋友們/5.png",
];
const dollImages = dollImagePaths.map((src) => {
  const image = new Image();
  image.src = src;
  return image;
});
let selectedDollImage = dollImages[0];
let audioPrimed = false;

function getEffectAudio(effect) {
  const audio = document.querySelector(`#${effect.audio}`);
  if (!audio) return null;
  audio.preload = "auto";
  audio.load();
  return audio;
}

function primeAudio() {
  if (audioPrimed) return;
  audioPrimed = true;
  effects.forEach((effect) => {
    const audio = getEffectAudio(effect);
    if (!audio) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
      })
      .catch(() => {
        audio.volume = 1;
      });
  });
}

function showScreen(name) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });

  if (name === "recycle") {
    quoteFragment.textContent = state.quote;
    recycleChamber.classList.remove("is-recycling");
    glitchCloud.innerHTML = "";
    recycleButton.disabled = false;
    effectCaption.textContent = "點下去，讓這句話碎成雜訊。";
  }

  if (name === "result") {
    selectedDollImage = dollImages[Math.floor(Math.random() * dollImages.length)];
    drawShareImage();
  }
}

function selectQuote(index) {
  const quote = quotes[index];
  state.quote = quote.text;
  state.quoteType = quote.type;
  customQuote.value = "";
  renderQuoteOptions(index);
}

function renderQuoteOptions(selectedIndex = 0) {
  quoteOptions.innerHTML = quotes
    .map(
      (quote, index) => `
        <button class="quote-card ${index === selectedIndex ? "is-selected" : ""}" type="button" data-quote-index="${index}">
          <strong>${quote.type}</strong>
          <span>${quote.text}</span>
        </button>
      `,
    )
    .join("");
}

function renderImpactOptions(selectedIndex = 0) {
  impactOptions.innerHTML = impacts
    .map(
      (impact, index) => `
        <button class="impact-card ${index === selectedIndex ? "is-selected" : ""}" type="button" data-impact-index="${index}">
          ${impact}
        </button>
      `,
    )
    .join("");
}

function selectImpact(index) {
  state.impact = impacts[index];
  customImpact.value = "";
  renderImpactOptions(index);
}

function playEffect(effect) {
  const audio = getEffectAudio(effect);
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {
    effectCaption.textContent = `${effect.caption}（音效被瀏覽器暫時擋下，但態度已到位。）`;
  });
}

function createGlitchPieces() {
  glitchCloud.innerHTML = "";
  const glyphs = ["退", "回", "評", "分", "?", "#", "404", "LOOK", "NO", "BODY"];
  for (let index = 0; index < 42; index += 1) {
    const piece = document.createElement("span");
    piece.className = "glitch-piece";
    piece.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    piece.style.left = `${25 + Math.random() * 50}%`;
    piece.style.top = `${35 + Math.random() * 30}%`;
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 520}px`);
    piece.style.setProperty("--y", `${(Math.random() - 0.5) * 620}px`);
    piece.style.setProperty("--r", `${(Math.random() - 0.5) * 360}deg`);
    piece.style.animationDelay = `${Math.random() * 180}ms`;
    glitchCloud.appendChild(piece);
  }
}

function recycleQuote() {
  const effect = effects[Math.floor(Math.random() * effects.length)];
  recycleButton.disabled = true;
  recycleChamber.classList.add("is-recycling");
  effectCaption.textContent = `${effect.name}回收中...`;
  createGlitchPieces();
  playEffect(effect);

  window.setTimeout(() => {
    effectCaption.textContent = effect.caption;
  }, 900);

  window.setTimeout(() => {
    showScreen("result");
  }, 1700);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 8) {
  const chars = [...text];
  let line = "";
  let lines = [];

  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);
  lines = lines.slice(0, maxLines);
  lines.forEach((canvasLine, index) => {
    ctx.fillText(canvasLine, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function drawContainedImage(ctx, image, x, y, boxWidth, boxHeight) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = boxWidth / boxHeight;
  let drawWidth = boxWidth;
  let drawHeight = boxHeight;

  if (imageRatio > boxRatio) {
    drawHeight = boxWidth / imageRatio;
  } else {
    drawWidth = boxHeight * imageRatio;
  }

  const drawX = x + (boxWidth - drawWidth) / 2;
  const drawY = y + (boxHeight - drawHeight) / 2;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawSticker(ctx, text, x, y, options = {}) {
  const {
    background = "#f2efe6",
    color = "#151515",
    rotate = 0,
    fontSize = 34,
    paddingX = 24,
    paddingY = 16,
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.font = `900 ${fontSize}px sans-serif`;
  const width = ctx.measureText(text).width + paddingX * 2;
  const height = fontSize + paddingY * 2;
  roundedRect(ctx, 0, 0, width, height, 18);
  ctx.fillStyle = background;
  ctx.fill();
  ctx.strokeStyle = "#151515";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(text, paddingX, fontSize + paddingY - 4);
  ctx.restore();
}

function drawShareImage() {
  if (!selectedDollImage.complete || !selectedDollImage.naturalWidth) {
    selectedDollImage.onload = drawShareImage;
    return;
  }

  const ctx = shareCanvas.getContext("2d");
  const width = shareCanvas.width;
  const height = shareCanvas.height;

  ctx.fillStyle = "#f3ff2c";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#f3ff2c";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#151515";
  for (let y = -80; y < height + 184; y += 92) {
    ctx.save();
    ctx.translate(width / 2, y);
    ctx.rotate(-0.08);
    ctx.font = "900 54px sans-serif";
    ctx.globalAlpha = 0.08;
    ctx.fillText("COMMENTS OFF  COMMENTS OFF  COMMENTS OFF", -700, 0);
    ctx.restore();
  }

  ctx.save();
  roundedRect(ctx, 58, 52, width - 116, 1040, 34);
  ctx.clip();
  ctx.fillStyle = "#101010";
  ctx.fillRect(58, 52, width - 116, 1040);
  drawContainedImage(ctx, selectedDollImage, 58, 52, width - 116, 1040);

  const imageFade = ctx.createLinearGradient(0, 720, 0, 1092);
  imageFade.addColorStop(0, "rgba(21, 21, 21, 0)");
  imageFade.addColorStop(1, "rgba(21, 21, 21, 0.9)");
  ctx.fillStyle = imageFade;
  ctx.fillRect(58, 720, width - 116, 372);
  ctx.restore();

  ctx.strokeStyle = "#151515";
  ctx.lineWidth = 10;
  roundedRect(ctx, 58, 52, width - 116, 1040, 34);
  ctx.stroke();

  ctx.strokeStyle = "#ff3d5a";
  ctx.lineWidth = 5;
  roundedRect(ctx, 80, 74, width - 160, 996, 24);
  ctx.stroke();

  ctx.save();
  ctx.translate(88, 116);
  ctx.rotate(-0.05);
  roundedRect(ctx, 0, 0, 380, 118, 20);
  ctx.fillStyle = "#f2efe6";
  ctx.fill();
  ctx.fillStyle = "#151515";
  ctx.font = "1000 44px sans-serif";
  ctx.fillText("COMMENTS", 32, 48);
  ctx.fillText("OFF", 32, 94);
  ctx.restore();

  ctx.save();
  ctx.translate(600, 928);
  ctx.rotate(0.06);
  roundedRect(ctx, 0, 0, 360, 92, 20);
  ctx.fillStyle = "#ff3d5a";
  ctx.fill();
  ctx.fillStyle = "#f2efe6";
  ctx.font = "900 30px sans-serif";
  ctx.fillText("RATING SYSTEM", 30, 39);
  ctx.fillText("HAS LEFT THE CHAT", 30, 72);
  ctx.restore();

  ctx.save();
  ctx.translate(86, 918);
  ctx.rotate(-0.06);
  roundedRect(ctx, 0, 0, 410, 100, 20);
  ctx.fillStyle = "#58e6ff";
  ctx.fill();
  ctx.fillStyle = "#151515";
  ctx.font = "900 32px sans-serif";
  ctx.fillText("本身體", 32, 42);
  ctx.fillText("不支援匿名評分", 32, 76);
  ctx.restore();

  drawSticker(ctx, "誰問你了", 670, 228, {
    background: "#f3ff2c",
    rotate: 0.1,
    fontSize: 42,
  });
  drawSticker(ctx, "審美NPC已靜音", 118, 770, {
    background: "#ff3d5a",
    color: "#f2efe6",
    rotate: -0.09,
    fontSize: 34,
  });
  drawSticker(ctx, "BODY REVIEW 404", 580, 790, {
    background: "#58e6ff",
    rotate: 0.06,
    fontSize: 30,
  });

  roundedRect(ctx, 58, 1038, width - 116, 790, 34);
  ctx.fillStyle = "rgba(21, 21, 21, 0.96)";
  ctx.fill();

  ctx.strokeStyle = "#151515";
  ctx.lineWidth = 8;
  roundedRect(ctx, 58, 1038, width - 116, 790, 34);
  ctx.stroke();

  ctx.strokeStyle = "#c7ff2e";
  ctx.lineWidth = 4;
  roundedRect(ctx, 90, 1072, width - 180, 710, 24);
  ctx.stroke();

  ctx.fillStyle = "#ff3d5a";
  ctx.font = "900 42px sans-serif";
  ctx.fillText("我退回了一句", 120, 1148);

  ctx.fillStyle = "#f2efe6";
  ctx.font = "900 70px sans-serif";
  const nextY = wrapCanvasText(ctx, `「${state.quote}」`, 120, 1236, width - 240, 80, 3);

  ctx.fillStyle = "#58e6ff";
  ctx.font = "800 34px sans-serif";
  wrapCanvasText(ctx, `它曾經讓我：${state.impact}`, 120, nextY + 36, width - 240, 46, 2);

  ctx.fillStyle = "#c7ff2e";
  ctx.font = "900 56px sans-serif";
  wrapCanvasText(ctx, "本身體無開放評論功能。", 120, 1540, width - 240, 64, 2);

  ctx.fillStyle = "#f2efe6";
  ctx.font = "800 32px sans-serif";
  ctx.fillText("#我就長這樣關你屁事", 120, 1668);
  ctx.fillText("#身體和解計畫BodyPlan2026", 120, 1714);

  ctx.fillStyle = "#ff3d5a";
  ctx.font = "900 32px sans-serif";
  ctx.fillText("來劇場看身體怎麼重新說話", 120, 1764);
}

function downloadShareImage() {
  const link = document.createElement("a");
  link.download = "bodyplan-toxic-comment-recycled.png";
  link.href = shareCanvas.toDataURL("image/png");
  link.click();
}

async function shareImage() {
  shareCanvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], "bodyplan-toxic-comment-recycled.png", {
      type: "image/png",
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "#我就長這樣關你屁事",
        text: "本身體無開放評論功能。",
        files: [file],
      });
    } else {
      downloadShareImage();
    }
  });
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    primeAudio();
    showScreen(button.dataset.next);
  });
});

quoteOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quote-index]");
  if (!button) return;
  selectQuote(Number(button.dataset.quoteIndex));
});

impactOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-impact-index]");
  if (!button) return;
  selectImpact(Number(button.dataset.impactIndex));
});

customQuote.addEventListener("input", () => {
  const value = customQuote.value.trim();
  if (!value) return;
  state.quote = value;
  state.quoteType = "自行輸入";
  document.querySelectorAll(".quote-card").forEach((button) => {
    button.classList.remove("is-selected");
  });
});

customImpact.addEventListener("input", () => {
  const value = customImpact.value.trim();
  if (!value) return;
  state.impact = value;
  document.querySelectorAll(".impact-card").forEach((button) => {
    button.classList.remove("is-selected");
  });
});

quoteNext.addEventListener("click", () => {
  const customValue = customQuote.value.trim();
  if (customValue) {
    state.quote = customValue;
    state.quoteType = "自行輸入";
  }
  showScreen("impact");
});

impactNext.addEventListener("click", () => {
  const customValue = customImpact.value.trim();
  if (customValue) {
    state.impact = customValue;
  }
  showScreen("recycle");
});
recycleButton.addEventListener("click", () => {
  primeAudio();
  recycleQuote();
});
downloadButton.addEventListener("click", downloadShareImage);
shareButton.addEventListener("click", shareImage);
restartButton.addEventListener("click", () => showScreen("select"));

renderQuoteOptions();
renderImpactOptions();
