/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { FavoriteComedian } from "../API.ts";
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
export declare type FavoriteComedianUpdateFormInputValues = {
    userProfileId?: string;
    comedianId?: string;
    createdAt?: string;
};
export declare type FavoriteComedianUpdateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    comedianId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FavoriteComedianUpdateFormOverridesProps = {
    FavoriteComedianUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    comedianId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FavoriteComedianUpdateFormProps = React.PropsWithChildren<{
    overrides?: FavoriteComedianUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    favoriteComedian?: FavoriteComedian;
    onSubmit?: (fields: FavoriteComedianUpdateFormInputValues) => FavoriteComedianUpdateFormInputValues;
    onSuccess?: (fields: FavoriteComedianUpdateFormInputValues) => void;
    onError?: (fields: FavoriteComedianUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FavoriteComedianUpdateFormInputValues) => FavoriteComedianUpdateFormInputValues;
    onValidate?: FavoriteComedianUpdateFormValidationValues;
} & React.CSSProperties>;
export default function FavoriteComedianUpdateForm(props: FavoriteComedianUpdateFormProps): React.ReactElement;
