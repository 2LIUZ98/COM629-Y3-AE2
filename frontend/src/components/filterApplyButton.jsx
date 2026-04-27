export default function ApplyButton({ onClick }) {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onClick}
        className="bg-[#05339C] text-white px-4 py-2 rounded border border-[#05339C] transition hover:bg-white hover:text-[#05339C]"
      >
        Apply
      </button>
    </div>
  );
}