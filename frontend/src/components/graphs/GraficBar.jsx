import './Grafic.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';

function GraficBar({ totalSismics }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState('');
  const [sismicCounts, setSismicCounts] = useState([]);
  const lastNotifiedEventId = useRef(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const currentMonth_ = new Date().getMonth() + 1;

    switch (currentMonth_) {
      case 1:
        setCurrentMonth('Gennaio');
        break;
      case 2:
        setCurrentMonth('Febbraio');
        break;
      case 3:
        setCurrentMonth('Marzo');
        break;
      case 4:
        setCurrentMonth('Aprile');
        break;
      case 5:
        setCurrentMonth('Maggio');
        break;
      case 6:
        setCurrentMonth('Giugno');
        break;
      case 7:
        setCurrentMonth('Luglio');
        break;
      case 8:
        setCurrentMonth('Agosto');
        break;
      case 9:
        setCurrentMonth('Settembre');
        break;
      case 10:
        setCurrentMonth('Ottobre');
        break;
      case 11:
        setCurrentMonth('Novembre');
        break;
      case 12:
        setCurrentMonth('Dicembre');
        break;
      default:
        setCurrentMonth('');
    }
  }, []);


  // totalSismics.map((sismic) => {
  //   date.push(sismic.properties.time.split('T')[0].split('-')[2]); 
  // })
 

  return (
    <div className='content__bar'>
      <Bar
        data={{
          labels: [], // I giorni del mese
          datasets: [
            {
              label: `Eventi sismici nel mese di ${currentMonth} ${currentYear}`,
              data: [], // Conteggi degli eventi sismici per ogni giorno
            },
          ],
        }}
      />
    </div>
  );
}

export default GraficBar;

