import { useState, useEffect } from 'react';
import { Plus, Trash2, Pin, Search, Clock, Tag, Edit2, Check } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Note {
  id: string;
  content: string;
  color: string;
  pinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const noteColors = [
  { id: 'amber', bg: 'rgba(244, 208, 63, 0.15)', border: 'rgba(244, 208, 63, 0.3)', text: '#f4d03f' },
  { id: 'blue', bg: 'rgba(52, 152, 219, 0.15)', border: 'rgba(52, 152, 219, 0.3)', text: '#3498db' },
  { id: 'green', bg: 'rgba(46, 204, 113, 0.15)', border: 'rgba(46, 204, 113, 0.3)', text: '#2ecc71' },
  { id: 'purple', bg: 'rgba(155, 89, 182, 0.15)', border: 'rgba(155, 89, 182, 0.3)', text: '#9b59b6' },
  { id: 'red', bg: 'rgba(231, 76, 60, 0.15)', border: 'rgba(231, 76, 60, 0.3)', text: '#e74c3c' },
  { id: 'gray', bg: 'rgba(149, 165, 166, 0.15)', border: 'rgba(149, 165, 166, 0.3)', text: '#95a5a6' },
];

const initialNotes: Note[] = [
  {
    id: '1',
    content: 'Remember to check the Fizzy board for new tasks',
    color: 'amber',
    pinned: true,
    tags: ['work', 'reminder'],
    createdAt: '2026-03-13T08:00:00',
    updatedAt: '2026-03-13T08:00:00',
  },
  {
    id: '2',
    content: 'Ideas for next garden evolution:\n- Voice memos\n- Photo gallery\n- Mood analytics',
    color: 'blue',
    pinned: true,
    tags: ['ideas', 'garden'],
    createdAt: '2026-03-13T07:30:00',
    updatedAt: '2026-03-13T07:30:00',
  },
  {
    id: '3',
    content: 'Gym schedule: Mon/Wed/Fri - Push/Pull/Legs',
    color: 'green',
    pinned: false,
    tags: ['fitness'],
    createdAt: '2026-03-12T20:00:00',
    updatedAt: '2026-03-12T20:00:00',
  },
  {
    id: '4',
    content: 'Book recommendation: Atomic Habits by James Clear',
    color: 'purple',
    pinned: false,
    tags: ['reading', 'recommendation'],
    createdAt: '2026-03-12T15:00:00',
    updatedAt: '2026-03-12T15:00:00',
  },
];

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ content: '', color: 'amber', tags: [] as string[] });
  const [editContent, setEditContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.quick-notes-section');
  }, [revealRef]);

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const pinnedCount = notes.filter(n => n.pinned).length;

  const addNote = () => {
    if (!newNote.content.trim()) return;
    const now = new Date().toISOString();
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.content,
      color: newNote.color,
      pinned: false,
      tags: newNote.tags,
      createdAt: now,
      updatedAt: now,
    };
    setNotes([note, ...notes]);
    setNewNote({ content: '', color: 'amber', tags: [] });
    setShowAdd(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
    ));
  };

  const startEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    setNotes(notes.map(n => 
      n.id === id ? { ...n, content: editContent, updatedAt: new Date().toISOString() } : n
    ));
    setEditingNote(null);
    setEditContent('');
  };

  const addTagToNewNote = () => {
    if (!newTag.trim() || newNote.tags.includes(newTag.trim())) return;
    setNewNote({ ...newNote, tags: [...newNote.tags, newTag.trim()] });
    setNewTag('');
  };

  const removeTagFromNewNote = (tag: string) => {
    setNewNote({ ...newNote, tags: newNote.tags.filter(t => t !== tag) });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  };

  const getColorStyle = (colorId: string) => {
    return noteColors.find(c => c.id === colorId) || noteColors[0];
  };

  return (
    <section className="quick-notes-section" id="notes" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Thought Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Quick Notes
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{notes.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Notes</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{pinnedCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pinned</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{allTags.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tags</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setSelectedTag(null)}
            style={{
              padding: '0.5rem 1rem',
              background: !selectedTag ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              color: !selectedTag ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedTag === tag ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '20px',
                color: selectedTag === tag ? 'var(--bg-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredNotes.map(note => {
          const colorStyle = getColorStyle(note.color);
          const isEditing = editingNote === note.id;
          
          return (
            <div
              key={note.id}
              style={{
                background: colorStyle.bg,
                border: `1px solid ${colorStyle.border}`,
                borderRadius: '8px',
                padding: '1.25rem',
                position: 'relative',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {note.pinned && <Pin size={14} color={colorStyle.text} fill={colorStyle.text} />}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {isEditing ? (
                    <button
                      onClick={() => saveEdit(note.id)}
                      style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: '#2ecc71', cursor: 'pointer' }}
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(note)}
                      style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: colorStyle.text, cursor: 'pointer' }}
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => togglePin(note.id)}
                    style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: colorStyle.text, cursor: 'pointer' }}
                  >
                    <Pin size={16} fill={note.pinned ? colorStyle.text : 'none'} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    marginBottom: '0.75rem',
                  }}
                />
              ) : (
                <p style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '0.95rem', 
                  lineHeight: 1.5, 
                  marginBottom: '0.75rem',
                  whiteSpace: 'pre-wrap',
                }}>
                  {note.content}
                </p>
              )}

              {/* Tags & Time */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '0.15rem 0.4rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        color: colorStyle.text,
                        fontSize: '0.7rem',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Clock size={12} />
                  {formatTime(note.updatedAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '450px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              New Note
            </h3>

            {/* Color Picker */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Color
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {noteColors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setNewNote({ ...newNote, color: color.id })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: color.bg,
                      border: newNote.color === color.id ? `2px solid ${color.text}` : `1px solid ${color.border}`,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            <textarea
              placeholder="Write your note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                resize: 'vertical',
              }}
            />

            {/* Tags */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTagToNewNote()}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                />
                <button
                  onClick={addTagToNewNote}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'var(--accent-gold)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--bg-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <Tag size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {newNote.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(244, 208, 63, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--accent-gold)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => removeTagFromNewNote(tag)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addNote}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                }}
              >
                Add Note
              </button>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
