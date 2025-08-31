import { Trash2, Edit, Calendar } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onEditNote: (note: Note) => void;
  searchTerm: string;
}

const NotesList = ({ notes, onDeleteNote, onEditNote, searchTerm }: NotesListProps) => {
  // Notes are already filtered by the parent component

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Get the most recent date (updatedAt or createdAt)
  const getDisplayDate = (note: Note) => {
    return note.updatedAt || note.createdAt;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          Notes {searchTerm && `(${notes.length} found)`}
        </h3>
      </div>
      
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-200"
          >
            {/* Note Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-800 font-semibold text-sm sm:text-base truncate">
                  {note.title}
                </h4>
                {note.content && (
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
                    {note.content}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={() => onEditNote(note)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 sm:p-2 rounded-lg hover:bg-blue-50 flex-shrink-0"
                  title="Edit note"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 sm:p-2 rounded-lg hover:bg-red-50 flex-shrink-0"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            {/* Timestamp */}
            {getDisplayDate(note) && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  {note.updatedAt ? 'Updated' : 'Created'}: {formatDate(getDisplayDate(note))}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {/* Empty States */}
        {notes.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">No notes found matching "{searchTerm}"</p>
          </div>
        )}
        
        {notes.length === 0 && !searchTerm && (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Get started by creating your first note
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
