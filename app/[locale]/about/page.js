import { t } from '@/lib/messages';

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const values = ['quality', 'ethical', 'craft'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-ocean mb-4">{t(locale, 'about.title')}</h1>
        <p className="text-zinc-500 text-lg">{t(locale, 'about.subtitle')}</p>
      </div>
      <div className="space-y-6 text-zinc-600 leading-relaxed mb-16">
        <p>{t(locale, 'about.p1')}</p><p>{t(locale, 'about.p2')}</p><p>{t(locale, 'about.p3')}</p>
      </div>
      <h2 className="text-2xl font-light text-ocean text-center mb-10">{t(locale, 'about.values_title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map(v => (
          <div key={v} className="text-center p-6 rounded-xl bg-pearl">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h3 className="font-medium text-ocean mb-2">{t(locale, `about.${v}`)}</h3>
            <p className="text-sm text-zinc-500">{t(locale, `about.${v}_desc`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
