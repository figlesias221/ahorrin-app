'use client';

interface ComparisonTableProps {
  headers: string[];
  rows: {
    [key: string]: string | number;
  }[];
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-blue-200 shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 text-left font-semibold text-blue-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            // Get values in the same order as they appear in the object
            const values = Object.values(row);
            return (
              <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                {values.map((value, cellIndex) => (
                  <td key={cellIndex} className="border-b border-blue-100 px-4 py-3 text-sm">
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
