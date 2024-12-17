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

  // Define the possible time ranges
  type TimeRange = "all" | "day" | "7days" | "month" | "year";

  // Initialize timeRange from localStorage or default to 'day'
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    if (typeof window !== "undefined") {
      const storedRange = localStorage.getItem(
        "profileGraphTimeRange"
      ) as TimeRange | null;
      const validRanges: TimeRange[] = ["all", "day", "7days", "month", "year"];
      return storedRange && validRanges.includes(storedRange)
        ? storedRange
        : "day";
    }
    return "day";
  });

  // Update localStorage whenever timeRange changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profileGraphTimeRange", timeRange);
    }
  }, [timeRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const filterRacesByTimeRange = (races: Race[], range: TimeRange): Race[] => {
    const now = new Date();
    return races.filter((race) => {
      const raceDate = new Date(race.date);
      const diffInDays = Math.floor(
        (now.getTime() - raceDate.getTime()) / (1000 * 3600 * 24)
      );
  
      switch (range) {
        case "day":
          return diffInDays < 1; // Changed to strictly less than 1
        case "7days":
          return diffInDays < 7;
        case "month":
          return diffInDays < 30;
        case "year":
          return diffInDays < 365;
        case "all":
          return true;
        default:
          return true;
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
  
      // Format date based on time range
      const formatDateByRange = (dateString: string) => {
        const date = new Date(dateString);
        switch (timeRange) {
          case "day":
            return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
          case "7days":
            return date.toLocaleDateString("en-US", { weekday: "short" });
          case "month":
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          case "year":
          case "all":
            return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          default:
            return formatDate(dateString);
        }
      };
  
      // Determine point radius based on data length
      const pointRadius = sortedRaces.length > 30 ? 0 : 3;
      const pointHoverRadius = 6;
  
      const newChart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: sortedRaces.map((race) => race.date), // Store full date for tooltip
          datasets: [
            {
              label: "Words per Minute",
              data: sortedRaces.map((race) => race.wpm),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              pointRadius,
              pointHoverRadius,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              fill: true,
              tension: 0.2, // Slight curve for smoother lines
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: { color: "#fff" },
            },
            tooltip: {
              enabled: true,
              mode: "index",
              intersect: false,
              callbacks: {
                title: (tooltipItems) => {
                  const date = new Date(tooltipItems[0].label);
                  return date.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  });
                },
                label: (context) => `${context.parsed.y} WPM`,
              },
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 12,
              cornerRadius: 6,
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#ccc",
                maxRotation: 45,
                minRotation: 45,
                callback: function(value, index) {
                  const label = this.getLabelForValue(value as number);
                  // Show fewer labels when there's more data
                  if (sortedRaces.length > 20) {
                    // Show every nth label based on data length
                    const skipFactor = Math.ceil(sortedRaces.length / 10);
                    if (index % skipFactor !== 0) return "";
                  }
                  return formatDateByRange(label);
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
                display: sortedRaces.length <= 30, // Hide grid lines for large datasets
              },
            },
            y: {
              beginAtZero: true,
              ticks: { color: "#ccc" },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
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

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "7days", label: "7 Days" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex justify-center space-x-2 mb-4'>
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value as typeof timeRange)}
            className={`px-4 py-2 rounded-md transition-colors ${
              timeRange === option.value
                ? "bg-cyan-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className='h-64 w-full content-center'>
        <canvas ref={chartRef} id='wpmChart' />
      </div>
    </div>
  );
};

export default ProfileGraph;
