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
export declare type ComedianReviewCreateFormInputValues = {
    userProfileId?: string;
    comedianId?: string;
    rating?: number;
    review?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ComedianReviewCreateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    comedianId?: ValidationFunction<string>;
    rating?: ValidationFunction<number>;
    review?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ComedianReviewCreateFormOverridesProps = {
    ComedianReviewCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    comedianId?: PrimitiveOverrideProps<TextFieldProps>;
    rating?: PrimitiveOverrideProps<TextFieldProps>;
    review?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ComedianReviewCreateFormProps = React.PropsWithChildren<{
    overrides?: ComedianReviewCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ComedianReviewCreateFormInputValues) => ComedianReviewCreateFormInputValues;
    onSuccess?: (fields: ComedianReviewCreateFormInputValues) => void;
    onError?: (fields: ComedianReviewCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ComedianReviewCreateFormInputValues) => ComedianReviewCreateFormInputValues;
    onValidate?: ComedianReviewCreateFormValidationValues;
} & React.CSSProperties>;
export default function ComedianReviewCreateForm(props: ComedianReviewCreateFormProps): React.ReactElement;
