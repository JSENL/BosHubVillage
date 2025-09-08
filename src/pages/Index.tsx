import { HomePage } from "@/components/pages/HomePage";
import { TestSponsoredComponents } from "@/components/TestSponsoredComponents";

const Index = () => {
  // Add test parameter to show test component
  const urlParams = new URLSearchParams(window.location.search);
  const showTest = urlParams.get('test') === 'sponsored';
  
  if (showTest) {
    return <TestSponsoredComponents />;
  }
  
  return <HomePage />;
};

export default Index;
