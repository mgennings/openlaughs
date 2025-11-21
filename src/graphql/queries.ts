/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    id
    email
    displayName
    firstName
    lastName
    gender
    birthdate
    profileImageKey
    addressLine1
    addressLine2
    city
    state
    postalCode
    country
    role
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      email
      displayName
      firstName
      lastName
      gender
      birthdate
      profileImageKey
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      role
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
export const getUserActivity = /* GraphQL */ `query GetUserActivity($id: ID!) {
  getUserActivity(id: $id) {
    id
    userProfileId
    activityType
    entityId
    entityType
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserActivityQueryVariables,
  APITypes.GetUserActivityQuery
>;
export const listUserActivities = /* GraphQL */ `query ListUserActivities(
  $filter: ModelUserActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userProfileId
      activityType
      entityId
      entityType
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserActivitiesQueryVariables,
  APITypes.ListUserActivitiesQuery
>;
export const getShow = /* GraphQL */ `query GetShow($id: ID!) {
  getShow(id: $id) {
    id
    title
    description
    dateTime
    venueID
    comedianIDs
    createdBy
    showImageKey
    ticketUrl
    ticketPrice
    ageRestriction
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetShowQueryVariables, APITypes.GetShowQuery>;
export const listShows = /* GraphQL */ `query ListShows(
  $filter: ModelShowFilterInput
  $limit: Int
  $nextToken: String
) {
  listShows(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      dateTime
      venueID
      comedianIDs
      createdBy
      showImageKey
      ticketUrl
      ticketPrice
      ageRestriction
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListShowsQueryVariables, APITypes.ListShowsQuery>;
export const getVenue = /* GraphQL */ `query GetVenue($id: ID!) {
  getVenue(id: $id) {
    id
    name
    address
    city
    state
    postalCode
    country
    openMic
    bio
    description
    venueImageKeys
    logoKey
    googleReviewsLink
    googlePlaceId
    website
    phone
    email
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetVenueQueryVariables, APITypes.GetVenueQuery>;
export const listVenues = /* GraphQL */ `query ListVenues(
  $filter: ModelVenueFilterInput
  $limit: Int
  $nextToken: String
) {
  listVenues(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      address
      city
      state
      postalCode
      country
      openMic
      bio
      description
      venueImageKeys
      logoKey
      googleReviewsLink
      googlePlaceId
      website
      phone
      email
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVenuesQueryVariables,
  APITypes.ListVenuesQuery
>;
export const getComedian = /* GraphQL */ `query GetComedian($id: ID!) {
  getComedian(id: $id) {
    id
    stageName
    bio
    profileImageKey
    firstName
    lastName
    pronouns
    basedIn
    isActive
    availability
    comedyStyles
    performanceTypes
    contentRating
    performingSince
    headline
    website
    instagram
    twitter
    tiktok
    youtube
    facebook
    businessEmail
    businessPhone
    notableCredits
    awards
    pressKitUrl
    videoSampleUrl
    userProfileId
    isVerified
    isFeatured
    status
    createdBy
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetComedianQueryVariables,
  APITypes.GetComedianQuery
>;
export const listComedians = /* GraphQL */ `query ListComedians(
  $filter: ModelComedianFilterInput
  $limit: Int
  $nextToken: String
) {
  listComedians(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      stageName
      bio
      profileImageKey
      firstName
      lastName
      pronouns
      basedIn
      isActive
      availability
      comedyStyles
      performanceTypes
      contentRating
      performingSince
      headline
      website
      instagram
      twitter
      tiktok
      youtube
      facebook
      businessEmail
      businessPhone
      notableCredits
      awards
      pressKitUrl
      videoSampleUrl
      userProfileId
      isVerified
      isFeatured
      status
      createdBy
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComediansQueryVariables,
  APITypes.ListComediansQuery
>;
export const getFavoriteComedian = /* GraphQL */ `query GetFavoriteComedian($id: ID!) {
  getFavoriteComedian(id: $id) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFavoriteComedianQueryVariables,
  APITypes.GetFavoriteComedianQuery
>;
export const listFavoriteComedians = /* GraphQL */ `query ListFavoriteComedians(
  $filter: ModelFavoriteComedianFilterInput
  $limit: Int
  $nextToken: String
) {
  listFavoriteComedians(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userProfileId
      comedianId
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFavoriteComediansQueryVariables,
  APITypes.ListFavoriteComediansQuery
>;
export const getFavoriteVenue = /* GraphQL */ `query GetFavoriteVenue($id: ID!) {
  getFavoriteVenue(id: $id) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFavoriteVenueQueryVariables,
  APITypes.GetFavoriteVenueQuery
>;
export const listFavoriteVenues = /* GraphQL */ `query ListFavoriteVenues(
  $filter: ModelFavoriteVenueFilterInput
  $limit: Int
  $nextToken: String
) {
  listFavoriteVenues(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userProfileId
      venueId
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFavoriteVenuesQueryVariables,
  APITypes.ListFavoriteVenuesQuery
>;
export const getShowRSVP = /* GraphQL */ `query GetShowRSVP($id: ID!) {
  getShowRSVP(id: $id) {
    id
    userProfileId
    showId
    status
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetShowRSVPQueryVariables,
  APITypes.GetShowRSVPQuery
>;
export const listShowRSVPS = /* GraphQL */ `query ListShowRSVPS(
  $filter: ModelShowRSVPFilterInput
  $limit: Int
  $nextToken: String
) {
  listShowRSVPS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userProfileId
      showId
      status
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShowRSVPSQueryVariables,
  APITypes.ListShowRSVPSQuery
>;
export const getShowReview = /* GraphQL */ `query GetShowReview($id: ID!) {
  getShowReview(id: $id) {
    id
    userProfileId
    showId
    rating
    review
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetShowReviewQueryVariables,
  APITypes.GetShowReviewQuery
>;
export const listShowReviews = /* GraphQL */ `query ListShowReviews(
  $filter: ModelShowReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listShowReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userProfileId
      showId
      rating
      review
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShowReviewsQueryVariables,
  APITypes.ListShowReviewsQuery
>;
export const getComedianReview = /* GraphQL */ `query GetComedianReview($id: ID!) {
  getComedianReview(id: $id) {
    id
    userProfileId
    comedianId
    rating
    review
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetComedianReviewQueryVariables,
  APITypes.GetComedianReviewQuery
>;
export const listComedianReviews = /* GraphQL */ `query ListComedianReviews(
  $filter: ModelComedianReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listComedianReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userProfileId
      comedianId
      rating
      review
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComedianReviewsQueryVariables,
  APITypes.ListComedianReviewsQuery
>;
