
// Helper function to safely parse villages data
export const parseVillages = (villagesData: any): string[] => {
  if (!villagesData) return [];
  
  if (Array.isArray(villagesData)) {
    return villagesData;
  }
  
  if (typeof villagesData === 'string') {
    if (villagesData.trim().startsWith('[') && villagesData.trim().endsWith(']')) {
      try {
        return JSON.parse(villagesData);
      } catch (error) {
        return [];
      }
    } else {
      return [villagesData.trim()];
    }
  }
  
  return [];
};
