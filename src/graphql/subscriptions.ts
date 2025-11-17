/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onCreateUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onUpdateUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onDeleteUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onCreateShow = /* GraphQL */ `subscription OnCreateShow($filter: ModelSubscriptionShowFilterInput) {
  onCreateShow(filter: $filter) {
    id
    title
    description
    dateTime
    venueID
    createdBy
    showImageKey
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateShowSubscriptionVariables,
  APITypes.OnCreateShowSubscription
>;
export const onUpdateShow = /* GraphQL */ `subscription OnUpdateShow($filter: ModelSubscriptionShowFilterInput) {
  onUpdateShow(filter: $filter) {
    id
    title
    description
    dateTime
    venueID
    createdBy
    showImageKey
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateShowSubscriptionVariables,
  APITypes.OnUpdateShowSubscription
>;
export const onDeleteShow = /* GraphQL */ `subscription OnDeleteShow($filter: ModelSubscriptionShowFilterInput) {
  onDeleteShow(filter: $filter) {
    id
    title
    description
    dateTime
    venueID
    createdBy
    showImageKey
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteShowSubscriptionVariables,
  APITypes.OnDeleteShowSubscription
>;
export const onCreateVenue = /* GraphQL */ `subscription OnCreateVenue($filter: ModelSubscriptionVenueFilterInput) {
  onCreateVenue(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateVenueSubscriptionVariables,
  APITypes.OnCreateVenueSubscription
>;
export const onUpdateVenue = /* GraphQL */ `subscription OnUpdateVenue($filter: ModelSubscriptionVenueFilterInput) {
  onUpdateVenue(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateVenueSubscriptionVariables,
  APITypes.OnUpdateVenueSubscription
>;
export const onDeleteVenue = /* GraphQL */ `subscription OnDeleteVenue($filter: ModelSubscriptionVenueFilterInput) {
  onDeleteVenue(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteVenueSubscriptionVariables,
  APITypes.OnDeleteVenueSubscription
>;
