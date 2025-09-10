import React, { useState } from "react";
import { supabase } from '../utils/supabaseClient';
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import PlanViewer from './PlanViewer';

const GeneratePlan = ({ user, onPlanCreated }) => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(7);
  const [markdown, setMarkdown] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [planId, setPlanId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!goal || !duration) {
      toast.error("Please enter a goal and duration");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate-plan", {
        goal,
        duration,
        startDate: format(startDate, "yyyy-MM-dd"),
      });
      const aiPlan = response.data.plan;
      setMarkdown(aiPlan);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("You must be logged in to save a plan.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("study_plan")
        .insert([
          {
            title,
            goal,
            days: duration,
            start_date: format(startDate, "yyyy-MM-dd"),
            plan: aiPlan,
            created_at: new Date().toISOString(),
            progress: {},
            user_id: user.id,
          },
        ])
        .select();
      if (error) {
        console.error('Supabase insert error:', error);
        toast.error("Failed to save plan: " + error.message);
        return;
      }
      toast.success("Plan generated and saved!");
      setPlanId(data[0].id);
      if (onPlanCreated) onPlanCreated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 520,
      margin: '40px auto',
      background: 'rgba(255,255,255,0.85)',
      borderRadius: 32,
      boxShadow: '0 8px 32px #60a5fa33',
      border: '2.5px solid',
      borderImage: 'linear-gradient(90deg, #60a5fa 0%, #f472b6 100%) 1',
      padding: 36,
      position: 'relative',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 900,
          color: '#2563eb',
          letterSpacing: '-1px',
          marginBottom: 4,
          textShadow: '0 2px 12px #60a5fa33',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          <span style={{ fontSize: 32 }}>🧠</span> Generate Your Study Plan
        </h2>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 500, marginBottom: 2 }}>
          Let AI help you organize your learning journey!
        </div>
      </div>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={e => { e.preventDefault(); handleGeneratePlan(); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#60a5fa' }}>📝</span>
            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 48px', // increased left padding
                borderRadius: 999,
                border: '1.5px solid #e0e7ef',
                fontSize: 16,
                background: 'rgba(255,255,255,0.95)',
                color: '#2563eb',
                boxShadow: '0 1px 4px #60a5fa11',
                outline: 'none',
                marginBottom: 0,
                transition: 'border-color 0.18s, box-shadow 0.18s',
              }}
              onFocus={e => e.target.style.borderColor = '#60a5fa'}
              onBlur={e => e.target.style.borderColor = '#e0e7ef'}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#f472b6' }}>🎯</span>
            <input
              type="text"
              placeholder="Your Learning Goal (e.g. Learn Python)"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 48px', // increased left padding
                borderRadius: 999,
                border: '1.5px solid #e0e7ef',
                fontSize: 16,
                background: 'rgba(255,255,255,0.95)',
                color: '#f472b6',
                boxShadow: '0 1px 4px #f472b611',
                outline: 'none',
                marginBottom: 0,
                transition: 'border-color 0.18s, box-shadow 0.18s',
              }}
              onFocus={e => e.target.style.borderColor = '#f472b6'}
              onBlur={e => e.target.style.borderColor = '#e0e7ef'}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#6366f1' }}>⏳</span>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 48px', // increased left padding
                  borderRadius: 999,
                  border: '1.5px solid #e0e7ef',
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.95)',
                  color: '#6366f1',
                  boxShadow: '0 1px 4px #6366f111',
                  outline: 'none',
                  marginBottom: 0,
                  transition: 'border-color 0.18s, box-shadow 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e0e7ef'}
              />
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#2563eb' }}>📅</span>
              <input
                type="date"
                value={format(startDate, "yyyy-MM-dd")}
                onChange={e => setStartDate(new Date(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 48px', // increased left padding
                  borderRadius: 999,
                  border: '1.5px solid #e0e7ef',
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.95)',
                  color: '#2563eb',
                  boxShadow: '0 1px 4px #2563eb11',
                  outline: 'none',
                  marginBottom: 0,
                  transition: 'border-color 0.18s, box-shadow 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e0e7ef'}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          style={{
            marginTop: 8,
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            border: 'none',
            borderRadius: 999,
            padding: '14px 0',
            boxShadow: '0 4px 24px #6366f155',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s',
            outline: 'none',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            opacity: loading ? 0.7 : 1,
            animation: loading ? 'pulseFAB 1.2s infinite' : 'none',
          }}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="loader" style={{ width: 22, height: 22, border: '3px solid #fff', borderTop: '3px solid #60a5fa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
              Generating...
            </span>
          ) : (
            <>
              <span style={{ fontSize: 22 }}>⚡</span> Generate Plan
            </>
          )}
        </button>
      </form>
      {/* Only show PlanViewer after plan is generated */}
      {markdown && (
        <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.97)', borderRadius: 24, boxShadow: '0 8px 32px #60a5fa33', padding: 24 }}>
          <PlanViewer planData={{ plan: markdown, start_date: format(startDate, "yyyy-MM-dd") }} />
        </div>
      )}
      <style>{`
        @keyframes pulseFAB {
          0%, 100% { box-shadow: 0 8px 32px #6366f155, 0 0 0 0 #6366f133; }
          50% { box-shadow: 0 8px 32px #6366f155, 0 0 0 16px #6366f111; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GeneratePlan;
