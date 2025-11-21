/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createShow = /* GraphQL */ `mutation CreateShow(
  $input: CreateShowInput!
  $condition: ModelShowConditionInput
) {
  createShow(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateShowMutationVariables,
  APITypes.CreateShowMutation
>;
export const updateShow = /* GraphQL */ `mutation UpdateShow(
  $input: UpdateShowInput!
  $condition: ModelShowConditionInput
) {
  updateShow(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateShowMutationVariables,
  APITypes.UpdateShowMutation
>;
export const deleteShow = /* GraphQL */ `mutation DeleteShow(
  $input: DeleteShowInput!
  $condition: ModelShowConditionInput
) {
  deleteShow(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteShowMutationVariables,
  APITypes.DeleteShowMutation
>;
export const createVenue = /* GraphQL */ `mutation CreateVenue(
  $input: CreateVenueInput!
  $condition: ModelVenueConditionInput
) {
  createVenue(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateVenueMutationVariables,
  APITypes.CreateVenueMutation
>;
export const updateVenue = /* GraphQL */ `mutation UpdateVenue(
  $input: UpdateVenueInput!
  $condition: ModelVenueConditionInput
) {
  updateVenue(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateVenueMutationVariables,
  APITypes.UpdateVenueMutation
>;
export const deleteVenue = /* GraphQL */ `mutation DeleteVenue(
  $input: DeleteVenueInput!
  $condition: ModelVenueConditionInput
) {
  deleteVenue(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteVenueMutationVariables,
  APITypes.DeleteVenueMutation
>;
export const createComedian = /* GraphQL */ `mutation CreateComedian(
  $input: CreateComedianInput!
  $condition: ModelComedianConditionInput
) {
  createComedian(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateComedianMutationVariables,
  APITypes.CreateComedianMutation
>;
export const updateComedian = /* GraphQL */ `mutation UpdateComedian(
  $input: UpdateComedianInput!
  $condition: ModelComedianConditionInput
) {
  updateComedian(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateComedianMutationVariables,
  APITypes.UpdateComedianMutation
>;
export const deleteComedian = /* GraphQL */ `mutation DeleteComedian(
  $input: DeleteComedianInput!
  $condition: ModelComedianConditionInput
) {
  deleteComedian(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteComedianMutationVariables,
  APITypes.DeleteComedianMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $input: CreateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  createUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $input: UpdateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  updateUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $input: DeleteUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  deleteUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const createFavoriteComedian = /* GraphQL */ `mutation CreateFavoriteComedian(
  $input: CreateFavoriteComedianInput!
  $condition: ModelFavoriteComedianConditionInput
) {
  createFavoriteComedian(input: $input, condition: $condition) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFavoriteComedianMutationVariables,
  APITypes.CreateFavoriteComedianMutation
>;
export const updateFavoriteComedian = /* GraphQL */ `mutation UpdateFavoriteComedian(
  $input: UpdateFavoriteComedianInput!
  $condition: ModelFavoriteComedianConditionInput
) {
  updateFavoriteComedian(input: $input, condition: $condition) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFavoriteComedianMutationVariables,
  APITypes.UpdateFavoriteComedianMutation
>;
export const deleteFavoriteComedian = /* GraphQL */ `mutation DeleteFavoriteComedian(
  $input: DeleteFavoriteComedianInput!
  $condition: ModelFavoriteComedianConditionInput
) {
  deleteFavoriteComedian(input: $input, condition: $condition) {
    id
    userProfileId
    comedianId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFavoriteComedianMutationVariables,
  APITypes.DeleteFavoriteComedianMutation
>;
export const createFavoriteVenue = /* GraphQL */ `mutation CreateFavoriteVenue(
  $input: CreateFavoriteVenueInput!
  $condition: ModelFavoriteVenueConditionInput
) {
  createFavoriteVenue(input: $input, condition: $condition) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFavoriteVenueMutationVariables,
  APITypes.CreateFavoriteVenueMutation
>;
export const updateFavoriteVenue = /* GraphQL */ `mutation UpdateFavoriteVenue(
  $input: UpdateFavoriteVenueInput!
  $condition: ModelFavoriteVenueConditionInput
) {
  updateFavoriteVenue(input: $input, condition: $condition) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFavoriteVenueMutationVariables,
  APITypes.UpdateFavoriteVenueMutation
>;
export const deleteFavoriteVenue = /* GraphQL */ `mutation DeleteFavoriteVenue(
  $input: DeleteFavoriteVenueInput!
  $condition: ModelFavoriteVenueConditionInput
) {
  deleteFavoriteVenue(input: $input, condition: $condition) {
    id
    userProfileId
    venueId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFavoriteVenueMutationVariables,
  APITypes.DeleteFavoriteVenueMutation
>;
export const createShowRSVP = /* GraphQL */ `mutation CreateShowRSVP(
  $input: CreateShowRSVPInput!
  $condition: ModelShowRSVPConditionInput
) {
  createShowRSVP(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateShowRSVPMutationVariables,
  APITypes.CreateShowRSVPMutation
>;
export const updateShowRSVP = /* GraphQL */ `mutation UpdateShowRSVP(
  $input: UpdateShowRSVPInput!
  $condition: ModelShowRSVPConditionInput
) {
  updateShowRSVP(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateShowRSVPMutationVariables,
  APITypes.UpdateShowRSVPMutation
>;
export const deleteShowRSVP = /* GraphQL */ `mutation DeleteShowRSVP(
  $input: DeleteShowRSVPInput!
  $condition: ModelShowRSVPConditionInput
) {
  deleteShowRSVP(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteShowRSVPMutationVariables,
  APITypes.DeleteShowRSVPMutation
>;
export const createUserActivity = /* GraphQL */ `mutation CreateUserActivity(
  $input: CreateUserActivityInput!
  $condition: ModelUserActivityConditionInput
) {
  createUserActivity(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserActivityMutationVariables,
  APITypes.CreateUserActivityMutation
>;
export const updateUserActivity = /* GraphQL */ `mutation UpdateUserActivity(
  $input: UpdateUserActivityInput!
  $condition: ModelUserActivityConditionInput
) {
  updateUserActivity(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserActivityMutationVariables,
  APITypes.UpdateUserActivityMutation
>;
export const deleteUserActivity = /* GraphQL */ `mutation DeleteUserActivity(
  $input: DeleteUserActivityInput!
  $condition: ModelUserActivityConditionInput
) {
  deleteUserActivity(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserActivityMutationVariables,
  APITypes.DeleteUserActivityMutation
>;
export const createShowReview = /* GraphQL */ `mutation CreateShowReview(
  $input: CreateShowReviewInput!
  $condition: ModelShowReviewConditionInput
) {
  createShowReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateShowReviewMutationVariables,
  APITypes.CreateShowReviewMutation
>;
export const updateShowReview = /* GraphQL */ `mutation UpdateShowReview(
  $input: UpdateShowReviewInput!
  $condition: ModelShowReviewConditionInput
) {
  updateShowReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateShowReviewMutationVariables,
  APITypes.UpdateShowReviewMutation
>;
export const deleteShowReview = /* GraphQL */ `mutation DeleteShowReview(
  $input: DeleteShowReviewInput!
  $condition: ModelShowReviewConditionInput
) {
  deleteShowReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteShowReviewMutationVariables,
  APITypes.DeleteShowReviewMutation
>;
export const createComedianReview = /* GraphQL */ `mutation CreateComedianReview(
  $input: CreateComedianReviewInput!
  $condition: ModelComedianReviewConditionInput
) {
  createComedianReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateComedianReviewMutationVariables,
  APITypes.CreateComedianReviewMutation
>;
export const updateComedianReview = /* GraphQL */ `mutation UpdateComedianReview(
  $input: UpdateComedianReviewInput!
  $condition: ModelComedianReviewConditionInput
) {
  updateComedianReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateComedianReviewMutationVariables,
  APITypes.UpdateComedianReviewMutation
>;
export const deleteComedianReview = /* GraphQL */ `mutation DeleteComedianReview(
  $input: DeleteComedianReviewInput!
  $condition: ModelComedianReviewConditionInput
) {
  deleteComedianReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteComedianReviewMutationVariables,
  APITypes.DeleteComedianReviewMutation
>;
