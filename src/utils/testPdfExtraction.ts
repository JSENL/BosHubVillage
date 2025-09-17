import { toast } from 'sonner';

// Test data simulating extracted PDF text
const testPdfTexts = [
  {
    name: "Concert Event",
    text: `
Boston Symphony Hall Concert
Date: March 15, 2024
Time: 7:30 PM to 10:00 PM
Location: Symphony Hall, 301 Massachusetts Ave, Boston, MA 02115
Price: $45.00
Capacity: 500 people
Registration required for this musical performance.
Join us for an evening of classical music featuring renowned artists.
Website: https://bostonmusic.com/events
    `
  },
  {
    name: "Workshop Event", 
    text: `
Event: Digital Marketing Workshop
When: April 20, 2024 from 9:00 AM - 5:00 PM
Where: Boston Conference Center, 100 Clarendon Street, Boston
Cost: Free
Maximum attendees: 50
This educational workshop covers social media marketing, SEO, and content creation.
Perfect for small business owners and marketing professionals.
    `
  },
  {
    name: "Community Event",
    text: `
Title: Community Food Festival
Date: May 5, 2024
Time: 12:00 PM to 8:00 PM  
Address: Boston Common, Tremont St, Boston, MA
Price: Free admission
Come celebrate local food vendors and restaurants in this exciting social gathering.
Live music and entertainment throughout the day.
Contact: foodfest@boston.gov
    `
  }
];

export const testPdfExtraction = async (testIndex: number = 0) => {
  if (testIndex >= testPdfTexts.length) {
    toast.error('Invalid test index');
    return null;
  }

  const testData = testPdfTexts[testIndex];
  
  try {
    console.log(`Testing PDF extraction with: ${testData.name}`);
    
    // Create a blob to simulate PDF file
    const testBlob = new Blob([testData.text], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('pdf', testBlob, `test-${testData.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);

    // Call the extract-event-data edge function
    const response = await fetch('https://mecotkulcgdbilaksddu.supabase.co/functions/v1/extract-event-data', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('PDF Extraction Test Results:', {
      testName: testData.name,
      success: result.success,
      extractedText: result.extractedText,
      eventData: result.eventData
    });

    if (result.success) {
      toast.success(`✅ PDF extraction test "${testData.name}" completed successfully!`);
      
      // Validate extracted data
      const validation = validateExtractedData(result.eventData);
      console.log('Data validation:', validation);
      
      return {
        success: true,
        testName: testData.name,
        extractedData: result.eventData,
        validation,
        rawText: result.extractedText
      };
    } else {
      toast.error(`❌ PDF extraction test "${testData.name}" failed: ${result.error}`);
      return {
        success: false,
        testName: testData.name,
        error: result.error
      };
    }

  } catch (error: any) {
    console.error(`PDF extraction test "${testData.name}" error:`, error);
    toast.error(`❌ Test failed: ${error.message}`);
    return {
      success: false,
      testName: testData.name,
      error: error.message
    };
  }
};

// Validate if the extracted data makes sense
const validateExtractedData = (eventData: any) => {
  const validations = {
    hasTitle: Boolean(eventData.title && eventData.title.length > 0),
    hasDate: Boolean(eventData.date),
    hasLocation: Boolean(eventData.location && eventData.location.length > 0),
    hasValidPrice: typeof eventData.price === 'number' && eventData.price >= 0,
    hasCategory: Boolean(eventData.category),
    hasStartTime: Boolean(eventData.startTime),
    hasEndTime: Boolean(eventData.endTime)
  };

  const score = Object.values(validations).filter(Boolean).length;
  const total = Object.keys(validations).length;
  
  return {
    ...validations,
    score: `${score}/${total}`,
    percentage: Math.round((score / total) * 100)
  };
};

// Run all tests
export const runAllPdfTests = async () => {
  console.log('🧪 Starting comprehensive PDF extraction tests...');
  toast.info('Running PDF extraction tests...');
  
  const results = [];
  
  for (let i = 0; i < testPdfTexts.length; i++) {
    const result = await testPdfExtraction(i);
    results.push(result);
    
    // Add small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('📊 PDF Extraction Test Summary:', {
    total,
    successful,
    failed: total - successful,
    successRate: `${Math.round((successful / total) * 100)}%`,
    results
  });
  
  if (successful === total) {
    toast.success(`🎉 All ${total} PDF extraction tests passed!`);
  } else {
    toast.warning(`⚠️ ${successful}/${total} tests passed (${Math.round((successful / total) * 100)}%)`);
  }
  
  return results;
};

// Get available test names
export const getTestNames = () => testPdfTexts.map((test, index) => ({
  index,
  name: test.name
}));