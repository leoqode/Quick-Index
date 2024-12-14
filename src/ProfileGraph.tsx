import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";

interface Race {
  wpm: number;
  date: string;
}

interface ProfileGraphProps {
  races: Race[];
}

const ProfileGraph: React.FC<ProfileGraphProps> = ({ races }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<'all' | 'day' | '7days' | 'month' | 'year'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const filterRacesByTimeRange = (races: Race[], range: string): Race[] => {
    const now = new Date();
    return races.filter(race => {
      const raceDate = new Date(race.date);
      const diffInDays = (now.getTime() - raceDate.getTime()) / (1000 * 3600 * 24);

      switch (range) {
        case 'day': return diffInDays <= 1;
        case '7days': return diffInDays <= 7;
        case 'month': return diffInDays <= 30;
        case 'year': return diffInDays <= 365;
        default: return true;
      }
    });
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const filteredRaces = filterRacesByTimeRange(races, timeRange);

      const sortedRaces = [...filteredRaces].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const newChart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: sortedRaces.map((race) => formatDate(race.date)),
          datasets: [
            {
              label: "Words per Minute",
              data: sortedRaces.map((race) => race.wpm),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });

      setChartInstance(newChart);

      return () => {
        newChart.destroy();
      };
    }
  }, [races, timeRange]); 

  const timeRangeOptions = [
    { value: 'day', label: 'Day' },
    { value: '7days', label: '7 Days' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2 mb-4">
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value as typeof timeRange)}
            className={`px-4 py-2 rounded-md transition-colors ${
              timeRange === option.value
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="h-64 w-full content-center">
        <canvas ref={chartRef} id="wpmChart" />
      </div>
    </div>
  );
};

export default ProfileGraph;
