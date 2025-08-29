import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UserInfoCard from '../components/dashboard/UserInfoCard';
import CreateNoteButton from '../components/dashboard/CreateNoteButton';
import NotesList from '../components/dashboard/NotesList';

interface Note {
  id: number;
  title: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Note 1' },
    { id: 2, title: 'Note 2' }
  ]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: `Note ${notes.length + 1}`
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log('Sign out clicked');
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <DashboardHeader onSignOut={handleSignOut} />
      <UserInfoCard name="Jonas Kahnwald" email="xxxxxx@xxxx.com" />
      <CreateNoteButton onCreateNote={handleCreateNote} />
      <NotesList notes={notes} onDeleteNote={handleDeleteNote} />
    </div>
  );
};

export default Dashboard;
