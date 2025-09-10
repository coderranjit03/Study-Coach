import React, { useEffect, useState } from 'react';
import PlanCard from '../components/PlanCard';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-hot-toast';
import GeneratePlan from '../components/GeneratePlan';
import BackButton from '../components/BackButton';

function PlanDashboard() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('study_plan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching plans: ' + error.message);
    } else {
      setPlans(data);
    }
    setLoading(false);
  };

  const handleDelete = async (planId) => {
    const { error } = await supabase
      .from('study_plan')
      .delete()
      .eq('id', planId);

    if (error) {
      toast.error('Error deleting plan: ' + error.message);
    } else {
      setPlans(plans.filter((p) => p.id !== planId));
      toast.success('Plan deleted successfully!');
    }
  };

  const filteredPlans = plans.filter((plan) =>
    (plan.title + plan.goal + plan.daily_plan)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Back to Landing Page Button */}
      {/* Animated Blobs/Shapes */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-120px',
        width: 320,
        height: 320,
        background: 'radial-gradient(circle at 60% 40%, #60a5fa88 0%, #a1c4fd00 80%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'floatBlob 8s ease-in-out infinite alternate',
      }} aria-hidden="true" />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: 260,
        height: 260,
        background: 'radial-gradient(circle at 40% 60%, #f472b6aa 0%, #c2e9fb00 80%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'floatBlob2 10s ease-in-out infinite alternate',
      }} aria-hidden="true" />

      {/* Sticky Glass Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.65)',
          borderBottom: '1.5px solid #e0e7ef',
          boxShadow: '0 2px 16px #60a5fa11',
          paddingTop: 16,
          paddingBottom: 18,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
        }}
        aria-label="Dashboard Header"
      >
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.85)',
            color: '#2563eb',
            border: '1.5px solid #e0e7ef',
            borderRadius: 16,
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px #60a5fa22',
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s',
            position: 'absolute',
            top: 16,
            left: 24,
            marginTop: 0,
            marginLeft: 0,
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#e0e7ef';
            e.currentTarget.style.color = '#1e40af';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
            e.currentTarget.style.color = '#2563eb';
          }}
        >
          <span style={{ fontSize: 20 }}>🏠</span> Back
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#2563eb',
              textShadow: '0 4px 24px #60a5fa55',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <span role="img" aria-label="books" style={{ fontSize: 54 }}>📚</span>
            Study Plans Dashboard
          </h1>
          <p style={{ color: '#374151', fontSize: 20, marginTop: 8, fontWeight: 500 }}>
            <span style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
              Your personal learning journey at a glance
            </span>
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, margin: '40px 0 32px 0', zIndex: 2, position: 'relative' }}>
        <div style={{ flex: 1, maxWidth: 400 }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* Plan Generation Form */}
      <section style={{ maxWidth: 600, margin: '0 auto 48px auto', zIndex: 2, position: 'relative', background: 'rgba(255,255,255,0.85)', borderRadius: 24, boxShadow: '0 4px 24px #60a5fa22', padding: 24, border: '1.5px solid #e0e7ef' }}>
        <GeneratePlan user={null} onPlanCreated={fetchPlans} />
      </section>

      {/* Plan List Card/Glassmorphism */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          background: 'rgba(255,255,255,0.80)',
          borderRadius: 32,
          boxShadow: '0 8px 32px #60a5fa33',
          padding: 48,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '2px solid #e0e7ef',
          marginBottom: 80,
        }}
        aria-label="Plan List"
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: '#2563eb', fontSize: 24, fontWeight: 600, padding: 48 }}>
            Loading your plans...
          </div>
        ) : filteredPlans.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 22, fontWeight: 500, padding: 48 }}>
            No plans found. Start your learning journey!
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', // Changed min width from 340px to 260px
              gap: 32, // Reduced gap for better fit
              width: '100%',
              overflowX: 'auto',
            }}
          >
            {filteredPlans.map((plan, idx) => (
              <div
                key={plan.id}
                style={{
                  animation: 'fadeInCard 0.7s cubic-bezier(.4,0,.2,1) both',
                  animationDelay: `${idx * 0.08}s`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: 24,
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                tabIndex={0}
                aria-label={`Study plan card: ${plan.title}`}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                  // e.currentTarget.style.boxShadow = '0 8px 32px #60a5fa44';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <PlanCard
                  plan={plan}
                  onDelete={() => handleDelete(plan.id)}
                  searchTerm={searchTerm}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => navigate('/generate')}
        style={{
          position: 'fixed',
          right: 36,
          bottom: 36,
          background: 'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 68,
          height: 68,
          fontSize: 38,
          boxShadow: '0 12px 36px #6366f188',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          animation: 'pulseFAB 2.2s infinite',
          transition: 'box-shadow 0.2s, transform 0.2s',
        }}
        title="Add New Plan"
        aria-label="Add New Plan"
        onMouseOver={e => {
          e.currentTarget.style.boxShadow = '0 20px 48px #6366f1cc';
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.boxShadow = '0 12px 36px #6366f188';
          e.currentTarget.style.transform = '';
        }}
      >
        <span role="img" aria-label="add">➕</span>
      </button>

      {/* Animations */}
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatBlob {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(40px) scale(1.08); }
        }
        @keyframes floatBlob2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.04); }
        }
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes pulseFAB {
          0%, 100% { box-shadow: 0 8px 32px #6366f155, 0 0 0 0 #6366f133; }
          50% { box-shadow: 0 8px 32px #6366f155, 0 0 0 16px #6366f111; }
        }
      `}</style>
    </>
  );
}

export default PlanDashboard;
