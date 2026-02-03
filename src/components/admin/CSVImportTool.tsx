import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, MapPin, Search, RefreshCw } from 'lucide-react';

import { useCSVImport } from '@/hooks/useCSVImport';
import { DataType, downloadTemplate } from '@/utils/csv';
import { CSVPreviewTable, CSVImportResults, CSVDuplicatesPanel } from './csv';

export const CSVImportTool = () => {
  const {
    fileInputRef,
    selectedFile,
    dataType,
    isUploading,
    uploadProgress,
    previewData,
    importResult,
    showPreview,
    validCategories,
    duplicates,
    isCheckingDuplicates,
    rowsToImport,
    deletingId,
    setDataType,
    handleFileSelect,
    handleCheckDuplicates,
    deleteDuplicateFromDatabase,
    skipDuplicateRow,
    handleImport,
    resetImport,
  } = useCSVImport();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0] || null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          CSV Import Tool
          <span className="text-sm text-gray-500 font-normal">
            Import data with automatic geocoding for map display
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="dataType">Data Type</Label>
          <Select
            value={dataType}
            onValueChange={(value: DataType) => setDataType(value)}
          >
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

        {/* Valid Categories Display for Local Resources */}
        {dataType === 'local_resources' && validCategories.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              📋 Valid Categories for Local Resources:
            </p>
            <div className="text-xs text-blue-700 space-y-1 max-h-40 overflow-y-auto">
              {validCategories.map(cat => (
                <div key={cat} className="font-mono bg-white px-2 py-1 rounded">
                  • {cat}
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3 italic">
              ⚠️ Use these exact category names in your CSV file
            </p>
          </div>
        )}

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
          <span className="text-sm text-gray-600">
            Use this template to format your data correctly
          </span>
        </div>

        {/* Geocoding Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Enhanced Map Integration</p>
              <p className="text-sm text-blue-700 mt-1">
                CSV templates include <strong>longitude</strong> and <strong>latitude</strong>{' '}
                columns. Provide coordinates directly, or the system will geocode addresses
                automatically.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="csvFile">CSV File</Label>
          <Input
            ref={fileInputRef}
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={onFileChange}
            disabled={isUploading}
          />
        </div>

        {/* Preview */}
        {showPreview && previewData.length > 0 && (
          <CSVPreviewTable data={previewData} />
        )}

        {/* Import Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Label>Import Progress</Label>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-600">
              Processing and geocoding... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        {/* Import Results */}
        {importResult && <CSVImportResults result={importResult} />}

        {/* Duplicates Warning Section */}
        <CSVDuplicatesPanel
          duplicates={duplicates}
          dataType={dataType}
          deletingId={deletingId}
          onSkip={skipDuplicateRow}
          onDelete={deleteDuplicateFromDatabase}
        />

        {/* Action Buttons */}
        {selectedFile && !importResult && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleCheckDuplicates}
              disabled={isUploading || isCheckingDuplicates}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isCheckingDuplicates ? 'Checking...' : 'Check for Duplicates'}
            </Button>
            <Button
              onClick={handleImport}
              disabled={isUploading || isCheckingDuplicates}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading
                ? 'Importing...'
                : `Import ${rowsToImport.length || 'All'} Rows`}
            </Button>
          </div>
        )}

        {/* Reset Button */}
        {(importResult || selectedFile) && (
          <Button
            variant="outline"
            onClick={resetImport}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Start New Import
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
