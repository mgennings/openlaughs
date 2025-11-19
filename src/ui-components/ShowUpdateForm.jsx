/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getShow } from "../graphql/queries";
import { updateShow } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ShowUpdateForm(props) {
  const {
    id: idProp,
    show: showModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    title: "",
    description: "",
    dateTime: "",
    venueID: "",
    comedianIDs: [],
    createdBy: "",
    showImageKey: "",
    ticketUrl: "",
    ticketPrice: "",
    ageRestriction: "",
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [dateTime, setDateTime] = React.useState(initialValues.dateTime);
  const [venueID, setVenueID] = React.useState(initialValues.venueID);
  const [comedianIDs, setComedianIDs] = React.useState(
    initialValues.comedianIDs
  );
  const [createdBy, setCreatedBy] = React.useState(initialValues.createdBy);
  const [showImageKey, setShowImageKey] = React.useState(
    initialValues.showImageKey
  );
  const [ticketUrl, setTicketUrl] = React.useState(initialValues.ticketUrl);
  const [ticketPrice, setTicketPrice] = React.useState(
    initialValues.ticketPrice
  );
  const [ageRestriction, setAgeRestriction] = React.useState(
    initialValues.ageRestriction
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = showRecord
      ? { ...initialValues, ...showRecord }
      : initialValues;
    setTitle(cleanValues.title);
    setDescription(cleanValues.description);
    setDateTime(cleanValues.dateTime);
    setVenueID(cleanValues.venueID);
    setComedianIDs(cleanValues.comedianIDs ?? []);
    setCurrentComedianIDsValue("");
    setCreatedBy(cleanValues.createdBy);
    setShowImageKey(cleanValues.showImageKey);
    setTicketUrl(cleanValues.ticketUrl);
    setTicketPrice(cleanValues.ticketPrice);
    setAgeRestriction(cleanValues.ageRestriction);
    setErrors({});
  };
  const [showRecord, setShowRecord] = React.useState(showModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getShow.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getShow
        : showModelProp;
      setShowRecord(record);
    };
    queryData();
  }, [idProp, showModelProp]);
  React.useEffect(resetStateValues, [showRecord]);
  const [currentComedianIDsValue, setCurrentComedianIDsValue] =
    React.useState("");
  const comedianIDsRef = React.createRef();
  const validations = {
    title: [{ type: "Required" }],
    description: [],
    dateTime: [{ type: "Required" }],
    venueID: [{ type: "Required" }],
    comedianIDs: [],
    createdBy: [],
    showImageKey: [],
    ticketUrl: [],
    ticketPrice: [],
    ageRestriction: [],
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
          title,
          description: description ?? null,
          dateTime,
          venueID,
          comedianIDs: comedianIDs ?? null,
          createdBy: createdBy ?? null,
          showImageKey: showImageKey ?? null,
          ticketUrl: ticketUrl ?? null,
          ticketPrice: ticketPrice ?? null,
          ageRestriction: ageRestriction ?? null,
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
            query: updateShow.replaceAll("__typename", ""),
            variables: {
              input: {
                id: showRecord.id,
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
      {...getOverrideProps(overrides, "ShowUpdateForm")}
      {...rest}
    >
      <TextField
        label="Title"
        isRequired={true}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              description,
              dateTime,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description: value,
              dateTime,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Date time"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={dateTime && convertToLocal(new Date(dateTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime: value,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.dateTime ?? value;
          }
          if (errors.dateTime?.hasError) {
            runValidationTasks("dateTime", value);
          }
          setDateTime(value);
        }}
        onBlur={() => runValidationTasks("dateTime", dateTime)}
        errorMessage={errors.dateTime?.errorMessage}
        hasError={errors.dateTime?.hasError}
        {...getOverrideProps(overrides, "dateTime")}
      ></TextField>
      <TextField
        label="Venue id"
        isRequired={true}
        isReadOnly={false}
        value={venueID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID: value,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.venueID ?? value;
          }
          if (errors.venueID?.hasError) {
            runValidationTasks("venueID", value);
          }
          setVenueID(value);
        }}
        onBlur={() => runValidationTasks("venueID", venueID)}
        errorMessage={errors.venueID?.errorMessage}
        hasError={errors.venueID?.hasError}
        {...getOverrideProps(overrides, "venueID")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID,
              comedianIDs: values,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            values = result?.comedianIDs ?? values;
          }
          setComedianIDs(values);
          setCurrentComedianIDsValue("");
        }}
        currentFieldValue={currentComedianIDsValue}
        label={"Comedian i ds"}
        items={comedianIDs}
        hasError={errors?.comedianIDs?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("comedianIDs", currentComedianIDsValue)
        }
        errorMessage={errors?.comedianIDs?.errorMessage}
        setFieldValue={setCurrentComedianIDsValue}
        inputFieldRef={comedianIDsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Comedian i ds"
          isRequired={false}
          isReadOnly={false}
          value={currentComedianIDsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.comedianIDs?.hasError) {
              runValidationTasks("comedianIDs", value);
            }
            setCurrentComedianIDsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("comedianIDs", currentComedianIDsValue)
          }
          errorMessage={errors.comedianIDs?.errorMessage}
          hasError={errors.comedianIDs?.hasError}
          ref={comedianIDsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "comedianIDs")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Created by"
        isRequired={false}
        isReadOnly={false}
        value={createdBy}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID,
              comedianIDs,
              createdBy: value,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.createdBy ?? value;
          }
          if (errors.createdBy?.hasError) {
            runValidationTasks("createdBy", value);
          }
          setCreatedBy(value);
        }}
        onBlur={() => runValidationTasks("createdBy", createdBy)}
        errorMessage={errors.createdBy?.errorMessage}
        hasError={errors.createdBy?.hasError}
        {...getOverrideProps(overrides, "createdBy")}
      ></TextField>
      <TextField
        label="Show image key"
        isRequired={false}
        isReadOnly={false}
        value={showImageKey}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey: value,
              ticketUrl,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.showImageKey ?? value;
          }
          if (errors.showImageKey?.hasError) {
            runValidationTasks("showImageKey", value);
          }
          setShowImageKey(value);
        }}
        onBlur={() => runValidationTasks("showImageKey", showImageKey)}
        errorMessage={errors.showImageKey?.errorMessage}
        hasError={errors.showImageKey?.hasError}
        {...getOverrideProps(overrides, "showImageKey")}
      ></TextField>
      <TextField
        label="Ticket url"
        isRequired={false}
        isReadOnly={false}
        value={ticketUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl: value,
              ticketPrice,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.ticketUrl ?? value;
          }
          if (errors.ticketUrl?.hasError) {
            runValidationTasks("ticketUrl", value);
          }
          setTicketUrl(value);
        }}
        onBlur={() => runValidationTasks("ticketUrl", ticketUrl)}
        errorMessage={errors.ticketUrl?.errorMessage}
        hasError={errors.ticketUrl?.hasError}
        {...getOverrideProps(overrides, "ticketUrl")}
      ></TextField>
      <TextField
        label="Ticket price"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={ticketPrice}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice: value,
              ageRestriction,
            };
            const result = onChange(modelFields);
            value = result?.ticketPrice ?? value;
          }
          if (errors.ticketPrice?.hasError) {
            runValidationTasks("ticketPrice", value);
          }
          setTicketPrice(value);
        }}
        onBlur={() => runValidationTasks("ticketPrice", ticketPrice)}
        errorMessage={errors.ticketPrice?.errorMessage}
        hasError={errors.ticketPrice?.hasError}
        {...getOverrideProps(overrides, "ticketPrice")}
      ></TextField>
      <TextField
        label="Age restriction"
        isRequired={false}
        isReadOnly={false}
        value={ageRestriction}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              dateTime,
              venueID,
              comedianIDs,
              createdBy,
              showImageKey,
              ticketUrl,
              ticketPrice,
              ageRestriction: value,
            };
            const result = onChange(modelFields);
            value = result?.ageRestriction ?? value;
          }
          if (errors.ageRestriction?.hasError) {
            runValidationTasks("ageRestriction", value);
          }
          setAgeRestriction(value);
        }}
        onBlur={() => runValidationTasks("ageRestriction", ageRestriction)}
        errorMessage={errors.ageRestriction?.errorMessage}
        hasError={errors.ageRestriction?.hasError}
        {...getOverrideProps(overrides, "ageRestriction")}
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
          isDisabled={!(idProp || showModelProp)}
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
              !(idProp || showModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
