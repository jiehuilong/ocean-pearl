const COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-zinc-100 text-zinc-800',
  CANCELLED: 'bg-red-100 text-red-800',
  ADMIN: 'bg-purple-100 text-purple-800',
  CUSTOMER: 'bg-zinc-100 text-zinc-600',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${COLORS[status] || 'bg-zinc-100 text-zinc-600'}`}>
      {status}
    </span>
  );
}
