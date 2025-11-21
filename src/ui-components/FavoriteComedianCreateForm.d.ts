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
export declare type FavoriteComedianCreateFormInputValues = {
    userProfileId?: string;
    comedianId?: string;
    createdAt?: string;
};
export declare type FavoriteComedianCreateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    comedianId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FavoriteComedianCreateFormOverridesProps = {
    FavoriteComedianCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    comedianId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FavoriteComedianCreateFormProps = React.PropsWithChildren<{
    overrides?: FavoriteComedianCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FavoriteComedianCreateFormInputValues) => FavoriteComedianCreateFormInputValues;
    onSuccess?: (fields: FavoriteComedianCreateFormInputValues) => void;
    onError?: (fields: FavoriteComedianCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FavoriteComedianCreateFormInputValues) => FavoriteComedianCreateFormInputValues;
    onValidate?: FavoriteComedianCreateFormValidationValues;
} & React.CSSProperties>;
export default function FavoriteComedianCreateForm(props: FavoriteComedianCreateFormProps): React.ReactElement;
