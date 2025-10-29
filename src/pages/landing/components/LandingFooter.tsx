import { Container } from '@/components/container';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">🎭 OpenLaughs</h3>
              <p className="text-gray-400">
                Austin's premier comedy discovery platform. Connecting
                comedians, fans, and promoters to create unforgettable laughter
                experiences.
              </p>
            </div>
            <div className="text-gray-400 text-sm">
              <p>
                © {new Date().getFullYear()} OpenLaughs. All rights reserved.
              </p>
              <p className="mt-1">
                Built with ❤️ for Austin's comedy community
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/auth/sign-up"
                  className="hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/sign-in"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For Comedians
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For Fans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For Promoters
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            Powered by AWS Amplify • Built with React & TypeScript •
            <a
              href="https://github.com/matthewgennings/openlaughs"
              className="hover:text-white transition-colors ml-1"
            >
              Open Source
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export { LandingFooter };
