import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { Link } from 'react-router-dom';

const LandingHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      <Container className="relative z-10">
        <div className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-5xl lg:text-7xl font-bold mb-4">
                🎭 OpenLaughs
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 font-medium">
                Austin's Comedy Scene, Amplified
              </p>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
              Discover, Connect, and Laugh Together
            </h2>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              The centralized hub for Austin's live comedy scene. Whether you're
              a comedian, fan, or promoter, OpenLaughs brings the community
              together to discover shows, book gigs, and share the laughter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  className="bg-purple-600 text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-blue-200">Venues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">200+</div>
                <div className="text-blue-200">Comedians</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">1000+</div>
                <div className="text-blue-200">Fans</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export { LandingHero };
