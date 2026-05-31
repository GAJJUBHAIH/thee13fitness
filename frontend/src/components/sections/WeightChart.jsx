import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function WeightChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="neonFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#39FF14" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#39FF14" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="#5b6b5b" fontSize={11} />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#5b6b5b" fontSize={11} />
          <Tooltip contentStyle={{ background: '#0a0d0f', border: '1px solid rgba(57,255,20,0.4)', borderRadius: 12, color: '#e6f5e6' }} />
          <Area type="monotone" dataKey="kg" stroke="#39FF14" strokeWidth={2} fill="url(#neonFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
