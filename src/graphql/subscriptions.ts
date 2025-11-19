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
` as GeneratedSubscription<
  APITypes.OnDeleteVenueSubscriptionVariables,
  APITypes.OnDeleteVenueSubscription
>;
export const onCreateComedian = /* GraphQL */ `subscription OnCreateComedian(
  $filter: ModelSubscriptionComedianFilterInput
  $userProfileId: String
) {
  onCreateComedian(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateComedianSubscriptionVariables,
  APITypes.OnCreateComedianSubscription
>;
export const onUpdateComedian = /* GraphQL */ `subscription OnUpdateComedian(
  $filter: ModelSubscriptionComedianFilterInput
  $userProfileId: String
) {
  onUpdateComedian(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateComedianSubscriptionVariables,
  APITypes.OnUpdateComedianSubscription
>;
export const onDeleteComedian = /* GraphQL */ `subscription OnDeleteComedian(
  $filter: ModelSubscriptionComedianFilterInput
  $userProfileId: String
) {
  onDeleteComedian(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteComedianSubscriptionVariables,
  APITypes.OnDeleteComedianSubscription
>;
