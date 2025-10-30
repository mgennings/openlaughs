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
export declare type UserProfileCreateFormInputValues = {
    email?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthdate?: string;
    profileImageKey?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    role?: string;
};
export declare type UserProfileCreateFormValidationValues = {
    email?: ValidationFunction<string>;
    displayName?: ValidationFunction<string>;
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    gender?: ValidationFunction<string>;
    birthdate?: ValidationFunction<string>;
    profileImageKey?: ValidationFunction<string>;
    addressLine1?: ValidationFunction<string>;
    addressLine2?: ValidationFunction<string>;
    city?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
    postalCode?: ValidationFunction<string>;
    country?: ValidationFunction<string>;
    role?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserProfileCreateFormOverridesProps = {
    UserProfileCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    displayName?: PrimitiveOverrideProps<TextFieldProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    gender?: PrimitiveOverrideProps<TextFieldProps>;
    birthdate?: PrimitiveOverrideProps<TextFieldProps>;
    profileImageKey?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine1?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine2?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    state?: PrimitiveOverrideProps<TextFieldProps>;
    postalCode?: PrimitiveOverrideProps<TextFieldProps>;
    country?: PrimitiveOverrideProps<TextFieldProps>;
    role?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserProfileCreateFormProps = React.PropsWithChildren<{
    overrides?: UserProfileCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserProfileCreateFormInputValues) => UserProfileCreateFormInputValues;
    onSuccess?: (fields: UserProfileCreateFormInputValues) => void;
    onError?: (fields: UserProfileCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserProfileCreateFormInputValues) => UserProfileCreateFormInputValues;
    onValidate?: UserProfileCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserProfileCreateForm(props: UserProfileCreateFormProps): React.ReactElement;
