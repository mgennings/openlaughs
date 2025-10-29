import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { Link } from 'react-router-dom';

const LandingCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Join Austin's Comedy Revolution?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Whether you're looking to perform, discover amazing shows, or
            promote your venue, OpenLaughs is your gateway to Austin's thriving
            comedy community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/auth/sign-up">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Comedy Journey
              </Button>
            </Link>
            <Link to="/auth/sign-in">
              <Button
                size="lg"
                className="bg-purple-600 text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Already Have an Account?
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                100%
              </div>
              <div className="text-purple-200">Free to Use</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                5min
              </div>
              <div className="text-purple-200">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                24/7
              </div>
              <div className="text-purple-200">Community Support</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export { LandingCTA };
