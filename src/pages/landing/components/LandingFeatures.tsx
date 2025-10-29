import { Container } from '@/components/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const LandingFeatures = () => {
  const features = [
    {
      icon: '🎤',
      title: 'For Comedians',
      description: 'Find venues, book gigs, and connect with promoters',
      features: [
        'Venue Explorer Feed',
        'Booking Workflow',
        'Calendar Sync',
        'Messaging with Promoters',
      ],
    },
    {
      icon: '🎭',
      title: 'For Fans',
      description:
        'Discover shows, get recommendations, and never miss a laugh',
      features: [
        'Calendar View of Shows',
        'Weekly Top Picks',
        'Filterable Events',
        'Add-to-Calendar & Tickets',
      ],
    },
    {
      icon: '🎪',
      title: 'For Promoters',
      description: 'Post shows, manage lineups, and grow your audience',
      features: [
        'Show Posting & Lineup Builder',
        'Comedian Search & Contact',
        'Messaging System',
        'Exportable Reports',
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Built for Everyone in Austin's Comedy Scene
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            OpenLaughs serves comedians, fans, and promoters with tailored tools
            to make Austin's comedy scene more connected and accessible than
            ever.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Why Austin Chooses OpenLaughs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Mobile-First
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Designed for on-the-go comedy discovery
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Reliable
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Built on AWS with enterprise-grade security
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Real-Time Updates
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Instant notifications for new shows and bookings
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Community Driven
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Built by comedians, for comedians
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export { LandingFeatures };
