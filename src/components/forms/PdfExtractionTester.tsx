import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Link,
  Tag
} from 'lucide-react';
import { testPdfExtraction, runAllPdfTests, getTestNames } from '@/utils/testPdfExtraction';

interface PdfExtractionTesterProps {
  onEventDataExtracted?: (eventData: any) => void;
}

export const PdfExtractionTester: React.FC<PdfExtractionTesterProps> = ({ onEventDataExtracted }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [lastResult, setLastResult] = useState<any>(null);

  const testNames = getTestNames();

  const runSingleTest = async () => {
    if (!selectedTest) return;
    
    const testIndex = parseInt(selectedTest);
    setIsRunning(true);
    
    try {
      const result = await testPdfExtraction(testIndex);
      setLastResult(result);
      
      // If successful and callback provided, fill the form with extracted data
      if (result?.success && result.extractedData && onEventDataExtracted) {
        onEventDataExtracted(result.extractedData);
      }
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    try {
      const results = await runAllPdfTests();
      setLastResult({
        success: true,
        testName: 'All Tests',
        allResults: results
      });
    } catch (error) {
      console.error('All tests error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const renderValidationResult = (validation: any) => {
    if (!validation) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Data Quality Score:</span>
          <Badge variant={validation.percentage >= 70 ? 'default' : 'secondary'}>
            {validation.score} ({validation.percentage}%)
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            {validation.hasTitle ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
            <span>Title</span>
          </div>
          <div className="flex items-center gap-1">
            {validation.hasDate ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
            <span>Date</span>
          </div>
          <div className="flex items-center gap-1">
            {validation.hasLocation ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
            <span>Location</span>
          </div>
          <div className="flex items-center gap-1">
            {validation.hasValidPrice ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
            <span>Price</span>
          </div>
          <div className="flex items-center gap-1">
            {validation.hasCategory ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
            <span>Category</span>
          </div>
          <div className="flex items-center gap-1">
            {validation.hasStartTime ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
            <span>Time</span>
          </div>
        </div>
      </div>
    );
  };

  const renderExtractedData = (eventData: any) => {
    if (!eventData) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Extracted Event Data:</h4>
        <div className="grid gap-2 text-xs">
          {eventData.title && (
            <div className="flex items-start gap-2">
              <FileText className="h-3 w-3 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Title:</span> {eventData.title}
              </div>
            </div>
          )}
          
          {eventData.date && (
            <div className="flex items-start gap-2">
              <Calendar className="h-3 w-3 mt-0.5 text-green-500" />
              <div>
                <span className="font-medium">Date:</span> {eventData.date}
              </div>
            </div>
          )}
          
          {(eventData.startTime || eventData.endTime) && (
            <div className="flex items-start gap-2">
              <Clock className="h-3 w-3 mt-0.5 text-orange-500" />
              <div>
                <span className="font-medium">Time:</span> {eventData.startTime || 'N/A'} - {eventData.endTime || 'N/A'}
              </div>
            </div>
          )}
          
          {eventData.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 mt-0.5 text-red-500" />
              <div>
                <span className="font-medium">Location:</span> {eventData.location}
              </div>
            </div>
          )}
          
          {eventData.price !== undefined && (
            <div className="flex items-start gap-2">
              <DollarSign className="h-3 w-3 mt-0.5 text-green-600" />
              <div>
                <span className="font-medium">Price:</span> ${eventData.price}
              </div>
            </div>
          )}
          
          {eventData.maxAttendees && (
            <div className="flex items-start gap-2">
              <Users className="h-3 w-3 mt-0.5 text-purple-500" />
              <div>
                <span className="font-medium">Max Attendees:</span> {eventData.maxAttendees}
              </div>
            </div>
          )}
          
          {eventData.category && (
            <div className="flex items-start gap-2">
              <Tag className="h-3 w-3 mt-0.5 text-indigo-500" />
              <div>
                <span className="font-medium">Category:</span> {eventData.category}
              </div>
            </div>
          )}
          
          {eventData.website && (
            <div className="flex items-start gap-2">
              <Link className="h-3 w-3 mt-0.5 text-blue-600" />
              <div>
                <span className="font-medium">Website:</span> {eventData.website}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TestTube className="h-5 w-5 text-orange-600" />
          PDF Extraction Tester
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test the AI PDF extraction with sample event documents to verify accuracy
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Select value={selectedTest} onValueChange={setSelectedTest}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a test scenario" />
              </SelectTrigger>
              <SelectContent>
                {testNames.map((test) => (
                  <SelectItem key={test.index} value={test.index.toString()}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={runSingleTest}
            disabled={!selectedTest || isRunning}
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            {isRunning ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Test
          </Button>
          
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isRunning ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="h-4 w-4 mr-2" />
            )}
            Test All
          </Button>
        </div>

        {lastResult && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center gap-2 mb-3">
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium text-sm">
                Test: {lastResult.testName}
              </span>
              <Badge variant={lastResult.success ? 'default' : 'destructive'}>
                {lastResult.success ? 'Passed' : 'Failed'}
              </Badge>
            </div>

            {lastResult.success && lastResult.extractedData && (
              <>
                {renderExtractedData(lastResult.extractedData)}
                
                {lastResult.validation && (
                  <>
                    <Separator className="my-3" />
                    {renderValidationResult(lastResult.validation)}
                  </>
                )}
              </>
            )}

            {!lastResult.success && lastResult.error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                <strong>Error:</strong> {lastResult.error}
              </div>
            )}

            {lastResult.allResults && (
              <div className="mt-3">
                <h4 className="font-medium text-sm mb-2">Test Summary:</h4>
                <div className="space-y-1">
                  {lastResult.allResults.map((result: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {result.success ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span>{result.testName}</span>
                      {result.validation && (
                        <Badge variant="outline" className="text-xs">
                          {result.validation.percentage}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>
            💡 This tester simulates PDF extraction with pre-defined event data. 
            If successful, the extracted data will automatically fill the form fields below.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};