/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ShowRSVP } from "../API.ts";
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
export declare type ShowRSVPUpdateFormInputValues = {
    userProfileId?: string;
    showId?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ShowRSVPUpdateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    showId?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ShowRSVPUpdateFormOverridesProps = {
    ShowRSVPUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    showId?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ShowRSVPUpdateFormProps = React.PropsWithChildren<{
    overrides?: ShowRSVPUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    showRSVP?: ShowRSVP;
    onSubmit?: (fields: ShowRSVPUpdateFormInputValues) => ShowRSVPUpdateFormInputValues;
    onSuccess?: (fields: ShowRSVPUpdateFormInputValues) => void;
    onError?: (fields: ShowRSVPUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ShowRSVPUpdateFormInputValues) => ShowRSVPUpdateFormInputValues;
    onValidate?: ShowRSVPUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ShowRSVPUpdateForm(props: ShowRSVPUpdateFormProps): React.ReactElement;
