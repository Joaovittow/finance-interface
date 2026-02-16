import React from 'react'

const PieChart = ({ data, colors, width = 200, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-dark-border/10 rounded-xl" style={{ width: '100%', minHeight: height }}>
        <div className="text-gray-400 dark:text-gray-500 text-sm">Sem dados para exibir</div>
      </div>
    )
  }

  let currentAngle = 0

  const segments = data.map((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const largeArc = percentage > 0.5 ? 1 : 0
    
    const x1 = Math.cos((currentAngle - 90) * Math.PI / 180) * 80 + 100
    const y1 = Math.sin((currentAngle - 90) * Math.PI / 180) * 80 + 100
    
    currentAngle += angle
    
    const x2 = Math.cos((currentAngle - 90) * Math.PI / 180) * 80 + 100
    const y2 = Math.sin((currentAngle - 90) * Math.PI / 180) * 80 + 100

    // If full circle
    const pathData = percentage === 1 
      ? `M 100 100 m -80 0 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0`
      : [
        `M 100 100`,
        `L ${x1} ${y1}`,
        `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

    return (
      <path
        key={index}
        d={pathData}
        fill={colors[index % colors.length]}
        className="stroke-white dark:stroke-dark-card transition-all duration-300 hover:opacity-90 cursor-pointer"
        strokeWidth="2"
      />
    )
  })

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <svg width={width} height={height} viewBox="0 0 200 200" className="transform transition-transform">
          {segments}
          <circle cx="100" cy="100" r="60" className="fill-white dark:fill-dark-card" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</span>
           <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</span>
        </div>
      </div>
      
      <div className="mt-6 space-y-3 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
            </div>
            <div className="text-right">
               <span className="block font-bold text-gray-900 dark:text-gray-100">
                  {((item.value / total) * 100).toFixed(1)}%
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart