import React, { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

function parseMarkdownPlan(planText) {
  const lines = planText.replace(/\\n/g, '\n').split(/\r?\n/);
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    if (/^-{5,}$/.test(lines[i])) {
      const block = { type: 'dayblock', dayHeader: '', title: '', tasks: [] };
      i++;
      while (i < lines.length && lines[i].trim() === '') i++;
      if (i < lines.length && lines[i].startsWith('📆 Day')) {
        block.dayHeader = lines[i];
        i++;
      }
      while (i < lines.length && lines[i].trim() === '') i++;
      if (i < lines.length && /^\*\*.*\*\*$/.test(lines[i])) {
        block.title = lines[i].replace(/\*\*/g, '');
        i++;
      }
      while (i < lines.length && !/^-{5,}$/.test(lines[i])) {
        if (lines[i].trim() !== '') {
          block.tasks.push(lines[i]);
        }
        i++;
      }
      blocks.push(block);
    } else {
      i++;
    }
  }
  return blocks;
}

const ICON = '📚';
const CAL_ICON = '📅';

function getProgress(blocks, progress) {
  let total = 0;
  let completed = 0;
  blocks.forEach((block, dayIdx) => {
    block.tasks.forEach((task, tIdx) => {
      total++;
      const checked = progress[`${dayIdx}-${tIdx}`] || /\[x\]/i.test(task);
      if (checked) completed++;
    });
  });
  return { total, completed };
}

