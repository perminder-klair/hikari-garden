import { useState, useEffect } from 'react';
import { Building2, DoorOpen, Lightbulb, Search, Plus } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface MemoryRoom {
  id: string;
  name: string;
  icon: string;
  memories: Memory[];
}

interface Memory {
  id: string;
  content: string;
  date: string;
  tags: string[];
}

const initialRooms: MemoryRoom[] = [
  {
    id: '1',
    name: 'Childhood Home',
    icon: '🏠',
    memories: [
      { id: '1', content: 'The smell of mom\'s cooking on Sunday mornings', date: '2026-03-01', tags: ['family', 'scent'] },
      { id: '2', content: 'Reading books under the blanket fort', date: '2026-02-15', tags: ['reading', 'comfort'] },
    ],
  },
  {
    id: '2',
    name: 'First Office',
    icon: '💻',
    memories: [
      { id: '3', content: 'The first successful deploy at 3 AM', date: '2026-01-20', tags: ['coding', 'milestone'] },
      { id: '4', content: 'Coffee machine that never worked properly', date: '2026-01-10', tags: ['office', 'humor'] },
    ],
  },
  {
    id: '3',
    name: 'Japan Trip',
    icon: '⛩️',
    memories: [
      { id: '5', content: 'First ramen in Tokyo - the broth was life-changing', date: '2025-12-15', tags: ['travel', 'food'] },
      { id: '6', content: 'Getting lost in Shibuya at midnight', date: '2025-12-14', tags: ['travel', 'adventure'] },
    ],
  },
  {
    id: '4',
    name: 'Gym Sanctuary',
    icon: '💪',
    memories: [
      { id: '7', content: 'First time deadlifting 100kg', date: '2025-11-20', tags: ['fitness', 'milestone'] },
      { id: '8', content: 'The 5 AM crew - silent nods of respect', date: '2025-11-15', tags: ['fitness', 'community'] },
    ],
  },
];

export default function MemoryPalace() {
  const [rooms, setRooms] = useState<MemoryRoom[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<MemoryRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.memory-palace-section');
  }, [revealRef]);

  const filteredRooms = rooms.map(room => ({
    ...room,
    memories: room.memories.filter(m => 
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(room => room.memories.length > 0 || searchQuery === '');

  const totalMemories = rooms.reduce((acc, room) => acc + room.memories.length, 0);

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom: MemoryRoom = {
      id: Date.now().toString(),
      name: newRoomName,
      icon: '🏛️',
      memories: [],
    };
    setRooms([...rooms, newRoom]);
    setNewRoomName('');
    setIsAddingRoom(false);
  };

  return (
    <section className="memory-palace-section" id="memory" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Mental Architecture
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Memory Palace
        </h2>
      </div>

      {/* Stats & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{rooms.length}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rooms</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{totalMemories}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Memories</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                width: '200px',
              }}
            />
          </div>
          <button
            onClick={() => setIsAddingRoom(true)}
            style={{
              padding: '0.75rem 1rem',
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
            Add Room
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{room.icon}</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {room.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <DoorOpen size={14} />
              {room.memories.length} memories
            </div>
          </div>
        ))}
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
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
          onClick={() => setSelectedRoom(null)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{selectedRoom.icon}</span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  {selectedRoom.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedRoom.memories.map((memory) => (
                <div
                  key={memory.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    padding: '1rem',
                  }}
                >
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                    {memory.content}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {memory.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.15rem 0.4rem',
                            background: 'rgba(244, 208, 63, 0.1)',
                            color: 'var(--accent-gold)',
                            borderRadius: '4px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{memory.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddingRoom && (
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
          onClick={() => setIsAddingRoom(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Create New Room
            </h3>
            <input
              type="text"
              placeholder="Room name..."
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addRoom}
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
                Create
              </button>
              <button
                onClick={() => setIsAddingRoom(false)}
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
