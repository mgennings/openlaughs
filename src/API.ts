/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateShowInput = {
  id?: string | null,
  title: string,
  description?: string | null,
  dateTime: string,
  venueID: string,
  comedianIDs?: Array< string | null > | null,
  createdBy?: string | null,
  showImageKey?: string | null,
  ticketUrl?: string | null,
  ticketPrice?: number | null,
  ageRestriction?: string | null,
};

export type ModelShowConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  venueID?: ModelIDInput | null,
  comedianIDs?: ModelIDInput | null,
  createdBy?: ModelStringInput | null,
  showImageKey?: ModelStringInput | null,
  ticketUrl?: ModelStringInput | null,
  ticketPrice?: ModelFloatInput | null,
  ageRestriction?: ModelStringInput | null,
  and?: Array< ModelShowConditionInput | null > | null,
  or?: Array< ModelShowConditionInput | null > | null,
  not?: ModelShowConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Show = {
  __typename: "Show",
  id: string,
  title: string,
  description?: string | null,
  dateTime: string,
  venueID: string,
  comedianIDs?: Array< string | null > | null,
  createdBy?: string | null,
  showImageKey?: string | null,
  ticketUrl?: string | null,
  ticketPrice?: number | null,
  ageRestriction?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateShowInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  dateTime?: string | null,
  venueID?: string | null,
  comedianIDs?: Array< string | null > | null,
  createdBy?: string | null,
  showImageKey?: string | null,
  ticketUrl?: string | null,
  ticketPrice?: number | null,
  ageRestriction?: string | null,
};

export type DeleteShowInput = {
  id: string,
};

export type CreateVenueInput = {
  id?: string | null,
  name: string,
  address?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null,
  openMic?: boolean | null,
  bio?: string | null,
  description?: string | null,
  venueImageKeys?: Array< string > | null,
  logoKey?: string | null,
  googleReviewsLink?: string | null,
  googlePlaceId?: string | null,
  website?: string | null,
  phone?: string | null,
  email?: string | null,
};

