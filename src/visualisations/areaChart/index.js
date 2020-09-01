import moment from 'moment';
import { areaChart } from "./area-chart";

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const lineChartMockupData = [
  {
    value: 35,
    time: "2019-02-08 22:02:09",
  },
  {
    value: 20,
    time: "2019-02-10 05:14:13",
  },
  {
    value: 17,
    time: "2019-02-11 12:26:17",
  },
  {
    value: 25,
    time: "2019-02-12 19:38:21",
  },
  {
    value: 18,
    time: "2019-02-14 02:50:25",
  },
  {
    value: 12,
    time: "2019-02-15 10:02:29",
  },
  {
    value: 33,
    time: "2019-03-16 17:14:33",
  },
  {
    value: 13,
    time: "2019-03-18 00:26:37",
  },
  {
    value: 13,
    time: "2019-03-19 07:38:41",
  },
  {
    value: 29,
    time: "2019-03-20 14:50:45",
  },
];

export default (selector) => {
  let update;
  return {
    render: () => {
      const items = lineChartMockupData.map(({time, value}) => ({
        label: new Date(time),
        time: time,
        value: value,
        tooltipValue: value,
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
