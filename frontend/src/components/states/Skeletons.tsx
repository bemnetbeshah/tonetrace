import React from 'react';

export const KpiSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
      
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
      <div className="p-6 border-b border-gray-200">
        <div className="h-10 bg-gray-200 rounded w-64"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(6)].map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(6)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="h-4 bg-gray-200 rounded w-48 mt-2 mx-auto"></div>
    </div>
  );
};

export const RowSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