export type ModelVenueConditionInput = {
  name?: ModelStringInput | null,
  address?: ModelStringInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  country?: ModelStringInput | null,
  openMic?: ModelBooleanInput | null,
  bio?: ModelStringInput | null,
  description?: ModelStringInput | null,
  venueImageKeys?: ModelStringInput | null,
  logoKey?: ModelStringInput | null,
  googleReviewsLink?: ModelStringInput | null,
  googlePlaceId?: ModelStringInput | null,
  website?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelVenueConditionInput | null > | null,
  or?: Array< ModelVenueConditionInput | null > | null,
  not?: ModelVenueConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Venue = {
  __typename: "Venue",
  id: string,
  name: string,
  address?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null,
  openMic?: boolean | null,
  bio?: string | null,
  description?: string | null,
  venueImageKeys?: Array< string > | null,
  logoKey?: string | null,
  googleReviewsLink?: string | null,
  googlePlaceId?: string | null,
  website?: string | null,
  phone?: string | null,
  email?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateVenueInput = {
  id: string,
  name?: string | null,
  address?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null,
  openMic?: boolean | null,
  bio?: string | null,
  description?: string | null,
  venueImageKeys?: Array< string > | null,
  logoKey?: string | null,
  googleReviewsLink?: string | null,
  googlePlaceId?: string | null,
  website?: string | null,
  phone?: string | null,
  email?: string | null,
};

export type DeleteVenueInput = {
  id: string,
};

export type CreateComedianInput = {
  id?: string | null,
  stageName: string,
  bio?: string | null,
  profileImageKey?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  pronouns?: string | null,
  basedIn?: string | null,
  isActive?: boolean | null,
  availability?: string | null,
  comedyStyles?: Array< string | null > | null,
  performanceTypes?: Array< string | null > | null,
  contentRating?: string | null,
  performingSince?: number | null,
  headline?: string | null,
  website?: string | null,
  instagram?: string | null,
  twitter?: string | null,
  tiktok?: string | null,
  youtube?: string | null,
  facebook?: string | null,
  businessEmail?: string | null,
  businessPhone?: string | null,
  notableCredits?: Array< string | null > | null,
  awards?: Array< string | null > | null,
  pressKitUrl?: string | null,
  videoSampleUrl?: string | null,
  userProfileId?: string | null,
  isVerified?: boolean | null,
  isFeatured?: boolean | null,
  status?: string | null,
  createdBy?: string | null,
};

export type ModelComedianConditionInput = {
  stageName?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  profileImageKey?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  pronouns?: ModelStringInput | null,
  basedIn?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  availability?: ModelStringInput | null,
  comedyStyles?: ModelStringInput | null,
  performanceTypes?: ModelStringInput | null,
  contentRating?: ModelStringInput | null,
  performingSince?: ModelIntInput | null,
  headline?: ModelStringInput | null,
  website?: ModelStringInput | null,
  instagram?: ModelStringInput | null,
  twitter?: ModelStringInput | null,
  tiktok?: ModelStringInput | null,
  youtube?: ModelStringInput | null,
  facebook?: ModelStringInput | null,
  businessEmail?: ModelStringInput | null,
  businessPhone?: ModelStringInput | null,
  notableCredits?: ModelStringInput | null,
  awards?: ModelStringInput | null,
  pressKitUrl?: ModelStringInput | null,
  videoSampleUrl?: ModelStringInput | null,
  userProfileId?: ModelIDInput | null,
  isVerified?: ModelBooleanInput | null,
  isFeatured?: ModelBooleanInput | null,
  status?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  and?: Array< ModelComedianConditionInput | null > | null,
  or?: Array< ModelComedianConditionInput | null > | null,
  not?: ModelComedianConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Comedian = {
  __typename: "Comedian",
  id: string,
  stageName: string,
  bio?: string | null,
  profileImageKey?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  pronouns?: string | null,
  basedIn?: string | null,
  isActive?: boolean | null,
  availability?: string | null,
  comedyStyles?: Array< string | null > | null,
  performanceTypes?: Array< string | null > | null,
  contentRating?: string | null,
  performingSince?: number | null,
  headline?: string | null,
  website?: string | null,
  instagram?: string | null,
  twitter?: string | null,
  tiktok?: string | null,
  youtube?: string | null,
  facebook?: string | null,
  businessEmail?: string | null,
  businessPhone?: string | null,
  notableCredits?: Array< string | null > | null,
  awards?: Array< string | null > | null,
  pressKitUrl?: string | null,
  videoSampleUrl?: string | null,
  userProfileId?: string | null,
  isVerified?: boolean | null,
  isFeatured?: boolean | null,
  status?: string | null,
  createdBy?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateComedianInput = {
  id: string,
  stageName?: string | null,
  bio?: string | null,
  profileImageKey?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  pronouns?: string | null,
  basedIn?: string | null,
  isActive?: boolean | null,
  availability?: string | null,
  comedyStyles?: Array< string | null > | null,
  performanceTypes?: Array< string | null > | null,
  contentRating?: string | null,
  performingSince?: number | null,
  headline?: string | null,
  website?: string | null,
  instagram?: string | null,
  twitter?: string | null,
  tiktok?: string | null,
  youtube?: string | null,
  facebook?: string | null,
  businessEmail?: string | null,
  businessPhone?: string | null,
  notableCredits?: Array< string | null > | null,
  awards?: Array< string | null > | null,
  pressKitUrl?: string | null,
  videoSampleUrl?: string | null,
  userProfileId?: string | null,
  isVerified?: boolean | null,
  isFeatured?: boolean | null,
  status?: string | null,
  createdBy?: string | null,
};

export type DeleteComedianInput = {
  id: string,
};

export type CreateUserProfileInput = {
  id?: string | null,
  email: string,
  displayName?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  gender?: string | null,
  birthdate?: string | null,
  profileImageKey?: string | null,
  addressLine1?: string | null,
  addressLine2?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null,
  role: string,
};

export type ModelUserProfileConditionInput = {
  email?: ModelStringInput | null,
  displayName?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  gender?: ModelStringInput | null,
  birthdate?: ModelStringInput | null,
  profileImageKey?: ModelStringInput | null,
  addressLine1?: ModelStringInput | null,
  addressLine2?: ModelStringInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  country?: ModelStringInput | null,
  role?: ModelStringInput | null,
  and?: Array< ModelUserProfileConditionInput | null > | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  not?: ModelUserProfileConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  id: string,
  email: string,
  displayName?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  gender?: string | null,
  birthdate?: string | null,
  profileImageKey?: string | null,
  addressLine1?: string | null,
  addressLine2?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null,
  role: string,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateUserProfileInput = {
  id: string,
  email?: string | null,
  displayName?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  gender?: string | null,
  birthdate?: string | null,
  profileImageKey?: string | null,
  addressLine1?: string | null,
  addressLine2?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null,
  role?: string | null,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type CreateFavoriteComedianInput = {
  id?: string | null,
  userProfileId: string,
  comedianId: string,
  createdAt?: string | null,
};

export type ModelFavoriteComedianConditionInput = {
  userProfileId?: ModelIDInput | null,
  comedianId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelFavoriteComedianConditionInput | null > | null,
  or?: Array< ModelFavoriteComedianConditionInput | null > | null,
  not?: ModelFavoriteComedianConditionInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type FavoriteComedian = {
  __typename: "FavoriteComedian",
  id: string,
  userProfileId: string,
  comedianId: string,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateFavoriteComedianInput = {
  id: string,
  userProfileId?: string | null,
  comedianId?: string | null,
  createdAt?: string | null,
};

export type DeleteFavoriteComedianInput = {
  id: string,
};

export type CreateFavoriteVenueInput = {
  id?: string | null,
  userProfileId: string,
  venueId: string,
  createdAt?: string | null,
};

export type ModelFavoriteVenueConditionInput = {
  userProfileId?: ModelIDInput | null,
  venueId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelFavoriteVenueConditionInput | null > | null,
  or?: Array< ModelFavoriteVenueConditionInput | null > | null,
  not?: ModelFavoriteVenueConditionInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type FavoriteVenue = {
  __typename: "FavoriteVenue",
  id: string,
  userProfileId: string,
  venueId: string,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateFavoriteVenueInput = {
  id: string,
  userProfileId?: string | null,
  venueId?: string | null,
  createdAt?: string | null,
};

export type DeleteFavoriteVenueInput = {
  id: string,
};

export type CreateShowRSVPInput = {
  id?: string | null,
  userProfileId: string,
  showId: string,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelShowRSVPConditionInput = {
  userProfileId?: ModelIDInput | null,
  showId?: ModelIDInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelShowRSVPConditionInput | null > | null,
  or?: Array< ModelShowRSVPConditionInput | null > | null,
  not?: ModelShowRSVPConditionInput | null,
  owner?: ModelStringInput | null,
};

export type ShowRSVP = {
  __typename: "ShowRSVP",
  id: string,
  userProfileId: string,
  showId: string,
  status?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateShowRSVPInput = {
  id: string,
  userProfileId?: string | null,
  showId?: string | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteShowRSVPInput = {
  id: string,
};

export type CreateUserActivityInput = {
  id?: string | null,
  userProfileId: string,
  activityType?: string | null,
  entityId: string,
  entityType?: string | null,
  createdAt?: string | null,
};

export type ModelUserActivityConditionInput = {
  userProfileId?: ModelIDInput | null,
  activityType?: ModelStringInput | null,
  entityId?: ModelIDInput | null,
  entityType?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserActivityConditionInput | null > | null,
  or?: Array< ModelUserActivityConditionInput | null > | null,
  not?: ModelUserActivityConditionInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type UserActivity = {
  __typename: "UserActivity",
  id: string,
  userProfileId: string,
  activityType?: string | null,
  entityId: string,
  entityType?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateUserActivityInput = {
  id: string,
  userProfileId?: string | null,
  activityType?: string | null,
  entityId?: string | null,
  entityType?: string | null,
  createdAt?: string | null,
};

export type DeleteUserActivityInput = {
  id: string,
};

export type CreateShowReviewInput = {
  id?: string | null,
  userProfileId: string,
  showId: string,
  rating?: number | null,
  review?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelShowReviewConditionInput = {
  userProfileId?: ModelIDInput | null,
  showId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  review?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelShowReviewConditionInput | null > | null,
  or?: Array< ModelShowReviewConditionInput | null > | null,
  not?: ModelShowReviewConditionInput | null,
};

export type ShowReview = {
  __typename: "ShowReview",
  id: string,
  userProfileId: string,
  showId: string,
  rating?: number | null,
  review?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateShowReviewInput = {
  id: string,
  userProfileId?: string | null,
  showId?: string | null,
  rating?: number | null,
  review?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteShowReviewInput = {
  id: string,
};

export type CreateComedianReviewInput = {
  id?: string | null,
  userProfileId: string,
  comedianId: string,
  rating?: number | null,
  review?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelComedianReviewConditionInput = {
  userProfileId?: ModelIDInput | null,
  comedianId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  review?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelComedianReviewConditionInput | null > | null,
  or?: Array< ModelComedianReviewConditionInput | null > | null,
  not?: ModelComedianReviewConditionInput | null,
};

export type ComedianReview = {
  __typename: "ComedianReview",
  id: string,
  userProfileId: string,
  comedianId: string,
  rating?: number | null,
  review?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateComedianReviewInput = {
  id: string,
  userProfileId?: string | null,
  comedianId?: string | null,
  rating?: number | null,
  review?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteComedianReviewInput = {
  id: string,
};

export type ModelUserProfileFilterInput = {
  id?: ModelIDInput | null,
  email?: ModelStringInput | null,
  displayName?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  gender?: ModelStringInput | null,
  birthdate?: ModelStringInput | null,
  profileImageKey?: ModelStringInput | null,
  addressLine1?: ModelStringInput | null,
  addressLine2?: ModelStringInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  country?: ModelStringInput | null,
  role?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProfileFilterInput | null > | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  not?: ModelUserProfileFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelUserActivityFilterInput = {
  id?: ModelIDInput | null,
  userProfileId?: ModelIDInput | null,
  activityType?: ModelStringInput | null,
  entityId?: ModelIDInput | null,
  entityType?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserActivityFilterInput | null > | null,
  or?: Array< ModelUserActivityFilterInput | null > | null,
  not?: ModelUserActivityFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelUserActivityConnection = {
  __typename: "ModelUserActivityConnection",
  items:  Array<UserActivity | null >,
  nextToken?: string | null,
};

export type ModelShowFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  venueID?: ModelIDInput | null,
  comedianIDs?: ModelIDInput | null,
  createdBy?: ModelStringInput | null,
  showImageKey?: ModelStringInput | null,
  ticketUrl?: ModelStringInput | null,
  ticketPrice?: ModelFloatInput | null,
  ageRestriction?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelShowFilterInput | null > | null,
  or?: Array< ModelShowFilterInput | null > | null,
  not?: ModelShowFilterInput | null,
};

export type ModelShowConnection = {
  __typename: "ModelShowConnection",
  items:  Array<Show | null >,
  nextToken?: string | null,
};

export type ModelVenueFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  address?: ModelStringInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  country?: ModelStringInput | null,
  openMic?: ModelBooleanInput | null,
  bio?: ModelStringInput | null,
  description?: ModelStringInput | null,
  venueImageKeys?: ModelStringInput | null,
  logoKey?: ModelStringInput | null,
  googleReviewsLink?: ModelStringInput | null,
  googlePlaceId?: ModelStringInput | null,
  website?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  email?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelVenueFilterInput | null > | null,
  or?: Array< ModelVenueFilterInput | null > | null,
  not?: ModelVenueFilterInput | null,
};

export type ModelVenueConnection = {
  __typename: "ModelVenueConnection",
  items:  Array<Venue | null >,
  nextToken?: string | null,
};

export type ModelComedianFilterInput = {
  id?: ModelIDInput | null,
  stageName?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  profileImageKey?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  pronouns?: ModelStringInput | null,
  basedIn?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  availability?: ModelStringInput | null,
  comedyStyles?: ModelStringInput | null,
  performanceTypes?: ModelStringInput | null,
  contentRating?: ModelStringInput | null,
  performingSince?: ModelIntInput | null,
  headline?: ModelStringInput | null,
  website?: ModelStringInput | null,
  instagram?: ModelStringInput | null,
  twitter?: ModelStringInput | null,
  tiktok?: ModelStringInput | null,
  youtube?: ModelStringInput | null,
  facebook?: ModelStringInput | null,
  businessEmail?: ModelStringInput | null,
  businessPhone?: ModelStringInput | null,
  notableCredits?: ModelStringInput | null,
  awards?: ModelStringInput | null,
  pressKitUrl?: ModelStringInput | null,
  videoSampleUrl?: ModelStringInput | null,
  userProfileId?: ModelIDInput | null,
  isVerified?: ModelBooleanInput | null,
  isFeatured?: ModelBooleanInput | null,
  status?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelComedianFilterInput | null > | null,
  or?: Array< ModelComedianFilterInput | null > | null,
  not?: ModelComedianFilterInput | null,
};

export type ModelComedianConnection = {
  __typename: "ModelComedianConnection",
  items:  Array<Comedian | null >,
  nextToken?: string | null,
};

export type ModelFavoriteComedianFilterInput = {
  id?: ModelIDInput | null,
  userProfileId?: ModelIDInput | null,
  comedianId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFavoriteComedianFilterInput | null > | null,
  or?: Array< ModelFavoriteComedianFilterInput | null > | null,
  not?: ModelFavoriteComedianFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelFavoriteComedianConnection = {
  __typename: "ModelFavoriteComedianConnection",
  items:  Array<FavoriteComedian | null >,
  nextToken?: string | null,
};

export type ModelFavoriteVenueFilterInput = {
  id?: ModelIDInput | null,
  userProfileId?: ModelIDInput | null,
  venueId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFavoriteVenueFilterInput | null > | null,
  or?: Array< ModelFavoriteVenueFilterInput | null > | null,
  not?: ModelFavoriteVenueFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelFavoriteVenueConnection = {
  __typename: "ModelFavoriteVenueConnection",
  items:  Array<FavoriteVenue | null >,
  nextToken?: string | null,
};

export type ModelShowRSVPFilterInput = {
  id?: ModelIDInput | null,
  userProfileId?: ModelIDInput | null,
  showId?: ModelIDInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelShowRSVPFilterInput | null > | null,
  or?: Array< ModelShowRSVPFilterInput | null > | null,
  not?: ModelShowRSVPFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelShowRSVPConnection = {
  __typename: "ModelShowRSVPConnection",
  items:  Array<ShowRSVP | null >,
  nextToken?: string | null,
};

export type ModelShowReviewFilterInput = {
  id?: ModelIDInput | null,
  userProfileId?: ModelIDInput | null,
  showId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  review?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelShowReviewFilterInput | null > | null,
  or?: Array< ModelShowReviewFilterInput | null > | null,
  not?: ModelShowReviewFilterInput | null,
};

export type ModelShowReviewConnection = {
  __typename: "ModelShowReviewConnection",
  items:  Array<ShowReview | null >,
  nextToken?: string | null,
};

export type ModelComedianReviewFilterInput = {
  id?: ModelIDInput | null,
  userProfileId?: ModelIDInput | null,
  comedianId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  review?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelComedianReviewFilterInput | null > | null,
  or?: Array< ModelComedianReviewFilterInput | null > | null,
  not?: ModelComedianReviewFilterInput | null,
};

export type ModelComedianReviewConnection = {
  __typename: "ModelComedianReviewConnection",
  items:  Array<ComedianReview | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  gender?: ModelSubscriptionStringInput | null,
  birthdate?: ModelSubscriptionStringInput | null,
  profileImageKey?: ModelSubscriptionStringInput | null,
  addressLine1?: ModelSubscriptionStringInput | null,
  addressLine2?: ModelSubscriptionStringInput | null,
  city?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  postalCode?: ModelSubscriptionStringInput | null,
  country?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionUserActivityFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userProfileId?: ModelSubscriptionIDInput | null,
  activityType?: ModelSubscriptionStringInput | null,
  entityId?: ModelSubscriptionIDInput | null,
  entityType?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserActivityFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionShowFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  dateTime?: ModelSubscriptionStringInput | null,
  venueID?: ModelSubscriptionIDInput | null,
  comedianIDs?: ModelSubscriptionIDInput | null,
  createdBy?: ModelSubscriptionStringInput | null,
  showImageKey?: ModelSubscriptionStringInput | null,
  ticketUrl?: ModelSubscriptionStringInput | null,
  ticketPrice?: ModelSubscriptionFloatInput | null,
  ageRestriction?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionShowFilterInput | null > | null,
  or?: Array< ModelSubscriptionShowFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionVenueFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  city?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  postalCode?: ModelSubscriptionStringInput | null,
  country?: ModelSubscriptionStringInput | null,
  openMic?: ModelSubscriptionBooleanInput | null,
  bio?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  venueImageKeys?: ModelSubscriptionStringInput | null,
  logoKey?: ModelSubscriptionStringInput | null,
  googleReviewsLink?: ModelSubscriptionStringInput | null,
  googlePlaceId?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
  phone?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionVenueFilterInput | null > | null,
  or?: Array< ModelSubscriptionVenueFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionComedianFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  stageName?: ModelSubscriptionStringInput | null,
  bio?: ModelSubscriptionStringInput | null,
  profileImageKey?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  pronouns?: ModelSubscriptionStringInput | null,
  basedIn?: ModelSubscriptionStringInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  availability?: ModelSubscriptionStringInput | null,
  comedyStyles?: ModelSubscriptionStringInput | null,
  performanceTypes?: ModelSubscriptionStringInput | null,
  contentRating?: ModelSubscriptionStringInput | null,
  performingSince?: ModelSubscriptionIntInput | null,
  headline?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
  instagram?: ModelSubscriptionStringInput | null,
  twitter?: ModelSubscriptionStringInput | null,
  tiktok?: ModelSubscriptionStringInput | null,
  youtube?: ModelSubscriptionStringInput | null,
  facebook?: ModelSubscriptionStringInput | null,
  businessEmail?: ModelSubscriptionStringInput | null,
  businessPhone?: ModelSubscriptionStringInput | null,
  notableCredits?: ModelSubscriptionStringInput | null,
  awards?: ModelSubscriptionStringInput | null,
  pressKitUrl?: ModelSubscriptionStringInput | null,
  videoSampleUrl?: ModelSubscriptionStringInput | null,
  isVerified?: ModelSubscriptionBooleanInput | null,
  isFeatured?: ModelSubscriptionBooleanInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdBy?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionComedianFilterInput | null > | null,
  or?: Array< ModelSubscriptionComedianFilterInput | null > | null,
  userProfileId?: ModelStringInput | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFavoriteComedianFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userProfileId?: ModelSubscriptionIDInput | null,
  comedianId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFavoriteComedianFilterInput | null > | null,
  or?: Array< ModelSubscriptionFavoriteComedianFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionFavoriteVenueFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userProfileId?: ModelSubscriptionIDInput | null,
  venueId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFavoriteVenueFilterInput | null > | null,
  or?: Array< ModelSubscriptionFavoriteVenueFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionShowRSVPFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userProfileId?: ModelSubscriptionIDInput | null,
  showId?: ModelSubscriptionIDInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionShowRSVPFilterInput | null > | null,
  or?: Array< ModelSubscriptionShowRSVPFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionShowReviewFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  showId?: ModelSubscriptionIDInput | null,
  rating?: ModelSubscriptionIntInput | null,
  review?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionShowReviewFilterInput | null > | null,
  or?: Array< ModelSubscriptionShowReviewFilterInput | null > | null,
  userProfileId?: ModelStringInput | null,
};

export type ModelSubscriptionComedianReviewFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  comedianId?: ModelSubscriptionIDInput | null,
  rating?: ModelSubscriptionIntInput | null,
  review?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionComedianReviewFilterInput | null > | null,
  or?: Array< ModelSubscriptionComedianReviewFilterInput | null > | null,
  userProfileId?: ModelStringInput | null,
};

export type CreateShowMutationVariables = {
  input: CreateShowInput,
  condition?: ModelShowConditionInput | null,
};

export type CreateShowMutation = {
  createShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateShowMutationVariables = {
  input: UpdateShowInput,
  condition?: ModelShowConditionInput | null,
};

export type UpdateShowMutation = {
  updateShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteShowMutationVariables = {
  input: DeleteShowInput,
  condition?: ModelShowConditionInput | null,
};

export type DeleteShowMutation = {
  deleteShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateVenueMutationVariables = {
  input: CreateVenueInput,
  condition?: ModelVenueConditionInput | null,
};

export type CreateVenueMutation = {
  createVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateVenueMutationVariables = {
  input: UpdateVenueInput,
  condition?: ModelVenueConditionInput | null,
};

export type UpdateVenueMutation = {
  updateVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteVenueMutationVariables = {
  input: DeleteVenueInput,
  condition?: ModelVenueConditionInput | null,
};

export type DeleteVenueMutation = {
  deleteVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateComedianMutationVariables = {
  input: CreateComedianInput,
  condition?: ModelComedianConditionInput | null,
};

export type CreateComedianMutation = {
  createComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateComedianMutationVariables = {
  input: UpdateComedianInput,
  condition?: ModelComedianConditionInput | null,
};

export type UpdateComedianMutation = {
  updateComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteComedianMutationVariables = {
  input: DeleteComedianInput,
  condition?: ModelComedianConditionInput | null,
};

export type DeleteComedianMutation = {
  deleteComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  input: CreateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  input: DeleteUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateFavoriteComedianMutationVariables = {
  input: CreateFavoriteComedianInput,
  condition?: ModelFavoriteComedianConditionInput | null,
};

export type CreateFavoriteComedianMutation = {
  createFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateFavoriteComedianMutationVariables = {
  input: UpdateFavoriteComedianInput,
  condition?: ModelFavoriteComedianConditionInput | null,
};

export type UpdateFavoriteComedianMutation = {
  updateFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteFavoriteComedianMutationVariables = {
  input: DeleteFavoriteComedianInput,
  condition?: ModelFavoriteComedianConditionInput | null,
};

export type DeleteFavoriteComedianMutation = {
  deleteFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateFavoriteVenueMutationVariables = {
  input: CreateFavoriteVenueInput,
  condition?: ModelFavoriteVenueConditionInput | null,
};

export type CreateFavoriteVenueMutation = {
  createFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateFavoriteVenueMutationVariables = {
  input: UpdateFavoriteVenueInput,
  condition?: ModelFavoriteVenueConditionInput | null,
};

export type UpdateFavoriteVenueMutation = {
  updateFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteFavoriteVenueMutationVariables = {
  input: DeleteFavoriteVenueInput,
  condition?: ModelFavoriteVenueConditionInput | null,
};

export type DeleteFavoriteVenueMutation = {
  deleteFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateShowRSVPMutationVariables = {
  input: CreateShowRSVPInput,
  condition?: ModelShowRSVPConditionInput | null,
};

export type CreateShowRSVPMutation = {
  createShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateShowRSVPMutationVariables = {
  input: UpdateShowRSVPInput,
  condition?: ModelShowRSVPConditionInput | null,
};

export type UpdateShowRSVPMutation = {
  updateShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteShowRSVPMutationVariables = {
  input: DeleteShowRSVPInput,
  condition?: ModelShowRSVPConditionInput | null,
};

export type DeleteShowRSVPMutation = {
  deleteShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateUserActivityMutationVariables = {
  input: CreateUserActivityInput,
  condition?: ModelUserActivityConditionInput | null,
};

export type CreateUserActivityMutation = {
  createUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserActivityMutationVariables = {
  input: UpdateUserActivityInput,
  condition?: ModelUserActivityConditionInput | null,
};

export type UpdateUserActivityMutation = {
  updateUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserActivityMutationVariables = {
  input: DeleteUserActivityInput,
  condition?: ModelUserActivityConditionInput | null,
};

export type DeleteUserActivityMutation = {
  deleteUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateShowReviewMutationVariables = {
  input: CreateShowReviewInput,
  condition?: ModelShowReviewConditionInput | null,
};

export type CreateShowReviewMutation = {
  createShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateShowReviewMutationVariables = {
  input: UpdateShowReviewInput,
  condition?: ModelShowReviewConditionInput | null,
};

export type UpdateShowReviewMutation = {
  updateShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteShowReviewMutationVariables = {
  input: DeleteShowReviewInput,
  condition?: ModelShowReviewConditionInput | null,
};

export type DeleteShowReviewMutation = {
  deleteShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateComedianReviewMutationVariables = {
  input: CreateComedianReviewInput,
  condition?: ModelComedianReviewConditionInput | null,
};

export type CreateComedianReviewMutation = {
  createComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateComedianReviewMutationVariables = {
  input: UpdateComedianReviewInput,
  condition?: ModelComedianReviewConditionInput | null,
};

export type UpdateComedianReviewMutation = {
  updateComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteComedianReviewMutationVariables = {
  input: DeleteComedianReviewInput,
  condition?: ModelComedianReviewConditionInput | null,
};

export type DeleteComedianReviewMutation = {
  deleteComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      email: string,
      displayName?: string | null,
      firstName?: string | null,
      lastName?: string | null,
      gender?: string | null,
      birthdate?: string | null,
      profileImageKey?: string | null,
      addressLine1?: string | null,
      addressLine2?: string | null,
      city?: string | null,
      state?: string | null,
      postalCode?: string | null,
      country?: string | null,
      role: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserActivityQueryVariables = {
  id: string,
};

export type GetUserActivityQuery = {
  getUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserActivitiesQueryVariables = {
  filter?: ModelUserActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserActivitiesQuery = {
  listUserActivities?:  {
    __typename: "ModelUserActivityConnection",
    items:  Array< {
      __typename: "UserActivity",
      id: string,
      userProfileId: string,
      activityType?: string | null,
      entityId: string,
      entityType?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetShowQueryVariables = {
  id: string,
};

export type GetShowQuery = {
  getShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListShowsQueryVariables = {
  filter?: ModelShowFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShowsQuery = {
  listShows?:  {
    __typename: "ModelShowConnection",
    items:  Array< {
      __typename: "Show",
      id: string,
      title: string,
      description?: string | null,
      dateTime: string,
      venueID: string,
      comedianIDs?: Array< string | null > | null,
      createdBy?: string | null,
      showImageKey?: string | null,
      ticketUrl?: string | null,
      ticketPrice?: number | null,
      ageRestriction?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetVenueQueryVariables = {
  id: string,
};

export type GetVenueQuery = {
  getVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListVenuesQueryVariables = {
  filter?: ModelVenueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListVenuesQuery = {
  listVenues?:  {
    __typename: "ModelVenueConnection",
    items:  Array< {
      __typename: "Venue",
      id: string,
      name: string,
      address?: string | null,
      city?: string | null,
      state?: string | null,
      postalCode?: string | null,
      country?: string | null,
      openMic?: boolean | null,
      bio?: string | null,
      description?: string | null,
      venueImageKeys?: Array< string > | null,
      logoKey?: string | null,
      googleReviewsLink?: string | null,
      googlePlaceId?: string | null,
      website?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetComedianQueryVariables = {
  id: string,
};

export type GetComedianQuery = {
  getComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListComediansQueryVariables = {
  filter?: ModelComedianFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListComediansQuery = {
  listComedians?:  {
    __typename: "ModelComedianConnection",
    items:  Array< {
      __typename: "Comedian",
      id: string,
      stageName: string,
      bio?: string | null,
      profileImageKey?: string | null,
      firstName?: string | null,
      lastName?: string | null,
      pronouns?: string | null,
      basedIn?: string | null,
      isActive?: boolean | null,
      availability?: string | null,
      comedyStyles?: Array< string | null > | null,
      performanceTypes?: Array< string | null > | null,
      contentRating?: string | null,
      performingSince?: number | null,
      headline?: string | null,
      website?: string | null,
      instagram?: string | null,
      twitter?: string | null,
      tiktok?: string | null,
      youtube?: string | null,
      facebook?: string | null,
      businessEmail?: string | null,
      businessPhone?: string | null,
      notableCredits?: Array< string | null > | null,
      awards?: Array< string | null > | null,
      pressKitUrl?: string | null,
      videoSampleUrl?: string | null,
      userProfileId?: string | null,
      isVerified?: boolean | null,
      isFeatured?: boolean | null,
      status?: string | null,
      createdBy?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFavoriteComedianQueryVariables = {
  id: string,
};

export type GetFavoriteComedianQuery = {
  getFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListFavoriteComediansQueryVariables = {
  filter?: ModelFavoriteComedianFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFavoriteComediansQuery = {
  listFavoriteComedians?:  {
    __typename: "ModelFavoriteComedianConnection",
    items:  Array< {
      __typename: "FavoriteComedian",
      id: string,
      userProfileId: string,
      comedianId: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFavoriteVenueQueryVariables = {
  id: string,
};

export type GetFavoriteVenueQuery = {
  getFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListFavoriteVenuesQueryVariables = {
  filter?: ModelFavoriteVenueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFavoriteVenuesQuery = {
  listFavoriteVenues?:  {
    __typename: "ModelFavoriteVenueConnection",
    items:  Array< {
      __typename: "FavoriteVenue",
      id: string,
      userProfileId: string,
      venueId: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetShowRSVPQueryVariables = {
  id: string,
};

export type GetShowRSVPQuery = {
  getShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListShowRSVPSQueryVariables = {
  filter?: ModelShowRSVPFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShowRSVPSQuery = {
  listShowRSVPS?:  {
    __typename: "ModelShowRSVPConnection",
    items:  Array< {
      __typename: "ShowRSVP",
      id: string,
      userProfileId: string,
      showId: string,
      status?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetShowReviewQueryVariables = {
  id: string,
};

export type GetShowReviewQuery = {
  getShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListShowReviewsQueryVariables = {
  filter?: ModelShowReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShowReviewsQuery = {
  listShowReviews?:  {
    __typename: "ModelShowReviewConnection",
    items:  Array< {
      __typename: "ShowReview",
      id: string,
      userProfileId: string,
      showId: string,
      rating?: number | null,
      review?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetComedianReviewQueryVariables = {
  id: string,
};

export type GetComedianReviewQuery = {
  getComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListComedianReviewsQueryVariables = {
  filter?: ModelComedianReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListComedianReviewsQuery = {
  listComedianReviews?:  {
    __typename: "ModelComedianReviewConnection",
    items:  Array< {
      __typename: "ComedianReview",
      id: string,
      userProfileId: string,
      comedianId: string,
      rating?: number | null,
      review?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    email: string,
    displayName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    gender?: string | null,
    birthdate?: string | null,
    profileImageKey?: string | null,
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    role: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateUserActivitySubscriptionVariables = {
  filter?: ModelSubscriptionUserActivityFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserActivitySubscription = {
  onCreateUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserActivitySubscriptionVariables = {
  filter?: ModelSubscriptionUserActivityFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserActivitySubscription = {
  onUpdateUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserActivitySubscriptionVariables = {
  filter?: ModelSubscriptionUserActivityFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserActivitySubscription = {
  onDeleteUserActivity?:  {
    __typename: "UserActivity",
    id: string,
    userProfileId: string,
    activityType?: string | null,
    entityId: string,
    entityType?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateShowSubscriptionVariables = {
  filter?: ModelSubscriptionShowFilterInput | null,
};

export type OnCreateShowSubscription = {
  onCreateShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateShowSubscriptionVariables = {
  filter?: ModelSubscriptionShowFilterInput | null,
};

export type OnUpdateShowSubscription = {
  onUpdateShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteShowSubscriptionVariables = {
  filter?: ModelSubscriptionShowFilterInput | null,
};

export type OnDeleteShowSubscription = {
  onDeleteShow?:  {
    __typename: "Show",
    id: string,
    title: string,
    description?: string | null,
    dateTime: string,
    venueID: string,
    comedianIDs?: Array< string | null > | null,
    createdBy?: string | null,
    showImageKey?: string | null,
    ticketUrl?: string | null,
    ticketPrice?: number | null,
    ageRestriction?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateVenueSubscriptionVariables = {
  filter?: ModelSubscriptionVenueFilterInput | null,
};

export type OnCreateVenueSubscription = {
  onCreateVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateVenueSubscriptionVariables = {
  filter?: ModelSubscriptionVenueFilterInput | null,
};

export type OnUpdateVenueSubscription = {
  onUpdateVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteVenueSubscriptionVariables = {
  filter?: ModelSubscriptionVenueFilterInput | null,
};

export type OnDeleteVenueSubscription = {
  onDeleteVenue?:  {
    __typename: "Venue",
    id: string,
    name: string,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null,
    country?: string | null,
    openMic?: boolean | null,
    bio?: string | null,
    description?: string | null,
    venueImageKeys?: Array< string > | null,
    logoKey?: string | null,
    googleReviewsLink?: string | null,
    googlePlaceId?: string | null,
    website?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateComedianSubscriptionVariables = {
  filter?: ModelSubscriptionComedianFilterInput | null,
  userProfileId?: string | null,
};

export type OnCreateComedianSubscription = {
  onCreateComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateComedianSubscriptionVariables = {
  filter?: ModelSubscriptionComedianFilterInput | null,
  userProfileId?: string | null,
};

export type OnUpdateComedianSubscription = {
  onUpdateComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteComedianSubscriptionVariables = {
  filter?: ModelSubscriptionComedianFilterInput | null,
  userProfileId?: string | null,
};

export type OnDeleteComedianSubscription = {
  onDeleteComedian?:  {
    __typename: "Comedian",
    id: string,
    stageName: string,
    bio?: string | null,
    profileImageKey?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    basedIn?: string | null,
    isActive?: boolean | null,
    availability?: string | null,
    comedyStyles?: Array< string | null > | null,
    performanceTypes?: Array< string | null > | null,
    contentRating?: string | null,
    performingSince?: number | null,
    headline?: string | null,
    website?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    tiktok?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    businessEmail?: string | null,
    businessPhone?: string | null,
    notableCredits?: Array< string | null > | null,
    awards?: Array< string | null > | null,
    pressKitUrl?: string | null,
    videoSampleUrl?: string | null,
    userProfileId?: string | null,
    isVerified?: boolean | null,
    isFeatured?: boolean | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateFavoriteComedianSubscriptionVariables = {
  filter?: ModelSubscriptionFavoriteComedianFilterInput | null,
  owner?: string | null,
};

export type OnCreateFavoriteComedianSubscription = {
  onCreateFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateFavoriteComedianSubscriptionVariables = {
  filter?: ModelSubscriptionFavoriteComedianFilterInput | null,
  owner?: string | null,
};

export type OnUpdateFavoriteComedianSubscription = {
  onUpdateFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteFavoriteComedianSubscriptionVariables = {
  filter?: ModelSubscriptionFavoriteComedianFilterInput | null,
  owner?: string | null,
};

export type OnDeleteFavoriteComedianSubscription = {
  onDeleteFavoriteComedian?:  {
    __typename: "FavoriteComedian",
    id: string,
    userProfileId: string,
    comedianId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateFavoriteVenueSubscriptionVariables = {
  filter?: ModelSubscriptionFavoriteVenueFilterInput | null,
  owner?: string | null,
};

export type OnCreateFavoriteVenueSubscription = {
  onCreateFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateFavoriteVenueSubscriptionVariables = {
  filter?: ModelSubscriptionFavoriteVenueFilterInput | null,
  owner?: string | null,
};

export type OnUpdateFavoriteVenueSubscription = {
  onUpdateFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteFavoriteVenueSubscriptionVariables = {
  filter?: ModelSubscriptionFavoriteVenueFilterInput | null,
  owner?: string | null,
};

export type OnDeleteFavoriteVenueSubscription = {
  onDeleteFavoriteVenue?:  {
    __typename: "FavoriteVenue",
    id: string,
    userProfileId: string,
    venueId: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateShowRSVPSubscriptionVariables = {
  filter?: ModelSubscriptionShowRSVPFilterInput | null,
  owner?: string | null,
};

export type OnCreateShowRSVPSubscription = {
  onCreateShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateShowRSVPSubscriptionVariables = {
  filter?: ModelSubscriptionShowRSVPFilterInput | null,
  owner?: string | null,
};

export type OnUpdateShowRSVPSubscription = {
  onUpdateShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteShowRSVPSubscriptionVariables = {
  filter?: ModelSubscriptionShowRSVPFilterInput | null,
  owner?: string | null,
};

export type OnDeleteShowRSVPSubscription = {
  onDeleteShowRSVP?:  {
    __typename: "ShowRSVP",
    id: string,
    userProfileId: string,
    showId: string,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateShowReviewSubscriptionVariables = {
  filter?: ModelSubscriptionShowReviewFilterInput | null,
  userProfileId?: string | null,
};

export type OnCreateShowReviewSubscription = {
  onCreateShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateShowReviewSubscriptionVariables = {
  filter?: ModelSubscriptionShowReviewFilterInput | null,
  userProfileId?: string | null,
};

export type OnUpdateShowReviewSubscription = {
  onUpdateShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteShowReviewSubscriptionVariables = {
  filter?: ModelSubscriptionShowReviewFilterInput | null,
  userProfileId?: string | null,
};

export type OnDeleteShowReviewSubscription = {
  onDeleteShowReview?:  {
    __typename: "ShowReview",
    id: string,
    userProfileId: string,
    showId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateComedianReviewSubscriptionVariables = {
  filter?: ModelSubscriptionComedianReviewFilterInput | null,
  userProfileId?: string | null,
};

export type OnCreateComedianReviewSubscription = {
  onCreateComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateComedianReviewSubscriptionVariables = {
  filter?: ModelSubscriptionComedianReviewFilterInput | null,
  userProfileId?: string | null,
};

export type OnUpdateComedianReviewSubscription = {
  onUpdateComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteComedianReviewSubscriptionVariables = {
  filter?: ModelSubscriptionComedianReviewFilterInput | null,
  userProfileId?: string | null,
};

export type OnDeleteComedianReviewSubscription = {
  onDeleteComedianReview?:  {
    __typename: "ComedianReview",
    id: string,
    userProfileId: string,
    comedianId: string,
    rating?: number | null,
    review?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
