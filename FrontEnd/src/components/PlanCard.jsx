import React from 'react';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function highlightMatch(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} style={{ background: '#fef08a', borderRadius: 4, padding: '0 2px' }}>{part}</mark>
        ) : (
            part
        )
    );
}

function PlanCard({ plan, onDelete, searchTerm }) {
    const navigate = useNavigate();
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete();
    };
    const handleCardClick = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        navigate(`/plandetail/${plan.id}`);
    };

    // New: Try to parse plan as JSON array and show first day preview
    let dayPreview = null;
    try {
        const parsed = typeof plan.plan === 'string' ? JSON.parse(plan.plan) : plan.plan;
        if (Array.isArray(parsed) && parsed[0]?.day && parsed[0]?.title && parsed[0]?.tasks) {
            const day = parsed[0];
            dayPreview = (
                <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 18 }}>📆</span>
                        <span style={{ fontWeight: 600 }}>Day {day.day}:</span>
                        <span style={{ color: '#64748b', fontSize: 14 }}>{day.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{day.title}</div>
                    <ul style={{ marginLeft: 18, marginTop: 2, marginBottom: 0, padding: 0 }}>
                        {day.tasks.map((task, tIdx) => (
                            <li key={`day${day.day}-task${tIdx}`} style={{ color: '#334155', fontSize: 15, marginBottom: 2 }}>
                                {task}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    } catch (e) { dayPreview = null; }

    const formatAsMarkdown = () => {
        const date = new Date(plan.created_at).toLocaleDateString();
        const tags = plan.tags ? plan.tags.split(',').map((tag) => `#${tag.trim()}`).join(' ') : '';
        return `# ${plan.title}\n\n**🎯 Goal:** ${plan.goal}\n\n**🗓️ Created:** ${date}\n\n${tags}\n\n---\n\n${plan.daily_plan}`;
    };

    const downloadAsMarkdown = () => {
        const content = formatAsMarkdown();
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${plan.title.replace(/\s+/g, '_')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadAsPDF = () => {
        const element = document.createElement('div');
        element.innerHTML = `<h1>${plan.title}</h1>
            <p><strong>🎯 Goal:</strong> ${plan.goal}</p>
            <p><strong>🗓️ Created:</strong> ${new Date(plan.created_at).toLocaleDateString()}</p>
            <p>${plan.tags ? `<strong>Tags:</strong> ${plan.tags}` : ''}</p>
            <pre style="white-space: pre-wrap;">${plan.daily_plan}</pre>`;

        html2pdf().from(element).save(`${plan.title.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div
            onClick={handleCardClick}
            style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 20,
                boxShadow: '0 4px 16px rgba(96, 165, 250, 0.10)',
                border: '1.5px solid #e0e7ef',
                padding: 28,
                marginBottom: 16,
                cursor: 'pointer',
                transition: 'transform 0.18s, box-shadow 0.18s, backdrop-filter 0.18s',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.015)';
                e.currentTarget.style.boxShadow = '0 6px 18px #60a5fa33, 0 2px 8px #2563eb11';
                e.currentTarget.style.backdropFilter = 'blur(5px)';
                e.currentTarget.style.WebkitBackdropFilter = 'blur(5px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 32px #60a5fa22, 0 1.5px 6px #2563eb11';
                e.currentTarget.style.backdropFilter = 'blur(4px)';
                e.currentTarget.style.WebkitBackdropFilter = 'blur(4px)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>🎯</span>
                <span style={{ fontWeight: 700, fontSize: 20 }}>{plan.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', marginBottom: 2 }}>
                <span style={{ fontSize: 17 }}>🧠</span>
                <span style={{ fontWeight: 600 }}>{plan.goal}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontSize: 15 }}>📅</span>
                <span>Created: {plan.start_date ? new Date(plan.start_date).toLocaleDateString() : 'N/A'}</span>
            </div>
            {dayPreview}
            <button
                onClick={handleDeleteClick}
                style={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    padding: '4px 14px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    borderRadius: 16,
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px #b91c1c11',
                    transition: 'background 0.18s, color 0.18s',
                }}
                onMouseEnter={e => {
                    e.stopPropagation();
                    e.currentTarget.style.background = '#fecaca';
                    e.currentTarget.style.color = '#7f1d1d';
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.color = '#b91c1c';
                }}
            >
                🗑️ Delete
            </button>
        </div>
    );
}

export default PlanCard;
