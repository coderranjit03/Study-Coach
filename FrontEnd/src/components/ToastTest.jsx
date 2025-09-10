import { Toaster, toast } from "react-hot-toast";

export default function ToastTest() {
  return (
    <div style={{ padding: 40 }}>
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={() => toast.success("Toast works!")}
        style={{ padding: 12, fontSize: 18, background: '#4ade80', color: 'white', border: 'none', borderRadius: 8 }}
      >
        Test Toast
      </button>
    </div>
  );
} 