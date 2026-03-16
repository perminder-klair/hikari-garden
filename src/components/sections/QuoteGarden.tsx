import { useState, useEffect } from 'react';
import { Quote, Heart, Share2, RefreshCw, Copy, Check } from 'lucide-react';
import styles from './QuoteGarden.module.css';

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  category: string;
  liked: boolean;
}

const QUOTES: QuoteItem[] = [
  { id: '1', text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work", liked: false },
  { id: '2', text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership", liked: true },
  { id: '3', text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Life", liked: false },
  { id: '4', text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "Life", liked: false },
  { id: '5', text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Design", liked: true },
  { id: '6', text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "Programming", liked: false },
  { id: '7', text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Programming", liked: false },
  { id: '8', text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", category: "Wisdom", liked: false },
  { id: '9', text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Innovation", liked: true },
  { id: '10', text: "Knowledge is power.", author: "Francis Bacon", category: "Learning", liked: false },
  { id: '11', text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Motivation", liked: false },
  { id: '12', text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Productivity", liked: false },
];

const CATEGORIES = ['All', 'Work', 'Life', 'Programming', 'Design', 'Leadership', 'Innovation', 'Learning', 'Motivation', 'Wisdom'];

export default function QuoteGarden() {
  const [quotes, setQuotes] = useState<QuoteItem[]>(QUOTES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  const filteredQuotes = selectedCategory === 'All' 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  const currentQuote = filteredQuotes[currentIndex % filteredQuotes.length] || filteredQuotes[0];

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
    setCopied(false);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
    setCopied(false);
  };

  const toggleLike = (id: string) => {
    setQuotes(quotes.map(q => 
      q.id === id ? { ...q, liked: !q.liked } : q
    ));
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quote from Hikari Garden',
        text: `"${currentQuote.text}" — ${currentQuote.author}`
      });
    }
  };

  const likedCount = quotes.filter(q => q.liked).length;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Quote className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Quote Garden</h2>
        <p className={styles.sectionSubtitle}>Wisdom collected over time</p>
      </div>

      <div className={styles.stats}>
        <span>{quotes.length} quotes</span>
        <span className={styles.dot}>•</span>
        <span>{likedCount} favorites</span>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={styles.categoryButton}
            data-active={selectedCategory === cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.quoteCard}>
        <div className={styles.quoteIcon}>
          <Quote size={32} />
        </div>

        <blockquote className={styles.quoteText}>
          "{currentQuote.text}"
        </blockquote>

        <cite className={styles.quoteAuthor}>
          — {currentQuote.author}
        </cite>

        <div className={styles.quoteMeta}>
          <span className={styles.categoryTag}>{currentQuote.category}</span>
        </div>

        <div className={styles.quoteActions}>
          <button 
            className={styles.actionButton}
            data-liked={currentQuote.liked}
            onClick={() => toggleLike(currentQuote.id)}
            title="Add to favorites"
          >
            <Heart size={20} fill={currentQuote.liked ? "currentColor" : "none"} />
          </button>

          <button 
            className={styles.actionButton}
            onClick={copyQuote}
            title="Copy to clipboard"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>

          <button 
            className={styles.actionButton}
            onClick={shareQuote}
            title="Share quote"
          >
            <Share2 size={20} />
          </button>
        </div>

        <div className={styles.navigation}>
          <button className={styles.navButton} onClick={prevQuote}>
            ← Previous
          </button>
          
          <span className={styles.counter}>
            {currentIndex + 1} / {filteredQuotes.length}
          </span>
          
          <button className={styles.navButton} onClick={nextQuote}>
            Next →
          </button>
        </div>
      </div>

      <div className={styles.favoritesSection}>
        <h3 className={styles.favoritesTitle}>
          <Heart size={18} fill="currentColor" />
          Favorites ({likedCount})
        </h3>
        
        {likedCount === 0 ? (
          <p className={styles.emptyFavorites}>
            No favorites yet. Click the heart to save quotes you love.
          </p>
        ) : (
          <div className={styles.favoritesList}>
            {quotes.filter(q => q.liked).map(q => (
              <div key={q.id} className={styles.favoriteItem}>
                <p>"{q.text}"</p>
                <span>— {q.author}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
