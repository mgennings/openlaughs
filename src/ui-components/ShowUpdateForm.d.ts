/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Show } from "../API.ts";
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
export declare type ShowUpdateFormInputValues = {
    title?: string;
    description?: string;
    dateTime?: string;
    venueID?: string;
    createdBy?: string;
};
export declare type ShowUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    dateTime?: ValidationFunction<string>;
    venueID?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ShowUpdateFormOverridesProps = {
    ShowUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    dateTime?: PrimitiveOverrideProps<TextFieldProps>;
    venueID?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ShowUpdateFormProps = React.PropsWithChildren<{
    overrides?: ShowUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    show?: Show;
    onSubmit?: (fields: ShowUpdateFormInputValues) => ShowUpdateFormInputValues;
    onSuccess?: (fields: ShowUpdateFormInputValues) => void;
    onError?: (fields: ShowUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ShowUpdateFormInputValues) => ShowUpdateFormInputValues;
    onValidate?: ShowUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ShowUpdateForm(props: ShowUpdateFormProps): React.ReactElement;
