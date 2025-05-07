const form = document.getElementById("entry-form");
const list = document.getElementById("entry-list");
const summary = document.getElementById("summary");
const lineCanvas = document.getElementById("lineChart");
const pieCanvas = document.getElementById("pieChart");

let records = JSON.parse(localStorage.getItem("bet-records")) || [];

function saveData() {
  localStorage.setItem("bet-records", JSON.stringify(records));
}

function renderList() {
  list.innerHTML = "";
  let total = 0;

  records.forEach((rec, index) => {
    const li = document.createElement("li");
    li.className = rec.result;
    li.textContent = `${rec.date}｜${rec.item}：¥${rec.amount}（${rec.result === "win" ? "赢" : "输"}）`;
    list.appendChild(li);
    total += rec.result === "win" ? rec.amount : -rec.amount;
  });

  summary.textContent = `总盈亏：¥${total}`;
  updateCharts();
}

form.onsubmit = function (e) {
  e.preventDefault();
  const item = document.getElementById("item").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const result = document.getElementById("result").value;
  const date = document.getElementById("date").value;

  records.push({ item, amount, result, date });
  saveData();
  renderList();
  form.reset();
};

function updateCharts() {
  const dates = records.map(r => r.date);
  let balance = 0;
  const balances = records.map(r => {
    balance += r.result === "win" ? r.amount : -r.amount;
    return balance;
  });

  const typeTotals = { win: 0, lose: 0 };
  records.forEach(r => typeTotals[r.result] += r.amount);

  if (window.lineChartObj) window.lineChartObj.destroy();
  window.lineChartObj = new Chart(lineCanvas, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "累计盈亏",
        data: balances,
        borderColor: "#007bff",
        fill: false,
      }],
    },
  });

  if (window.pieChartObj) window.pieChartObj.destroy();
  window.pieChartObj = new Chart(pieCanvas, {
    type: "pie",
    data: {
      labels: ["赢", "输"],
      datasets: [{
        data: [typeTotals.win, typeTotals.lose],
        backgroundColor: ["green", "red"],
      }],
    },
  });
}

renderList();
