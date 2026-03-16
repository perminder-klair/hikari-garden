import { useState } from 'react';
import { Target, CheckCircle2, Circle, Trophy, Calendar, TrendingUp, Plus, X } from 'lucide-react';
import styles from './GoalGarden.module.css';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'health' | 'learning' | 'creative' | 'personal';
  deadline: string;
  progress: number;
  milestones: Milestone[];
  completed: boolean;
}

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Launch Digital Garden',
    description: 'Complete and deploy the Hikari Garden project with 100+ sections',
    category: 'creative',
    deadline: '2026-03-20',
    progress: 85,
    milestones: [
      { id: 'm1', title: 'Core architecture', completed: true },
      { id: 'm2', title: '50 sections', completed: true },
      { id: 'm3', title: '100 sections', completed: true },
      { id: 'm4', title: 'Deploy to production', completed: false },
    ],
    completed: false
  },
  {
    id: '2',
    title: 'Learn Rust',
    description: 'Complete the Rust book and build a CLI tool',
    category: 'learning',
    deadline: '2026-04-15',
    progress: 30,
    milestones: [
      { id: 'm1', title: 'Chapters 1-5', completed: true },
      { id: 'm2', title: 'Chapters 6-10', completed: false },
      { id: 'm3', title: 'Build CLI tool', completed: false },
    ],
    completed: false
  },
  {
    id: '3',
    title: 'Fitness Consistency',
    description: 'Work out 4 times per week for 3 months',
    category: 'health',
    deadline: '2026-06-01',
    progress: 60,
    milestones: [
      { id: 'm1', title: 'Month 1 complete', completed: true },
      { id: 'm2', title: 'Month 2 complete', completed: true },
      { id: 'm3', title: 'Month 3 complete', completed: false },
    ],
    completed: false
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', color: '#888' },
  { id: 'career', label: 'Career', color: '#3498db' },
  { id: 'health', label: 'Health', color: '#2ecc71' },
  { id: 'learning', label: 'Learning', color: '#9b59b6' },
  { id: 'creative', label: 'Creative', color: '#e74c3c' },
  { id: 'personal', label: 'Personal', color: '#f39c12' },
];

export default function GoalGarden() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    deadline: ''
  });

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(g => g.category === selectedCategory);

  const completedGoals = goals.filter(g => g.completed).length;
  const totalProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedMilestones = goal.milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);
      const allCompleted = completedCount === updatedMilestones.length;
      
      return {
        ...goal,
        milestones: updatedMilestones,
        progress,
        completed: allCompleted
      };
    }));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      deadline: newGoal.deadline,
      progress: 0,
      milestones: [],
      completed: false
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', category: 'personal', deadline: '' });
    setShowAddForm(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Target className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Goal Garden</h2>
        <p className={styles.sectionSubtitle}>Plant goals, watch them grow</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <Trophy className={styles.statIcon} />
          <span className={styles.statValue}>{completedGoals}/{goals.length}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <TrendingUp className={styles.statIcon} />
          <span className={styles.statValue}>{Math.round(totalProgress)}%</span>
          <span className={styles.statLabel}>Avg Progress</span>
        </div>
        <div className={styles.stat}>
          <Calendar className={styles.statIcon} />
          <span className={styles.statValue}>{goals.length}</span>
          <span className={styles.statLabel}>Active Goals</span>
        </div>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={styles.categoryButton}
            data-active={selectedCategory === cat.id}
            style={{ '--category-color': cat.color } as React.CSSProperties}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button className={styles.addGoalButton} onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? <X size={18} /> : <Plus size={18} />}
        {showAddForm ? 'Cancel' : 'New Goal'}
      </button>

      {showAddForm && (
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Goal title..."
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <textarea
            placeholder="Description..."
            rows={2}
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
          <div className={styles.formRow}>
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            />
          </div>
          <button className={styles.saveButton} onClick={addGoal}>Create Goal</button>
        </div>
      )}

      <div className={styles.goalsList}>
        {filteredGoals.map(goal => (
          <div key={goal.id} className={styles.goalCard} data-completed={goal.completed}>
            <div className={styles.goalHeader}>
              <div className={styles.goalTitleRow}>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
                <span 
                  className={styles.categoryBadge}
                  style={{ background: CATEGORIES.find(c => c.id === goal.category)?.color }}
                >
                  {goal.category}
                </span>
              </div>
              <span className={styles.deadline}>
                <Calendar size={12} />
                Due {goal.deadline}
              </span>
            </div>

            <p className={styles.goalDescription}>{goal.description}</p>

            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span>Progress</span>
                <span className={styles.progressValue}>{goal.progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className={styles.milestones}>
              {goal.milestones.map(milestone => (
                <button
                  key={milestone.id}
                  className={styles.milestone}
                  data-completed={milestone.completed}
                  onClick={() => toggleMilestone(goal.id, milestone.id)}
                >
                  {milestone.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  <span>{milestone.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
