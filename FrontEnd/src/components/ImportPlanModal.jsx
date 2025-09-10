import React, { useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ImportPlanModal = ({ onClose }) => {
  const [planText, setPlanText] = useState("");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [tags, setTags] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = reader.result;
        // If JSON, parse
        if (file.name.endsWith(".json")) {
          const jsonData = JSON.parse(content);
          if (jsonData.plan) setPlanText(jsonData.plan);
        } else {
          setPlanText(content);
        }
      } catch (error) {
        toast.error("Failed to read file.");
      }
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/json": [".json"],
      "text/markdown": [".md"]
    }
  });

  const handleSave = async () => {
    if (!planText || !title || !goal) {
      toast.error("Please fill all fields.");
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    const { error } = await supabase.from("study_plan").insert({
      user_id: user.id,
      title,
      goal,
      tags,
      plan: planText,
      start_date: new Date(),
      progress: [],
    });

    if (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan.");
    } else {
      toast.success("Plan imported and saved!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-4xl overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-center">📥 Import Study Plan</h2>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-4 mb-4 text-center cursor-pointer rounded-lg ${
            isDragActive ? "border-green-400" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive
            ? "Drop your file here..."
            : "Drag & drop a .txt, .md, or .json file here or click to browse"}
        </div>

        {/* Inputs */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 rounded border"
        />
        <input
          type="text"
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-2 mb-2 rounded border"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 mb-4 rounded border"
        />

        {/* Markdown textarea */}
        <textarea
          placeholder="Paste or edit your Markdown study plan here..."
          rows={10}
          value={planText}
          onChange={(e) => setPlanText(e.target.value)}
          className="w-full p-2 border rounded mb-4 font-mono"
        />

        {/* Formatting Help */}
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          <strong>Markdown Tips:</strong><br />
          - Use `#` for headings<br />
          - Use `-` for bullet tasks (these will have checkboxes)<br />
          - Leave a blank line between each day<br />
          - Example:  
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs whitespace-pre-wrap">
{`## Day 1: Intro\n- Watch video\n- Take notes`}
          </pre>
        </div>

        {/* Live Preview */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">🔍 Live Preview:</h3>
          <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800 text-sm max-h-60 overflow-y-auto">
            <ReactMarkdown>{planText}</ReactMarkdown>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✅ Import & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPlanModal;
