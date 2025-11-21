import axios from 'axios';

let ratesCache = { USD: 1 };

// Fetch rates on app load
export const fetchRates = async () => {
  try {
    const res = await axios.get('https://open.er-api.com/v6/latest/USD');
    if (res.data?.rates) {
      ratesCache = res.data.rates;
      localStorage.setItem('rates', JSON.stringify(ratesCache));
    }
  } catch (error) {
    const saved = localStorage.getItem('rates');
    if(saved) ratesCache = JSON.parse(saved);
  }
};

// Get list for Dropdown
export const getCurrencyList = () => Object.keys(ratesCache).sort();

// Display Price (e.g. $10 -> €9.20)
export const formatPrice = (amountInUSD, currency) => {
  const code = currency.toUpperCase();
  const rate = ratesCache[code] || 1;
  const converted = amountInUSD * rate;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
    }).format(converted);
  } catch (e) {
    return `${code} ${converted.toFixed(2)}`;
  }
};

// Input: User types local currency -> Save as USD
export const convertLocalToUSD = (amount, localCurrency) => {
  if (!amount) return 0;
  const code = localCurrency.toUpperCase();
  const rate = ratesCache[code] || 1;
  return amount / rate;
};

// Edit: Load USD -> Show as local currency
export const convertUSDToLocal = (usdAmount, localCurrency) => {
  if (!usdAmount) return "";
  const code = localCurrency.toUpperCase();
  const rate = ratesCache[code] || 1;
  return (usdAmount * rate).toFixed(2);
};