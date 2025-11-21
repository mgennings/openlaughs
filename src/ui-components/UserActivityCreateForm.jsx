/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createUserActivity } from "../graphql/mutations";
const client = generateClient();
export default function UserActivityCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    userProfileId: "",
    activityType: "",
    entityId: "",
    entityType: "",
    createdAt: "",
  };
  const [userProfileId, setUserProfileId] = React.useState(
    initialValues.userProfileId
  );
  const [activityType, setActivityType] = React.useState(
    initialValues.activityType
  );
  const [entityId, setEntityId] = React.useState(initialValues.entityId);
  const [entityType, setEntityType] = React.useState(initialValues.entityType);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUserProfileId(initialValues.userProfileId);
    setActivityType(initialValues.activityType);
    setEntityId(initialValues.entityId);
    setEntityType(initialValues.entityType);
    setCreatedAt(initialValues.createdAt);
    setErrors({});
  };
  const validations = {
    userProfileId: [{ type: "Required" }],
    activityType: [],
    entityId: [{ type: "Required" }],
    entityType: [],
    createdAt: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          userProfileId,
          activityType,
          entityId,
          entityType,
          createdAt,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createUserActivity.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserActivityCreateForm")}
      {...rest}
    >
      <TextField
        label="User profile id"
        isRequired={true}
        isReadOnly={false}
        value={userProfileId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userProfileId: value,
              activityType,
              entityId,
              entityType,
              createdAt,
            };
            const result = onChange(modelFields);
            value = result?.userProfileId ?? value;
          }
          if (errors.userProfileId?.hasError) {
            runValidationTasks("userProfileId", value);
          }
          setUserProfileId(value);
        }}
        onBlur={() => runValidationTasks("userProfileId", userProfileId)}
        errorMessage={errors.userProfileId?.errorMessage}
        hasError={errors.userProfileId?.hasError}
        {...getOverrideProps(overrides, "userProfileId")}
      ></TextField>
      <TextField
        label="Activity type"
        isRequired={false}
        isReadOnly={false}
        value={activityType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userProfileId,
              activityType: value,
              entityId,
              entityType,
              createdAt,
            };
            const result = onChange(modelFields);
            value = result?.activityType ?? value;
          }
          if (errors.activityType?.hasError) {
            runValidationTasks("activityType", value);
          }
          setActivityType(value);
        }}
        onBlur={() => runValidationTasks("activityType", activityType)}
        errorMessage={errors.activityType?.errorMessage}
        hasError={errors.activityType?.hasError}
        {...getOverrideProps(overrides, "activityType")}
      ></TextField>
      <TextField
        label="Entity id"
        isRequired={true}
        isReadOnly={false}
        value={entityId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userProfileId,
              activityType,
              entityId: value,
              entityType,
              createdAt,
            };
            const result = onChange(modelFields);
            value = result?.entityId ?? value;
          }
          if (errors.entityId?.hasError) {
            runValidationTasks("entityId", value);
          }
          setEntityId(value);
        }}
        onBlur={() => runValidationTasks("entityId", entityId)}
        errorMessage={errors.entityId?.errorMessage}
        hasError={errors.entityId?.hasError}
        {...getOverrideProps(overrides, "entityId")}
      ></TextField>
      <TextField
        label="Entity type"
        isRequired={false}
        isReadOnly={false}
        value={entityType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userProfileId,
              activityType,
              entityId,
              entityType: value,
              createdAt,
            };
            const result = onChange(modelFields);
            value = result?.entityType ?? value;
          }
          if (errors.entityType?.hasError) {
            runValidationTasks("entityType", value);
          }
          setEntityType(value);
        }}
        onBlur={() => runValidationTasks("entityType", entityType)}
        errorMessage={errors.entityType?.errorMessage}
        hasError={errors.entityType?.hasError}
        {...getOverrideProps(overrides, "entityType")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userProfileId,
              activityType,
              entityId,
              entityType,
              createdAt: value,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
