const LANGS = [
  { key: 'en', label: 'EN' },
  { key: 'zh', label: '中文' },
  { key: 'ja', label: '日本語' },
  { key: 'fr', label: 'FR' },
];

export default function MultiLangField({ label, values, onChange, type = 'input', rows = 3 }) {
  const Tag = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {LANGS.map(l => (
          <div key={l.key}>
            <span className="text-xs text-zinc-400 mb-0.5 block">{l.label}</span>
            <Tag
              value={values?.[l.key] || ''}
              onChange={e => onChange({ ...values, [l.key]: e.target.value })}
              rows={rows}
              className="w-full border border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gold resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
