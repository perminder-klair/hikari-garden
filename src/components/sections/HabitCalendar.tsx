import { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Flame, Target } from 'lucide-react';
import styles from './HabitCalendar.module.css';

interface HabitDay {
  date: string;
  completed: boolean;
  habits: string[];
}

const habits = ['Meditate', 'Exercise', 'Read', 'Code', 'Journal'];

const generateSampleData = (): HabitDay[] => {
  const data: HabitDay[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const completed = Math.random() > 0.3;
    data.push({
      date: dateStr,
      completed,
      habits: completed ? habits.filter(() => Math.random() > 0.4) : [],
    });
  }
  return data;
};

export default function HabitCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habitData] = useState<HabitDay[]>(generateSampleData());
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const stats = useMemo(() => {
    const completed = habitData.filter(d => d.completed).length;
    const streak = habitData.reduce((maxStreak, day, i) => {
      if (day.completed) {
        let currentStreak = 1;
        for (let j = i + 1; j < habitData.length && habitData[j].completed; j++) {
          currentStreak++;
        }
        return Math.max(maxStreak, currentStreak);
      }
      return maxStreak;
    }, 0);
    return { completed, streak, total: habitData.length };
  }, [habitData]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (HabitDay | null)[] = Array(startingDay).fill(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayData = habitData.find(d => d.date === dateStr);
      days.push(dayData || { date: dateStr, completed: false, habits: [] });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDayIntensity = (day: HabitDay | null) => {
    if (!day || !day.completed) return 0;
    const count = day.habits.length;
    if (count >= 4) return 4;
    if (count >= 3) return 3;
    if (count >= 2) return 2;
    return 1;
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <CalendarDays className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Habit Calendar</h2>
        <p className={styles.sectionSubtitle}>Visualize your consistency</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.completed}</span>
          <span className={styles.statLabel}>Days Active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.streak}</span>
          <span className={styles.statLabel}>
            <Flame size={14} /> Best Streak
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {Math.round((stats.completed / stats.total) * 100)}%
          </span>
          <span className={styles.statLabel}>Consistency</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.calendarHeader}>
          <button onClick={prevMonth} className={styles.iconButton}>
            <ChevronLeft size={20} />
          </button>
          <h3 className={styles.monthTitle}>{monthName}</h3>
          <button onClick={nextMonth} className={styles.iconButton}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.weekdays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {days.map((day, index) => {
            const intensity = getDayIntensity(day);
            return (
              <div
                key={index}
                className={styles.calendarDay}
                data-intensity={intensity}
                title={day ? `${day.date}: ${day.habits.length} habits` : ''}
              >
                {day && (
                  <>
                    <span className={styles.dayNumber}>
                      {parseInt(day.date.split('-')[2])}
                    </span>
                    {day.completed && (
                      <div className={styles.dayIndicator}>
                        <Target size={12} />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.legend}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} className={styles.legendBox} data-intensity={level} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className={styles.habitList}>
        <h4 className={styles.habitListTitle}>Tracked Habits</h4>
        <div className={styles.habitTags}>
          {habits.map(habit => (
            <button
              key={habit}
              onClick={() => setSelectedHabit(selectedHabit === habit ? null : habit)}
              className={styles.habitTag}
              data-active={selectedHabit === habit}
            >
              {habit}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
