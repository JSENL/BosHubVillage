
import { UniversalMap } from './UniversalMap';

interface SectionMapProps {
  height?: string;
}

export const SectionMap = ({ height = "300px" }: SectionMapProps) => {
  return <UniversalMap height={height} />;
};
