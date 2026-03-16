import { useState } from 'react';
import { Database, Table, Key, Link2, Plus, Trash2, Edit3, Eye } from 'lucide-react';
import styles from './DatabaseSchema.module.css';

interface Column {
  name: string;
  type: string;
  isPrimary: boolean;
  isForeign: boolean;
  isNullable: boolean;
  references?: string;
}

interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rowCount: number;
}

const initialTables: TableData[] = [
  {
    id: '1',
    name: 'users',
    rowCount: 1247,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, isForeign: false, isNullable: false },
      { name: 'email', type: 'varchar(255)', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'username', type: 'varchar(50)', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'created_at', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'last_login', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: true },
    ],
  },
  {
    id: '2',
    name: 'projects',
    rowCount: 89,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, isForeign: false, isNullable: false },
      { name: 'user_id', type: 'uuid', isPrimary: false, isForeign: true, isNullable: false, references: 'users.id' },
      { name: 'name', type: 'varchar(100)', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'description', type: 'text', isPrimary: false, isForeign: false, isNullable: true },
      { name: 'status', type: 'enum', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'created_at', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: false },
    ],
  },
  {
    id: '3',
    name: 'tasks',
    rowCount: 3421,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, isForeign: false, isNullable: false },
      { name: 'project_id', type: 'uuid', isPrimary: false, isForeign: true, isNullable: false, references: 'projects.id' },
      { name: 'title', type: 'varchar(200)', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'priority', type: 'int', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'completed', type: 'boolean', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'due_date', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: true },
    ],
  },
  {
    id: '4',
    name: 'habits',
    rowCount: 156,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, isForeign: false, isNullable: false },
      { name: 'user_id', type: 'uuid', isPrimary: false, isForeign: true, isNullable: false, references: 'users.id' },
      { name: 'name', type: 'varchar(100)', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'streak', type: 'int', isPrimary: false, isForeign: false, isNullable: false },
      { name: 'color', type: 'varchar(7)', isPrimary: false, isForeign: false, isNullable: false },
    ],
  },
];

const typeColors: Record<string, string> = {
  uuid: '#a78bfa',
  varchar: '#60a5fa',
  text: '#60a5fa',
  timestamp: '#fbbf24',
  int: '#34d399',
  boolean: '#f472b6',
  enum: '#fbbf24',
};

export default function DatabaseSchema() {
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const totalRows = tables.reduce((acc, t) => acc + t.rowCount, 0);
  const totalColumns = tables.reduce((acc, t) => acc + t.columns.length, 0);
  const relationships = tables.reduce((acc, t) => acc + t.columns.filter(c => c.isForeign).length, 0);

  return (
    <section className={styles.schema} id="database-schema">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Database size={28} />
        </div>
        <h2 className={styles.title}>Database Schema</h2>
        <p className={styles.subtitle}>Visual data model</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <Table size={16} />
          <span className={styles.statValue}>{tables.length}</span>
          <span className={styles.statLabel}>Tables</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalColumns}</span>
          <span className={styles.statLabel}>Columns</span>
        </div>
        <div className={styles.stat}>
          <Link2 size={16} />
          <span className={styles.statValue}>{relationships}</span>
          <span className={styles.statLabel}>Relations</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalRows.toLocaleString()}</span>
          <span className={styles.statLabel}>Rows</span>
        </div>
      </div>

      <div className={styles.viewToggle}>
        <button 
          className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </button>
        <button 
          className={`${styles.viewBtn} ${viewMode === 'detail' ? styles.active : ''}`}
          onClick={() => setViewMode('detail')}
        >
          Detail View
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className={styles.tableGrid}>
          {tables.map(table => (
            <div 
              key={table.id} 
              className={styles.tableCard}
              onClick={() => { setSelectedTable(table); setViewMode('detail'); }}
            >
              <div className={styles.tableHeader}>
                <Table size={18} />
                <span className={styles.tableName}>{table.name}</span>
                <span className={styles.rowCount}>{table.rowCount.toLocaleString()} rows</span>
              </div>
              <div className={styles.columnPreview}>
                {table.columns.slice(0, 4).map(col => (
                  <div key={col.name} className={styles.columnTag}>
                    {col.isPrimary && <Key size={10} className={styles.keyIcon} />}
                    {col.isForeign && <Link2 size={10} className={styles.linkIcon} />}
                    <span>{col.name}</span>
                    <span className={styles.colType}>{col.type}</span>
                  </div>
                ))}
                {table.columns.length > 4 && (
                  <div className={styles.moreCols}>+{table.columns.length - 4} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.detailView}>
          {selectedTable ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h3>{selectedTable.name}</h3>
                <span className={styles.detailRowCount}>{selectedTable.rowCount.toLocaleString()} rows</span>
              </div>
              <table className={styles.columnsTable}>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Constraints</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTable.columns.map(col => (
                    <tr key={col.name}>
                      <td className={styles.colName}>
                        {col.isPrimary && <Key size={14} className={styles.pkIcon} />}
                        {col.isForeign && <Link2 size={14} className={styles.fkIcon} />}
                        {col.name}
                      </td>
                      <td>
                        <span 
                          className={styles.typeBadge}
                          style={{ background: typeColors[col.type.split('(')[0]] || '#9ca3af' }}
                        >
                          {col.type}
                        </span>
                      </td>
                      <td className={styles.constraints}>
                        {!col.isNullable && <span className={styles.notNull}>NOT NULL</span>}
                        {col.references && (
                          <span className={styles.reference}>→ {col.references}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles.backBtn} onClick={() => setViewMode('grid')}>
                ← Back to tables
              </button>
            </div>
          ) : (
            <div className={styles.selectPrompt}>
              <p>Select a table from grid view to see details</p>
              <button className={styles.backBtn} onClick={() => setViewMode('grid')}>
                View Tables
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
