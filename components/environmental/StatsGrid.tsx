const stats = [
  {label: "Total Records", value: "1,234"},
  {label: "Data Quality", value: "95.6%"},
  {label: "Active Sensors", value: "12"},
  {label: "Monitoring", value: "24/7"}
]

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
      {stats.map((stat) => (
        <div className="bg-white text-center bg-opacity-80 backdrop-blur p-6 rounded-lg border border-lime-300/50 shadow hover:shadow-lg transition" key={stat.label}>
          <div className="text-lime-500 text-3xl font-bold">{stat.value}</div>
          <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
export default StatsGrid;