/* tslint:disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from '../API';
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
    createdBy
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
      createdBy
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
      googleReviewsLink
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
