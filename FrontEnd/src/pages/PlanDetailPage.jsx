// pages/PlanDetailPage.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import PlanViewer from '../components/PlanViewer';
import { supabase } from '../utils/supabaseClient';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import BackButton from '../components/BackButton';
import { format } from 'date-fns';

export default function PlanDetailPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState(undefined); // undefined = loading, null = not found
  const [fetchError, setFetchError] = useState(null);
  const [adapting, setAdapting] = useState(false);
  const [adaptedPlan, setAdaptedPlan] = useState(null);
  const [showAdaptModal, setShowAdaptModal] = useState(false);
  const [justAdapted, setJustAdapted] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();





  useEffect(() => {
    async function fetchPlan() {
      try {
      const { data, error } = await supabase
        .from('study_plan')
        .select('*')
        .eq('id', id)
        .single();
        if (error) {
          setFetchError(error.message);
          setPlan(null);
          console.error('Fetch error:', error.message);
        } else if (!data) {
          setPlan(null);
        } else {
          setPlan(data);
        }
      } catch (err) {
        setFetchError(err.message);
        setPlan(null);
        console.error('Exception during fetch:', err);
      }
    }
    fetchPlan();
  }, [id]);



  // Handler to update progress in Supabase (Optimistic UI, state is lifted up)
  const handleProgressUpdate = async (taskKey) => {
    if (!plan) return;

    // 1. Calculate the new progress state based on the key of the clicked task
    const currentProgress = plan.progress || {};
    const wasCompleted = currentProgress[taskKey]; // Check if task was already completed
    const newProgress = {
      ...currentProgress,
      [taskKey]: !currentProgress[taskKey], // Toggle the value
    };

    // 2. Optimistically update the local state. This is the single source of truth.
    const previousPlan = plan;
    setPlan(currentPlan => ({ ...currentPlan, progress: newProgress }));
    setSaving(true);

    // Check if task was just completed (not uncompleted)
    const isJustCompleted = !wasCompleted && newProgress[taskKey];
    
    // Add logging here!
    console.log('Updating plan with id:', plan.id, 'Type:', typeof plan.id);
    // 3. Send the update to the backend
    const { error, data } = await supabase
      .from('study_plan')
      .update({ progress: newProgress })
      .eq('id', plan.id)
      .select();

    // 4. If there's an error, revert to the previous state
    console.log('Supabase update result:', { error, data, newProgress });

    if (error) {
      console.error('Failed to save progress:', error);
      toast.error('Failed to save progress. Your changes have been reverted.');
      setPlan(previousPlan);
    }

    setSaving(false);
  };

  // Handler to request adapted plan
  const handleAdaptPlan = async () => {
    console.log('Adapt button clicked!');
    // toast('Adapt button clicked! Check console for more info.');
    
    setAdapting(true);
    setShowAdaptModal(true);
    console.log('Modal should be visible now. showAdaptModal:', true);
    
    try {
      const response = await fetch('http://localhost:5000/adapt-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.plan,
          progress: plan.progress || {},
          feedback: plan.feedback || '',
          goal: plan.goal,
          days: plan.days,
          start_date: plan.start_date
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Adapted plan response:', data);
      
      setAdaptedPlan(data.adapted_plan);
      toast.success('Plan adapted successfully!');
    } catch (error) {
      console.error('Error adapting plan:', error);
      toast.error('Failed to adapt plan: ' + error.message);
    } finally {
      setAdapting(false);
    }
  };

  // Handler to accept adapted plan
  const handleAcceptAdapted = async () => {
    if (!adaptedPlan) return;
    await supabase
      .from('study_plan')
      .update({ plan: adaptedPlan })
      .eq('id', plan.id);
    setPlan((prev) => ({ ...prev, plan: adaptedPlan }));
    setShowAdaptModal(false);
    setAdaptedPlan(null);
    setJustAdapted(true);
    console.log('Calling toast!');
    toast.success('Your plan has been adapted and saved!');
  };

  // Handler to reject adapted plan
  const handleRejectAdapted = () => {
    setShowAdaptModal(false);
    setAdaptedPlan(null);
  };

  // Modal close on outside click or Escape
  const modalRef = useRef();
  useEffect(() => {
    if (!showAdaptModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowAdaptModal(false);
    };
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowAdaptModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdaptModal]);

  // Focus trap for modal
  useEffect(() => {
    if (!showAdaptModal) return;
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modalNode = modalRef.current;
    if (!modalNode) return;
    const focusableEls = modalNode.querySelectorAll(focusableSelectors);
    if (focusableEls.length === 0) return;
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    firstEl.focus();
    function trap(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
    modalNode.addEventListener('keydown', trap);
    return () => modalNode.removeEventListener('keydown', trap);
  }, [showAdaptModal]);

  const adaptBtnRef = useRef();
  const acceptBtnRef = useRef();

  // Restore focus to Adapt button when modal closes
  useEffect(() => {
    if (!showAdaptModal && adaptBtnRef.current) {
      adaptBtnRef.current.focus();
    }
  }, [showAdaptModal]);

  // Auto-focus Accept button when modal opens
  useEffect(() => {
    if (showAdaptModal && acceptBtnRef.current) {
      acceptBtnRef.current.focus();
    }
  }, [showAdaptModal]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (showAdaptModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAdaptModal]);

  if (plan === undefined) return <p className="text-center mt-10">Loading...</p>;
  if (fetchError) return <p className="text-center mt-10 text-red-500">Error: {fetchError}</p>;
  if (!plan) return <p className="text-center mt-10 text-red-500">Plan not found.</p>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', padding: 0, margin: 0, position: 'relative' }}>
      {/* Sticky Glass Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.65)',
        borderBottom: '1.5px solid #e0e7ef',
        boxShadow: '0 2px 16px #60a5fa11',
        padding: '18px 0 12px 0',
        display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'flex-start',
      }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.85)', color: '#2563eb',
          border: '1.5px solid #e0e7ef', borderRadius: 16,
          padding: '8px 18px', fontWeight: 600, fontSize: 16,
          boxShadow: '0 2px 8px #60a5fa22', cursor: 'pointer',
          transition: 'background 0.18s, color 0.18s', marginLeft: 24
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.color = '#1e40af'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.color = '#2563eb'; }}
        >
          <span style={{ fontSize: 20 }}>⬅️</span> Back
        </button>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#2563eb', letterSpacing: '-1px', textShadow: '0 2px 12px #60a5fa33', margin: 0 }}>
          {plan.title || 'Plan Details'}
        </h2>
      </header>

      {/* Plan Info Card */}
      <section style={{
        maxWidth: 700, margin: '32px auto 0 auto', background: 'rgba(255,255,255,0.92)',
        borderRadius: 24, boxShadow: '0 4px 24px #60a5fa22', padding: 32, display: 'flex', flexDirection: 'column', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <span style={{ fontWeight: 700, fontSize: 24 }}>{plan.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2563eb', fontWeight: 600, fontSize: 18 }}>
          <span style={{ fontSize: 22 }}>🧠</span> {plan.goal}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 15 }}>
          <span style={{ fontSize: 18 }}>📅</span> Created: {plan.start_date ? format(new Date(plan.start_date), 'dd MMM yyyy') : 'N/A'}
        </div>
        {plan.tags && <div style={{ color: '#f472b6', fontWeight: 600, fontSize: 15 }}>
          <span style={{ fontSize: 18 }}>🏷️</span> {plan.tags.split(',').map(tag => <span key={tag} style={{ marginRight: 8 }}>#{tag.trim()}</span>)}
        </div>}
      </section>

      {/* Adapted Banner */}
      {justAdapted && (
        <div style={{ background: '#bbf7d0', border: '1.5px solid #4ade80', color: '#166534', fontWeight: 700, borderRadius: 12, padding: '12px 24px', margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontSize: 18, boxShadow: '0 2px 12px #4ade8033' }}>
          ✅ This plan was just adapted by AI!
        </div>
      )}

      {/* Adapt Button */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 0 0' }}>
        <button
          ref={adaptBtnRef}
          onClick={handleAdaptPlan}
          style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
            color: '#fff', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 18,
            padding: '14px 38px', boxShadow: '0 4px 24px #6366f155', cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s',
            animation: 'pulseFAB 2.2s infinite',
            outline: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 12px 32px #6366f1cc';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 4px 24px #6366f155';
          }}
        >
          ♻️ Adapt My Plan
        </button>
      </div>

      {/* Plan Viewer Card */}
      <section style={{
        maxWidth: 900, margin: '36px auto', background: 'rgba(255,255,255,0.97)',
        borderRadius: 24, boxShadow: '0 8px 32px #60a5fa33', padding: 32
      }}>
      <PlanViewer planData={plan} onProgressUpdate={handleProgressUpdate} saving={saving} />
      </section>

      {/* Adapted Plan Modal */}
      {showAdaptModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 bg-black bg-opacity-40 animate-fadeIn"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999
          }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="adapted-plan-title"
          aria-describedby="adapted-plan-desc"
          tabIndex={-1}
        >
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col animate-modalPop relative"
            style={{
              background: 'rgba(255,255,255,0.98)',
              padding: '32px',
              borderRadius: '18px',
              boxShadow: '0 20px 40px 0 #60a5fa33',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              outline: 'none',
              position: 'relative',
            }}
          >
            {/* Close (X) button */}
            <button
              aria-label="Close modal"
              onClick={() => setShowAdaptModal(false)}
              style={{
                position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 32, color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'color 0.18s',
              }}
              onMouseOver={e => { e.currentTarget.style.color = '#1e40af'; }}
              onMouseOut={e => { e.currentTarget.style.color = '#64748b'; }}
              tabIndex={0}
            >
              ×
            </button>
            <h2 id="adapted-plan-title" style={{ fontSize: 26, fontWeight: 800, marginBottom: 18, color: '#2563eb', textAlign: 'center' }}>AI-Adapted Plan Preview</h2>
            <div id="adapted-plan-desc" style={{ flex: 1, overflowY: 'auto', borderRadius: 12, padding: 18, background: '#f1f5f9', marginBottom: 18 }}>
              {adapting ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '48px 0' }}>
                  <ClipLoader color="#2563eb" size={60} speedMultiplier={1.2} />
                  <p style={{ color: '#2563eb', fontSize: 20, fontWeight: 600, marginTop: 18 }}>Adapting your plan...</p>
                </div>
              ) : (
                <PlanViewer planData={{ plan: adaptedPlan }} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => {
                  setShowAdaptModal(false);
                  toast('Adaptation rejected.', { icon: '❌', style: { background: '#fee2e2', color: '#991b1b' } });
                }}
                style={{ padding: '10px 28px', background: '#e5e7eb', color: '#374151', borderRadius: 10, fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'background 0.18s, color 0.18s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#fca5a5'; e.currentTarget.style.color = '#991b1b'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                disabled={adapting}
              >
                Reject
              </button>
              <button
                ref={acceptBtnRef}
                onClick={() => {
                  handleAcceptAdapted();
                  toast('Adapted plan accepted!', { icon: '✅', style: { background: '#bbf7d0', color: '#166534' } });
                }}
                style={{ padding: '10px 28px', background: '#4ade80', color: '#166534', borderRadius: 10, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'background 0.18s, color 0.18s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#22d3ee'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#4ade80'; e.currentTarget.style.color = '#166534'; }}
                disabled={adapting}
              >
                Accept & Replace
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes pulseFAB {
          0%, 100% { box-shadow: 0 8px 32px #6366f155, 0 0 0 0 #6366f133; }
          50% { box-shadow: 0 8px 32px #6366f155, 0 0 0 16px #6366f111; }
        }
      `}</style>
    </div>
  );
}
