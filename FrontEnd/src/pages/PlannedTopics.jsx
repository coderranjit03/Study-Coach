import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function PlannedTopics() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_plan')
        .select('*')
        .order('created_at', { ascending: false });
      console.log('Supabase data:', data, 'Error:', error); // Debug log
      setPlans(data || []);
      setLoading(false);
    }
    fetchPlans();
  }, []);

  // Extract unique topics and languages from plans
  const uniqueTopics = Array.from(new Set(plans.map(plan => plan.goal || plan.topic || '')));
  const uniqueLanguages = Array.from(new Set(plans.map(plan => plan.language || '')));

  // --- Responsive grid with centered last row logic ---
  // Calculate number of columns based on min card width and container size
  const minCardWidth = 280;
  const maxGridWidth = 860; // matches container maxWidth
  const columns = Math.max(1, Math.floor(maxGridWidth / (minCardWidth + 28)));
  const fullRowsCount = Math.floor(plans.length / columns);
  const fullRows = [];
  for (let i = 0; i < fullRowsCount; i++) {
    fullRows.push(plans.slice(i * columns, (i + 1) * columns));
  }
  const lastRow = plans.slice(fullRowsCount * columns);

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .planned-topics-grid {
            grid-template-columns: 1fr !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
          .planned-topics-card {
            padding: 16px !important;
          }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflow: 'visible' }}>
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
          borderRadius: 24,
          boxShadow: '0 8px 32px #60a5fa33',
          border: '2px solid #a5b4fc',
          padding: '36px 8vw 40px 8vw', // responsive horizontal padding
          maxWidth: 860,
          width: '100%',
          margin: '0 auto 0 auto',
          textAlign: 'center',
          animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: '#2563eb', marginTop: 10, marginBottom: 10, textShadow: '0 2px 12px #60a5fa33', letterSpacing: '-1.5px' }}>
            📚 Your Planned Topics
          </h1>
          <p style={{ color: '#374151', fontSize: 22, marginBottom: 32, fontWeight: 600 }}>
            Here are the topics and languages you've already planned for.
          </p>
          {loading ? (
            <div style={{ color: '#2563eb', fontWeight: 600 }}>Loading your plans...</div>
          ) : plans.length === 0 ? (
            <div style={{ color: '#ef4444', fontWeight: 600 }}>No plans found. Start planning your learning journey!</div>
          ) : (
            <>
              {/* Render all full rows as grid */}
              {fullRows.map((row, idx) => (
                <div key={idx} className="planned-topics-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(280px, 1fr))`,
                  gap: 28,
                  width: '100%',
                  margin: '0 auto',
                  padding: '32px 8px 0 8px',
                  borderRadius: 18,
                  overflow: 'visible',
                  minHeight: 180,
                  boxSizing: 'border-box',
                  justifyContent: 'center',
                }}>
                  {row.map(plan => (
                    <div className="planned-topics-card" key={plan.id} style={{
                      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
                      borderRadius: 20,
                      boxShadow: '0 4px 24px #60a5fa22',
                      border: '1.5px solid #a5b4fc',
                      padding: 28,
                      minHeight: 120,
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      fontSize: 18,
                      fontWeight: 500,
                      marginBottom: 8,
                      cursor: 'pointer',
                      transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
                      outline: 'none',
                      boxSizing: 'border-box',
                      overflow: 'visible',
                    }}
                      onClick={() => navigate(`/plandetail/${plan.id}`)}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.045)';
                        e.currentTarget.style.boxShadow = '0 12px 32px #60a5fa55';
                        e.currentTarget.style.background = 'linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '0 4px 24px #60a5fa22';
                        e.currentTarget.style.background = 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)';
                      }}
                      tabIndex={0}
                      role="button"
                    >
                      <div style={{ fontWeight: 700, fontSize: 22, color: '#2563eb', marginBottom: 6 }}>
                        {plan.goal || plan.topic || 'Untitled Topic'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 16, marginBottom: 4 }}>
                        {plan.language ? `Language: ${plan.language}` : ''}
                      </div>
                      <div style={{ color: '#374151', fontSize: 16 }}>
                        {plan.title ? `Plan: ${plan.title}` : ''}
                      </div>
                      <div style={{ color: '#a1a1aa', fontSize: 14, marginTop: 8 }}>
                        Created: {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {/* Render last row as centered flex if not full */}
              {lastRow.length > 0 && (
                <div className="planned-topics-grid" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 28,
                  width: '100%',
                  margin: '0 auto',
                  padding: '32px 8px 0 8px',
                  borderRadius: 18,
                  overflow: 'visible',
                  minHeight: 180,
                  boxSizing: 'border-box',
                }}>
                  {lastRow.map(plan => (
                    <div className="planned-topics-card" key={plan.id} style={{
                      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
                      borderRadius: 20,
                      boxShadow: '0 4px 24px #60a5fa22',
                      border: '1.5px solid #a5b4fc',
                      padding: 28,
                      minHeight: 120,
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      fontSize: 18,
                      fontWeight: 500,
                      marginBottom: 8,
                      cursor: 'pointer',
                      transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
                      outline: 'none',
                      boxSizing: 'border-box',
                      overflow: 'visible',
                      width: 280, // match grid card width
                    }}
                      onClick={() => navigate(`/plandetail/${plan.id}`)}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.045)';
                        e.currentTarget.style.boxShadow = '0 12px 32px #60a5fa55';
                        e.currentTarget.style.background = 'linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '0 4px 24px #60a5fa22';
                        e.currentTarget.style.background = 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)';
                      }}
                      tabIndex={0}
                      role="button"
                    >
                      <div style={{ fontWeight: 700, fontSize: 22, color: '#2563eb', marginBottom: 6 }}>
                        {plan.goal || plan.topic || 'Untitled Topic'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 16, marginBottom: 4 }}>
                        {plan.language ? `Language: ${plan.language}` : ''}
                      </div>
                      <div style={{ color: '#374151', fontSize: 16 }}>
                        {plan.title ? `Plan: ${plan.title}` : ''}
                      </div>
                      <div style={{ color: '#a1a1aa', fontSize: 14, marginTop: 8 }}>
                        Created: {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
} 