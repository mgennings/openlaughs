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
export declare type UserActivityCreateFormInputValues = {
    userProfileId?: string;
    activityType?: string;
    entityId?: string;
    entityType?: string;
    createdAt?: string;
};
export declare type UserActivityCreateFormValidationValues = {
    userProfileId?: ValidationFunction<string>;
    activityType?: ValidationFunction<string>;
    entityId?: ValidationFunction<string>;
    entityType?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserActivityCreateFormOverridesProps = {
    UserActivityCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userProfileId?: PrimitiveOverrideProps<TextFieldProps>;
    activityType?: PrimitiveOverrideProps<TextFieldProps>;
    entityId?: PrimitiveOverrideProps<TextFieldProps>;
    entityType?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserActivityCreateFormProps = React.PropsWithChildren<{
    overrides?: UserActivityCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserActivityCreateFormInputValues) => UserActivityCreateFormInputValues;
    onSuccess?: (fields: UserActivityCreateFormInputValues) => void;
    onError?: (fields: UserActivityCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserActivityCreateFormInputValues) => UserActivityCreateFormInputValues;
    onValidate?: UserActivityCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserActivityCreateForm(props: UserActivityCreateFormProps): React.ReactElement;
