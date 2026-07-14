'use client';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4 w-full">
        <h3 className="font-semibold text-ocean mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm text-white rounded-lg ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-ocean hover:bg-ocean-light'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
