import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FiSend, FiType } from 'react-icons/fi';
import ReactQuill from 'react-quill-new'; // 👈 Updated Import
import 'react-quill-new/dist/quill.snow.css'; // 👈 Updated CSS
import toast from 'react-hot-toast';
import api from '../services/api';

const AdminPromotion = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => api.post('/admin/promote', data),
    onSuccess: () => {
      toast.success("Promotion campaign started!");
      setSubject("");
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send emails.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!subject || !message) return toast.error("Subject and message required");
    
    // Check if empty (strip HTML tags)
    if (message.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !message.includes('<img')) {
      return toast.error("Please write a message body");
    }

    if(window.confirm("Are you sure you want to email ALL users?")) {
      mutation.mutate({ subject, message });
    }
  };

  // ✅ Toolbar Configuration (Explicitly includes 'image')
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'], // Toggles
      [{ 'color': [] }, { 'background': [] }],   // Color dropdowns
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'], // 👈 THIS ADDS THE IMAGE BUTTON
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image' // 👈 Allow image formatting
  ];

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Email Campaign</h1>
        <p className="text-gray-400 mt-1 text-sm">Send formatted newsletters with images to all users.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Subject Line */}
          <div>
            <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2 flex items-center gap-2">
              <FiType /> Subject Line
            </label>
            <input 
              type="text" 
              placeholder="e.g. Big Updates Coming!" 
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#38E07B] outline-none transition-all font-bold text-lg"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2">
              Compose Email
            </label>
            
            {/* 
               🛑 IMPORTANT: The 'text-black' class here forces the toolbar icons 
               to be black so they are visible against the white background.
            */}
            <div className="bg-white rounded-xl overflow-hidden text-black">
              <ReactQuill 
                theme="snow"
                value={message}
                onChange={setMessage}
                modules={modules}
                formats={formats}
                className="h-80 mb-12" // Added margin bottom for toolbar space
                placeholder="Write something amazing... Drag and drop images here."
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 pt-2">
              Tip: Click the 🖼️ icon to upload images, or drag-and-drop them directly.
            </p>
          </div>

          {/* Send Button */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="bg-[#38E07B] text-[#122017] px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:bg-[#2fc468] transition flex items-center gap-2 disabled:opacity-50"
            >
              {mutation.isPending ? 'Sending...' : <><FiSend /> Send Blast</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminPromotion;