import { v4 as uuid } from "uuid";

import areaChart from "./visualisations/areaChart";
import "./app.scss";
import { generateBarData, generateFakeData } from "./fakeData";
import barChart from "./visualisations/barChart";

function createChartContainer(title) {
  const uId = uuid();

  const chartContent = document.createElement("div");
  chartContent.classList.add("chart__content");
  chartContent.setAttribute("data-id", uId);

  const chartTitle = document.createElement("h2");
  chartTitle.classList.add("chart__title");
  chartTitle.textContent = title;

  const chartContainer = document.createElement("div");
  chartContainer.classList.add("chart");
  chartContainer.appendChild(chartTitle);
  chartContainer.appendChild(chartContent);

  const container = document.getElementById("container");
  container.appendChild(chartContainer);

  return uId;
}

function initAreaChart() {
  const areaId = createChartContainer("Area chart");
  const area = areaChart(`[data-id="${areaId}"]`);
  const data = generateFakeData(100).map(({ time, value }) => ({
    label: time,
    value: value,
    tooltipValue: value,
  }));
  area.render(data);
  window.addEventListener("resize", () => {
    area.update(data);
  });
  setInterval(() => {
    const dataUpdate = generateFakeData(100).map(({ time, value }) => ({
      label: time,
      value: value,
      tooltipValue: value,
    }));
    area.update(dataUpdate);
  }, 10000);
}

function initBarChart() {
  const barId = createChartContainer("Bar chart");

  const barChartComp = barChart(`[data-id="${barId}"]`);
  barChartComp.render(generateBarData(15));
  window.addEventListener("resize", () => {
    barChartComp.update();
  });
}

function initDemo() {
  initAreaChart();
  initBarChart();
}

window.onload = () => {
  initDemo();
};
