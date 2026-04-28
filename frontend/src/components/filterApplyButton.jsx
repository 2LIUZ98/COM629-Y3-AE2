export default function ActionButtons({ onApply, onReset }) {
  return (
    <div className="flex gap-2">
      
      <button
        onClick={onApply}
        className="w-1/2 bg-[#05339C] text-white px-4 py-2 rounded border border-[#05339C]
                   transition hover:bg-white hover:text-[#05339C]"
      >
        Apply
      </button>

      <button
        onClick={onReset}
        className="w-1/2 bg-white text-[#05339C] px-4 py-2 rounded border border-[#05339C]
                   transition hover:bg-[#05339C] hover:text-white"
      >
        Reset
      </button>

    </div>
  );
}