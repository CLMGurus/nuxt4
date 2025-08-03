<template>
  <div class="d-flex justify-center" style="height: 300px">
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import Chart from "chart.js/auto";

const canvas = ref();
let chartInstance = null;

const props = defineProps({
  chartType: {
    type: String,
    required: true,
  },
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }),
  },
});

function renderChart() {
  if (!canvas.value || !props.chartData) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(canvas.value, {
    type: props.chartType,
    data: props.chartData,
    options: props.chartOptions,
  });
}

watchEffect(() => {
  renderChart();
});
</script>
