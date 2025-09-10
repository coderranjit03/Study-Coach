// src/components/ui/button.jsx
export function Button({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded ${className}`}
    >
      {children}
    </button>
  );
}
