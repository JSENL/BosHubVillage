import { Label } from '@/components/ui/label';
import { CSVRow } from '@/utils/csv';

interface CSVPreviewTableProps {
  data: CSVRow[];
}

export const CSVPreviewTable = ({ data }: CSVPreviewTableProps) => {
  if (data.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>Preview (First 5 rows)</Label>
      <div className="border rounded-lg overflow-auto max-h-64">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0]).map(header => (
                <th key={header} className="px-2 py-1 text-left border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex} className="px-2 py-1 border-r">
                    {value}
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
