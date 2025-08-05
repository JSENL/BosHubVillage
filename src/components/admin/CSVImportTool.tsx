import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

type DataType = 'events' | 'business' | 'local_resources';

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: any }>;
  total: number;
}

interface CSVRow {
  [key: string]: string;
}

export const CSVImportTool = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('events');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Sample CSV templates for different data types
  const csvTemplates = {
    events: `title,category,date,start_time,end_time,location,address,description,price,max_attendees,registration_required,neighborhoods,villages,website_link
Sample Community Event,Community,2024-12-25,10:00,12:00,Community Center,123 Main St Boston MA,A wonderful community gathering,0,50,false,Downtown,Back Bay,https://example.com`,
    business: `title,business_type,address,neighborhood,description,short_description,website_link,villages
Sample Business,Restaurant,456 Main St Boston MA,Downtown,A great local restaurant,Great food and service,https://restaurant.com,Back Bay`,
    local_resources: `name,category,address,neighborhood,description,website_link,village
Sample Resource,Healthcare,789 Main St Boston MA,Downtown,A helpful community resource,https://resource.com,Back Bay`
  };

  const downloadTemplate = (type: DataType) => {
    const csvContent = csvTemplates[type];
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      previewCSV(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const previewCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Preview first 5 rows
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: CSVRow = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing CSV:', error);
      toast.error('Error reading CSV file');
    }
  };

  const parseCSV = async (file: File): Promise<CSVRow[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const validateRow = (row: CSVRow, type: DataType): string | null => {
    switch (type) {
      case 'events':
        if (!row.title || !row.category || !row.date || !row.location) {
          return 'Missing required fields: title, category, date, or location';
        }
        // Validate date format
        if (row.date && !Date.parse(row.date)) {
          return 'Invalid date format. Use YYYY-MM-DD';
        }
        break;
      
      case 'business':
        if (!row.title || !row.business_type || !row.address || !row.neighborhood) {
          return 'Missing required fields: title, business_type, address, or neighborhood';
        }
        break;
      
      case 'local_resources':
        if (!row.name || !row.category || !row.address || !row.neighborhood) {
          return 'Missing required fields: name, category, address, or neighborhood';
        }
        break;
      
      default:
        return 'Invalid data type';
    }
    return null;
  };

  const transformRowForDatabase = (row: CSVRow, type: DataType): any => {
    const baseTransform = {
      created_by: user?.id,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
    };

    switch (type) {
      case 'events':
        return {
          ...baseTransform,
          title: row.title,
          category: row.category,
          date: row.date,
          start_time: row.start_time || null,
          end_time: row.end_time || null,
          location: row.location,
          address: row.address || null,
          description: row.description || null,
          price: row.price ? parseFloat(row.price) : 0,
          max_attendees: row.max_attendees ? parseInt(row.max_attendees) : null,
          registration_required: row.registration_required === 'true',
          neighborhoods: row.neighborhoods || null,
          villages: row.villages || null,
          website_link: row.website_link || null,
          event_type: 'event',
          is_recurring: false,
        };
      
      case 'business':
        return {
          ...baseTransform,
          title: row.title,
          business_type: row.business_type,
          address: row.address,
          neighborhood: row.neighborhood,
          description: row.description || null,
          short_description: row.short_description || null,
          website_link: row.website_link || null,
          villages: row.villages || null,
        };
      
      case 'local_resources':
        return {
          ...baseTransform,
          name: row.name,
          category: row.category,
          address: row.address,
          neighborhood: row.neighborhood,
          description: row.description || null,
          website_link: row.website_link || null,
          village: row.village || null,
        };
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Parse CSV
      const rows = await parseCSV(selectedFile);
      const result: ImportResult = {
        success: 0,
        errors: [],
        total: rows.length
      };

      // Process each row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setUploadProgress(((i + 1) / rows.length) * 100);

        // Validate row
        const validationError = validateRow(row, dataType);
        if (validationError) {
          result.errors.push({
            row: i + 2, // +2 because CSV has header row and we're 0-indexed
            error: validationError,
            data: row
          });
          continue;
        }

        try {
          // Transform and insert data
          const transformedData = transformRowForDatabase(row, dataType);
          
          const { error } = await supabase
            .from(dataType)
            .insert([transformedData]);

          if (error) {
            result.errors.push({
              row: i + 2,
              error: error.message,
              data: row
            });
          } else {
            result.success++;
          }
        } catch (error: any) {
          result.errors.push({
            row: i + 2,
            error: error.message || 'Unknown error',
            data: row
          });
        }
      }

      setImportResult(result);
      
      if (result.success > 0) {
        toast.success(`Successfully imported ${result.success} out of ${result.total} records`);
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} records failed to import`);
      }

    } catch (error: any) {
      console.error('Import error:', error);
      toast.error('Failed to import CSV file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setImportResult(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          CSV Import Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="dataType">Data Type</Label>
          <Select value={dataType} onValueChange={(value: DataType) => setDataType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="business">Businesses</SelectItem>
              <SelectItem value="local_resources">Local Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Template Download */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => downloadTemplate(dataType)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>
          <span className="text-sm text-gray-600">Use this template to format your data correctly</span>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="csvFile">CSV File</Label>
          <Input
            ref={fileInputRef}
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>

        {/* Preview */}
        {showPreview && previewData.length > 0 && (
          <div className="space-y-2">
            <Label>Preview (First 5 rows)</Label>
            <div className="border rounded-lg overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).map(header => (
                      <th key={header} className="px-2 py-1 text-left border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
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
        )}

        {/* Import Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Label>Import Progress</Label>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-600">Processing... {Math.round(uploadProgress)}%</p>
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <div className="space-y-4">
            <Label>Import Results</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">{importResult.success}</p>
                    <p className="text-sm text-green-600">Successful</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">{importResult.errors.length}</p>
                    <p className="text-sm text-red-600">Failed</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">{importResult.total}</p>
                    <p className="text-sm text-blue-600">Total Rows</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Details */}
            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <Label>Error Details</Label>
                <Textarea
                  value={importResult.errors.map(
                    error => `Row ${error.row}: ${error.error}`
                  ).join('\n')}
                  readOnly
                  className="h-32 font-mono text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          
          <Button
            variant="outline"
            onClick={resetImport}
            disabled={isUploading}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};