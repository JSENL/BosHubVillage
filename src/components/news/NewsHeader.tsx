
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const NewsHeader = () => {
  return (
    <header className="bg-white border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-end mb-4">
            <div className="text-sm text-gray-500">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-2">
              LocalHub News
            </h1>
            <p className="text-lg text-gray-600">Your Community's Voice</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewsHeader;
