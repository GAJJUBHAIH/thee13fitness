export function calculateBMI(heightCm, weightKg) {
  const h = parseFloat(heightCm) / 100
  const w = parseFloat(weightKg)
  if (!h || !w) return null
  return +(w / (h * h)).toFixed(1)
}

export function classifyBMI(bmi) {
  if (bmi < 18.5) return { cat: 'Underweight', color: 'text-yellow-300', advice: 'Increase calorie intake with nutrient-dense foods and resistance training to build mass.' }
  if (bmi < 25) return { cat: 'Normal', color: 'text-neon', advice: 'Great range. Maintain with balanced nutrition and consistent training.' }
  if (bmi < 30) return { cat: 'Overweight', color: 'text-orange-400', advice: 'Add cardio and a slight calorie deficit. Keep protein high to preserve muscle.' }
  return { cat: 'Obese', color: 'text-red-400', advice: 'Prioritise a structured deficit, daily activity and consult a coach for a safe plan.' }
}
