/* tslint:disable */

// this is an auto generated file. This will be overwritten

import * as APITypes from '../API';
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
    createdBy
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
    createdBy
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
    createdBy
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
    openMic
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
    openMic
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
    openMic
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteVenueMutationVariables,
  APITypes.DeleteVenueMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $input: CreateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  createUserProfile(input: $input, condition: $condition) {
    id
    email
    displayName
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
