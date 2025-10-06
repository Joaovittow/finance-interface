import React from 'react'

const BarChart = ({ data, colors, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1)
  const barWidth = 100 / data.length

  return (
    <div className="w-full">
      <div className="flex items-end justify-between" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 80
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: colors[index % colors.length],
                  minHeight: item.value > 0 ? '8px' : '0px'
                }}
                title={`${item.label}: ${item.value}`}
              />
              <div className="mt-2 text-xs text-gray-600 text-center whitespace-nowrap overflow-hidden overflow-ellipsis w-full">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <span>0</span>
        <span>{maxValue}</span>
      </div>
    </div>
  )
}

export default BarChart