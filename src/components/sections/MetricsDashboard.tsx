import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Activity, Zap, Globe } from 'lucide-react';
import styles from './MetricsDashboard.module.css';

interface Metric {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const generateRandomData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export default function MetricsDashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: '1', label: 'Page Views', value: '24.5K', change: 12.3, icon: <Globe size={16} /> },
    { id: '2', label: 'Active Users', value: '1,234', change: 5.7, icon: <Users size={16} /> },
    { id: '3', label: 'Avg Response', value: '45ms', change: -8.2, icon: <Zap size={16} /> },
    { id: '4', label: 'Error Rate', value: '0.02%', change: -15.0, icon: <Activity size={16} /> },
  ]);

  const [trafficData, setTrafficData] = useState(generateRandomData(24, 20, 100));
  const [performanceData, setPerformanceData] = useState(generateRandomData(20, 30, 90));

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(generateRandomData(24, 20, 100));
      setPerformanceData(generateRandomData(20, 30, 90));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMaxValue = (data: number[]) => Math.max(...data);

  return (
    <section className={styles.metricsDashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BarChart3 className={styles.icon} size={20} />
          Metrics Dashboard
        </h2>
        <div className={styles.timeRange}>
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              className={`${styles.rangeBtn} ${timeRange === range ? styles.rangeBtnActive : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <div key={metric.id} className={styles.metricCard}>
            <div className={styles.metricLabel}>
              {metric.icon} {metric.label}
            </div>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={`${styles.metricChange} ${metric.change >= 0 ? styles.positive : styles.negative}`}>
              {metric.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span style={{ marginLeft: '0.25rem' }}>{Math.abs(metric.change)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span className={styles.chartTitle}>Traffic Overview</span>
            <span className={styles.chartValue}>{trafficData.reduce((a, b) => a + b, 0).toLocaleString()}</span>
          </div>
          <div className={styles.chartArea}>
            {trafficData.map((value, index) => (
              <div
                key={index}
                className={styles.bar}
                data-value={value}
                style={{
                  height: `${(value / getMaxValue(trafficData)) * 100}%`,
                  background: value > 80 ? '#2ecc71' : value > 50 ? '#f4d03f' : '#e74c3c',
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span className={styles.chartTitle}>Performance Trend</span>
            <span className={styles.chartValue}>{Math.round(performanceData.reduce((a, b) => a + b, 0) / performanceData.length)}ms</span>
          </div>
          <div className={styles.sparkline}>
            {performanceData.map((value, index) => (
              <div
                key={index}
                className={styles.spark}
                style={{
                  height: `${(value / 100) * 60}px`,
                  opacity: 0.4 + (value / 100) * 0.6,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
