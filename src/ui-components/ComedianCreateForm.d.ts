/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ComedianCreateFormInputValues = {
    stageName?: string;
    bio?: string;
    profileImageKey?: string;
    firstName?: string;
    lastName?: string;
    pronouns?: string;
    basedIn?: string;
    isActive?: boolean;
    availability?: string;
    comedyStyles?: string[];
    performanceTypes?: string[];
    contentRating?: string;
    performingSince?: number;
    headline?: string;
    website?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    businessEmail?: string;
    businessPhone?: string;
    notableCredits?: string[];
    awards?: string[];
    pressKitUrl?: string;
    videoSampleUrl?: string;
    userProfileId?: string;
    isVerified?: boolean;
    isFeatured?: boolean;
    status?: string;
    createdBy?: string;
};
export declare type ComedianCreateFormValidationValues = {
    stageName?: ValidationFunction<string>;
    bio?: ValidationFunction<string>;
    profileImageKey?: ValidationFunction<string>;
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    pronouns?: ValidationFunction<string>;
    basedIn?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
    availability?: ValidationFunction<string>;
    comedyStyles?: ValidationFunction<string>;
    performanceTypes?: ValidationFunction<string>;
    contentRating?: ValidationFunction<string>;
    performingSince?: ValidationFunction<number>;
    headline?: ValidationFunction<string>;
    website?: ValidationFunction<string>;
    instagram?: ValidationFunction<string>;
    twitter?: ValidationFunction<string>;
    tiktok?: ValidationFunction<string>;
    youtube?: ValidationFunction<string>;
    facebook?: ValidationFunction<string>;
    businessEmail?: ValidationFunction<string>;
    businessPhone?: ValidationFunction<string>;
    notableCredits?: ValidationFunction<string>;
    awards?: ValidationFunction<string>;
    pressKitUrl?: ValidationFunction<string>;
    videoSampleUrl?: ValidationFunction<string>;
    userProfileId?: ValidationFunction<string>;
    isVerified?: ValidationFunction<boolean>;
    isFeatured?: ValidationFunction<boolean>;
    status?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ComedianCreateFormOverridesProps = {
    ComedianCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    stageName?: PrimitiveOverrideProps<TextFieldProps>;
    bio?: PrimitiveOverrideProps<TextFieldProps>;
    profileImageKey?: PrimitiveOverrideProps<TextFieldProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    pronouns?: PrimitiveOverrideProps<TextFieldProps>;
    basedIn?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
    availability?: PrimitiveOverrideProps<TextFieldProps>;
    comedyStyles?: PrimitiveOverrideProps<TextFieldProps>;
    performanceTypes?: PrimitiveOverrideProps<TextFieldProps>;
    contentRating?: PrimitiveOverrideProps<TextFieldProps>;
    performingSince?: PrimitiveOverrideProps<TextFieldProps>;
    headline?: PrimitiveOverrideProps<TextFieldProps>;
    website?: PrimitiveOverrideProps<TextFieldProps>;
    instagram?: PrimitiveOverrideProps<TextFieldProps>;
    twitter?: PrimitiveOverrideProps<TextFieldProps>;
    tiktok?: PrimitiveOverrideProps<TextFieldProps>;
    youtube?: PrimitiveOverrideProps<TextFieldProps>;
    facebook?: PrimitiveOverrideProps<TextFieldProps>;
    businessEmail?: PrimitiveOverrideProps<TextFieldProps>;
    businessPhone?: PrimitiveOverrideProps<TextFieldProps>;
    notableCredits?: PrimitiveOverrideProps<TextFieldProps>;
    awards?: PrimitiveOverrideProps<TextFieldProps>;
    pressKitUrl?: PrimitiveOverrideProps<TextFieldProps>;
    videoSampleUrl?: PrimitiveOverrideProps<TextFieldProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    isVerified?: PrimitiveOverrideProps<SwitchFieldProps>;
    isFeatured?: PrimitiveOverrideProps<SwitchFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ComedianCreateFormProps = React.PropsWithChildren<{
    overrides?: ComedianCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ComedianCreateFormInputValues) => ComedianCreateFormInputValues;
    onSuccess?: (fields: ComedianCreateFormInputValues) => void;
    onError?: (fields: ComedianCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ComedianCreateFormInputValues) => ComedianCreateFormInputValues;
    onValidate?: ComedianCreateFormValidationValues;
} & React.CSSProperties>;
export default function ComedianCreateForm(props: ComedianCreateFormProps): React.ReactElement;
