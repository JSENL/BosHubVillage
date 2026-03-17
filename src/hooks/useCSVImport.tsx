/**
 * CSV Import Hook
 * Handles CSV file processing, duplicate checking, and database import
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGeocoding } from '@/hooks/useGeocoding';
import { toast } from 'sonner';
import {
  CSVRow,
  DataType,
  parseCSV,
  parseCSVPreview,
  filterCSVData,
  validateRow,
  transformRowForDatabase,
} from '@/utils/csv';

export interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: CSVRow }>;
  geocoded: number;
  total: number;
}

export interface DuplicateItem {
  csvRowIndex: number;
  csvData: CSVRow;
  existingId: string;
  existingData: Record<string, unknown>;
  matchField: string;
  matchValue: string;
}

export const useCSVImport = () => {
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

  // Fetch valid categories for local_resources
  useEffect(() => {
    const fetchCategories = async () => {
      if (dataType === 'local_resources') {
        const { data } = await supabase
          .from('local_resources')
          .select('category');

        if (data) {
          const categories = [...new Set(data.map(item => item.category))].sort();
          setValidCategories(categories);
        }
      }
    };
    fetchCategories();
  }, [dataType]);

  const geocodeAddress = useCallback(
    async (address: string) => {
      try {
        const result = await geocode(address);
        return result ? { latitude: result.latitude, longitude: result.longitude } : null;
      } catch {
        return null;
      }
    },
    [geocode]
  );

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file || file.type !== 'text/csv') {
      toast.error('Please select a valid CSV file');
      return;
    }

    setSelectedFile(file);
    try {
      const text = await file.text();
      const preview = parseCSVPreview(text, 5);
      setPreviewData(preview);
      setShowPreview(true);
    } catch {
      toast.error('Error reading CSV file');
    }
  }, []);

  const checkForDuplicates = useCallback(
    async (rows: CSVRow[]): Promise<DuplicateItem[]> => {
      const foundDuplicates: DuplicateItem[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let matchField = '';
        let matchValue = '';
        let existingRecord = null;

        const tableName = dataType;
        const searchField = dataType === 'local_resources' ? 'name' : 'title';
        matchField = searchField;
        matchValue = row[searchField];

        if (matchValue) {
          const selectFields =
            dataType === 'events'
              ? 'id, title, date, location'
              : dataType === 'business'
              ? 'id, title, address, neighborhood'
              : 'id, name, address, category';

          const { data } = await supabase
            .from(tableName)
            .select(selectFields)
            .ilike(searchField, matchValue)
            .limit(1);

          if (data && data.length > 0) {
            existingRecord = data[0];
          }
        }

        if (existingRecord) {
          foundDuplicates.push({
            csvRowIndex: i,
            csvData: row,
            existingId: existingRecord.id,
            existingData: existingRecord,
            matchField,
            matchValue,
          });
        }
      }

      return foundDuplicates;
    },
    [dataType]
  );

  const handleCheckDuplicates = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    setIsCheckingDuplicates(true);
    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text).map(filterCSVData);
      setRowsToImport(rows);

      const foundDuplicates = await checkForDuplicates(rows);
      setDuplicates(foundDuplicates);

      if (foundDuplicates.length > 0) {
        toast.warning(`Found ${foundDuplicates.length} potential duplicate(s) in database`);
      } else {
        toast.success('No duplicates found! Ready to import.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error checking duplicates: ${message}`);
    } finally {
      setIsCheckingDuplicates(false);
    }
  }, [selectedFile, checkForDuplicates]);

  const deleteDuplicateFromDatabase = useCallback(
    async (duplicate: DuplicateItem) => {
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

        setDuplicates(prev => prev.filter(d => d.existingId !== duplicate.existingId));
        toast.success(`Deleted existing record: "${duplicate.matchValue}"`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        toast.error(`Error deleting: ${message}`);
      } finally {
        setDeletingId(null);
      }
    },
    [dataType]
  );

  const skipDuplicateRow = useCallback((csvRowIndex: number) => {
    setRowsToImport(prev => prev.filter((_, i) => i !== csvRowIndex));
    setDuplicates(prev => prev.filter(d => d.csvRowIndex !== csvRowIndex));
    toast.info('Row removed from import list');
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setImportResult(null);

    try {
      const text = await selectedFile.text();
      let rows: CSVRow[];
      try {
        rows = rowsToImport.length > 0 ? rowsToImport : parseCSV(text).map(filterCSVData);
      } catch (parseErr) {
        const message = parseErr instanceof Error ? parseErr.message : 'Invalid CSV';
        toast.error(message);
        setImportResult({
          success: 0,
          errors: [{ row: 0, error: message, data: {} }],
          geocoded: 0,
          total: 0,
        });
        return;
      }

      if (rows.length === 0) {
        toast.warning('No rows to import. Ensure your CSV has a header row and at least one data row.');
        setImportResult({
          success: 0,
          errors: [],
          geocoded: 0,
          total: 0,
        });
        return;
      }

      const result: ImportResult = {
        success: 0,
        errors: [],
        geocoded: 0,
        total: rows.length,
      };

      for (let i = 0; i < rows.length; i++) {
        const row = filterCSVData(rows[i]);
        setUploadProgress(((i + 1) / rows.length) * 100);

        const validationError = validateRow(row, dataType);
        if (validationError) {
          result.errors.push({ row: i + 2, error: validationError, data: row });
          continue;
        }

        try {
          const transformedData = await transformRowForDatabase(row, dataType, {
            userId: user?.id,
            geocodeAddress,
          });

          if (transformedData.latitude && transformedData.longitude) {
            result.geocoded++;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await supabase.from(dataType).insert([transformedData as any]);

          if (error) {
            result.errors.push({ row: i + 2, error: error.message, data: row });
          } else {
            result.success++;
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push({ row: i + 2, error: message, data: row });
        }
      }

      setImportResult(result);

      if (result.success > 0) {
        toast.success(
          `Successfully imported ${result.success} out of ${result.total} records${
            result.geocoded > 0 ? ` (${result.geocoded} with coordinates)` : ''
          }`
        );

        if (dataType === 'local_resources' && result.success > result.geocoded) {
          const missingCoords = result.success - result.geocoded;
          toast.info(
            `${missingCoords} local resources need geocoding. Use the "Geocode All" button.`
          );
        }
      }

      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} record(s) failed to import. See details below.`);
      }

      if (result.success === 0 && result.errors.length === 0 && result.total > 0) {
        toast.warning('No records were imported. Check error details below.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Import failed: ${message}`);
      setImportResult({
        success: 0,
        errors: [{ row: 0, error: message, data: {} }],
        geocoded: 0,
        total: 0,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, rowsToImport, dataType, user?.id, geocodeAddress]);

  const resetImport = useCallback(() => {
    setSelectedFile(null);
    setPreviewData([]);
    setImportResult(null);
    setShowPreview(false);
    setDuplicates([]);
    setRowsToImport([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    // State
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

    // Actions
    setDataType,
    handleFileSelect,
    handleCheckDuplicates,
    deleteDuplicateFromDatabase,
    skipDuplicateRow,
    handleImport,
    resetImport,
  };
};
