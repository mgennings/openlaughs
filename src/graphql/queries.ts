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
