import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png'; // Placeholder logo, swap with your own if available
import { supabase } from '../utils/supabaseClient';
import AuthModal from '../components/AuthModal';
import { CheckCircle, AlertCircle } from 'lucide-react';



export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { listener?.subscription?.unsubscribe?.(); };
  }, [navigate]);

  // Sidebar nav items with icons
  const studyTools = [
    { icon: '🏠', label: 'Home', to: '/' },
    { icon: '🤖', label: 'AI-Generated Plans', to: '/plandashboard' },
    { icon: '📅', label: 'Track Progress', to: '/planned-topics' },
    { icon: '🎮', label: 'Practice', to: '/practice' },
  ];
  const exploreHelp = [
    { icon: '🗂️', label: 'Resource', to: '#' },
    { icon: '🌐', label: 'Chrome Extension', to: '#' },
  ];

  // Features
  const features = [
    {
      icon: '🤖',
      title: 'AI Note Taker',
      desc: 'Turn textbooks, videos, slides, or screenshots into clear, organized notes in seconds.'
    },
    {
      icon: '📄',
      title: 'PDF & Slide Summarizer',
      desc: 'Upload PDFs or slides and get concise, study-ready notes instantly.'
    },
    {
      icon: '🎥',
      title: 'Video & Audio Support',
      desc: 'Summarize lectures, recordings, or YouTube videos for fast review.'
    },
    {
      icon: '📝',
      title: 'Editable & Personal',
      desc: 'Edit, highlight, and reorganize your notes to fit your study style.'
    },
    {
      icon: '💬',
      title: 'Ask Anything',
      desc: 'Get instant answers about your notes and study materials.'
    },
    {
      icon: '📱',
      title: 'Sync Across Devices',
      desc: 'Access, edit, and create notes on your phone, tablet, or desktop.'
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Emily Wang',
      quote: 'This AI note taker makes studying so much faster. Just upload my slides and screenshots, I get neat, organized notes in seconds.'
    },
    {
      name: 'Jamal Rodriguez',
      quote: 'This AI note taker literally saves me hours every week. I don’t have to type everything out anymore — just upload and it does the rest.'
    },
    {
      name: 'Aanya Patel',
      quote: 'After I started using the AI note taker for my chem and psych classes, I actually started understanding the material, my test scores went up too.'
    },
    {
      name: 'Carlos Mendes',
      quote: 'Didn’t think I’d use an AI note taker this much, but now it’s part of my routine. Works great with textbooks, PDFs, even lecture recordings.'
    },
    {
      name: 'Maya Johnson',
      quote: 'The AI note taker helps me break down long readings into clean bullet points. It’s perfect when I need to prep fast for a quiz or exam.'
    },
    {
      name: 'Daniel Nguyen',
      quote: 'I upload slides right after class and the AI note taker turns them into notes I can actually use. Way better than copying everything by hand.'
    },
  ];

  // Helper for protected navigation
  function handleProtectedNav(to) {
    console.log('handleProtectedNav called with:', to);
    console.log('Current user:', user);
    if (user) {
      setSidebarOpen(false);
      navigate(to);
    } else {
      console.log('No user, showing auth modal');
      setShowAuthModal(true);
      setPendingNav(to);
    }
  }

  console.log('LandingPage render - user:', user);
  
  return (
    <div className={`landing-root${darkMode ? ' dark' : ''}`} style={{
      minHeight: '100vh',
      width: '100%',
      background: darkMode
        ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
        : 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      transition: 'background 0.4s',
      display: 'flex',
    }}>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => { 
          console.log('Closing AuthModal'); 
          setShowAuthModal(false); 
        }} 
        onAuth={userData => { 
          console.log('Auth success:', userData); 
          setUser(userData); 
          setShowAuthModal(false); 
          showToast('Welcome back! Great to see you again! ✨', 'success');
          if (pendingNav) { 
            navigate(pendingNav); 
            setPendingNav(null); 
          } 
        }}
        onSignupSuccess={userData => { 
          console.log('Signup success:', userData); 
          setUser(userData); 
          setShowAuthModal(false); 
          showToast(`Welcome ${userData.user?.user_metadata?.username || 'there'}! Your account has been created successfully! 🎉`, 'success');
          if (pendingNav) { 
            navigate(pendingNav); 
            setPendingNav(null); 
          } 
        }}
        showToast={showToast}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            background: toast.type === 'success' 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out forwards',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={20} style={{ flexShrink: 0 }} />
          ) : (
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {toast.message}
          </span>
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 260,
          background: darkMode ? 'rgba(30,32,34,0.97)' : 'rgba(255,255,255,0.97)',
          boxShadow: '2px 0 24px #60a5fa22',
          borderRight: darkMode ? '1.5px solid #374151' : '1.5px solid #e0e7ff',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 0,
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          transition: 'left 0.35s cubic-bezier(.4,0,.2,1), background 0.4s',
        }}
      >
        {/* Scrollable content */}
      <div style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          paddingTop: 32,
          paddingBottom: 12,
        }}>
          <style>{`
            aside div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Top: Logo and Name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 18 }}>
            <img src={logo} alt="Logo" style={{ width: 170, height: "auto",  }} />
            {/* <span style={{
              fontWeight: 900,
              fontSize: 30,
              background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-1.5px',
              textShadow: darkMode ? '0 2px 12px #6366f1cc' : '0 2px 12px #60a5fa33',
              transition: 'text-shadow 0.3s',
              marginTop: 0,
              marginBottom: 8,
            }}>
              Study Coach
            </span> */}
          </div>
          {/* Study Tools Section */}
          <div style={{ width: '100%', marginBottom: 18 }}>
            <div style={{ color: darkMode ? '#a5b4fc' : '#64748b', fontWeight: 700, fontSize: 13, marginLeft: 32, marginBottom: 8, letterSpacing: 1 }}>Study Tools</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', alignItems: 'flex-start' }}>
              {studyTools.map(link => (
                <button
                  key={link.label}
                  onClick={() => { setSidebarOpen(false); navigate(link.to); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    padding: '10px 24px',
                    borderRadius: 12,
                    width: '90%',
                    outline: 'none',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'background 0.18s, color 0.18s',
                    marginBottom: 2,
                    textAlign: 'left',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = darkMode ? '#374151' : '#e0e7ff';
                    e.currentTarget.style.boxShadow = '0 2px 12px #60a5fa33';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: 18 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>
          {/* Explore & Help Section */}
          <div style={{ width: '100%', marginBottom: 18 }}>
            <div style={{ color: darkMode ? '#a5b4fc' : '#64748b', fontWeight: 700, fontSize: 13, marginLeft: 32, marginBottom: 8, letterSpacing: 1 }}>Explore & Help</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', alignItems: 'flex-start' }}>
              {exploreHelp.map(link => (
                <button
                  key={link.label}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    padding: '10px 24px',
                    borderRadius: 12,
                    width: '90%',
                    outline: 'none',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'background 0.18s, color 0.18s',
                    marginBottom: 2,
                    textAlign: 'left',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = darkMode ? '#374151' : '#e0e7ff';
                    e.currentTarget.style.boxShadow = '0 2px 12px #60a5fa33';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: 18 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Bottom: Language, Dark Mode, Get Started */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, width: '80%', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <button
              onClick={() => setDarkMode(dm => !dm)}
              style={{
                background: 'none',
                border: 'none',
                color: darkMode ? '#a5b4fc' : '#2563eb',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              aria-label="Toggle dark/light mode"
            >
              <span style={{ fontSize: 16 }}>{darkMode ? '🌙' : '☀️'}</span> Dark Mode
            </button>
          </div>
          <button
            onClick={() => handleProtectedNav('/plandashboard')}
            style={{
              width: '85%',
              marginTop: 10,
              background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              border: 'none',
              borderRadius: 16,
              padding: '16px 0',
              boxShadow: '0 4px 24px #60a5fa55',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background 0.18s, box-shadow 0.18s',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = '0 8px 32px #f472b6cc';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 24px #60a5fa55';
            }}
          >
            ⚡ Get started
          </button>
          {user && (
            <button
                          onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
              showToast('👋 You have been signed out successfully!', 'success');
            }}
              style={{
                width: '85%',
                marginTop: 6,
                background: 'linear-gradient(90deg, #f472b6 0%, #6366f1 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                border: 'none',
                borderRadius: 16,
                padding: '12px 0',
                boxShadow: '0 2px 12px #6366f1cc',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.18s, box-shadow 0.18s',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              🚪 Sign Out
            </button>
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          onClick={() => setSidebarOpen(s => !s)}
          style={{
        position: 'absolute',
            top: 18,
            right: -48,
            width: 40,
            height: 40,
            background: darkMode ? '#232526' : '#fff',
            border: '1.5px solid #e0e7ff',
            borderRadius: '50%',
            boxShadow: '0 2px 12px #60a5fa33',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 101,
            cursor: 'pointer',
          }}
          className="sidebar-hamburger"
          aria-label="Toggle sidebar"
        >
          <span style={{ fontSize: 26, color: darkMode ? '#a5b4fc' : '#2563eb' }}>☰</span>
        </button>
      </aside>

      {/* Main Content (shifted right) */}
      <div style={{
        flex: 1,
        marginLeft: 220,
        transition: 'margin-left 0.35s cubic-bezier(.4,0,.2,1)',
        minHeight: '100vh',
      }}>
      {/* Hero Section */}
      <section style={{
        zIndex: 2,
        textAlign: 'center',
          marginTop: 80,
        marginBottom: 40,
        padding: 32,
          background: darkMode ? 'rgba(30,32,34,0.92)' : 'rgba(255,255,255,0.92)',
        borderRadius: 32,
        boxShadow: '0 8px 32px #60a5fa33',
        maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
      }}>
        <h1 style={{
          fontSize: 56,
          fontWeight: 900,
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 50%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          letterSpacing: '-2px',
          marginBottom: 16,
            textShadow: darkMode ? '0 4px 24px #6366f1cc' : '0 4px 24px #60a5fa55',
        }}>
            Study Coach
        </h1>
        <p style={{
          fontSize: 26,
            color: darkMode ? '#e0e7ff' : '#374151',
          fontWeight: 500,
          marginBottom: 32,
        }}>
          Your AI-powered personal learning planner. Organize, track, and achieve your study goals with ease!
        </p>
        <button
          onClick={() => {
            console.log('Hero Get Started button clicked!');
            if (user) {
              navigate('/plandashboard');
            } else {
              setShowAuthModal(true);
            }
          }}
          style={{
            fontSize: 22,
            fontWeight: 700,
            padding: '16px 48px',
            borderRadius: 32,
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 8px 32px #6366f155',
            cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s',
            marginBottom: 12,
            animation: 'pulseFAB 2.2s infinite',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 16px 48px #6366f1cc';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 8px 32px #6366f155';
          }}
        >
          🚀 Get Started
        </button>

      </section>
      {/* Features Section */}
      <section style={{
        zIndex: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 32,
        marginBottom: 40,
          paddingTop: 16,
          paddingLeft: 16,
          paddingRight: 16,
          overflow: 'visible',
        }}>
          {features.map(f => (
          <div key={f.title} style={{
              background: darkMode ? 'rgba(30,32,34,0.92)' : 'rgba(255,255,255,0.92)',
            borderRadius: 24,
            boxShadow: '0 4px 24px #60a5fa22',
            padding: 32,
            minWidth: 220,
            maxWidth: 270,
            textAlign: 'center',
            transition: 'transform 0.18s, box-shadow 0.18s',
            fontSize: 18,
            fontWeight: 500,
            cursor: 'pointer',
              outline: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 12px 32px #60a5fa44';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 4px 24px #60a5fa22';
          }}
            tabIndex={0}
          >
            <div style={{ fontSize: 38, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: darkMode ? '#e0e7ff' : '#374151', fontSize: 16 }}>{f.desc}</div>
          </div>
        ))}
      </section>
        {/* Testimonials Section */}
        <section style={{
          zIndex: 2,
          background: darkMode ? 'rgba(30,32,34,0.92)' : 'rgba(255,255,255,0.92)',
          borderRadius: 32,
          boxShadow: '0 8px 32px #60a5fa33',
          maxWidth: 900,
          margin: '0 auto 40px auto',
          padding: '36px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 50%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 24,
          }}>
            Loved by over 10 million students
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 24,
          }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                background: darkMode ? 'rgba(30,32,34,0.97)' : 'rgba(255,255,255,0.97)',
                borderRadius: 20,
                boxShadow: '0 2px 12px #60a5fa22',
                padding: 24,
                minWidth: 220,
                maxWidth: 320,
                textAlign: 'left',
                fontSize: 17,
                fontWeight: 500,
                color: darkMode ? '#e0e7ff' : '#374151',
                marginBottom: 8,
                marginTop: 8,
              }}>
                <div style={{ fontWeight: 700, fontSize: 19, color: darkMode ? '#a5b4fc' : '#2563eb', marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontStyle: 'italic', fontSize: 16 }}>{t.quote}</div>
              </div>
            ))}
          </div>
        </section>
        {/* Call to Action Section */}
        <section style={{
          zIndex: 2,
          textAlign: 'center',
          margin: '0 auto 40px auto',
          padding: 32,
          background: darkMode ? 'rgba(30,32,34,0.92)' : 'rgba(255,255,255,0.92)',
          borderRadius: 32,
          boxShadow: '0 8px 32px #60a5fa33',
          maxWidth: 700,
        }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 50%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 24,
          }}>
            Ready to Take Smarter Notes?
          </h2>
          <button
            onClick={() => {
              console.log('Try for Free button clicked!');
              if (user) {
                navigate('/plandashboard');
              } else {
                setShowAuthModal(true);
              }
            }}
            style={{
              fontSize: 22,
              fontWeight: 700,
              padding: '16px 48px',
              borderRadius: 32,
              background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 8px 32px #6366f155',
              cursor: 'pointer',
              transition: 'transform 0.18s, box-shadow 0.18s',
              marginBottom: 12,
              animation: 'pulseFAB 2.2s infinite',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 16px 48px #6366f1cc';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 8px 32px #6366f155';
            }}
          >
            Try for Free
          </button>

        </section>
        {/* Footer */}
        <footer style={{
          width: '100%',
          background: darkMode ? 'rgba(30,32,34,0.97)' : 'rgba(255,255,255,0.97)',
          color: darkMode ? '#e0e7ff' : '#374151',
          textAlign: 'center',
          padding: '32px 0 16px 0',
          fontSize: 16,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: '0 -2px 16px #60a5fa22',
          marginTop: 32,
        }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            © {new Date().getFullYear()} Study Coach. All rights reserved.
          </div>
          {/* <div style={{ fontSize: 15, color: darkMode ? '#a5b4fc' : '#64748b' }}>
            Inspired by <a href="https://studyx.ai/ai-note-taker" target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? '#a5b4fc' : '#2563eb', textDecoration: 'underline' }}>StudyX AI Note Taker</a>
          </div> */}
        </footer>
        {/* Animations & Dark Mode Styles */}
      <style>{`
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes pulseFAB {
          0%, 100% { box-shadow: 0 8px 32px #6366f155, 0 0 0 0 #6366f133; }
          50% { box-shadow: 0 8px 32px #6366f155, 0 0 0 16px #6366f111; }
        }
          @media (max-width: 900px) {
            aside {
              left: ${sidebarOpen ? '0' : '-220px'} !important;
              display: flex !important;
            }
            .sidebar-hamburger {
              display: flex !important;
            }
            .main-content {
              margin-left: 0 !important;
            }
          }
          @media (min-width: 900px) {
            aside {
              left: 0 !important;
              display: flex !important;
            }
            .sidebar-hamburger {
              display: none !important;
            }
            .main-content {
              margin-left: 220px !important;
            }
          }
          body.dark {
            background: #232526 !important;
            color: #e0e7ff !important;
          }
          body.dark * {
            color: #e0e7ff !important;
            border-color: #374151 !important;
          }
          body.dark h1, body.dark h2, body.dark h3, body.dark h4, body.dark h5, body.dark h6 {
            color: #a5b4fc !important;
          }
          body.dark a { color: #a5b4fc !important; }
      `}</style>
      </div>
    </div>
  );
} 