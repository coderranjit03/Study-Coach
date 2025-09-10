import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const QUIZ_TOPICS = {
  Python: [
    { topic: 'Basics', icon: '🐍' },
    { topic: 'Data Types', icon: '🔢' },
    { topic: 'Loops', icon: '🔁' },
    { topic: 'Functions', icon: '🛠️' },
    { topic: 'OOP', icon: '🏛️' },
    { topic: 'Exception & Error Handling', icon: '⚠️' },
  ],
  Java: [
    { topic: 'Basics', icon: '☕' },
    { topic: 'Data Types', icon: '🔢' },
    { topic: 'Loops', icon: '🔁' },
    { topic: 'OOP', icon: '🏛️' },
    { topic: 'Exceptions', icon: '⚠️' },
  ],
};

export default function Quiz() {
  const navigate = useNavigate();
  const { language } = useParams();
  const topics = QUIZ_TOPICS[language] || [{ topic: 'General', icon: '❓' }];
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <h1 style={{ fontSize: 38, fontWeight: 900, color: '#2563eb', marginTop: 40, marginBottom: 10, textShadow: '0 2px 12px #60a5fa33', letterSpacing: '-1px' }}>❓ {language} Quiz Topics</h1>
      <p style={{ color: '#374151', fontSize: 20, marginBottom: 32, fontWeight: 500 }}>Select a topic to begin your quiz!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 18, maxWidth: 700, width: '100%', marginBottom: 36, background: 'rgba(255,255,255,0.7)', borderRadius: 24, boxShadow: '0 4px 24px #60a5fa22', padding: 24 }}>
        {topics.map(t => (
          <button key={t.topic} onClick={() => navigate(`/quiz/${language}/${t.topic}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.95)', color: '#2563eb', border: '1.5px solid #e0e7ef', borderRadius: 18, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #60a5fa11', cursor: 'pointer', padding: '18px 0', transition: 'all 0.18s' }}><span style={{ fontSize: 32 }}>{t.icon}</span>{t.topic}</button>
        ))}
      </div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 18, background: 'none', color: '#2563eb', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', textDecoration: 'underline' }}>← Back</button>
    </div>
  );
} 