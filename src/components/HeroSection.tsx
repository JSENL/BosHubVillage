
interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  return (
    <div className="bg-caribbean-teal">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
