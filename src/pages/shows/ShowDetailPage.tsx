import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon, RSVPButton } from '@/components';
import { useSnackbar } from '@/providers';
import { generateClient } from 'aws-amplify/api';
import { getShow, getVenue, getComedian } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { Show, Venue, Comedian } from '@/API';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const ShowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [show, setShow] = useState<Show | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [profileImageUrls, setProfileImageUrls] = useState<
    Record<string, string>
  >({});
  const [showImageUrl, setShowImageUrl] = useState<string | null>(null);
  const [venueLogoUrl, setVenueLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Show ID is required');
      setLoading(false);
      return;
    }

    const fetchShow = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: any;
        try {
          result = await userClient.graphql({
            query: (getShow as string).replace(/__typename/g, ''),
            variables: { id },
          });
        } catch {
          result = await publicClient.graphql({
            query: (getShow as string).replace(/__typename/g, ''),
            variables: { id },
          });
        }

        if ('data' in result && result.data?.getShow) {
          const showData = result.data.getShow as Show;
          setShow(showData);

          if (showData.showImageKey) {
            try {
              const url = await getPublicUrl(showData.showImageKey);
              setShowImageUrl(url.toString());
            } catch (err) {
              console.error('Failed to load show image:', err);
            }
          }

          if (showData.venueID) {
            try {
              let venueResult: any;
              try {
                venueResult = await userClient.graphql({
                  query: (getVenue as string).replace(/__typename/g, ''),
                  variables: { id: showData.venueID },
                });
              } catch {
                venueResult = await publicClient.graphql({
                  query: (getVenue as string).replace(/__typename/g, ''),
                  variables: { id: showData.venueID },
                });
              }

              if ('data' in venueResult && venueResult.data?.getVenue) {
                const venueData = venueResult.data.getVenue as Venue;
                setVenue(venueData);

                if (venueData.logoKey) {
                  try {
                    const url = await getPublicUrl(venueData.logoKey);
                    setVenueLogoUrl(url.toString());
                  } catch (err) {
                    console.error('Failed to load venue logo:', err);
                  }
                }
              }
            } catch (venueErr) {
              console.error('Failed to load venue:', venueErr);
            }
          }

          if (showData.comedianIDs && showData.comedianIDs.length > 0) {
            try {
              const comedianPromises = showData.comedianIDs.map(
                async comedianId => {
                  if (!comedianId) return null;
                  try {
                    let comedianResult: any;
                    try {
                      comedianResult = await userClient.graphql({
                        query: (getComedian as string).replace(
                          /__typename/g,
                          '',
                        ),
                        variables: { id: comedianId },
                      });
                    } catch {
                      comedianResult = await publicClient.graphql({
                        query: (getComedian as string).replace(
                          /__typename/g,
                          '',
                        ),
                        variables: { id: comedianId },
                      });
                    }

                    if (
                      'data' in comedianResult &&
                      comedianResult.data?.getComedian
                    ) {
                      return comedianResult.data.getComedian as Comedian;
                    }
                    return null;
                  } catch (err) {
                    console.error(
                      `Failed to load comedian ${comedianId}:`,
                      err,
                    );
                    return null;
                  }
                },
              );

              const comedianResults = await Promise.all(comedianPromises);
              const validComedians = comedianResults.filter(
                (c): c is Comedian => c !== null,
              );
              setComedians(validComedians);

              // Load profile images for comedians
              const imageUrls: Record<string, string> = {};
              for (const comedian of validComedians) {
                if (comedian.profileImageKey) {
                  try {
                    const url = await getPublicUrl(comedian.profileImageKey);
                    imageUrls[comedian.id] = url.toString();
                  } catch (err) {
                    console.error(
                      `Failed to load image for comedian ${comedian.id}:`,
                      err,
                    );
                  }
                }
              }
              setProfileImageUrls(imageUrls);
            } catch (comedianErr) {
              console.error('Failed to load comedians:', comedianErr);
            }
          }
        } else {
          setError('Show not found');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    void fetchShow();
  }, [id]);

  const formatDate = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateTimeString;
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return '';
    }
  };

  const formatShortDate = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        month: new Intl.DateTimeFormat('en-US', { month: 'short' })
          .format(date)
          .toUpperCase(),
        day: date.getDate().toString(),
        weekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
          date,
        ),
      };
    } catch {
      return { month: '???', day: '??', weekday: '???' };
    }
  };

  const generateCalendarLink = () => {
    if (!show) return '';
    const startDate = new Date(show.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatDateForCal = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: show.title || 'Comedy Show',
      dates: `${formatDateForCal(startDate)}/${formatDateForCal(endDate)}`,
      details: show.description || '',
      location: venue
        ? [venue.name, venue.address, venue.city, venue.state]
            .filter(Boolean)
            .join(', ')
        : '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateMapsLink = () => {
    if (!venue) return '';
    const address = [venue.address, venue.city, venue.state, venue.postalCode]
      .filter(Boolean)
      .join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading show...</span>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mb-4">
            <KeenIcon icon="information-2" className="text-4xl text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Show not found'}
          </h2>
          <p className="text-gray-500 mb-6">
            The show you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shows" className="btn btn-primary">
            Browse All Shows
          </Link>
        </div>
      </Container>
    );
  }

  const isPast = new Date(show.dateTime).getTime() < new Date().getTime();
  const venueFirstLetter = venue?.name?.charAt(0)?.toUpperCase() || '?';
  const shortDate = formatShortDate(show.dateTime);

  return (
    <div className="min-h-screen bg-gray-50 -mt-5">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 lg:h-[550px]">
          <div className="w-full h-full bg-gradient-to-br from-primary via-primary-dark to-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>

        {/* Hero Content */}
        <Container>
          <div className="relative pt-6 pb-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/shows')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
            >
              <KeenIcon icon="arrow-left" className="text-lg" />
              <span className="text-sm font-medium">Back to Shows</span>
            </button>

            {/* Main Hero Content */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {/* Show Image */}
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="relative w-full md:w-72 xl:w-80 aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  {showImageUrl ? (
                    <img
                      src={showImageUrl}
                      alt={show.title || 'Show'}
                      className="w-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                      <KeenIcon
                        icon="calendar"
                        className="text-6xl text-white/50"
                      />
                    </div>
                  )}
                  {isPast && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <span className="text-sm font-medium text-white/90">
                        Past Event
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Show Info */}
              <div className="flex-1 text-white pt-2 md:pt-4">
                {/* Date Badge */}
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-bold text-primary-light tracking-wider">
                      {shortDate.month}
                    </span>
                    <span className="text-2xl font-bold leading-none">
                      {shortDate.day}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">
                      {shortDate.weekday} • {formatTime(show.dateTime)}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                  {show.title}
                </h1>

                {/* Venue */}
                {venue && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <KeenIcon
                        icon="geolocation"
                        className="text-md md:text-lg text-white/60"
                      />
                      <span className="text-white/80">{venue.name}</span>
                    </div>
                    {/* {venue.city && (
                      <>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">
                          {venue.city}, {venue.state}
                        </span>
                      </>
                    )} */}
                  </div>
                )}

                {/* Action Buttons */}
                {!isPast && (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {show.ticketUrl && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
                      >
                        <KeenIcon icon="ticket" className="text-lg" />
                        Get Tickets
                        {show.ticketPrice !== null &&
                          show.ticketPrice !== undefined && (
                            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-lg text-sm">
                              ${show.ticketPrice.toFixed(0)}
                            </span>
                          )}
                      </a>
                    )}
                    {id && (
                      <RSVPButton showId={id} variant="button" showCount />
                    )}
                    <a
                      href={generateCalendarLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl transition-all border border-white/20"
                    >
                      <KeenIcon icon="calendar" />
                      Add to Calendar
                    </a>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {show.ageRestriction && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                      <KeenIcon icon="shield-tick" className="text-white/60" />
                      <span className="text-white/80">
                        {show.ageRestriction}
                      </span>
                    </div>
                  )}
                  {comedians.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                      <KeenIcon icon="people" className="text-white/60" />
                      <span className="text-white/80">
                        {comedians.length} Performer
                        {comedians.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Spacer for hero */}
      <div className="h-[120px] lg:h-[150px]" />

      {/* Main Content */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 -mt-16 relative pb-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {show.description && (
              <div className="card shadow-lg">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <KeenIcon icon="document" className="text-primary" />
                    </span>
                    About This Show
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {show.description}
                  </p>
                </div>
              </div>
            )}

            {/* Lineup Section */}
            {comedians && comedians.length > 0 && (
              <div className="card shadow-lg">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <KeenIcon icon="star" className="text-warning" />
                    </span>
                    The Lineup
                  </h2>
                  <div className="grid gap-4">
                    {comedians.map((comedian, index) => {
                      const yearsExp = comedian.performingSince
                        ? new Date().getFullYear() - comedian.performingSince
                        : null;

                      return (
                        <Link
                          key={comedian.id}
                          to={`/comedians/${comedian.id}`}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                        >
                          {/* Order Badge */}
                          {/* <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 group-hover:bg-primary group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors">
                            {index + 1}
                          </div> */}

                          {/* Avatar */}
                          {profileImageUrls[comedian.id] ? (
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                              <img
                                src={profileImageUrls[comedian.id]}
                                alt={comedian.stageName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl">
                              {comedian.stageName
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {comedian.stageName}
                              </span>
                              {comedian.isVerified && (
                                <KeenIcon
                                  icon="verify"
                                  className="text-success text-sm"
                                />
                              )}
                              {comedian.isFeatured && (
                                <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            {comedian.headline && (
                              <p className="text-sm text-gray-500 truncate italic">
                                "{comedian.headline}"
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {comedian.basedIn && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <KeenIcon icon="geolocation" />
                                  {comedian.basedIn}
                                </span>
                              )}
                              {yearsExp !== null && yearsExp > 0 && (
                                <span className="text-xs text-gray-400">
                                  {yearsExp}+ years
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <KeenIcon
                            icon="arrow-right"
                            className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Venue Section */}
            {venue && (
              <div className="card shadow-lg overflow-hidden">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                      <KeenIcon icon="geolocation" className="text-info" />
                    </span>
                    Venue
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Venue Image/Logo */}
                    <div className="flex-shrink-0">
                      {venueLogoUrl ? (
                        <img
                          src={venueLogoUrl}
                          alt={venue.name}
                          className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-info to-info-dark flex items-center justify-center text-white text-3xl font-bold">
                          {venueFirstLetter}
                        </div>
                      )}
                    </div>

                    {/* Venue Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {venue.name}
                      </h3>
                      {venue.address && (
                        <p className="text-gray-600 mb-1">{venue.address}</p>
                      )}
                      {(venue.city || venue.state) && (
                        <p className="text-gray-500 text-sm mb-4">
                          {[venue.city, venue.state, venue.postalCode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={generateMapsLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-light gap-1.5"
                        >
                          <KeenIcon icon="map" />
                          Get Directions
                        </a>
                        {venue.website && (
                          <a
                            href={venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-light gap-1.5"
                          >
                            <KeenIcon icon="link" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-5 space-y-4">
              {/* Ticket Card */}
              <div className="card shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-blue-400 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/90 text-lg font-medium">
                      {isPast ? 'Event Ended' : 'Get Your Spot'}
                    </span>
                    {show.ticketPrice !== null &&
                      show.ticketPrice !== undefined && (
                        <div className="text-right">
                          <span className="text-3xl font-bold">
                            ${show.ticketPrice.toFixed(0)}
                          </span>
                          <span className="text-white/70 text-sm ml-1">
                            /ticket
                          </span>
                        </div>
                      )}
                  </div>

                  {!isPast && show.ticketUrl && (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-success text-white font-semibold text-center rounded-xl hover:bg-success-active transition-colors shadow-success/30 hover:shadow-success/50 hover:scale-105"
                    >
                      Buy Tickets Now
                    </a>
                  )}

                  {isPast && (
                    <div className="text-center py-3 bg-white/10 rounded-xl">
                      <span className="text-white/80">
                        This event has ended
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <KeenIcon icon="calendar" className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(show.dateTime)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(show.dateTime)}
                      </p>
                    </div>
                  </div>

                  {/* Venue */}
                  {venue && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <KeenIcon
                          icon="geolocation"
                          className="text-gray-600"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {venue.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {venue.city}, {venue.state}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Age Restriction */}
                  {show.ageRestriction && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <KeenIcon
                          icon="shield-tick"
                          className="text-gray-600"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Age Restriction
                        </p>
                        <p className="text-sm text-gray-500">
                          {show.ageRestriction}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-4">
                    {!isPast && (
                      <div className="grid grid-cols-2 gap-2">
                        {id && (
                          <RSVPButton showId={id} variant="button" showCount />
                        )}
                        <a
                          href={generateCalendarLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-light w-full gap-1.5"
                        >
                          <KeenIcon icon="calendar" />
                          Calendar
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="card shadow-lg p-4">
                <p className="text-sm text-gray-500 mb-3">Share this event</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showSnackbar('Link copied to clipboard', 'success', 1000);
                    }}
                    className="flex-1 btn btn-sm btn-light gap-1.5"
                  >
                    <KeenIcon icon="copy" />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export { ShowDetailPage };
