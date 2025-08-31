import { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UserInfoCard from '../components/dashboard/UserInfoCard';
import CreateNoteButton from '../components/dashboard/CreateNoteButton';
import NotesList from '../components/dashboard/NotesList';
import SearchBar from '../components/dashboard/SearchBar';
import NoteModal from '../components/dashboard/NoteModal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/authContext';
import { useToast } from '../context/toastContext';
import { useNavigate } from 'react-router-dom';
import { notesApi, type Note, type CreateNoteData, type UpdateNoteData } from '../api/notes';

interface LocalNote extends Omit<Note, '_id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<LocalNote[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<LocalNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<LocalNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes when search term changes
  useEffect(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await notesApi.getNotes();
      
      if (response.success) {
        const localNotes: LocalNote[] = response.data.notes.map(note => ({
          id: note._id,
          title: note.title,
          content: note.content,
          userId: note.userId,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        
        setNotes(localNotes);
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note: LocalNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setNoteToDelete(note);
      setIsDeleteModalOpen(true);
    }
  };

  const handleSaveNote = async (noteData: CreateNoteData) => {
    try {
      if (editingNote) {
        // Update existing note
        setIsUpdating(true);
        
        // Optimistic update
        const optimisticNote: LocalNote = {
          ...editingNote,
          ...noteData,
          updatedAt: new Date()
        };
        setNotes(prev => prev.map(note => 
          note.id === editingNote.id ? optimisticNote : note
        ));

        const response = await notesApi.updateNote(editingNote.id, noteData);
        
        if (response.success) {
          const updatedNote: LocalNote = {
            id: response.data._id,
            title: response.data.title,
            content: response.data.content,
            userId: response.data.userId,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt)
          };
          
          setNotes(prev => prev.map(note => 
            note.id === editingNote.id ? updatedNote : note
          ));
          showSuccess('Note updated successfully');
        }
      } else {
        // Create new note
        setIsCreating(true);
        
        const response = await notesApi.createNote(noteData);
        
        if (response.success) {
          const newNote: LocalNote = {
            id: response.data._id,
            title: response.data.title,
            content: response.data.content,
            userId: response.data.userId,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt)
          };
          
          setNotes(prev => [newNote, ...prev]);
          showSuccess('Note created successfully');
        }
      }
    } catch (error: any) {
      showError(error.message || 'Failed to save note');
      
      // Revert optimistic update on error
      if (editingNote) {
        fetchNotes();
      }
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Optimistic delete
      const noteToDeleteId = noteToDelete.id;
      setNotes(prev => prev.filter(note => note.id !== noteToDeleteId));
      
      const response = await notesApi.deleteNote(noteToDelete.id);
      
      if (response.success) {
        showSuccess('Note deleted successfully');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to delete note');
      // Revert optimistic delete on error
      fetchNotes();
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <DashboardHeader onSignOut={handleSignOut} />
        <UserInfoCard name={user?.name || 'User'} email={user?.email || 'user@example.com'} />
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search notes by title or content..."
          />
        </div>
        
        <CreateNoteButton onCreateNote={handleCreateNote} />
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Loading notes...</p>
            </div>
          </div>
        ) : (
          <NotesList 
            notes={filteredNotes} 
            onDeleteNote={handleDeleteNote}
            onEditNote={handleEditNote}
            searchTerm={searchTerm}
          />
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        mode={editingNote ? 'edit' : 'create'}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        noteTitle={noteToDelete?.title || ''}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
