import { useState } from 'react';
import { TestTranslation } from "@/components/TestTranslation";
import { useAuth } from '@/hooks/useAuth';

export const TranslationTestModal = () => {
  const { isAdmin } = useAuth();
  const [showTranslationTest, setShowTranslationTest] = useState(false);
  
  // Only show for admins
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Translation Test Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowTranslationTest(!showTranslationTest)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm"
        >
          {showTranslationTest ? 'Hide' : 'Test'} Translations
        </button>
      </div>

      {/* Translation Test Modal */}
      {showTranslationTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Translation Test</h2>
              <button
                onClick={() => setShowTranslationTest(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TestTranslation />
            </div>
          </div>
        </div>
      )}
    </>
  );
};