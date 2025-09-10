import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';

function ResultPieChart({ score, total }) {
  const percent = total > 0 ? (score / total) * 100 : 0;
  const radius = 40;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} style={{ marginBottom: 12 }}>
      <circle
        stroke="#e5e7eb"
        fill="white"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#60a5fa"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="22" fontWeight="bold" fill="#2563eb">
        {score}/{total}
      </text>
    </svg>
  );
}

function EnhancedResultCard({ score, total, passed, onPlayAgain }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      borderRadius: 32,
      boxShadow: '0 8px 32px #60a5fa33',
      border: '2px solid #a5b4fc',
      padding: 48,
      maxWidth: 420,
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)'
    }}>
      {passed && <Confetti width={400} height={300} numberOfPieces={120} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} />}
      <div style={{ fontSize: 38, fontWeight: 900, color: passed ? '#22c55e' : '#2563eb', marginBottom: 12 }}>
        {passed ? '🎉 Congratulations!' : 'Game Complete!'}
      </div>
      <ResultPieChart score={score} total={total} />
      <div style={{
        fontSize: 28,
        fontWeight: 800,
        color: passed ? '#22c55e' : '#2563eb',
        marginBottom: 18,
        transition: 'color 0.3s'
      }}>
        {score} / {total}
      </div>
      <div style={{
        fontSize: 20,
        color: '#64748b',
        marginBottom: 24
      }}>
        {passed
          ? 'You did amazing! Keep up the great work!'
          : 'Keep practicing and you’ll get there!'}
      </div>
      <button onClick={onPlayAgain} style={{ background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 999, padding: '12px 36px', boxShadow: '0 4px 24px #60a5fa33', cursor: 'pointer', marginBottom: 18, transition: 'transform 0.18s' }}>
        Play Again
      </button>
    </div>
  );
}

