import { LandingHero } from './components/LandingHero';
import { LandingFeatures } from './components/LandingFeatures';
import { LandingCTA } from './components/LandingCTA';
import { LandingFooter } from './components/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900">
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
        <LandingFooter />
      </div>
    </div>
  );
};

export { LandingPage };
