let chartInstance = null;
let currentChartType = 'bar';
let cachedData = null;

async function loadAnalytics() {
  const status = document.getElementById("statusMessage");
  status.textContent = "Fetching analytics data from Flask API...";

  try {
    const response = await fetch("/api/analytics");
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    cachedData = data;

    renderChart(data, currentChartType);
    renderTable(data.students);
    status.textContent = "Data successfully synchronized!";
  } catch (error) {
    status.textContent = "Error fetching data: " + error.message;
    console.error("Fetch Error:", error);
  }
}

function renderChart(data, type) {
  const ctx = document.getElementById("analyticsChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: type,
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Student GPA (Max 4.0)",
          data: data.gpas,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "#3b82f6",
          borderWidth: 2,
          borderRadius: 5,
          yAxisID: "y"
        },
        {
          label: "Attendance Rate (%)",
          data: data.attendance,
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          borderColor: "#10b981",
          borderWidth: 2,
          type: "line",
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          min: 0,
          max: 4.0,
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          min: 0,
          max: 100,
          ticks: { color: "#94a3b8" },
          grid: { drawOnChartArea: false }
        },
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        }
      },
      plugins: {
        legend: { labels: { color: "#f8fafc" } }
      }
    }
  });
}

function renderTable(students) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.id}</td>
      <td><strong>${student.name}</strong></td>
      <td>${student.major}</td>
      <td>${student.gpa}</td>
      <td>${student.attendance}%</td>
    `;
    tbody.appendChild(row);
  });
}

function toggleChartType() {
  if (!cachedData) return;
  currentChartType = currentChartType === "bar" ? "line" : "bar";
  renderChart(cachedData, currentChartType);
}

// Automatically load the data on first page load
document.addEventListener("DOMContentLoaded", loadAnalytics);