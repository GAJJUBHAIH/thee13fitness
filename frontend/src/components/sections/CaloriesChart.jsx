import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function CaloriesChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="rgb(var(--color-text))" opacity={0.5} fontSize={11} />
          <YAxis stroke="rgb(var(--color-text))" opacity={0.5} fontSize={11} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgba(var(--color-primary), 0.4)', borderRadius: 12, color: 'rgb(var(--color-text))' }} />
          <Bar dataKey="calories" fill="rgb(var(--color-primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
