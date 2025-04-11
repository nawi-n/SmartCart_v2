// components/ui/chart.tsx
import type React from "react"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  showAnimation?: boolean
  layout?: "vertical" | "horizontal"
}

export const BarChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  showLegend,
  showXAxis,
  showYAxis,
  showGridLines,
  layout,
}) => {
  return (
    <div>
      {/* Placeholder for BarChart */}
      <div>BarChart: {data.length} data points</div>
    </div>
  )
}

export const LineChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  showLegend,
  showXAxis,
  showYAxis,
  showGridLines,
}) => {
  return (
    <div>
      {/* Placeholder for LineChart */}
      <div>LineChart: {data.length} data points</div>
    </div>
  )
}

export const PieChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  showLegend,
  showAnimation,
}) => {
  return (
    <div>
      {/* Placeholder for PieChart */}
      <div>PieChart: {data.length} data points</div>
    </div>
  )
}
