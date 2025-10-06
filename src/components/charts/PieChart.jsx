import React from 'react'

const PieChart = ({ data, colors, width = 200, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width, height }}>
        <div className="text-gray-400 text-sm">Sem dados</div>
      </div>
    )
  }

  let currentAngle = 0

  const segments = data.map((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const largeArc = percentage > 0.5 ? 1 : 0
    
    const x1 = Math.cos(currentAngle * Math.PI / 180) * 80 + 100
    const y1 = Math.sin(currentAngle * Math.PI / 180) * 80 + 100
    
    currentAngle += angle
    
    const x2 = Math.cos(currentAngle * Math.PI / 180) * 80 + 100
    const y2 = Math.sin(currentAngle * Math.PI / 180) * 80 + 100

    const pathData = [
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
        stroke="#fff"
        strokeWidth="2"
      />
    )
  })

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox="0 0 200 200">
        {segments}
        <circle cx="100" cy="100" r="60" fill="white" />
        <text x="100" y="95" textAnchor="middle" fontSize="18" fontWeight="bold">
          {total > 0 ? '100%' : '0%'}
        </text>
        <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#666">
          Total
        </text>
      </svg>
      
      <div className="mt-4 space-y-2 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-gray-700">{item.label}</span>
            </div>
            <span className="font-medium text-gray-900">
              {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart