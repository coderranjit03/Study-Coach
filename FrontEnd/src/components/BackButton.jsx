import { useNavigate } from 'react-router-dom';

export default function BackButton({ className = '', children = 'Back' }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium focus:outline-none ${className}`}
      aria-label="Go back"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </button>
  );
} 