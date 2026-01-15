
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
import { Upload, FileText, CheckCircle, AlertCircle, Download, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

interface DuplicateItem {
  csvRowIndex: number;
  csvData: CSVRow;
  existingId: string;
  existingData: any;
  matchField: string;
  matchValue: string;
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
  const [validCategories, setValidCategories] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateItem[]>([]);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [rowsToImport, setRowsToImport] = useState<CSVRow[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch valid categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      if (dataType === 'local_resources') {
        const { data } = await supabase
          .from('local_resources')
          .select('category');
        
        if (data) {
          const categories = [...new Set(data.map(item => item.category))].sort();
          setValidCategories(categories);
          console.log('📋 Valid local resource categories:', categories);
        }
      }
    };
    fetchCategories();
  }, [dataType]);

  // Sample CSV templates for different data types with longitude/latitude columns
  const csvTemplates = {
    events: `title,category,date,start_time,end_time,location,address,description,price,max_attendees,registration_required,neighborhoods,villages,website_link,longitude,latitude
Sample Community Event,Community,2024-12-25,10:00,12:00,Community Center,123 Main St Boston MA,A wonderful community gathering,0,50,false,Downtown,Back Bay,https://example.com,-71.0589,42.3601`,
    business: `title,business_type,address,neighborhood,description,short_description,website_link,villages,longitude,latitude
Sample Business,Restaurant,456 Main St Boston MA,Downtown,A great local restaurant,Great food and service,https://restaurant.com,Back Bay,-71.0589,42.3601`,
    local_resources: `name,category,address,neighborhood,village,description,latitude,longitude,website_link
Sample Resource,Healthcare / Community Clinic,789 Main St Boston MA,Downtown,Back Bay,A helpful community resource,42.3601,-71.0589,https://resource.com
Another Resource,Urban Agriculture / Community Space,456 Oak St Boston MA,South End,Dudley/Nubian Square,Educational urban farming,42.3301,-71.0829,https://education.com`
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

  // Detect the delimiter used in the CSV (comma, semicolon, or tab)
  const detectDelimiter = (line: string): string => {
    // Count occurrences of each potential delimiter
    const commas = (line.match(/,/g) || []).length;
    const semicolons = (line.match(/;/g) || []).length;
    const tabs = (line.match(/\t/g) || []).length;
    
    console.log('🔍 Delimiter detection:', { commas, semicolons, tabs });
    
    // Return the most common delimiter
    if (tabs >= commas && tabs >= semicolons && tabs > 0) {
      console.log('📋 Using TAB delimiter');
      return '\t';
    }
    if (semicolons > commas && semicolons > 0) {
      console.log('📋 Using SEMICOLON delimiter');
      return ';';
    }
    console.log('📋 Using COMMA delimiter');
    return ',';
  };

  // Improved CSV parsing function that handles quoted fields and various delimiters
  const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Handle escaped quotes
          current += '"';
          i += 2;
          continue;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field separator outside of quotes
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      i++;
    }

    // Add the last field
    result.push(current.trim());
    return result;
  };

  const previewCSV = async (file: File) => {
    try {
      const text = await file.text();
      
      // Debug: log raw file info
      console.log('📄 Raw file size:', text.length, 'characters');
      console.log('📄 First 500 chars:', text.substring(0, 500));
      
      // Handle both Windows (\r\n) and Unix (\n) line endings
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      
      if (lines.length === 0) {
        toast.error('CSV file is empty');
        return;
      }

      console.log('📄 First line (header):', lines[0]);
      console.log('📄 Number of lines:', lines.length);

      // Detect delimiter from the header line
      const delimiter = detectDelimiter(lines[0]);
      console.log('📋 Detected delimiter:', delimiter === '\t' ? 'TAB' : delimiter);

      const headers = parseCSVLine(lines[0], delimiter).map(h => h.replace(/"/g, '').trim());
      
      console.log('📋 CSV Headers detected:', headers);
      console.log('📋 Number of headers:', headers.length);
      
      // Preview first 5 rows
      const preview = lines.slice(1, 6).map((line, index) => {
        const values = parseCSVLine(line, delimiter).map(v => v.replace(/"/g, '').trim());
        const row: CSVRow = {};
        headers.forEach((header, headerIndex) => {
          row[header] = values[headerIndex] || '';
        });
        
        console.log(`📋 Preview row ${index + 1}:`, row);
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
    // Handle both Windows (\r\n) and Unix (\n) line endings
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Detect delimiter from the header line
    const delimiter = detectDelimiter(lines[0]);
    console.log('📊 Detected delimiter for import:', delimiter === '\t' ? 'TAB' : delimiter);

    const headers = parseCSVLine(lines[0], delimiter).map(h => h.replace(/"/g, '').trim().toLowerCase());
    
    console.log('📊 CSV Headers for import (normalized):', headers);
    console.log('📊 Number of headers:', headers.length);
    
    return lines.slice(1).map((line, index) => {
      const values = parseCSVLine(line, delimiter).map(v => v.replace(/"/g, '').trim());
      const row: CSVRow = {};
      headers.forEach((header, headerIndex) => {
        row[header] = values[headerIndex] || '';
      });
      
      console.log(`📊 Parsed row ${index + 2}:`, row);
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
        // Only name, category, address, and neighborhood are required
        if (!row.name || !row.category || !row.address || !row.neighborhood) {
          return 'Missing required fields: name, category, address, or neighborhood';
        }
        
        // Validate latitude and longitude if provided (optional)
        if (row.latitude || row.longitude) {
          const lat = parseFloat(row.latitude?.toString() || '');
          const lng = parseFloat(row.longitude?.toString() || '');
          if (isNaN(lat) || isNaN(lng)) {
            return 'Invalid latitude or longitude - must be valid numbers';
          }
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return 'Invalid coordinate ranges - latitude must be -90 to 90, longitude must be -180 to 180';
          }
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
          village: row.village,
          description: row.description,
          website_link: row.website_link,
        };
    }
  };

  // Check for duplicates in database
  const checkForDuplicates = async (rows: CSVRow[]): Promise<DuplicateItem[]> => {
    const foundDuplicates: DuplicateItem[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let matchField = '';
      let matchValue = '';
      let existingRecord = null;
      
      switch (dataType) {
        case 'events':
          matchField = 'title';
          matchValue = row.title;
          if (matchValue) {
            const { data } = await supabase
              .from('events')
              .select('id, title, date, location')
              .ilike('title', matchValue)
              .limit(1);
            if (data && data.length > 0) {
              existingRecord = data[0];
            }
          }
          break;
          
        case 'business':
          matchField = 'title';
          matchValue = row.title;
          if (matchValue) {
            const { data } = await supabase
              .from('business')
              .select('id, title, address, neighborhood')
              .ilike('title', matchValue)
              .limit(1);
            if (data && data.length > 0) {
              existingRecord = data[0];
            }
          }
          break;
          
        case 'local_resources':
          matchField = 'name';
          matchValue = row.name;
          if (matchValue) {
            const { data } = await supabase
              .from('local_resources')
              .select('id, name, address, category')
              .ilike('name', matchValue)
              .limit(1);
            if (data && data.length > 0) {
              existingRecord = data[0];
            }
          }
          break;
      }
      
      if (existingRecord) {
        foundDuplicates.push({
          csvRowIndex: i,
          csvData: row,
          existingId: existingRecord.id,
          existingData: existingRecord,
          matchField,
          matchValue
        });
      }
    }
    
    return foundDuplicates;
  };

  // Delete a single duplicate from database
  const deleteDuplicateFromDatabase = async (duplicate: DuplicateItem) => {
    setDeletingId(duplicate.existingId);
    try {
      const { error } = await supabase
        .from(dataType)
        .delete()
        .eq('id', duplicate.existingId);
      
      if (error) {
        toast.error(`Failed to delete: ${error.message}`);
        return;
      }
      
      // Remove from duplicates list
      setDuplicates(prev => prev.filter(d => d.existingId !== duplicate.existingId));
      toast.success(`Deleted existing ${dataType === 'local_resources' ? 'resource' : dataType === 'business' ? 'business' : 'event'}: "${duplicate.matchValue}"`);
    } catch (err: any) {
      toast.error(`Error deleting: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Remove row from import list (skip this duplicate)
  const skipDuplicateRow = (csvRowIndex: number) => {
    setRowsToImport(prev => prev.filter((_, i) => i !== csvRowIndex));
    setDuplicates(prev => prev.filter(d => d.csvRowIndex !== csvRowIndex));
    toast.info('Row removed from import list');
  };

  const handleCheckDuplicates = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }
    
    setIsCheckingDuplicates(true);
    try {
      const rows = await parseCSV(selectedFile);
      const filteredRows = rows.map(filterCSVData);
      setRowsToImport(filteredRows);
      
      const foundDuplicates = await checkForDuplicates(filteredRows);
      setDuplicates(foundDuplicates);
      
      if (foundDuplicates.length > 0) {
        toast.warning(`Found ${foundDuplicates.length} potential duplicate(s) in database`);
      } else {
        toast.success('No duplicates found! Ready to import.');
      }
    } catch (error: any) {
      toast.error(`Error checking duplicates: ${error.message}`);
    } finally {
      setIsCheckingDuplicates(false);
    }
  };
  
  // Filter out unwanted fields from CSV data
  const filterCSVData = (row: CSVRow): CSVRow => {
    const filteredRow = { ...row };
    // Remove state and zipcode fields if they exist
    delete filteredRow.state;
    delete filteredRow.zipcode;
    delete filteredRow.zip_code;
    delete filteredRow.zip;
    delete filteredRow.State;
    delete filteredRow.Zipcode;
    delete filteredRow.ZIP;
    delete filteredRow.ZIP_CODE;
    return filteredRow;
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Use rowsToImport if duplicates were checked, otherwise parse fresh
      const rows = rowsToImport.length > 0 ? rowsToImport : (await parseCSV(selectedFile)).map(filterCSVData);
      const result: ImportResult = {
        success: 0,
        errors: [],
        geocoded: 0,
        total: rows.length
      };

      console.log(`🚀 Starting CSV import: ${rows.length} rows for ${dataType}`);

      // Process each row with geocoding
      for (let i = 0; i < rows.length; i++) {
        const originalRow = rows[i];
        const row = filterCSVData(originalRow); // Filter out state and zipcode fields
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
    setDuplicates([]);
    setRowsToImport([]);
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

        {/* Valid Categories Display for Local Resources */}
        {dataType === 'local_resources' && validCategories.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">📋 Valid Categories for Local Resources:</p>
            <div className="text-xs text-blue-700 space-y-1 max-h-40 overflow-y-auto">
              {validCategories.map(cat => (
                <div key={cat} className="font-mono bg-white px-2 py-1 rounded">• {cat}</div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3 italic">
              ⚠️ Use these exact category names (including capitalization and spaces) in your CSV file
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

        {/* Duplicates Warning Section */}
        {duplicates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              <Label className="text-amber-700 font-semibold">
                {duplicates.length} Potential Duplicate(s) Found
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              The following items in your CSV match existing records in the database. You can delete the existing record to allow import, or skip the row.
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-amber-50">
              {duplicates.map((dup) => (
                <div key={dup.existingId} className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-amber-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">"{dup.matchValue}"</p>
                    <p className="text-xs text-muted-foreground">
                      CSV Row {dup.csvRowIndex + 2} matches existing {dataType === 'local_resources' ? 'resource' : dataType === 'business' ? 'business' : 'event'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Existing: {dup.existingData.address || dup.existingData.location || 'No address'}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => skipDuplicateRow(dup.csvRowIndex)}
                    >
                      Skip Row
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === dup.existingId}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deletingId === dup.existingId ? 'Deleting...' : 'Delete Existing'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Existing Record?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{dup.matchValue}" from the database. 
                            The CSV row will then be imported as a new record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDuplicateFromDatabase(dup)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleCheckDuplicates}
            disabled={!selectedFile || isUploading || isCheckingDuplicates}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {isCheckingDuplicates ? 'Checking...' : 'Check for Duplicates'}
          </Button>
          
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV {rowsToImport.length > 0 && `(${rowsToImport.length} rows)`}
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
