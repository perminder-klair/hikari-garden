import { useState } from 'react';
import { KanbanSquare, Plus, Circle } from 'lucide-react';
import styles from './TaskBoard.module.css';

interface Task {
  id: number;
  title: string;
  tag: string;
  priority: 'high' | 'medium' | 'low';
}

const initialTasks: Record<string, Task[]> = {
  todo: [
    { id: 1, title: 'Design new landing page', tag: 'design', priority: 'high' },
    { id: 2, title: 'Update documentation', tag: 'docs', priority: 'medium' },
    { id: 3, title: 'Fix navigation bug', tag: 'bug', priority: 'high' },
  ],
  inProgress: [
    { id: 4, title: 'Implement dark mode', tag: 'feature', priority: 'medium' },
    { id: 5, title: 'Optimize images', tag: 'feature', priority: 'low' },
  ],
  done: [
    { id: 6, title: 'Setup CI/CD pipeline', tag: 'feature', priority: 'high' },
    { id: 7, title: 'Write unit tests', tag: 'docs', priority: 'medium' },
  ],
};

const tagStyles: Record<string, string> = {
  feature: styles.tagFeature,
  bug: styles.tagBug,
  design: styles.tagDesign,
  docs: styles.tagDocs,
};

const priorityStyles: Record<string, string> = {
  high: styles.priorityHigh,
  medium: styles.priorityMedium,
  low: styles.priorityLow,
};

export default function TaskBoard() {
  const [tasks] = useState(initialTasks);

  return (
    <section className={styles.taskBoard}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <KanbanSquare className={styles.icon} size={20} />
          Task Board
        </h2>
        <button className={styles.addBtn}>
          <Plus size={14} />
          New Task
        </button>
      </div>

      <div className={styles.board}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <span className={`${styles.columnIcon} ${styles.todoIcon}`} />
              To Do
            </div>
            <span className={styles.taskCount}>{tasks.todo.length}</span>
          </div>
          {tasks.todo.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskTitle}>{task.title}</div>
              <div className={styles.taskMeta}>
                <span className={`${styles.taskTag} ${tagStyles[task.tag]}`}>
                  {task.tag}
                </span>
                <span className={`${styles.taskPriority} ${priorityStyles[task.priority]}`} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <span className={`${styles.columnIcon} ${styles.inProgressIcon}`} />
              In Progress
            </div>
            <span className={styles.taskCount}>{tasks.inProgress.length}</span>
          </div>
          {tasks.inProgress.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskTitle}>{task.title}</div>
              <div className={styles.taskMeta}>
                <span className={`${styles.taskTag} ${tagStyles[task.tag]}`}>
                  {task.tag}
                </span>
                <span className={`${styles.taskPriority} ${priorityStyles[task.priority]}`} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <span className={`${styles.columnIcon} ${styles.doneIcon}`} />
              Done
            </div>
            <span className={styles.taskCount}>{tasks.done.length}</span>
          </div>
          {tasks.done.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskTitle}>{task.title}</div>
              <div className={styles.taskMeta}>
                <span className={`${styles.taskTag} ${tagStyles[task.tag]}`}>
                  {task.tag}
                </span>
                <span className={`${styles.taskPriority} ${priorityStyles[task.priority]}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
