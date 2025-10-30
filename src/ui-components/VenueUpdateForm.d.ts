/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import {
  GridProps,
  SwitchFieldProps,
  TextFieldProps,
} from '@aws-amplify/ui-react';
import { Venue } from '../API.ts';
export declare type EscapeHatchProps = {
  [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
  [key: string]: string;
};
export declare type Variant = {
  variantValues: VariantValues;
  overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse,
) => ValidationResponse | Promise<ValidationResponse>;
export declare type VenueUpdateFormInputValues = {
  name?: string;
  address?: string;
  city?: string;
  openMic?: boolean;
};
export declare type VenueUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  address?: ValidationFunction<string>;
  city?: ValidationFunction<string>;
  openMic?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> &
  React.DOMAttributes<HTMLDivElement>;
export declare type VenueUpdateFormOverridesProps = {
  VenueUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
  name?: PrimitiveOverrideProps<TextFieldProps>;
  address?: PrimitiveOverrideProps<TextFieldProps>;
  city?: PrimitiveOverrideProps<TextFieldProps>;
  openMic?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type VenueUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: VenueUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    venue?: Venue;
    onSubmit?: (
      fields: VenueUpdateFormInputValues,
    ) => VenueUpdateFormInputValues;
    onSuccess?: (fields: VenueUpdateFormInputValues) => void;
    onError?: (
      fields: VenueUpdateFormInputValues,
      errorMessage: string,
    ) => void;
    onChange?: (
      fields: VenueUpdateFormInputValues,
    ) => VenueUpdateFormInputValues;
    onValidate?: VenueUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function VenueUpdateForm(
  props: VenueUpdateFormProps,
): React.ReactElement;
