export default function ResetButton({ onReset }) {
  return (
    <div className="flex gap-2">

      <button
        onClick={onReset}
        className="w-full bg-white text-[#05339C] px-4 py-2 rounded border border-[#05339C]
                   transition hover:bg-[#05339C] hover:text-white"
      >
        Reset
      </button>

    </div>
  );
}