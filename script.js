const STORAGE_KEY = "health_demo_records_v1";

const metricType = document.getElementById("metricType");
const dynamicFields = document.getElementById("dynamicFields");
const recordForm = document.getElementById("recordForm");
const recordList = document.getElementById("recordList");
const trendList = document.getElementById("trendList");
const metricCards = document.getElementById("metricCards");
const toast = document.getElementById("toast");
const todayDate = document.getElementById("todayDate");

const metricLabels = {
  headache: "头痛/头晕",
  blood_pressure: "血压",
  blood_glucose: "血糖",
  weight: "体重",
  heart_rate: "心率"
};

let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderFields() {
  const t = metricType.value;
  const fieldMap = {
    headache: `<div class="row"><label>程度（1-10）</label><input id="valueA" type="number" min="1" max="10" required /></div>
               <div class="row"><label>持续时长（分钟）</label><input id="valueB" type="number" min="1" max="600" required /></div>`,
    blood_pressure: `<div class="row"><label>收缩压 mmHg</label><input id="valueA" type="number" min="60" max="260" required /></div>
                     <div class="row"><label>舒张压 mmHg</label><input id="valueB" type="number" min="40" max="160" required /></div>`,
    blood_glucose: `<div class="row"><label>血糖 mmol/L</label><input id="valueA" type="number" min="2" max="35" step="0.1" required /></div>`,
    weight: `<div class="row"><label>体重 kg</label><input id="valueA" type="number" min="20" max="250" step="0.1" required /></div>`,
    heart_rate: `<div class="row"><label>心率 bpm</label><input id="valueA" type="number" min="30" max="220" required /></div>`
  };
  dynamicFields.innerHTML = fieldMap[t];
}

function riskTag(item) {
  if (item.type === "blood_pressure") {
    if (item.valueA >= 140 || item.valueB >= 90) return "danger";
    if (item.valueA >= 130 || item.valueB >= 85) return "warn";
  }
  if (item.type === "blood_glucose") {
    if (item.valueA >= 11.1) return "danger";
    if (item.valueA >= 7.8) return "warn";
  }
  if (item.type === "heart_rate") {
    if (item.valueA >= 120 || item.valueA < 45) return "danger";
    if (item.valueA >= 100) return "warn";
  }
  return "ok";
}

function formatValue(item) {
  if (item.type === "blood_pressure") return `${item.valueA}/${item.valueB} mmHg`;
  if (item.type === "headache") return `程度${item.valueA} 持续${item.valueB}分钟`;
  if (item.type === "blood_glucose") return `${item.valueA} mmol/L`;
  if (item.type === "weight") return `${item.valueA} kg`;
  if (item.type === "heart_rate") return `${item.valueA} bpm`;
  return "-";
}

function render() {
  const latestByType = Object.keys(metricLabels).map((t) => records.find((r) => r.type === t));
  metricCards.innerHTML = latestByType.map((r, idx) => {
    const key = Object.keys(metricLabels)[idx];
    return `<div class="metric-card"><b>${metricLabels[key]}</b><strong>${r ? formatValue(r) : "暂无"}</strong></div>`;
  }).join("");

  recordList.innerHTML = records.slice(0, 12).map((r) => {
    const tag = riskTag(r);
    const tagText = tag === "danger" ? "异常" : tag === "warn" ? "关注" : "正常";
    return `<li><b>${metricLabels[r.type]}</b>：${formatValue(r)} <span class="tag ${tag}">${tagText}</span><br><small>${new Date(r.time).toLocaleString()} ${r.note ? `· ${r.note}` : ""}</small></li>`;
  }).join("");

  const last7 = records.slice(0, 7).map((r) => `<li>${metricLabels[r.type]}：${formatValue(r)}（${new Date(r.time).toLocaleDateString()}）</li>`).join("");
  trendList.innerHTML = last7 || "<li>暂无趋势数据</li>";
}

recordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const valueA = Number(document.getElementById("valueA")?.value);
  const valueB = Number(document.getElementById("valueB")?.value || 0);
  const note = document.getElementById("note").value.trim();
  const item = { type: metricType.value, valueA, valueB, note, time: Date.now() };

  records.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  render();
  recordForm.reset();
  metricType.value = item.type;
  renderFields();
  showToast("记录成功（本地加密建议：生产版可接入 WebCrypto）");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  recordForm.reset();
  metricType.value = "headache";
  renderFields();
});

metricType.addEventListener("change", renderFields);
document.getElementById("quickRecordBtn").addEventListener("click", () => {
  document.querySelector(".form-panel").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "health-records-demo.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

todayDate.textContent = new Date().toLocaleDateString("zh-CN");
renderFields();
render();
