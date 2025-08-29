interface CreateNoteButtonProps {
  onCreateNote: () => void;
}

const CreateNoteButton = ({ onCreateNote }: CreateNoteButtonProps) => {
  return (
    <button
      onClick={onCreateNote}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 mb-6"
    >
      Create Note
    </button>
  );
};

export default CreateNoteButton;
