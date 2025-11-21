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
export const onCreateUserActivity = /* GraphQL */ `subscription OnCreateUserActivity(
  $filter: ModelSubscriptionUserActivityFilterInput
  $owner: String
) {
  onCreateUserActivity(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserActivitySubscriptionVariables,
  APITypes.OnCreateUserActivitySubscription
>;
export const onUpdateUserActivity = /* GraphQL */ `subscription OnUpdateUserActivity(
  $filter: ModelSubscriptionUserActivityFilterInput
  $owner: String
) {
  onUpdateUserActivity(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserActivitySubscriptionVariables,
  APITypes.OnUpdateUserActivitySubscription
>;
export const onDeleteUserActivity = /* GraphQL */ `subscription OnDeleteUserActivity(
  $filter: ModelSubscriptionUserActivityFilterInput
  $owner: String
) {
  onDeleteUserActivity(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserActivitySubscriptionVariables,
  APITypes.OnDeleteUserActivitySubscription
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
export const onCreateFavoriteComedian = /* GraphQL */ `subscription OnCreateFavoriteComedian(
  $filter: ModelSubscriptionFavoriteComedianFilterInput
  $owner: String
) {
  onCreateFavoriteComedian(filter: $filter, owner: $owner) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFavoriteComedianSubscriptionVariables,
  APITypes.OnCreateFavoriteComedianSubscription
>;
export const onUpdateFavoriteComedian = /* GraphQL */ `subscription OnUpdateFavoriteComedian(
  $filter: ModelSubscriptionFavoriteComedianFilterInput
  $owner: String
) {
  onUpdateFavoriteComedian(filter: $filter, owner: $owner) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFavoriteComedianSubscriptionVariables,
  APITypes.OnUpdateFavoriteComedianSubscription
>;
export const onDeleteFavoriteComedian = /* GraphQL */ `subscription OnDeleteFavoriteComedian(
  $filter: ModelSubscriptionFavoriteComedianFilterInput
  $owner: String
) {
  onDeleteFavoriteComedian(filter: $filter, owner: $owner) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFavoriteComedianSubscriptionVariables,
  APITypes.OnDeleteFavoriteComedianSubscription
>;
export const onCreateFavoriteVenue = /* GraphQL */ `subscription OnCreateFavoriteVenue(
  $filter: ModelSubscriptionFavoriteVenueFilterInput
  $owner: String
) {
  onCreateFavoriteVenue(filter: $filter, owner: $owner) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFavoriteVenueSubscriptionVariables,
  APITypes.OnCreateFavoriteVenueSubscription
>;
export const onUpdateFavoriteVenue = /* GraphQL */ `subscription OnUpdateFavoriteVenue(
  $filter: ModelSubscriptionFavoriteVenueFilterInput
  $owner: String
) {
  onUpdateFavoriteVenue(filter: $filter, owner: $owner) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFavoriteVenueSubscriptionVariables,
  APITypes.OnUpdateFavoriteVenueSubscription
>;
export const onDeleteFavoriteVenue = /* GraphQL */ `subscription OnDeleteFavoriteVenue(
  $filter: ModelSubscriptionFavoriteVenueFilterInput
  $owner: String
) {
  onDeleteFavoriteVenue(filter: $filter, owner: $owner) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFavoriteVenueSubscriptionVariables,
  APITypes.OnDeleteFavoriteVenueSubscription
>;
export const onCreateShowRSVP = /* GraphQL */ `subscription OnCreateShowRSVP(
  $filter: ModelSubscriptionShowRSVPFilterInput
  $owner: String
) {
  onCreateShowRSVP(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateShowRSVPSubscriptionVariables,
  APITypes.OnCreateShowRSVPSubscription
>;
export const onUpdateShowRSVP = /* GraphQL */ `subscription OnUpdateShowRSVP(
  $filter: ModelSubscriptionShowRSVPFilterInput
  $owner: String
) {
  onUpdateShowRSVP(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateShowRSVPSubscriptionVariables,
  APITypes.OnUpdateShowRSVPSubscription
>;
export const onDeleteShowRSVP = /* GraphQL */ `subscription OnDeleteShowRSVP(
  $filter: ModelSubscriptionShowRSVPFilterInput
  $owner: String
) {
  onDeleteShowRSVP(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteShowRSVPSubscriptionVariables,
  APITypes.OnDeleteShowRSVPSubscription
>;
export const onCreateShowReview = /* GraphQL */ `subscription OnCreateShowReview(
  $filter: ModelSubscriptionShowReviewFilterInput
  $userProfileId: String
) {
  onCreateShowReview(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateShowReviewSubscriptionVariables,
  APITypes.OnCreateShowReviewSubscription
>;
export const onUpdateShowReview = /* GraphQL */ `subscription OnUpdateShowReview(
  $filter: ModelSubscriptionShowReviewFilterInput
  $userProfileId: String
) {
  onUpdateShowReview(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateShowReviewSubscriptionVariables,
  APITypes.OnUpdateShowReviewSubscription
>;
export const onDeleteShowReview = /* GraphQL */ `subscription OnDeleteShowReview(
  $filter: ModelSubscriptionShowReviewFilterInput
  $userProfileId: String
) {
  onDeleteShowReview(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteShowReviewSubscriptionVariables,
  APITypes.OnDeleteShowReviewSubscription
>;
export const onCreateComedianReview = /* GraphQL */ `subscription OnCreateComedianReview(
  $filter: ModelSubscriptionComedianReviewFilterInput
  $userProfileId: String
) {
  onCreateComedianReview(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateComedianReviewSubscriptionVariables,
  APITypes.OnCreateComedianReviewSubscription
>;
export const onUpdateComedianReview = /* GraphQL */ `subscription OnUpdateComedianReview(
  $filter: ModelSubscriptionComedianReviewFilterInput
  $userProfileId: String
) {
  onUpdateComedianReview(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateComedianReviewSubscriptionVariables,
  APITypes.OnUpdateComedianReviewSubscription
>;
export const onDeleteComedianReview = /* GraphQL */ `subscription OnDeleteComedianReview(
  $filter: ModelSubscriptionComedianReviewFilterInput
  $userProfileId: String
) {
  onDeleteComedianReview(filter: $filter, userProfileId: $userProfileId) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteComedianReviewSubscriptionVariables,
  APITypes.OnDeleteComedianReviewSubscription
>;
