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
import { getComedianReview } from "../graphql/queries";
import { updateComedianReview } from "../graphql/mutations";
const client = generateClient();
export default function ComedianReviewUpdateForm(props) {
  const {
    id: idProp,
    comedianReview: comedianReviewModelProp,
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
    comedianId: "",
    rating: "",
    review: "",
    createdAt: "",
    updatedAt: "",
  };
  const [userProfileId, setUserProfileId] = React.useState(
    initialValues.userProfileId
  );
  const [comedianId, setComedianId] = React.useState(initialValues.comedianId);
  const [rating, setRating] = React.useState(initialValues.rating);
  const [review, setReview] = React.useState(initialValues.review);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = comedianReviewRecord
      ? { ...initialValues, ...comedianReviewRecord }
      : initialValues;
    setUserProfileId(cleanValues.userProfileId);
    setComedianId(cleanValues.comedianId);
    setRating(cleanValues.rating);
    setReview(cleanValues.review);
    setCreatedAt(cleanValues.createdAt);
    setUpdatedAt(cleanValues.updatedAt);
    setErrors({});
  };
  const [comedianReviewRecord, setComedianReviewRecord] = React.useState(
    comedianReviewModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getComedianReview.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getComedianReview
        : comedianReviewModelProp;
      setComedianReviewRecord(record);
    };
    queryData();
  }, [idProp, comedianReviewModelProp]);
  React.useEffect(resetStateValues, [comedianReviewRecord]);
  const validations = {
    userProfileId: [{ type: "Required" }],
    comedianId: [{ type: "Required" }],
    rating: [],
    review: [],
    createdAt: [{ type: "Required" }],
    updatedAt: [{ type: "Required" }],
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
          comedianId,
          rating: rating ?? null,
          review: review ?? null,
          createdAt,
          updatedAt,
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
            query: updateComedianReview.replaceAll("__typename", ""),
            variables: {
              input: {
                id: comedianReviewRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ComedianReviewUpdateForm")}
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
              comedianId,
              rating,
              review,
              createdAt,
              updatedAt,
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
        label="Comedian id"
        isRequired={true}
        isReadOnly={false}
        value={comedianId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userProfileId,
              comedianId: value,
              rating,
              review,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.comedianId ?? value;
          }
          if (errors.comedianId?.hasError) {
            runValidationTasks("comedianId", value);
          }
          setComedianId(value);
        }}
        onBlur={() => runValidationTasks("comedianId", comedianId)}
        errorMessage={errors.comedianId?.errorMessage}
        hasError={errors.comedianId?.hasError}
        {...getOverrideProps(overrides, "comedianId")}
      ></TextField>
      <TextField
        label="Rating"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={rating}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userProfileId,
              comedianId,
              rating: value,
              review,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.rating ?? value;
          }
          if (errors.rating?.hasError) {
            runValidationTasks("rating", value);
          }
          setRating(value);
        }}
        onBlur={() => runValidationTasks("rating", rating)}
        errorMessage={errors.rating?.errorMessage}
        hasError={errors.rating?.hasError}
        {...getOverrideProps(overrides, "rating")}
      ></TextField>
      <TextField
        label="Review"
        isRequired={false}
        isReadOnly={false}
        value={review}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userProfileId,
              comedianId,
              rating,
              review: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.review ?? value;
          }
          if (errors.review?.hasError) {
            runValidationTasks("review", value);
          }
          setReview(value);
        }}
        onBlur={() => runValidationTasks("review", review)}
        errorMessage={errors.review?.errorMessage}
        hasError={errors.review?.hasError}
        {...getOverrideProps(overrides, "review")}
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
              comedianId,
              rating,
              review,
              createdAt: value,
              updatedAt,
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
      <TextField
        label="Updated at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userProfileId,
              comedianId,
              rating,
              review,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || comedianReviewModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || comedianReviewModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
