import moment from 'moment';
import { areaChart } from "./area-chart";

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const lineChartMockupData = [
  {
    contents_count: 35,
    current_interval: moment("2019-02-08 22:02:09", dateFormat),
  },
  {
    contents_count: 20,
    current_interval: moment("2019-02-10 05:14:13", dateFormat),
  },
  {
    contents_count: 17,
    current_interval: moment("2019-02-11 12:26:17", dateFormat),
  },
  {
    contents_count: 25,
    current_interval: moment("2019-02-12 19:38:21", dateFormat),
  },
  {
    contents_count: 18,
    current_interval: moment("2019-02-14 02:50:25", dateFormat),
  },
  {
    contents_count: 12,
    current_interval: moment("2019-02-15 10:02:29", dateFormat),
  },
  {
    contents_count: 33,
    current_interval: moment("2019-03-16 17:14:33", dateFormat),
  },
  {
    contents_count: 13,
    current_interval: moment("2019-03-18 00:26:37", dateFormat),
  },
  {
    contents_count: 13,
    current_interval: moment("2019-03-19 07:38:41", dateFormat),
  },
  {
    contents_count: 29,
    current_interval: moment("2019-03-20 14:50:45", dateFormat),
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
