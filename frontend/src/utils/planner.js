const GOAL_ADJUST = { fat_loss: -400, weight_gain: 400, muscle: 250, strength: 150 }

const WORKOUTS = {
  fat_loss: ['Day 1: Full-body strength + 20 min HIIT', 'Day 2: Steady-state cardio 40 min', 'Day 3: Upper body + core circuit', 'Day 4: Active recovery / mobility', 'Day 5: Lower body + 15 min HIIT', 'Day 6: Cardio + abs', 'Day 7: Rest'],
  weight_gain: ['Day 1: Chest & Triceps (heavy)', 'Day 2: Back & Biceps (heavy)', 'Day 3: Rest / light cardio', 'Day 4: Legs & Glutes', 'Day 5: Shoulders & Arms', 'Day 6: Full-body volume', 'Day 7: Rest'],
  muscle: ['Day 1: Push (Chest/Shoulders/Triceps)', 'Day 2: Pull (Back/Biceps)', 'Day 3: Legs', 'Day 4: Rest', 'Day 5: Upper hypertrophy', 'Day 6: Lower hypertrophy', 'Day 7: Rest'],
  strength: ['Day 1: Squat focus (5x5)', 'Day 2: Bench focus (5x5)', 'Day 3: Rest', 'Day 4: Deadlift focus (3x5)', 'Day 5: Overhead Press (5x5)', 'Day 6: Accessory & core', 'Day 7: Rest'],
}

const NUTRITION = {
  fat_loss: 'High protein, moderate carbs around workouts, plenty of vegetables and water. Prioritise a calorie deficit.',
  weight_gain: 'Calorie surplus with frequent meals, calorie-dense whole foods, and a shake between meals.',
  muscle: 'Protein every 3-4 hours, carbs around training, healthy fats. Slight surplus for lean gains.',
  strength: 'Adequate carbs to fuel heavy lifts, high protein for recovery, maintenance-to-slight surplus.',
}

export const GOALS = [
  { value: 'fat_loss', label: 'Fat Loss' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'muscle', label: 'Muscle Building' },
  { value: 'strength', label: 'Strength' },
]

export function buildPlan({ age, gender, height, weight, goal }) {
  const a = +age, h = +height, w = +weight
  const bmr = gender === 'female' ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5
  const tdee = Math.round(bmr * 1.55)
  const calories = Math.max(1200, tdee + GOAL_ADJUST[goal])
  const protein = Math.round(w * (goal === 'fat_loss' ? 2.2 : 2))
  const fats = Math.round((calories * 0.25) / 9)
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4)
  return { calories, protein, carbs, fats, workouts: WORKOUTS[goal], nutrition: NUTRITION[goal] }
}
