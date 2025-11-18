/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Venue } from "../API.ts";
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
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type VenueUpdateFormInputValues = {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    openMic?: boolean;
    bio?: string;
    description?: string;
    venueImageKeys?: string[];
    logoKey?: string;
    googleReviewsLink?: string;
    googlePlaceId?: string;
    website?: string;
    phone?: string;
    email?: string;
};
export declare type VenueUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    city?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
    postalCode?: ValidationFunction<string>;
    country?: ValidationFunction<string>;
    openMic?: ValidationFunction<boolean>;
    bio?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    venueImageKeys?: ValidationFunction<string>;
    logoKey?: ValidationFunction<string>;
    googleReviewsLink?: ValidationFunction<string>;
    googlePlaceId?: ValidationFunction<string>;
    website?: ValidationFunction<string>;
    phone?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type VenueUpdateFormOverridesProps = {
    VenueUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    state?: PrimitiveOverrideProps<TextFieldProps>;
    postalCode?: PrimitiveOverrideProps<TextFieldProps>;
    country?: PrimitiveOverrideProps<TextFieldProps>;
    openMic?: PrimitiveOverrideProps<SwitchFieldProps>;
    bio?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    venueImageKeys?: PrimitiveOverrideProps<TextFieldProps>;
    logoKey?: PrimitiveOverrideProps<TextFieldProps>;
    googleReviewsLink?: PrimitiveOverrideProps<TextFieldProps>;
    googlePlaceId?: PrimitiveOverrideProps<TextFieldProps>;
    website?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type VenueUpdateFormProps = React.PropsWithChildren<{
    overrides?: VenueUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    venue?: Venue;
    onSubmit?: (fields: VenueUpdateFormInputValues) => VenueUpdateFormInputValues;
    onSuccess?: (fields: VenueUpdateFormInputValues) => void;
    onError?: (fields: VenueUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: VenueUpdateFormInputValues) => VenueUpdateFormInputValues;
    onValidate?: VenueUpdateFormValidationValues;
} & React.CSSProperties>;
export default function VenueUpdateForm(props: VenueUpdateFormProps): React.ReactElement;
