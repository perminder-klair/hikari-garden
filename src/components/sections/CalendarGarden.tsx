import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarGarden.module.css';

interface CalendarEvent {
  id: number;
  title: string;
  date: number;
  type: 'work' | 'personal' | 'reminder' | 'meeting';
  time?: string;
}

const events: CalendarEvent[] = [
  { id: 1, title: 'Team Standup', date: 15, type: 'work', time: '09:00' },
  { id: 2, title: 'Code Review', date: 15, type: 'work', time: '14:00' },
  { id: 3, title: 'Gym Session', date: 16, type: 'personal', time: '18:00' },
  { id: 4, title: 'Project Deadline', date: 18, type: 'reminder', time: '17:00' },
  { id: 5, title: 'Client Meeting', date: 20, type: 'meeting', time: '10:00' },
  { id: 6, title: 'Deploy to Production', date: 22, type: 'work', time: '16:00' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const tagStyles: Record<string, string> = {
  work: styles.eventWork,
  personal: styles.eventPersonal,
  reminder: styles.eventReminder,
  meeting: styles.eventMeeting,
};

const tagLabels: Record<string, string> = {
  work: 'Work',
  personal: 'Personal',
  reminder: 'Reminder',
  meeting: 'Meeting',
};

export default function CalendarGarden() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(e => e.date === day);
  };

  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
    });
  }

  // Next month days to fill grid
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  const upcomingEvents = events
    .filter(e => e.date >= today.getDate())
    .slice(0, 4);

  return (
    <section className={styles.calendarGarden}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Calendar className={styles.icon} size={20} />
          Calendar Garden
        </h2>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prevMonth}>
            <ChevronLeft size={18} />
          </button>
          <span className={styles.monthYear}>
            {monthNames[month]} {year}
          </span>
          <button className={styles.navBtn} onClick={nextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={styles.calendar}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {calendarDays.map((cell, index) => {
          const dayEvents = cell.isCurrentMonth ? getEventsForDay(cell.day) : [];
          return (
            <div
              key={index}
              className={`${styles.dayCell} ${!cell.isCurrentMonth ? styles.otherMonth : ''} ${cell.isToday ? styles.today : ''}`}
            >
              <span className={styles.dayNumber}>{cell.day}</span>
              {dayEvents.length > 0 && (
                <div className={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <span key={i} className={`${styles.eventDot} ${tagStyles[event.type]}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.upcomingEvents}>
        <h3 className={styles.sectionTitle}>Upcoming Events</h3>
        <div className={styles.eventList}>
          {upcomingEvents.map(event => (
            <div key={event.id} className={styles.eventItem}>
              <span className={styles.eventTime}>{event.time}</span>
              <span className={styles.eventTitle}>{event.title}</span>
              <span className={`${styles.eventTag} ${tagStyles[event.type]}`}>
                {tagLabels[event.type]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
