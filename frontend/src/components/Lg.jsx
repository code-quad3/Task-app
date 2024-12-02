import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart elements
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const CompletionRateChart = () => {
  const [completionRates, setCompletionRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:9000/task/completion-rate-week', { withCredentials: true })
      .then(response => {
        const data = response.data.completionRates;
        setCompletionRates(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching completion rates:', error);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: completionRates,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  const isEmptyOrZero = completionRates.length === 0 || completionRates.every(rate => rate === 0);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (hasError) {
    return <p>Error fetching completion rates. Please try again later.</p>;
  }

  if (isEmptyOrZero) {
    return (
      <div className="h-42 w-42">
        <p>No weekly task completion data available.</p>
      </div>
    );
  }

  return (
    <div className="h-42 w-42">
      <Line data={data} options={options} />
    </div>
  );
};

export default CompletionRateChart;
