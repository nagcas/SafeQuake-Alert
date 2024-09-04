import './Grafic.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function GraficLine({ totalSismics }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState('');
  const [dailyMagnitudes, setDailyMagnitudes] = useState([]);

  

  return (
    <div className='content__line'>
      <Line
        data={{
          labels: [], // I giorni del mese
          datasets: [
            {
              label: `Magnitudo media giornaliera nel mese di `,
              data: [], // Magnitudo media per ogni giorno
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Magnitudo',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Giorni del mese',
              },
            },
          },
        }}
      />
    </div>
  );
}

export default GraficLine;
