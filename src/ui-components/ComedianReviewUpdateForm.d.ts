/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ComedianReview } from "../API.ts";
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
export declare type ComedianReviewUpdateFormInputValues = {
    userProfileId?: string;
    comedianId?: string;
    rating?: number;
    review?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ComedianReviewUpdateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    comedianId?: ValidationFunction<string>;
    rating?: ValidationFunction<number>;
    review?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ComedianReviewUpdateFormOverridesProps = {
    ComedianReviewUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    comedianId?: PrimitiveOverrideProps<TextFieldProps>;
    rating?: PrimitiveOverrideProps<TextFieldProps>;
    review?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ComedianReviewUpdateFormProps = React.PropsWithChildren<{
    overrides?: ComedianReviewUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    comedianReview?: ComedianReview;
    onSubmit?: (fields: ComedianReviewUpdateFormInputValues) => ComedianReviewUpdateFormInputValues;
    onSuccess?: (fields: ComedianReviewUpdateFormInputValues) => void;
    onError?: (fields: ComedianReviewUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ComedianReviewUpdateFormInputValues) => ComedianReviewUpdateFormInputValues;
    onValidate?: ComedianReviewUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ComedianReviewUpdateForm(props: ComedianReviewUpdateFormProps): React.ReactElement;
