let chartInstance = null;
const availableTypes = ['bar', 'line', 'radar'];
let currentTypeIndex = 0;
let cachedData = null;

async function loadAnalytics() {
  const status = document.getElementById("statusMessage");
  status.textContent = "Fetching fresh dynamic data from Flask...";

  try {
    const response = await fetch("/api/analytics");
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    cachedData = await response.json();
    renderChart(cachedData, availableTypes[currentTypeIndex]);
    renderTable(cachedData.students);
    status.textContent = "Data updated successfully!";
  } catch (error) {
    status.textContent = "Error: " + error.message;
    console.error("Fetch Error:", error);
  }
}

function renderChart(data, chartType) {
  const ctx = document.getElementById("analyticsChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const isRadar = chartType === 'radar';

  chartInstance = new Chart(ctx, {
    type: chartType,
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Student GPA (Scaled x25 for comparison)",
          data: data.gpas.map(g => (g * 25).toFixed(1)),
          backgroundColor: "rgba(59, 130, 246, 0.4)",
          borderColor: "#3b82f6",
          borderWidth: 2,
          fill: isRadar
        },
        {
          label: "Attendance Rate (%)",
          data: data.attendance,
          backgroundColor: "rgba(16, 185, 129, 0.4)",
          borderColor: "#10b981",
          borderWidth: 2,
          fill: isRadar
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#f8fafc" } }
      },
      scales: isRadar ? {
        r: {
          ticks: { color: "#94a3b8", backdropColor: "transparent" },
          grid: { color: "rgba(255, 255, 255, 0.1)" }
        }
      } : {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        }
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
  currentTypeIndex = (currentTypeIndex + 1) % availableTypes.length;
  const nextType = availableTypes[currentTypeIndex];
  
  const toggleBtn = document.getElementById("toggleBtn");
  if (toggleBtn) {
    toggleBtn.textContent = `View Mode: ${nextType.toUpperCase()}`;
  }

  renderChart(cachedData, nextType);
}

document.addEventListener("DOMContentLoaded", loadAnalytics);