interface CreateNoteButtonProps {
  onCreateNote: () => void;
}

const CreateNoteButton = ({ onCreateNote }: CreateNoteButtonProps) => {
  return (
    <button
      onClick={onCreateNote}
      className="w-full bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 mb-6 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base"
    >
      Create Note
    </button>
  );
};

export default CreateNoteButton;