export default function CodeGamePage() {
  const { language, difficulty } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [codeGameInput, setCodeGameInput] = useState('');
  const [codeGameResult, setCodeGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const codeInputRef = useRef();
  const navigate = useNavigate();
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    setLoading(true);
    setChallenges([]);
    setCurrentIdx(0);
    setCodeGameInput('');
    setCodeGameResult(null);
    setScore(0);
    setFinalScore(null);
    setCelebrated(false);
    fetch(`/api/code-games?language=${encodeURIComponent(language)}&difficulty=${encodeURIComponent(difficulty)}`)
      .then(res => res.json())
      .then(data => {
        setChallenges(Array.isArray(data) ? data : []);
        setCurrentIdx(0);
        setCodeGameInput('');
        setCodeGameResult(null);
        setScore(0);
        setFinalScore(null);
        setCelebrated(false);
        setLoading(false);
      })
      .catch(() => {
        setChallenges([]);
        setCurrentIdx(0);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [language, difficulty]);

  useEffect(() => {
    if (currentIdx >= challenges.length && finalScore !== null && !celebrated) {
      const threshold = Math.floor((challenges.length * 3) / 4);
      if (finalScore >= threshold) {
        toast.success(`🎉 Amazing! You scored ${finalScore} out of ${challenges.length}!`);
        setCelebrated(true);
      }
    }
  }, [currentIdx, challenges.length, finalScore, celebrated]);

  const handleCodeGameSubmit = () => {
    const codeGame = challenges[currentIdx];
    if (!codeGame) return;
    let correct = false;
    if (codeGame.type === 'fill_blank' || codeGame.type === 'output' || codeGame.type === 'bug_fix') {
      if (codeGameInput.trim().toLowerCase() === codeGame.answer.trim().toLowerCase()) {
        setCodeGameResult('correct');
        correct = true;
      } else {
        setCodeGameResult('incorrect');
      }
    } else if (codeGame.type === 'write_code') {
      if (codeGameInput.includes(codeGame.answer)) {
        setCodeGameResult('correct');
        correct = true;
      } else {
        setCodeGameResult('incorrect');
      }
    }
    // Automatically trigger result if this is the last question
    if (currentIdx === challenges.length - 1) {
      const newScore = correct ? score + 1 : score;
      setFinalScore(newScore);
      setScore(newScore);
      setCurrentIdx(idx => idx + 1); // move past last
      setTimeout(() => {
        setCodeGameInput('');
        setCodeGameResult(null);
      }, 500); // small delay for feedback
    }
  };

  const handleNext = () => {
    const codeGame = challenges[currentIdx];
    let isCorrect = false;
    if (codeGame) {
      if (codeGame.type === 'fill_blank' || codeGame.type === 'output' || codeGame.type === 'bug_fix') {
        isCorrect = codeGameInput.trim().toLowerCase() === codeGame.answer.trim().toLowerCase();
      } else if (codeGame.type === 'write_code') {
        isCorrect = codeGameInput.includes(codeGame.answer);
      }
    }
    const newScore = isCorrect ? score + 1 : score;
    if (currentIdx + 1 < challenges.length) {
      setCurrentIdx(idx => idx + 1);
      setCodeGameInput('');
      setCodeGameResult(null);
      if (isCorrect) setScore(s => s + 1);
    } else {
      setFinalScore(newScore);
      setScore(newScore);
      setCurrentIdx(idx => idx + 1); // move past last
      setCodeGameInput('');
      setCodeGameResult(null);
    }
  };

  const codeGame = challenges[currentIdx];
  const isComplete = currentIdx >= challenges.length;
  const passed = (finalScore ?? score) >= Math.floor((challenges.length * 3) / 4);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <h1 style={{ fontSize: 38, fontWeight: 900, color: '#2563eb', marginTop: 40, marginBottom: 10, textShadow: '0 2px 12px #60a5fa33', letterSpacing: '-1px' }}>
        💻 Code Game ({language} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
      </h1>
      <button onClick={() => navigate(-1)}
        style={{
          marginBottom: 24,
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
        ← Back
      </button>
      {loading && <div style={{ color: '#2563eb', fontWeight: 600 }}>Loading code games...</div>}
      {!loading && isComplete && (
        <EnhancedResultCard
          score={finalScore ?? score}
          total={challenges.length}
          passed={passed}
          onPlayAgain={() => window.location.reload()}
        />
      )}
      {!loading && !isComplete && codeGame && (
        <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, boxShadow: '0 8px 32px #60a5fa33', padding: 36, maxWidth: 700, width: '100%', textAlign: 'center', fontSize: 20, color: '#2563eb', fontWeight: 700, marginBottom: 60, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 18 }}>Challenge {currentIdx + 1} of {challenges.length}</div>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 18 }}>{codeGame.prompt}</div>
          <pre style={{ background: '#f3f4f6', color: '#222', borderRadius: 12, padding: 18, fontSize: 17, marginBottom: 18, textAlign: 'left', width: '100%', maxWidth: 600, overflowX: 'auto' }}>{codeGame.code_snippet}</pre>
          {(codeGame.type === 'fill_blank' || codeGame.type === 'output' || codeGame.type === 'bug_fix') && (
            <input
              ref={codeInputRef}
              value={codeGameInput}
              onChange={e => setCodeGameInput(e.target.value)}
              placeholder={codeGame.type === 'fill_blank' ? 'Fill in the blank...' : codeGame.type === 'output' ? 'Enter output...' : 'Fix the bug...'}
              style={{ fontSize: 18, padding: '10px 18px', borderRadius: 8, border: '1.5px solid #e0e7ef', marginBottom: 18, width: '100%', maxWidth: 400 }}
            />
          )}
          {codeGame.type === 'write_code' && (
            <textarea
              ref={codeInputRef}
              value={codeGameInput}
              onChange={e => setCodeGameInput(e.target.value)}
              placeholder={'Write your code here...'}
              rows={6}
              style={{ fontSize: 17, padding: '10px 18px', borderRadius: 8, border: '1.5px solid #e0e7ef', marginBottom: 18, width: '100%', maxWidth: 600, fontFamily: 'monospace' }}
            />
          )}
          <button onClick={handleCodeGameSubmit} style={{ background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 999, padding: '12px 36px', boxShadow: '0 4px 24px #60a5fa33', cursor: 'pointer', marginBottom: 18 }}>Check</button>
          {codeGameResult && (
            <div style={{ color: codeGameResult === 'correct' ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
              {codeGameResult === 'correct' ? '✅ Correct!' : '❌ Incorrect.'}
              <div style={{ color: '#2563eb', fontWeight: 500, marginTop: 8 }}>{codeGame.explanation}</div>
            </div>
          )}
          {currentIdx < challenges.length - 1 && (
            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                borderRadius: 999,
                padding: '10px 32px',
                boxShadow: '0 2px 12px #60a5fa33',
                cursor: 'pointer',
                textDecoration: 'none',
                marginTop: 8,
                transition: 'transform 0.18s, box-shadow 0.18s',
                outline: 'none',
                display: 'inline-block',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 6px 24px #6366f1cc';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 2px 12px #60a5fa33';
              }}
            >
              Next Challenge
            </button>
          )}
        </div>
      )}
    </div>
  );
} 