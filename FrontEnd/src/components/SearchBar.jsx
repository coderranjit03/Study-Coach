// 🔍 SearchBar.jsx

import React, { useRef } from 'react';

function SearchBar({ searchTerm, setSearchTerm }) {
    const inputRef = useRef();
    return (
        <div style={{
            width: '100%',
            maxWidth: 320,
            margin: '18px auto 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
            }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    style={{
                        width: '100%',
                        height: 36,
                        border: '1.2px solid #e5e7eb', // fine border
                        outline: 'none',
                        background: '#fff',
                        fontSize: 14,
                        color: '#374151',
                        borderRadius: 999,
                        boxShadow: '0 2px 12px #60a5fa22',
                        padding: '0 44px 0 18px',
                        transition: 'box-shadow 0.18s, border-color 0.18s',
                    }}
                />
                {/* Search Icon Button, slightly overlapping input */}
                <button
                    type="button"
                    tabIndex={-1}
                    style={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        boxShadow: '0 1px 4px #f857a633',
                        cursor: 'pointer',
                        transition: 'background 0.18s, box-shadow 0.18s',
                        zIndex: 2,
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #ff5858 0%, #f857a6 100%)';
                        e.currentTarget.style.boxShadow = '0 2px 8px #f857a655';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)';
                        e.currentTarget.style.boxShadow = '0 1px 4px #f857a633';
                    }}
                    onClick={() => inputRef.current?.focus()}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
