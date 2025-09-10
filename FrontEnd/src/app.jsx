import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from './utils/supabaseClient';
import SearchBar from "./components/SearchBar";
import PlanCard from "./components/PlanCard";
import GeneratePlan from "./components/GeneratePlan";
import ConfirmModal from "./components/ConfirmModal";
import ImportPlanModal from "./components/ImportPlanModal";
import PlanDashboard from './pages/PlanDashboard';
import NotFound from './pages/NotFound';

import { SearchProvider, useSearch } from './context/SearchContext';
import PlanDetailPage from './pages/PlanDetailPage';
import ToastTest from './components/ToastTest';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import QuizTopic from './pages/QuizTopic';
import CodeGamePage from './pages/CodeGamePage';
import PlannedTopics from './pages/PlannedTopics';

// function AppContent() {
//   const session = useSession();
//   const { searchTerm } = useSearch();

//   const [plans, setPlans] = useState([]);
//   const [latestPlan, setLatestPlan] = useState(null);
//   const [selectedTag, setSelectedTag] = useState("All");
//   const [sortBy, setSortBy] = useState("newest");
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showImportModal, setShowImportModal] = useState(false);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();
//       setUser(data?.user || null);
//       setLoading(false);
//     };
//     getUser();

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//       fetchPlans();
//     });

//     return () => listener?.subscription.unsubscribe();
//   }, []);

//   const fetchPlans = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('study_plan')
//       .select('*')
//       .order('created_at', { ascending: false }); // ✅ Sort by timestamp

//     if (error) {
//       console.error('Error fetching plans:', error.message);
//     } else {
//       setPlans(data);
//     }
//     setLoading(false);
//   };



//   useEffect(() => {
//     if (user) fetchPlans();
//   }, [user]);

//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     const { error } = await supabase.from("study_plan").delete().eq("id", deleteId);
//     if (!error) {
//       fetchPlans();
//       setDeleteId(null);
//       setConfirmOpen(false);
//     }
//   };

//   const getAllTags = () => {
//     const allTags = new Set();
//     plans.forEach((plan) => {
//       if (plan.tags) {
//         plan.tags.split(",").forEach((tag) => allTags.add(tag.trim()));
//       }
//     });
//     return ["All", ...Array.from(allTags)];
//   };

//   const sortPlans = (plans) => {
//     switch (sortBy) {
//       case "a-z":
//         return [...plans].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
//       case "goal":
//         return [...plans].sort((a, b) => (a.goal || "").localeCompare(b.goal || ""));
//       case "newest":
//       default:
//         return [...plans].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//     }
//   };

//   const filteredPlans = sortPlans(
//     plans.filter((plan) => {
//       const term = searchTerm.toLowerCase();
//       const matchesSearch =
//         (plan.title || "").toLowerCase().includes(term) ||
//         (plan.goal || "").toLowerCase().includes(term) ||
//         (plan.daily_plan || "").toLowerCase().includes(term);

//       const matchesTag =
//         selectedTag === "All" ||
//         (plan.tags && plan.tags.toLowerCase().includes(selectedTag.toLowerCase()));

//       return matchesSearch && matchesTag;
//     })
//   );

//   if (loading) return <p className="text-center mt-10 text-gray-500">🔄 Checking login...</p>;
//   if (!user) return <Login onAuth={(user) => setUser(user)} />;

//   return (
//     <>
//       <div style={{ background: 'lime', color: 'black', padding: 20, fontWeight: 700 }}>
//         TEST DIV - Should be visible (AppContent)
//       </div>
//       <div className="min-h-screen bg-white text-black px-4 py-8">
//         <h1 className="text-3xl font-bold text-center mb-6">AI Study Coach 📚</h1>

//         <div className="flex justify-center gap-4 mb-4">
//           <button
//             onClick={() => setShowImportModal(true)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             📥 Import Plan
//           </button>
//           <button
//             onClick={fetchPlans}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             🔄 Refresh
//           </button>
//         </div>

//         <SearchBar />

//         <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
//           <select
//             value={selectedTag}
//             onChange={(e) => setSelectedTag(e.target.value)}
//             className="px-3 py-2 rounded-md border border-gray-300 text-sm"
//           >
//             {getAllTags().map((tag) => (
//               <option key={tag} value={tag}>
//                 {tag}
//               </option>
//             ))}
//           </select>

//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="px-3 py-2 rounded-md border border-gray-300 text-sm"
//           >
//             <option value="newest">🕒 Newest</option>
//             <option value="a-z">🔤 A–Z (Title)</option>
//             <option value="goal">🎯 Goal</option>
//           </select>
//         </div>

//         <div className="mt-6 space-y-6">
//           {filteredPlans.map((plan) => (
//             <PlanCard
//               key={plan.id}
//               plan={plan}
//               onDelete={() => handleDeleteClick(plan.id)}
//               searchTerm={searchTerm}
//             />
//           ))}
//         </div>

//         <div className="mt-10">
//           <GeneratePlan user={user} onPlanCreated={fetchPlans} />
//         </div>

//         <ConfirmModal
//           isOpen={confirmOpen}
//           onClose={() => setConfirmOpen(false)}
//           onConfirm={confirmDelete}
//         />

//         {showImportModal && (
//           <ImportPlanModal
//             onClose={() => setShowImportModal(false)}
//             onPlanImported={fetchPlans}
//           />
//         )}
//       </div>
//     </>
//   );
// }

export default function AppWrapper() {
  return (
    <>
      <Toaster position="top-center" />
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/plandetail/:id" element={<PlanDetailPage />} />
            <Route path="/plandashboard" element={<PlanDashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/planned-topics" element={<PlannedTopics />} />
            <Route path="/quiz/:language" element={<Quiz />} />
            <Route path="/quiz/:language/:topic" element={<QuizTopic />} />
            <Route path="/codegame/:language/:difficulty" element={<CodeGamePage />} />
            <Route path="/toast-test" element={<ToastTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SearchProvider>
    </>
  );
}
