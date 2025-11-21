/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type FavoriteVenueCreateFormInputValues = {
    userProfileId?: string;
    venueId?: string;
    createdAt?: string;
};
export declare type FavoriteVenueCreateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    venueId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FavoriteVenueCreateFormOverridesProps = {
    FavoriteVenueCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    venueId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FavoriteVenueCreateFormProps = React.PropsWithChildren<{
    overrides?: FavoriteVenueCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FavoriteVenueCreateFormInputValues) => FavoriteVenueCreateFormInputValues;
    onSuccess?: (fields: FavoriteVenueCreateFormInputValues) => void;
    onError?: (fields: FavoriteVenueCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FavoriteVenueCreateFormInputValues) => FavoriteVenueCreateFormInputValues;
    onValidate?: FavoriteVenueCreateFormValidationValues;
} & React.CSSProperties>;
export default function FavoriteVenueCreateForm(props: FavoriteVenueCreateFormProps): React.ReactElement;
