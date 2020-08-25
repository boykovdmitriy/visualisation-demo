import { v4 as uuid } from "uuid";

import areaChart from "./visualisations/areaChart";
import "./app.scss";

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

function initDemo() {
  const areaId = createChartContainer("Area chart");
  const area = areaChart(`[data-id="${areaId}"]`);
  area.render();
  window.addEventListener('resize', () => {
    area.update();
  })
}

window.onload = () => {
  initDemo();
};
