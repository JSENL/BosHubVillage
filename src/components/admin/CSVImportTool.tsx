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
import { useGeocoding } from '@/hooks/useGeocoding';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle, Download, MapPin } from 'lucide-react';

type DataType = 'events' | 'business' | 'local_resources';

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: any }>;
  geocoded: number;
  total: number;
}

interface CSVRow {
  [key: string]: string;
}

export const CSVImportTool = () => {
  const { user } = useAuth();
  const { geocode } = useGeocoding();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('events');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Sample CSV templates for different data types with longitude/latitude columns
  const csvTemplates = {
    events: `title,category,date,start_time,end_time,location,address,description,price,max_attendees,registration_required,neighborhoods,villages,website_link,longitude,latitude
Sample Community Event,Community,2024-12-25,10:00,12:00,Community Center,123 Main St Boston MA,A wonderful community gathering,0,50,false,Downtown,Back Bay,https://example.com,-71.0589,42.3601`,
    business: `title,business_type,address,neighborhood,description,short_description,website_link,villages,longitude,latitude
Sample Business,Restaurant,456 Main St Boston MA,Downtown,A great local restaurant,Great food and service,https://restaurant.com,Back Bay,-71.0589,42.3601`,
    local_resources: `name,category,address,neighborhood,village,description,website_link,longitude,latitude
Sample Resource,Healthcare,789 Main St,Downtown,Back Bay,A helpful community resource,https://resource.com,-71.0589,42.3601`
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

  const geocodeAddress = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const result = await geocode(address);
      if (result) {
        return {
          latitude: result.latitude,
          longitude: result.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  };

  const transformRowForDatabase = async (row: CSVRow, type: DataType): Promise<any> => {
    // Base transform - only include created_by for tables that have it
    const baseTransform: any = {
      latitude: null,
      longitude: null,
    };

    // Only add created_by for tables that have this column
    if (type !== 'local_resources') {
      baseTransform.created_by = user?.id;
    }

    console.log(`🔍 Processing row for "${row.title || row.name}":`, {
      providedLng: row.longitude,
      providedLat: row.latitude,
      address: row.address || row.location
    });

    // First, check if longitude and latitude are provided in the CSV
    if (row.longitude && row.latitude) {
      const lng = parseFloat(row.longitude.toString().trim());
      const lat = parseFloat(row.latitude.toString().trim());
      
      console.log(`📊 Parsing coordinates:`, {
        rawLng: row.longitude,
        rawLat: row.latitude,
        parsedLng: lng,
        parsedLat: lat,
        lngValid: !isNaN(lng),
        latValid: !isNaN(lat)
      });
      
      if (!isNaN(lng) && !isNaN(lat)) {
        // Validate coordinate ranges
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          baseTransform.longitude = lng;
          baseTransform.latitude = lat;
          console.log(`✅ Using provided coordinates for "${row.title || row.name}":`, { lat, lng });
        } else {
          console.warn(`❌ Invalid coordinate ranges for "${row.title || row.name}":`, { lat, lng });
        }
      } else {
        console.warn(`❌ Could not parse coordinates for "${row.title || row.name}":`, { 
          longitude: row.longitude, 
          latitude: row.latitude 
        });
      }
    }
    
    // If no valid coordinates provided, attempt geocoding if address is available
    if (!baseTransform.latitude || !baseTransform.longitude) {
      const addressField = row.address || row.location;
      if (addressField) {
        // Enhance address with neighborhood and city for better geocoding
        let enhancedAddress = addressField;
        if (row.neighborhood) {
          enhancedAddress += `, ${row.neighborhood}`;
        }
        // Always add Boston, MA for local resources to ensure correct geocoding
        if (type === 'local_resources') {
          enhancedAddress += ', Boston, MA';
        }
        
        console.log(`🗺️ Attempting to geocode enhanced address: "${enhancedAddress}"`);
        const coords = await geocodeAddress(enhancedAddress);
        if (coords) {
          // Ensure coordinates are properly converted to numbers for database storage
          baseTransform.latitude = Number(coords.latitude);
          baseTransform.longitude = Number(coords.longitude);
          console.log(`🎯 Geocoded coordinates for "${row.title || row.name}":`, {
            lat: baseTransform.latitude,
            lng: baseTransform.longitude,
            type: typeof baseTransform.latitude
          });
        } else {
          console.warn(`❌ Geocoding failed for "${row.title || row.name}" with address: "${enhancedAddress}"`);
        }
      } else {
        console.warn(`⚠️ No address available for geocoding "${row.title || row.name}"`);
      }
    }

    console.log(`🏁 Final coordinates for "${row.title || row.name}":`, {
      latitude: baseTransform.latitude,
      longitude: baseTransform.longitude
    });

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
          description: row.description || 'No description provided', // Required field, provide default
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
        geocoded: 0,
        total: rows.length
      };

      console.log(`🚀 Starting CSV import: ${rows.length} rows for ${dataType}`);

      // Process each row with geocoding
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setUploadProgress(((i + 1) / rows.length) * 100);

        console.log(`📝 Processing row ${i + 1}/${rows.length}:`, row);

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
          // Transform and geocode data
          const transformedData = await transformRowForDatabase(row, dataType);
          
          // Track if geocoding was successful
          if (transformedData.latitude && transformedData.longitude) {
            result.geocoded++;
            console.log(`📍 Coordinates available for "${row.title || row.name}":`, 
              { lat: transformedData.latitude, lng: transformedData.longitude });
          }
          
          console.log(`💾 Inserting into ${dataType} table:`, transformedData);
          
          const { error } = await supabase
            .from(dataType)
            .insert([transformedData]);

          if (error) {
            console.error(`❌ Database error for row ${i + 2}:`, error);
            result.errors.push({
              row: i + 2,
              error: error.message,
              data: row
            });
          } else {
            result.success++;
            console.log(`✅ Successfully inserted row ${i + 2}`);
          }
        } catch (error: any) {
          console.error(`❌ Processing error for row ${i + 2}:`, error);
          result.errors.push({
            row: i + 2,
            error: error.message || 'Unknown error',
            data: row
          });
        }
      }

      setImportResult(result);
      
      console.log(`🎉 Import completed:`, {
        successful: result.success,
        failed: result.errors.length,
        geocoded: result.geocoded,
        total: result.total
      });
      
      if (result.success > 0) {
        toast.success(`Successfully imported ${result.success} out of ${result.total} records${result.geocoded > 0 ? ` (${result.geocoded} with coordinates for map display)` : ''}`);
        
        // If importing local_resources and some don't have coordinates, suggest using geocode button
        if (dataType === 'local_resources' && result.success > result.geocoded) {
          const missingCoords = result.success - result.geocoded;
          toast.info(`${missingCoords} local resources need geocoding. Use the "Geocode All Local Resources" button in the Local Services tab to add map markers.`);
        }
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} records failed to import`);
      }

    } catch (error: any) {
      console.error('❌ Import error:', error);
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
          <span className="text-sm text-gray-500 font-normal">
            Import data with automatic geocoding for map display
          </span>
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

        {/* Geocoding Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Enhanced Map Integration</p>
              <p className="text-sm text-blue-700 mt-1">
                The CSV templates now include <strong>longitude</strong> and <strong>latitude</strong> columns. 
                If you provide coordinates, they will be used directly for map markers. 
                If coordinates are missing or invalid, the system will automatically geocode addresses using Mapbox.
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
            <p className="text-sm text-gray-600">
              Processing and geocoding... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <div className="space-y-4">
            <Label>Import Results</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">{importResult.geocoded}</p>
                    <p className="text-sm text-blue-600">With Coordinates</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{importResult.total}</p>
                    <p className="text-sm text-gray-600">Total Rows</p>
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

        {/* Success Notice */}
        {importResult && importResult.success > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Import Successful!</p>
                <p className="text-sm text-green-700 mt-1">
                  Your data has been imported into the Supabase database. 
                  {importResult.geocoded > 0 && ` ${importResult.geocoded} items with coordinates will now appear on the map.`}
                  {' '}Refresh the map view to see your new markers.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
