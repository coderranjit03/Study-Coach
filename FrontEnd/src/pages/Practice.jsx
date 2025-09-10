import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { name: 'C', icon: '🔵' },
  { name: 'C++', icon: '💻' },
  { name: 'Java', icon: '☕' },
  { name: 'Python', icon: '🐍' },
  { name: 'JavaScript', icon: '🟨' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'C#', icon: '🎵' },
  { name: 'Go', icon: '🐹' },
  { name: 'Rust', icon: '🦀' },
  { name: 'Kotlin', icon: '🅺' },
  { name: 'Swift', icon: '🦅' },
  { name: 'Dart', icon: '🎯' },
  { name: 'Ruby', icon: '💎' },
  { name: 'Bash', icon: '🐚' },
  { name: 'PowerShell', icon: '⚡' },
  { name: 'Lua', icon: '🌙' },
  { name: 'R', icon: '📊' },
  { name: 'Julia', icon: '🔬' },
  { name: 'MATLAB', icon: '📈' },
  { name: 'SQL', icon: '🗄️' },
  { name: 'GraphQL', icon: '🔺' },
  { name: 'HTML', icon: '🌐' },
  { name: 'CSS', icon: '🎨' }
];

export default function Practice() {
  const [selectedLang, setSelectedLang] = useState('Python');
  const [gameType, setGameType] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [codeGame, setCodeGame] = useState(null);
  const [codeGameInput, setCodeGameInput] = useState('');
  const [codeGameResult, setCodeGameResult] = useState(null);
  const [codeGameLoading, setCodeGameLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('basic');
  const codeInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedTopic(null);
    setLoadingTopics(true);
    fetch(`/api/topics?language=${encodeURIComponent(selectedLang)}`)
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics || []);
        setLoadingTopics(false);
      })
      .catch(() => {
        setTopics([]);
        setLoadingTopics(false);
      });
  }, [selectedLang]);

  const handleStart = () => {
    if (gameType === 'quiz' && selectedTopic) {
      navigate(`/quiz/${selectedLang}/${encodeURIComponent(selectedTopic)}`);
    } else if (gameType === 'code') {
      // Navigate to the new code game page
      navigate(`/codegame/${encodeURIComponent(selectedLang)}/${encodeURIComponent(difficulty)}`);
    }
  };

  const handleCodeGameSubmit = () => {
    if (!codeGame) return;
    // For MVP: simple string match (case-insensitive, trimmed)
    if (codeGame.type === 'fill_blank' || codeGame.type === 'output' || codeGame.type === 'bug_fix') {
      if (codeGameInput.trim().toLowerCase() === codeGame.answer.trim().toLowerCase()) {
        setCodeGameResult('correct');
      } else {
        setCodeGameResult('incorrect');
      }
    } else if (codeGame.type === 'write_code') {
      // For MVP, just check if the answer is included in the user input
      if (codeGameInput.includes(codeGame.answer)) {
        setCodeGameResult('correct');
      } else {
        setCodeGameResult('incorrect');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 32,
          marginBottom: 16,
          background: 'linear-gradient(90deg, #f472b6 0%, #60a5fa 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 18,
          border: 'none',
          borderRadius: 999,
          padding: '10px 32px',
          boxShadow: '0 2px 12px #60a5fa33',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'transform 0.18s, box-shadow 0.18s',
          outline: 'none',
          display: 'inline-block',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.boxShadow = '0 6px 24px #f472b6cc';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 2px 12px #60a5fa33';
        }}
      >
        🏠 Return to Home
      </button>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 32,
        boxShadow: '0 8px 32px #60a5fa33',
        border: '2px solid #a5b4fc',
        padding: 36,
        maxWidth: 900,
        width: '95%',
        margin: '0 auto 32px auto',
        textAlign: 'center',
        animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)'
      }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 900,
          color: '#2563eb',
          marginTop: 10,
          marginBottom: 10,
          textShadow: '0 2px 12px #60a5fa33',
          letterSpacing: '-1.5px',
        }}>
          🎮 Practice Zone
        </h1>
        <p style={{ color: '#374151', fontSize: 22, marginBottom: 32, fontWeight: 600 }}>
          Select a language and game mode to sharpen your skills!
        </p>
        {/* Language Selection Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 18,
          maxWidth: 800,
          width: '100%',
          marginBottom: 36,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 24,
          boxShadow: '0 4px 24px #60a5fa22',
          padding: 24,
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.name}
              onClick={() => setSelectedLang(lang.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: selectedLang === lang.name ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : 'rgba(255,255,255,0.95)',
                color: selectedLang === lang.name ? '#fff' : '#2563eb',
                border: selectedLang === lang.name ? '2.5px solid #2563eb' : '1.5px solid #e0e7ef',
                borderRadius: 18,
                fontWeight: 700,
                fontSize: 20,
                boxShadow: selectedLang === lang.name ? '0 4px 16px #6366f144' : '0 2px 8px #60a5fa11',
                cursor: 'pointer',
                padding: '18px 0',
                transition: 'all 0.18s',
                outline: 'none',
                minHeight: 80,
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 8px 32px #6366f1cc';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = selectedLang === lang.name ? '0 4px 16px #6366f144' : '0 2px 8px #60a5fa11';
              }}
            >
              <span style={{ fontSize: 32 }}>{lang.icon}</span>
              {lang.name}
            </button>
          ))}
        </div>
        {/* Game Type Selection */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 40, justifyContent: 'center' }}>
          <button
            onClick={() => setGameType('quiz')}
            style={{
              background: gameType === 'quiz' ? 'linear-gradient(90deg, #60a5fa 0%, #f472b6 100%)' : 'rgba(255,255,255,0.95)',
              color: gameType === 'quiz' ? '#fff' : '#2563eb',
              border: gameType === 'quiz' ? '2.5px solid #2563eb' : '1.5px solid #e0e7ef',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 22,
              boxShadow: gameType === 'quiz' ? '0 4px 16px #60a5fa44' : '0 2px 8px #60a5fa11',
              cursor: 'pointer',
              padding: '18px 44px',
              transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: 10,
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 8px 32px #60a5fa44';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = gameType === 'quiz' ? '0 4px 16px #60a5fa44' : '0 2px 8px #60a5fa11';
            }}
          >
            <span style={{ fontSize: 26 }}>❓</span> Quiz Game
          </button>
          <button
            onClick={() => setGameType('code')}
            style={{
              background: gameType === 'code' ? 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)' : 'rgba(255,255,255,0.95)',
              color: gameType === 'code' ? '#fff' : '#2563eb',
              border: gameType === 'code' ? '2.5px solid #2563eb' : '1.5px solid #e0e7ef',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 22,
              boxShadow: gameType === 'code' ? '0 4px 16px #6366f144' : '0 2px 8px #60a5fa11',
              cursor: 'pointer',
              padding: '18px 44px',
              transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: 10,
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 8px 32px #6366f1cc';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = gameType === 'code' ? '0 4px 16px #6366f144' : '0 2px 8px #60a5fa11';
            }}
          >
            <span style={{ fontSize: 26 }}>💻</span> Code Game
          </button>
        </div>
        {/* Difficulty Selection for Code Game */}
        {gameType === 'code' && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 700, color: '#2563eb', fontSize: 20, marginRight: 10 }}>Difficulty:</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ fontSize: 18, borderRadius: 8, border: '1.5px solid #e0e7ef', padding: '6px 18px', outline: 'none', color: '#2563eb', fontWeight: 600 }}>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        )}
        {/* Topic Selection Grid - only show for quiz game */}
        {gameType === 'quiz' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            maxWidth: 900,
            width: '100%',
            marginBottom: 36,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 24,
            boxShadow: '0 4px 24px #60a5fa22',
            padding: 24,
            minHeight: 80,
          }}>
            {loadingTopics ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>
                Loading topics...
              </div>
            ) : topics.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
                No topics found for this language.
              </div>
            ) : (
              topics.map(t => (
                <button
                  key={t.topic}
                  onClick={() => setSelectedTopic(t.topic)}
                  style={{
                    background: selectedTopic === t.topic ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : 'rgba(255,255,255,0.95)',
                    color: selectedTopic === t.topic ? '#fff' : '#2563eb',
                    border: selectedTopic === t.topic ? '2.5px solid #2563eb' : '1.5px solid #e0e7ef',
                    borderRadius: 18,
                    fontWeight: 600,
                    fontSize: 16,
                    boxShadow: selectedTopic === t.topic ? '0 4px 16px #6366f144' : '0 2px 8px #60a5fa11',
                    cursor: 'pointer',
                    padding: '14px 10px',
                    transition: 'all 0.18s',
                    textAlign: 'center',
                    minHeight: 48,
                  }}
                >
                  {t.topic}
                </button>
              ))
            )}
          </div>
        )}
        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={gameType === 'quiz' ? !selectedTopic : !gameType}
          style={{
            background: gameType && (gameType === 'quiz' ? selectedTopic : true) ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : '#e0e7ef',
            color: gameType && (gameType === 'quiz' ? selectedTopic : true) ? '#fff' : '#64748b',
            fontWeight: 700,
            fontSize: 22,
            border: 'none',
            borderRadius: 999,
            padding: '14px 44px',
            boxShadow: '0 4px 24px #60a5fa33',
            cursor: gameType && (gameType === 'quiz' ? selectedTopic : true) ? 'pointer' : 'not-allowed',
            marginBottom: 40,
            transition: 'transform 0.18s',
            outline: 'none',
            display: 'inline-block',
          }}
          onMouseOver={e => {
            if (gameType && (gameType === 'quiz' ? selectedTopic : true)) {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 8px 32px #6366f1cc';
            }
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 4px 24px #60a5fa33';
          }}
        >
          Start
        </button>
      </div>
      {/* Code Game UI */}
    </div>
  );
} 