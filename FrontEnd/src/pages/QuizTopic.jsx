import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';

// 1. Assign unique id to each question at definition time
function addIdsToQuestions(questions, topic) {
  return questions.map((q, i) => ({ ...q, id: topic + '_' + i }));
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ProgressBar({ value, max }) {
  return (
    <div style={{ width: '100%', background: '#e0e7ef', borderRadius: 8, height: 12, marginBottom: 18 }}>
      <div style={{ width: `${(value / max) * 100}%`, background: 'linear-gradient(90deg, #60a5fa 0%, #f472b6 100%)', height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
    </div>
  );
}

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

function EnhancedResultCard({ score, total, passed, onPlayAgain, onReview }) {
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
        {passed ? '🎉 Congratulations!' : 'Quiz Complete!'}
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
      <button onClick={onReview} style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #f472b6 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 999, padding: '12px 36px', boxShadow: '0 4px 24px #60a5fa33', cursor: 'pointer', marginBottom: 18, marginRight: 8, transition: 'transform 0.18s' }}>
        Review Answers
      </button>
      <button onClick={onPlayAgain} style={{ background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 999, padding: '12px 36px', boxShadow: '0 4px 24px #60a5fa33', cursor: 'pointer', marginBottom: 18, transition: 'transform 0.18s' }}>
        Play Again
      </button>
    </div>
  );
}

function QuizGame({ language, topic, count, timerEnabled }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(count * 30);
  const [celebrated, setCelebrated] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/quiz-questions?language=${encodeURIComponent(language)}&topic=${encodeURIComponent(topic)}`)
      .then(res => res.json())
      .then(data => {
        // Shuffle and slice to the desired count
        const selectedQuestions = shuffleArray(data).slice(0, Math.min(count, data.length));
        setQuestions(selectedQuestions);
        setLoading(false);
        setIdx(0);
        setSelected(null);
        setScore(0);
        setShowResult(false);
        setReviewMode(false);
        setUserAnswers([]);
        setTimeLeft(count * 30);
        setCelebrated(false);
      });
  }, [language, topic, count]);

  useEffect(() => {
    if (showResult && finalScore !== null && !celebrated) {
      const threshold = Math.floor((questions.length * 3) / 4);
      if (finalScore >= threshold) {
        toast.success(`🎉 Amazing! You scored ${finalScore} out of ${questions.length}!`);
        setCelebrated(true);
      }
    }
  }, [showResult, finalScore, celebrated, questions.length]);

  if (loading) return <div>Loading questions...</div>;
  if (!questions.length) return <div>No questions found for this topic.</div>;

  const current = questions[idx];
  // Ensure options is always an array
  let options = current.options;
  if (!Array.isArray(options)) {
    try {
      options = JSON.parse(options);
    } catch {
      options = [];
    }
  }
  const handleNext = () => {
    const isCorrect = selected === current.answer;
    const newScore = isCorrect ? score + 1 : score;
    setUserAnswers([...userAnswers, { ...current, selected }]);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
      if (isCorrect) setScore(s => s + 1);
    } else {
      setFinalScore(newScore);
      setShowResult(true);
      setScore(newScore); // update score for result
    }
  };
  const handleRestart = () => {
    setIdx(0); setSelected(null); setScore(0); setShowResult(false); setReviewMode(false); setUserAnswers([]); setTimeLeft(count * 30); setCelebrated(false);
    // re-shuffle questions
    const shuffled = shuffleArray(questions).slice(0, Math.min(count, questions.length)).map(q => ({ ...q, options: shuffleArray(q.options) }));
    setQuestions(shuffled);
  };
  if (reviewMode) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, boxShadow: '0 8px 32px #60a5fa33', padding: 36, maxWidth: 600, width: '100%', textAlign: 'center', fontSize: 20, color: '#2563eb', fontWeight: 700, marginBottom: 60, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 18 }}>{language} - {topic} Quiz Review</div>
        {userAnswers.map((ua, i) => (
          <div key={i} style={{ marginBottom: 18, width: '100%', textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: '#374151' }}>Q{i + 1}: {ua.question}</div>
            <div style={{ marginLeft: 12, marginTop: 4 }}>
              <span style={{ color: ua.selected === ua.answer ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                Your answer: {ua.selected || <span style={{ color: '#64748b' }}>No answer</span>}
              </span>
              <br />
              <span style={{ color: '#2563eb', fontWeight: 700 }}>Correct: {ua.answer}</span>
              <br />
              <span style={{ color: '#f472b6', fontWeight: 500 }}>Explanation: {ua.explanation}</span>
            </div>
          </div>
        ))}
        <button onClick={handleRestart} style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #f472b6 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 999, padding: '12px 36px', boxShadow: '0 4px 24px #60a5fa33', cursor: 'pointer', marginTop: 8 }}>Restart</button>
      </div>
    );
  }
  return (
    <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, boxShadow: '0 8px 32px #60a5fa33', padding: 36, maxWidth: 600, width: '100%', textAlign: 'center', fontSize: 20, color: '#2563eb', fontWeight: 700, marginBottom: 60, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 18 }}>{language} - {topic} Quiz</div>
      <ProgressBar value={idx} max={questions.length} />
      {timerEnabled && <div style={{ marginBottom: 10, color: timeLeft < 10 ? '#ef4444' : '#2563eb', fontWeight: 700 }}>⏰ {timeLeft}s left</div>}
      <div style={{ fontSize: 19, marginBottom: 18, color: '#374151', fontWeight: 600 }}>
        Q{idx + 1} of {questions.length}: {current.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 400, margin: '0 auto 18px auto' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(opt)} disabled={selected !== null} style={{ background: selected === opt ? (opt === current.answer ? 'linear-gradient(90deg, #4ade80 0%, #60a5fa 100%)' : 'linear-gradient(90deg, #fca5a5 0%, #f472b6 100%)') : 'rgba(255,255,255,0.95)', color: selected === opt ? '#fff' : '#2563eb', border: selected === opt ? '2.5px solid #2563eb' : '1.5px solid #e0e7ef', borderRadius: 16, fontWeight: 700, fontSize: 17, boxShadow: selected === opt ? '0 4px 16px #60a5fa44' : '0 2px 8px #60a5fa11', cursor: selected === null ? 'pointer' : 'not-allowed', padding: '12px 0', transition: 'all 0.18s', outline: 'none' }}>{opt}</button>
        ))}
      </div>
      {selected !== null && (
        <div style={{ color: selected === current.answer ? '#22c55e' : '#ef4444', fontWeight: 700, marginBottom: 10 }}>
          {selected === current.answer ? 'Correct!' : 'Incorrect.'}
          <br />
          <span style={{ color: '#f472b6', fontWeight: 500 }}>Explanation: {current.explanation}</span>
        </div>
      )}
      <button onClick={handleNext} disabled={selected === null} style={{ background: selected === null ? '#e0e7ef' : 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: selected === null ? '#64748b' : '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 999, padding: '12px 36px', boxShadow: '0 4px 24px #60a5fa33', cursor: selected === null ? 'not-allowed' : 'pointer', marginTop: 10, transition: 'all 0.18s' }}>{idx + 1 === questions.length ? 'Finish' : 'Next'}</button>
      {showResult && (
        <EnhancedResultCard
          score={finalScore ?? score}
          total={questions.length}
          passed={(finalScore ?? score) >= Math.floor((questions.length * 3) / 4)}
          onPlayAgain={handleRestart}
          onReview={() => setReviewMode(true)}
        />
      )}
    </div>
  );
}

export default function QuizTopic() {
  const { language, topic } = useParams();
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const [timerEnabled, setTimerEnabled] = useState(false);

  // Debug log
  console.log('QuizTopic params:', { language, topic });

  if (!language || !topic) {
    return (
      <div style={{ padding: 36, color: '#ef4444', fontWeight: 700 }}>
        Invalid quiz URL. Language or topic missing.<br />
        language: {String(language)}<br />
        topic: {String(topic)}
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <h1 style={{ fontSize: 38, fontWeight: 900, color: '#2563eb', marginTop: 40, marginBottom: 10, textShadow: '0 2px 12px #60a5fa33', letterSpacing: '-1px' }}>❓ {language} - {topic} Quiz</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <label style={{ fontWeight: 700, color: '#2563eb', fontSize: 17 }}>Questions:</label>
        <select value={count} onChange={e => setCount(Number(e.target.value))} style={{ fontSize: 16, borderRadius: 8, border: '1.5px solid #e0e7ef', padding: '6px 18px', outline: 'none', color: '#2563eb', fontWeight: 600 }}>
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <label style={{ fontWeight: 700, color: '#2563eb', fontSize: 17 }}>Timer:</label>
        <input type="checkbox" checked={timerEnabled} onChange={e => setTimerEnabled(e.target.checked)} style={{ width: 20, height: 20, accentColor: '#60a5fa' }} />
        <span style={{ color: '#64748b', fontWeight: 500, fontSize: 15 }}>Enable 30s/question</span>
      </div>
      <QuizGame language={language} topic={topic} count={count} timerEnabled={timerEnabled} />
      <button
        onClick={() => navigate(-1)}
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
    </div>
  );
} 