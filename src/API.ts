/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateShowInput = {
  id?: string | null,
  title: string,
  description?: string | null,
  dateTime: string,
  venueID: string,
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

export type ModelShowFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  venueID?: ModelIDInput | null,
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

export type ModelSubscriptionShowFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  dateTime?: ModelSubscriptionStringInput | null,
  venueID?: ModelSubscriptionIDInput | null,
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
