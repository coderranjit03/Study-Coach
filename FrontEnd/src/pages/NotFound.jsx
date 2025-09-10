// pages/NotFound.jsx
import BackButton from '../components/BackButton';

export default function NotFound() {
  return (
    <div className="text-center mt-32">
      <BackButton className="mb-6 mx-auto" />
      <h1 className="text-4xl font-bold mb-4 text-red-600">404</h1>
      <p className="text-lg text-gray-600">Page not found.</p>
    </div>
  );
}
