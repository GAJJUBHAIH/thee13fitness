export const MEMBERSHIP = [
  {
    title: 'Non Cardio',
    popular: false,
    tiers: [
      { label: 'Monthly', price: 700 },
      { label: '3 Month', price: 1800, save: 'Save ₹300' },
      { label: '6 Month', price: 3200, save: 'Save ₹1000' },
      { label: '12 Month', price: 4500, save: 'Best Value' },
    ],
    perks: ['Full gym floor access', 'Free weights & machines', 'Locker facility'],
  },
  {
    title: 'Cardio',
    popular: true,
    tiers: [
      { label: 'Monthly', price: 800 },
      { label: '3 Month', price: 2100, save: 'Save ₹300' },
      { label: '6 Month', price: 4000, save: 'Save ₹800' },
      { label: '12 Month', price: 6000, save: 'Best Value' },
    ],
    perks: ['Everything in Non Cardio', 'Full cardio zone', 'Steam cabinet access'],
  },
]

export const TRAINER_PLANS = [
  { months: '1 Month', sessions: 24, price: 2500, popular: false },
  { months: '2 Month', sessions: 48, price: 4000, popular: true },
  { months: '3 Month', sessions: 72, price: 5500, popular: false },
]
