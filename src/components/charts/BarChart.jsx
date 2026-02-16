import React from 'react'

const BarChart = ({ data, colors, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1)

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 sm:gap-4" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="w-full relative flex items-end h-full">
                 <div
                   className="w-full rounded-t-lg transition-all duration-500 ease-out hover:opacity-90 relative group-hover:scale-[1.02]"
                   style={{
                     height: `${percentage}%`,
                     backgroundColor: colors[index % colors.length] || colors[0],
                     minHeight: item.value > 0 ? '4px' : '0px'
                   }}
                 >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                       R$ {item.value.toFixed(2)}
                    </div>
                 </div>
              </div>
              <div className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400 text-center w-full truncate px-1">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Grid lines or Axis can be added here if needed */}
      <div className="border-t border-gray-100 dark:border-dark-border w-full mt-1"></div>
    </div>
  )
}

export default BarChart