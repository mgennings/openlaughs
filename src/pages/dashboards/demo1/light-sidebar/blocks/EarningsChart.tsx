import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const fetchEarningsChart = () => {
  // return axios.get<number[]>(`${import.meta.env.VITE_APP_API_URL}/sales/index`);

  // Generate realistic comedy venue earnings data
  // Comedy shows tend to peak in summer (Jun-Aug) and winter holidays (Dec)
  // with lower attendance in Jan-Feb and slower spring months
  return {
    data: [
      28, // Jan - Post-holiday slump
      32, // Feb - Still slow, Valentine's shows help
      45, // Mar - Spring picking up
      52, // Apr - Tax returns, people spending more
      58, // May - Nice weather, more shows
      72, // Jun - Summer season starts strong
      85, // Jul - Peak summer, festivals, tourists
      78, // Aug - Still strong summer
      65, // Sep - Back to school dip
      68, // Oct - Halloween events boost
      55, // Nov - Pre-holiday slowdown
      82, // Dec - Holiday parties, corporate events
    ],
  };
};

const EarningsChart = () => {
  const [charData, setCharData] = useState<number[]>();
  const categories: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {
    const data = fetchEarningsChart();
    if (data && 'data' in data) {
      setCharData(data.data);
    }
  }, []);

  const options: ApexOptions = {
    series: [
      {
        name: 'series1',
        data: charData ?? [],
      },
    ],
    chart: {
      height: 250,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['var(--tw-primary)'],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: 'var(--tw-gray-500)',
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: 'var(--tw-primary)',
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: false,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: 'var(--tw-gray-500)',
          fontSize: '12px',
        },
        formatter: defaultValue => {
          return `$${defaultValue}K`;
        },
      },
    },
    tooltip: {
      enabled: true,
      custom({ series, seriesIndex, dataPointIndex, w }) {
        const number = parseInt(series[seriesIndex][dataPointIndex]) * 1000;
        const monthName = categories[dataPointIndex];

        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });

        const formattedNumber = formatter.format(number);

        // Calculate month-over-month growth
        let growthBadge = '';
        if (dataPointIndex > 0) {
          const currentValue = parseInt(series[seriesIndex][dataPointIndex]);
          const previousValue = parseInt(
            series[seriesIndex][dataPointIndex - 1],
          );
          const growthPercent = (
            ((currentValue - previousValue) / previousValue) *
            100
          ).toFixed(1);
          const isPositive = parseFloat(growthPercent) >= 0;
          const badgeClass = isPositive ? 'badge-success' : 'badge-danger';
          const sign = isPositive ? '+' : '';
          growthBadge = `<span class="badge badge-outline ${badgeClass} badge-xs">${sign}${growthPercent}%</span>`;
        }

        return `
          <div class="flex flex-col gap-2 p-3.5">
            <div class="font-medium text-2sm text-gray-600">${monthName}, 2025 Earnings</div>
            <div class="flex items-center gap-1.5">
              <div class="font-semibold text-md text-gray-900">${formattedNumber}</div>
              ${growthBadge}
            </div>
          </div>
          `;
      },
    },
    markers: {
      size: 0,
      colors: 'var(--tw-primary-light)',
      strokeColors: 'var(--tw-primary)',
      strokeWidth: 4,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: 8,
        sizeOffset: 0,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.25,
        opacityTo: 0,
      },
    },
    grid: {
      borderColor: 'var(--tw-gray-200)',
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Earnings</h3>

        <div className="flex items-center gap-5">
          <label className="switch switch-sm">
            <input
              name="check"
              type="checkbox"
              value="1"
              className="order-2"
              readOnly
            />
            <span className="switch-label order-1">Referrals only</span>
          </label>

          <Select defaultValue="1">
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="1">1 month</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="card-body flex flex-col justify-end items-stretch grow px-3 py-1">
        {charData && (
          <ApexChart
            id="earnings_chart"
            options={options}
            series={options.series}
            type="area"
            max-width="694"
            height="250"
          />
        )}
      </div>
    </div>
  );
};

export { EarningsChart };
