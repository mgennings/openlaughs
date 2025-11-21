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
export declare type ShowReviewCreateFormInputValues = {
    userProfileId?: string;
    showId?: string;
    rating?: number;
    review?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ShowReviewCreateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    showId?: ValidationFunction<string>;
    rating?: ValidationFunction<number>;
    review?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ShowReviewCreateFormOverridesProps = {
    ShowReviewCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    showId?: PrimitiveOverrideProps<TextFieldProps>;
    rating?: PrimitiveOverrideProps<TextFieldProps>;
    review?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ShowReviewCreateFormProps = React.PropsWithChildren<{
    overrides?: ShowReviewCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ShowReviewCreateFormInputValues) => ShowReviewCreateFormInputValues;
    onSuccess?: (fields: ShowReviewCreateFormInputValues) => void;
    onError?: (fields: ShowReviewCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ShowReviewCreateFormInputValues) => ShowReviewCreateFormInputValues;
    onValidate?: ShowReviewCreateFormValidationValues;
} & React.CSSProperties>;
export default function ShowReviewCreateForm(props: ShowReviewCreateFormProps): React.ReactElement;