function PieChart({ completed, total }) {
  const size = 60;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const percent = total === 0 ? 0 : completed / total;
  const offset = circ * (1 - percent);
  return (
    <svg width={size} height={size} style={{ marginRight: 16 }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="#f5f5f5" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2563eb"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="18"
        fontWeight="bold"
        fill="#2563eb"
      >
        {total === 0 ? '0%' : `${Math.round((completed / total) * 100)}%`}
      </text>
    </svg>
  );
}

const PlanViewer = ({ planData, onProgressUpdate, saving }) => {
  const progress = planData.progress || {};
  const planText = typeof planData.plan === 'string' ? planData.plan : '';
  let blocks = [];
  let parseError = false;
  try {
    blocks = parseMarkdownPlan(planText);
    if (!blocks.length) parseError = true;
  } catch {
    parseError = true;
  }

  const [completedDaysToday, setCompletedDaysToday] = useState(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);
  const [permanentlyCompletedDays, setPermanentlyCompletedDays] = useState(new Set());

  const prevCompleteRef = useRef({}); // track previous completion state
  const initializedRef = useRef(false); // avoid retroactive toast on mount

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Initialize completed days when plan loads
  useEffect(() => {
    if (blocks.length > 0 && !hasInitialized) {
      const today = getTodayDate();
      let initialCompletedDays = new Set();
      let initialPermanentlyCompletedDays = new Set();

      const storedCompletedDays = localStorage.getItem(`completedDays_${today}`);
      if (storedCompletedDays) {
        try {
          initialCompletedDays = new Set(JSON.parse(storedCompletedDays));
        } catch {}
      }

      const storedPermanentlyCompletedDays = localStorage.getItem(`permanentlyCompletedDays_${planData.id}`);
      if (storedPermanentlyCompletedDays) {
        try {
          initialPermanentlyCompletedDays = new Set(JSON.parse(storedPermanentlyCompletedDays));
        } catch {}
      }

      // ✅ set prevCompleteRef so existing completed days don’t fire toast
      const prevMap = {};
      blocks.forEach((block, dayIdx) => {
        const allChecked = block.tasks.length > 0 && block.tasks.every((_, tIdx) =>
          progress[`${dayIdx}-${tIdx}`] || /\[x\]/i.test(block.tasks[tIdx])
        );
        prevMap[dayIdx] = allChecked;
        if (allChecked) {
          initialCompletedDays.add(`${dayIdx}_${today}`);
          initialPermanentlyCompletedDays.add(dayIdx.toString());
        }
      });
      prevCompleteRef.current = prevMap;

      setCompletedDaysToday(initialCompletedDays);
      setPermanentlyCompletedDays(initialPermanentlyCompletedDays);

      localStorage.setItem(`completedDays_${today}`, JSON.stringify([...initialCompletedDays]));
      localStorage.setItem(`permanentlyCompletedDays_${planData.id}`, JSON.stringify([...initialPermanentlyCompletedDays]));

      setHasInitialized(true);
      initializedRef.current = true;
    }
  }, [blocks, progress, hasInitialized, planData.id]);

  // Reset daily completion if date changes
  useEffect(() => {
    const checkDayChange = () => {
      const today = getTodayDate();
      const lastCheckedDate = localStorage.getItem('lastCheckedDate_PlanViewer');
      if (lastCheckedDate !== today) {
        setCompletedDaysToday(new Set());
        setHasInitialized(false);
        localStorage.setItem('lastCheckedDate_PlanViewer', today);
        if (lastCheckedDate) localStorage.removeItem(`completedDays_${lastCheckedDate}`);
      }
    };
    checkDayChange();
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, []);

  const markDayCompletedForToday = (dayIdx) => {
    const today = getTodayDate();
    const key = `${dayIdx}_${today}`;
    setCompletedDaysToday(prev => {
      const newSet = new Set(prev).add(key);
      localStorage.setItem(`completedDays_${today}`, JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const markDayPermanentlyCompleted = (dayIdx) => {
    setPermanentlyCompletedDays(prev => {
      const newSet = new Set(prev).add(dayIdx.toString());
      localStorage.setItem(`permanentlyCompletedDays_${planData.id}`, JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // ✅ Watch progress for new completions
  useEffect(() => {
    const today = getTodayDate();
    blocks.forEach((block, idx) => {
      const allChecked = block.tasks.length > 0 && block.tasks.every((_, tIdx) =>
        progress[`${idx}-${tIdx}`] || /\[x\]/i.test(block.tasks[tIdx])
      );

      if (allChecked && !prevCompleteRef.current[idx]) {
        // 🎉 Fire toast only the moment it becomes complete
        toast.success(`🎉 Congratulations! You completed ${block.dayHeader || `Day ${idx + 1}`}!`);

        if (!permanentlyCompletedDays.has(idx.toString())) {
          markDayPermanentlyCompleted(idx);
        }
        if (!completedDaysToday.has(`${idx}_${today}`)) {
          markDayCompletedForToday(idx);
        }
      }
      prevCompleteRef.current[idx] = allChecked;
    });
  }, [progress, planText, blocks, completedDaysToday, permanentlyCompletedDays]);

  const getExportText = () => planText;
  const downloadAsMarkdown = () => {
    const blob = new Blob([getExportText()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-plan.md';
    a.click();
    toast.success('Exported as Markdown');
  };
  const downloadAsPDF = () => {
    const element = document.createElement('div');
    element.style.whiteSpace = 'pre-wrap';
    element.style.fontFamily = 'inherit';
    element.style.fontSize = '16px';
    element.textContent = getExportText();
    document.body.appendChild(element);
    html2pdf().from(element).set({ margin: 0.5, filename: 'study-plan.pdf', html2canvas: { scale: 2 } }).save().then(() => {
      document.body.removeChild(element);
      toast.success('Exported as PDF');
    });
  };

  if (parseError) {
    return (
      <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 8px', fontFamily: 'inherit', color: '#222' }}>
        <pre style={{ color: 'red', fontWeight: 600 }}>Plan format not supported. Showing raw text:</pre>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 16 }}>{planText}</pre>
      </div>
    );
  }

  const { total, completed } = getProgress(blocks, progress);

  return (
    <div style={{
      maxWidth: 900,
      margin: '32px auto',
      padding: 24,
      fontFamily: 'inherit',
      color: '#222',
      background: '#fff',
      border: '1.5px solid #e5e7eb',
      borderRadius: 18,
      boxShadow: '0 2px 16px #0001',
    }}>
      {/* Progress Pie Chart */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <PieChart completed={completed} total={total} />
        <div style={{ fontWeight: 600, fontSize: 18, color: '#2563eb' }}>
          Progress: {completed} / {total} tasks
        </div>
      </div>
      {/* Start Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 8, fontSize: 16 }}>
        <span style={{ fontSize: 20 }}>{CAL_ICON}</span>
        <span>Start Date: {planData.start_date ? format(new Date(planData.start_date), 'EEE MMM d yyyy') : 'N/A'}</span>
      </div>
      {/* Export Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={downloadAsMarkdown} style={{ padding: '6px 18px', borderRadius: 6, background: '#f5f5f5', border: '1px solid #ccc', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>📝 Export Markdown</button>
        <button onClick={downloadAsPDF} style={{ padding: '6px 18px', borderRadius: 6, background: '#f5f5f5', border: '1px solid #ccc', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>📄 Export PDF</button>
      </div>
      {/* Plan Days */}
      <div style={{ fontSize: 17, lineHeight: 1.7 }}>
        {blocks.map((block, idx) => {
          const allChecked = block.tasks.length > 0 && block.tasks.every((_, tIdx) =>
            progress[`${idx}-${tIdx}`] || /\[x\]/i.test(block.tasks[tIdx])
          );
          return (
            <div key={idx}>
              <div style={{ fontFamily: 'monospace', color: '#888', margin: '24px 0 12px 0' }}>
                {'------------------------------------------------------------------------------------------'}
              </div>
              {block.dayHeader && (
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, marginBottom: 8 }}>
                  <span>{CAL_ICON}</span>
                  <span>{block.dayHeader.replace('📆 ', '')}</span>
                </div>
              )}
              {block.title && (
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, marginBottom: 10 }}>
                  <span>{ICON}</span>
                  <span>{block.title}</span>
                </div>
              )}
              <div style={{ marginBottom: 10 }}>
                {block.tasks.map((task, tIdx) => {
                  const checked = progress[`${idx}-${tIdx}`] || /\[x\]/i.test(task);
                  const label = task.trim();
                  const taskKey = `${idx}-${tIdx}`;
                  const handleChange = () => {
                    if (onProgressUpdate) onProgressUpdate(taskKey);
                  };
                  const style = checked ? { textDecoration: 'line-through', color: '#888' } : {};
                  return (
                    <div key={tIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8, marginBottom: 4 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                        style={{ width: 18, height: 18, marginRight: 6 }}
                        disabled={!!saving}
                      />
                      <span style={style}>{label}</span>
                    </div>
                  );
                })}
              </div>
              {allChecked && (
                <div style={{ background: '#d1fae5', color: '#065f46', fontWeight: 700, borderRadius: 8, padding: '10px 18px', margin: '10px 0 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>🎉</span> Day Complete!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanViewer;
