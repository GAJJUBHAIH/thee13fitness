import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function WeightChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="primaryFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="rgb(var(--color-text))" opacity={0.5} fontSize={11} />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="rgb(var(--color-text))" opacity={0.5} fontSize={11} />
          <Tooltip contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgba(var(--color-primary), 0.4)', borderRadius: 12, color: 'rgb(var(--color-text))' }} />
          <Area type="monotone" dataKey="kg" stroke="rgb(var(--color-primary))" strokeWidth={2} fill="url(#primaryFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
