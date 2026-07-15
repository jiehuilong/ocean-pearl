// ponytail: static rates, fetch from API when volume justifies it
const RATES = {
  USD: { symbol: '$', rate: 1, label: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, label: 'Euro' },
  JPY: { symbol: '¥', rate: 149.5, label: 'Japanese Yen' },
  CNY: { symbol: '¥', rate: 7.24, label: 'Chinese Yuan' },
};

export const currencies = Object.entries(RATES).map(([code, c]) => ({ code, ...c }));

export function convertPrice(usd, targetCurrency) {
  const c = RATES[targetCurrency];
  if (!c || targetCurrency === 'USD') return { value: usd, symbol: '$', formatted: `$${usd.toLocaleString()}` };
  const converted = usd * c.rate;
  const formatted = targetCurrency === 'JPY'
    ? `${c.symbol}${Math.round(converted).toLocaleString()}`
    : `${c.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return { value: converted, symbol: c.symbol, formatted };
}
