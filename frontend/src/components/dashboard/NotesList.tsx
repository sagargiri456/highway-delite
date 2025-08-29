import { Trash2 } from 'lucide-react';

interface Note {
  id: number;
  title: string;
}

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (id: number) => void;
}

const NotesList = ({ notes, onDeleteNote }: NotesListProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Notes</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between"
          >
            <span className="text-gray-800">{note.title}</span>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
