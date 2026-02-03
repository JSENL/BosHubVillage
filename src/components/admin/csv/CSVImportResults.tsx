import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, MapPin, FileText } from 'lucide-react';
import { ImportResult } from '@/hooks/useCSVImport';

interface CSVImportResultsProps {
  result: ImportResult;
}

export const CSVImportResults = ({ result }: CSVImportResultsProps) => {
  return (
    <div className="space-y-4">
      <Label>Import Results</Label>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">{result.success}</p>
              <p className="text-sm text-green-600">Successful</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">{result.errors.length}</p>
              <p className="text-sm text-red-600">Failed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">{result.geocoded}</p>
              <p className="text-sm text-blue-600">With Coordinates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-800">{result.total}</p>
              <p className="text-sm text-gray-600">Total Rows</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {result.errors.length > 0 && (
        <div className="space-y-2">
          <Label>Error Details</Label>
          <Textarea
            value={result.errors.map(error => `Row ${error.row}: ${error.error}`).join('\n')}
            readOnly
            className="h-32 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
};
