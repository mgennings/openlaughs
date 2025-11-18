import { Container } from '@/components/container';
import { ShowsList } from '@/partials/shows/ShowsList';

const ShowsPage = () => {
  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Shows</h1>
        <p className="text-gray-600">
          Discover and explore comedy shows happening in Austin
        </p>
      </div>

      <ShowsList
        showFilters={true}
        compact={false}
        titleLinkFormat="/shows/:id"
      />
    </Container>
  );
};

export { ShowsPage };

