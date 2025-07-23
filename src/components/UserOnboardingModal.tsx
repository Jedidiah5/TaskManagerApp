import React, { useState } from 'react';
import Image from 'next/image';

export default function UserOnboardingModal({ onSubmit }) {
  const [nickname, setNickname] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Nickname is required');
      return;
    }
    onSubmit(nickname.trim(), profilePic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <form onSubmit={handleSubmit} className="bg-card text-foreground rounded-xl p-8 shadow-2xl w-full max-w-sm flex flex-col gap-5 border border-border">
        <div className="flex flex-col items-center mb-2">
          <Image src="/favicon.ico" alt="TaskManager Logo" width={48} height={48} className="mb-2 rounded" />
          <h2 className="text-2xl font-bold mb-1">Welcome to TaskManager!</h2>
          <p className="text-muted-foreground text-sm">Set up your profile to get started</p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Nickname <span className="text-red-500">*</span></span>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="border border-border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your nickname"
            required
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Profile Picture (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:bg-primary file:text-white file:rounded file:px-3 file:py-1 file:border-0 file:mr-2"
          />
          {profilePic && (
            <img src={profilePic} alt="Preview" className="w-16 h-16 rounded-full mt-2 object-cover border-2 border-primary mx-auto" />
          )}
        </label>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded px-4 py-2 mt-2 font-semibold transition-colors">Save</button>
      </form>
    </div>
  );
} 