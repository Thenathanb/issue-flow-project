'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

type DataPoint = {
  name: string
  value: number
  color: string
}

export default function IssueCharts({
  statusData,
  priorityData,
}: {
  statusData: DataPoint[]
  priorityData: DataPoint[]
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Issues by status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Issues by priority</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priorityData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {priorityData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
