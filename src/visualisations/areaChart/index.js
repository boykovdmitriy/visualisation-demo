import { areaChart } from "./area-chart";
const lineChartMockupData = [
  {
    contents_count: 35,
    current_interval: "2019-02-08T22:02:09.000+00:00",
  },
  {
    contents_count: 20,
    current_interval: "2019-02-10T05:14:13.000+00:00",
  },
  {
    contents_count: 17,
    current_interval: "2019-02-11T12:26:17.000+00:00",
  },
  {
    contents_count: 25,
    current_interval: "2019-02-12T19:38:21.000+00:00",
  },
  {
    contents_count: 18,
    current_interval: "2019-02-14T02:50:25.000+00:00",
  },
  {
    contents_count: 12,
    current_interval: "2019-02-15T10:02:29.000+00:00",
  },
  {
    contents_count: 33,
    current_interval: "2019-03-16T17:14:33.000+00:00",
  },
  {
    contents_count: 13,
    current_interval: "2019-03-18T00:26:37.000+00:00",
  },
  {
    contents_count: 13,
    current_interval: "2019-03-19T07:38:41.000+00:00",
  },
  {
    contents_count: 29,
    current_interval: "2019-03-20T14:50:45.000+00:00",
  },
];

export default (selector) => {
  let update;
  return {
    render: () => {
      const items = lineChartMockupData.map((x) => ({
        label: x.current_interval,
        value: x.contents_count,
        tooltipValue: x.contents_count,
      }));
      const container = document.querySelector(selector);
      const width = container.offsetWidth;
      update = areaChart({
        width,
        height: 0.5 * width,
        selector,
        data: items,
        uniqKey: "redStyle",
      });
    },
    update: () => {
      const container = document.querySelector(selector);
      const width = container.offsetWidth;
      if (update) {
        update({ width, height: 0.5 * width });
      }
    },
  };
};
