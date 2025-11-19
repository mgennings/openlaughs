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
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getComedian } from "../graphql/queries";
import { updateComedian } from "../graphql/mutations";
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
export default function ComedianUpdateForm(props) {
  const {
    id: idProp,
    comedian: comedianModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    stageName: "",
    bio: "",
    profileImageKey: "",
    firstName: "",
    lastName: "",
    pronouns: "",
    basedIn: "",
    isActive: false,
    availability: "",
    comedyStyles: [],
    performanceTypes: [],
    contentRating: "",
    performingSince: "",
    headline: "",
    website: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    youtube: "",
    facebook: "",
    businessEmail: "",
    businessPhone: "",
    notableCredits: [],
    awards: [],
    pressKitUrl: "",
    videoSampleUrl: "",
    userProfileId: "",
    isVerified: false,
    isFeatured: false,
    status: "",
    createdBy: "",
  };
  const [stageName, setStageName] = React.useState(initialValues.stageName);
  const [bio, setBio] = React.useState(initialValues.bio);
  const [profileImageKey, setProfileImageKey] = React.useState(
    initialValues.profileImageKey
  );
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [pronouns, setPronouns] = React.useState(initialValues.pronouns);
  const [basedIn, setBasedIn] = React.useState(initialValues.basedIn);
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [availability, setAvailability] = React.useState(
    initialValues.availability
  );
  const [comedyStyles, setComedyStyles] = React.useState(
    initialValues.comedyStyles
  );
  const [performanceTypes, setPerformanceTypes] = React.useState(
    initialValues.performanceTypes
  );
  const [contentRating, setContentRating] = React.useState(
    initialValues.contentRating
  );
  const [performingSince, setPerformingSince] = React.useState(
    initialValues.performingSince
  );
  const [headline, setHeadline] = React.useState(initialValues.headline);
  const [website, setWebsite] = React.useState(initialValues.website);
  const [instagram, setInstagram] = React.useState(initialValues.instagram);
  const [twitter, setTwitter] = React.useState(initialValues.twitter);
  const [tiktok, setTiktok] = React.useState(initialValues.tiktok);
  const [youtube, setYoutube] = React.useState(initialValues.youtube);
  const [facebook, setFacebook] = React.useState(initialValues.facebook);
  const [businessEmail, setBusinessEmail] = React.useState(
    initialValues.businessEmail
  );
  const [businessPhone, setBusinessPhone] = React.useState(
    initialValues.businessPhone
  );
  const [notableCredits, setNotableCredits] = React.useState(
    initialValues.notableCredits
  );
  const [awards, setAwards] = React.useState(initialValues.awards);
  const [pressKitUrl, setPressKitUrl] = React.useState(
    initialValues.pressKitUrl
  );
  const [videoSampleUrl, setVideoSampleUrl] = React.useState(
    initialValues.videoSampleUrl
  );
  const [userProfileId, setUserProfileId] = React.useState(
    initialValues.userProfileId
  );
  const [isVerified, setIsVerified] = React.useState(initialValues.isVerified);
  const [isFeatured, setIsFeatured] = React.useState(initialValues.isFeatured);
  const [status, setStatus] = React.useState(initialValues.status);
  const [createdBy, setCreatedBy] = React.useState(initialValues.createdBy);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = comedianRecord
      ? { ...initialValues, ...comedianRecord }
      : initialValues;
    setStageName(cleanValues.stageName);
    setBio(cleanValues.bio);
    setProfileImageKey(cleanValues.profileImageKey);
    setFirstName(cleanValues.firstName);
    setLastName(cleanValues.lastName);
    setPronouns(cleanValues.pronouns);
    setBasedIn(cleanValues.basedIn);
    setIsActive(cleanValues.isActive);
    setAvailability(cleanValues.availability);
    setComedyStyles(cleanValues.comedyStyles ?? []);
    setCurrentComedyStylesValue("");
    setPerformanceTypes(cleanValues.performanceTypes ?? []);
    setCurrentPerformanceTypesValue("");
    setContentRating(cleanValues.contentRating);
    setPerformingSince(cleanValues.performingSince);
    setHeadline(cleanValues.headline);
    setWebsite(cleanValues.website);
    setInstagram(cleanValues.instagram);
    setTwitter(cleanValues.twitter);
    setTiktok(cleanValues.tiktok);
    setYoutube(cleanValues.youtube);
    setFacebook(cleanValues.facebook);
    setBusinessEmail(cleanValues.businessEmail);
    setBusinessPhone(cleanValues.businessPhone);
    setNotableCredits(cleanValues.notableCredits ?? []);
    setCurrentNotableCreditsValue("");
    setAwards(cleanValues.awards ?? []);
    setCurrentAwardsValue("");
    setPressKitUrl(cleanValues.pressKitUrl);
    setVideoSampleUrl(cleanValues.videoSampleUrl);
    setUserProfileId(cleanValues.userProfileId);
    setIsVerified(cleanValues.isVerified);
    setIsFeatured(cleanValues.isFeatured);
    setStatus(cleanValues.status);
    setCreatedBy(cleanValues.createdBy);
    setErrors({});
  };
  const [comedianRecord, setComedianRecord] = React.useState(comedianModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getComedian.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getComedian
        : comedianModelProp;
      setComedianRecord(record);
    };
    queryData();
  }, [idProp, comedianModelProp]);
  React.useEffect(resetStateValues, [comedianRecord]);
  const [currentComedyStylesValue, setCurrentComedyStylesValue] =
    React.useState("");
  const comedyStylesRef = React.createRef();
  const [currentPerformanceTypesValue, setCurrentPerformanceTypesValue] =
    React.useState("");
  const performanceTypesRef = React.createRef();
  const [currentNotableCreditsValue, setCurrentNotableCreditsValue] =
    React.useState("");
  const notableCreditsRef = React.createRef();
  const [currentAwardsValue, setCurrentAwardsValue] = React.useState("");
  const awardsRef = React.createRef();
  const validations = {
    stageName: [{ type: "Required" }],
    bio: [],
    profileImageKey: [],
    firstName: [],
    lastName: [],
    pronouns: [],
    basedIn: [],
    isActive: [],
    availability: [],
    comedyStyles: [],
    performanceTypes: [],
    contentRating: [],
    performingSince: [],
    headline: [],
    website: [],
    instagram: [],
    twitter: [],
    tiktok: [],
    youtube: [],
    facebook: [],
    businessEmail: [],
    businessPhone: [],
    notableCredits: [],
    awards: [],
    pressKitUrl: [],
    videoSampleUrl: [],
    userProfileId: [],
    isVerified: [],
    isFeatured: [],
    status: [],
    createdBy: [],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          stageName,
          bio: bio ?? null,
          profileImageKey: profileImageKey ?? null,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          pronouns: pronouns ?? null,
          basedIn: basedIn ?? null,
          isActive: isActive ?? null,
          availability: availability ?? null,
          comedyStyles: comedyStyles ?? null,
          performanceTypes: performanceTypes ?? null,
          contentRating: contentRating ?? null,
          performingSince: performingSince ?? null,
          headline: headline ?? null,
          website: website ?? null,
          instagram: instagram ?? null,
          twitter: twitter ?? null,
          tiktok: tiktok ?? null,
          youtube: youtube ?? null,
          facebook: facebook ?? null,
          businessEmail: businessEmail ?? null,
          businessPhone: businessPhone ?? null,
          notableCredits: notableCredits ?? null,
          awards: awards ?? null,
          pressKitUrl: pressKitUrl ?? null,
          videoSampleUrl: videoSampleUrl ?? null,
          userProfileId: userProfileId ?? null,
          isVerified: isVerified ?? null,
          isFeatured: isFeatured ?? null,
          status: status ?? null,
          createdBy: createdBy ?? null,
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
            query: updateComedian.replaceAll("__typename", ""),
            variables: {
              input: {
                id: comedianRecord.id,
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
      {...getOverrideProps(overrides, "ComedianUpdateForm")}
      {...rest}
    >
      <TextField
        label="Stage name"
        isRequired={true}
        isReadOnly={false}
        value={stageName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName: value,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.stageName ?? value;
          }
          if (errors.stageName?.hasError) {
            runValidationTasks("stageName", value);
          }
          setStageName(value);
        }}
        onBlur={() => runValidationTasks("stageName", stageName)}
        errorMessage={errors.stageName?.errorMessage}
        hasError={errors.stageName?.hasError}
        {...getOverrideProps(overrides, "stageName")}
      ></TextField>
      <TextField
        label="Bio"
        isRequired={false}
        isReadOnly={false}
        value={bio}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio: value,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.bio ?? value;
          }
          if (errors.bio?.hasError) {
            runValidationTasks("bio", value);
          }
          setBio(value);
        }}
        onBlur={() => runValidationTasks("bio", bio)}
        errorMessage={errors.bio?.errorMessage}
        hasError={errors.bio?.hasError}
        {...getOverrideProps(overrides, "bio")}
      ></TextField>
      <TextField
        label="Profile image key"
        isRequired={false}
        isReadOnly={false}
        value={profileImageKey}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey: value,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.profileImageKey ?? value;
          }
          if (errors.profileImageKey?.hasError) {
            runValidationTasks("profileImageKey", value);
          }
          setProfileImageKey(value);
        }}
        onBlur={() => runValidationTasks("profileImageKey", profileImageKey)}
        errorMessage={errors.profileImageKey?.errorMessage}
        hasError={errors.profileImageKey?.hasError}
        {...getOverrideProps(overrides, "profileImageKey")}
      ></TextField>
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName: value,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName: value,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Pronouns"
        isRequired={false}
        isReadOnly={false}
        value={pronouns}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns: value,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.pronouns ?? value;
          }
          if (errors.pronouns?.hasError) {
            runValidationTasks("pronouns", value);
          }
          setPronouns(value);
        }}
        onBlur={() => runValidationTasks("pronouns", pronouns)}
        errorMessage={errors.pronouns?.errorMessage}
        hasError={errors.pronouns?.hasError}
        {...getOverrideProps(overrides, "pronouns")}
      ></TextField>
      <TextField
        label="Based in"
        isRequired={false}
        isReadOnly={false}
        value={basedIn}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn: value,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.basedIn ?? value;
          }
          if (errors.basedIn?.hasError) {
            runValidationTasks("basedIn", value);
          }
          setBasedIn(value);
        }}
        onBlur={() => runValidationTasks("basedIn", basedIn)}
        errorMessage={errors.basedIn?.errorMessage}
        hasError={errors.basedIn?.hasError}
        {...getOverrideProps(overrides, "basedIn")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive: value,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.isActive ?? value;
          }
          if (errors.isActive?.hasError) {
            runValidationTasks("isActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("isActive", isActive)}
        errorMessage={errors.isActive?.errorMessage}
        hasError={errors.isActive?.hasError}
        {...getOverrideProps(overrides, "isActive")}
      ></SwitchField>
      <TextField
        label="Availability"
        isRequired={false}
        isReadOnly={false}
        value={availability}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability: value,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.availability ?? value;
          }
          if (errors.availability?.hasError) {
            runValidationTasks("availability", value);
          }
          setAvailability(value);
        }}
        onBlur={() => runValidationTasks("availability", availability)}
        errorMessage={errors.availability?.errorMessage}
        hasError={errors.availability?.hasError}
        {...getOverrideProps(overrides, "availability")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles: values,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            values = result?.comedyStyles ?? values;
          }
          setComedyStyles(values);
          setCurrentComedyStylesValue("");
        }}
        currentFieldValue={currentComedyStylesValue}
        label={"Comedy styles"}
        items={comedyStyles}
        hasError={errors?.comedyStyles?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("comedyStyles", currentComedyStylesValue)
        }
        errorMessage={errors?.comedyStyles?.errorMessage}
        setFieldValue={setCurrentComedyStylesValue}
        inputFieldRef={comedyStylesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Comedy styles"
          isRequired={false}
          isReadOnly={false}
          value={currentComedyStylesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.comedyStyles?.hasError) {
              runValidationTasks("comedyStyles", value);
            }
            setCurrentComedyStylesValue(value);
          }}
          onBlur={() =>
            runValidationTasks("comedyStyles", currentComedyStylesValue)
          }
          errorMessage={errors.comedyStyles?.errorMessage}
          hasError={errors.comedyStyles?.hasError}
          ref={comedyStylesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "comedyStyles")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes: values,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            values = result?.performanceTypes ?? values;
          }
          setPerformanceTypes(values);
          setCurrentPerformanceTypesValue("");
        }}
        currentFieldValue={currentPerformanceTypesValue}
        label={"Performance types"}
        items={performanceTypes}
        hasError={errors?.performanceTypes?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "performanceTypes",
            currentPerformanceTypesValue
          )
        }
        errorMessage={errors?.performanceTypes?.errorMessage}
        setFieldValue={setCurrentPerformanceTypesValue}
        inputFieldRef={performanceTypesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Performance types"
          isRequired={false}
          isReadOnly={false}
          value={currentPerformanceTypesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.performanceTypes?.hasError) {
              runValidationTasks("performanceTypes", value);
            }
            setCurrentPerformanceTypesValue(value);
          }}
          onBlur={() =>
            runValidationTasks("performanceTypes", currentPerformanceTypesValue)
          }
          errorMessage={errors.performanceTypes?.errorMessage}
          hasError={errors.performanceTypes?.hasError}
          ref={performanceTypesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "performanceTypes")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Content rating"
        isRequired={false}
        isReadOnly={false}
        value={contentRating}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating: value,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.contentRating ?? value;
          }
          if (errors.contentRating?.hasError) {
            runValidationTasks("contentRating", value);
          }
          setContentRating(value);
        }}
        onBlur={() => runValidationTasks("contentRating", contentRating)}
        errorMessage={errors.contentRating?.errorMessage}
        hasError={errors.contentRating?.hasError}
        {...getOverrideProps(overrides, "contentRating")}
      ></TextField>
      <TextField
        label="Performing since"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={performingSince}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince: value,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.performingSince ?? value;
          }
          if (errors.performingSince?.hasError) {
            runValidationTasks("performingSince", value);
          }
          setPerformingSince(value);
        }}
        onBlur={() => runValidationTasks("performingSince", performingSince)}
        errorMessage={errors.performingSince?.errorMessage}
        hasError={errors.performingSince?.hasError}
        {...getOverrideProps(overrides, "performingSince")}
      ></TextField>
      <TextField
        label="Headline"
        isRequired={false}
        isReadOnly={false}
        value={headline}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline: value,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.headline ?? value;
          }
          if (errors.headline?.hasError) {
            runValidationTasks("headline", value);
          }
          setHeadline(value);
        }}
        onBlur={() => runValidationTasks("headline", headline)}
        errorMessage={errors.headline?.errorMessage}
        hasError={errors.headline?.hasError}
        {...getOverrideProps(overrides, "headline")}
      ></TextField>
      <TextField
        label="Website"
        isRequired={false}
        isReadOnly={false}
        value={website}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website: value,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.website ?? value;
          }
          if (errors.website?.hasError) {
            runValidationTasks("website", value);
          }
          setWebsite(value);
        }}
        onBlur={() => runValidationTasks("website", website)}
        errorMessage={errors.website?.errorMessage}
        hasError={errors.website?.hasError}
        {...getOverrideProps(overrides, "website")}
      ></TextField>
      <TextField
        label="Instagram"
        isRequired={false}
        isReadOnly={false}
        value={instagram}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram: value,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.instagram ?? value;
          }
          if (errors.instagram?.hasError) {
            runValidationTasks("instagram", value);
          }
          setInstagram(value);
        }}
        onBlur={() => runValidationTasks("instagram", instagram)}
        errorMessage={errors.instagram?.errorMessage}
        hasError={errors.instagram?.hasError}
        {...getOverrideProps(overrides, "instagram")}
      ></TextField>
      <TextField
        label="Twitter"
        isRequired={false}
        isReadOnly={false}
        value={twitter}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter: value,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.twitter ?? value;
          }
          if (errors.twitter?.hasError) {
            runValidationTasks("twitter", value);
          }
          setTwitter(value);
        }}
        onBlur={() => runValidationTasks("twitter", twitter)}
        errorMessage={errors.twitter?.errorMessage}
        hasError={errors.twitter?.hasError}
        {...getOverrideProps(overrides, "twitter")}
      ></TextField>
      <TextField
        label="Tiktok"
        isRequired={false}
        isReadOnly={false}
        value={tiktok}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok: value,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.tiktok ?? value;
          }
          if (errors.tiktok?.hasError) {
            runValidationTasks("tiktok", value);
          }
          setTiktok(value);
        }}
        onBlur={() => runValidationTasks("tiktok", tiktok)}
        errorMessage={errors.tiktok?.errorMessage}
        hasError={errors.tiktok?.hasError}
        {...getOverrideProps(overrides, "tiktok")}
      ></TextField>
      <TextField
        label="Youtube"
        isRequired={false}
        isReadOnly={false}
        value={youtube}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube: value,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.youtube ?? value;
          }
          if (errors.youtube?.hasError) {
            runValidationTasks("youtube", value);
          }
          setYoutube(value);
        }}
        onBlur={() => runValidationTasks("youtube", youtube)}
        errorMessage={errors.youtube?.errorMessage}
        hasError={errors.youtube?.hasError}
        {...getOverrideProps(overrides, "youtube")}
      ></TextField>
      <TextField
        label="Facebook"
        isRequired={false}
        isReadOnly={false}
        value={facebook}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook: value,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.facebook ?? value;
          }
          if (errors.facebook?.hasError) {
            runValidationTasks("facebook", value);
          }
          setFacebook(value);
        }}
        onBlur={() => runValidationTasks("facebook", facebook)}
        errorMessage={errors.facebook?.errorMessage}
        hasError={errors.facebook?.hasError}
        {...getOverrideProps(overrides, "facebook")}
      ></TextField>
      <TextField
        label="Business email"
        isRequired={false}
        isReadOnly={false}
        value={businessEmail}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail: value,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.businessEmail ?? value;
          }
          if (errors.businessEmail?.hasError) {
            runValidationTasks("businessEmail", value);
          }
          setBusinessEmail(value);
        }}
        onBlur={() => runValidationTasks("businessEmail", businessEmail)}
        errorMessage={errors.businessEmail?.errorMessage}
        hasError={errors.businessEmail?.hasError}
        {...getOverrideProps(overrides, "businessEmail")}
      ></TextField>
      <TextField
        label="Business phone"
        isRequired={false}
        isReadOnly={false}
        value={businessPhone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone: value,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.businessPhone ?? value;
          }
          if (errors.businessPhone?.hasError) {
            runValidationTasks("businessPhone", value);
          }
          setBusinessPhone(value);
        }}
        onBlur={() => runValidationTasks("businessPhone", businessPhone)}
        errorMessage={errors.businessPhone?.errorMessage}
        hasError={errors.businessPhone?.hasError}
        {...getOverrideProps(overrides, "businessPhone")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits: values,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            values = result?.notableCredits ?? values;
          }
          setNotableCredits(values);
          setCurrentNotableCreditsValue("");
        }}
        currentFieldValue={currentNotableCreditsValue}
        label={"Notable credits"}
        items={notableCredits}
        hasError={errors?.notableCredits?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("notableCredits", currentNotableCreditsValue)
        }
        errorMessage={errors?.notableCredits?.errorMessage}
        setFieldValue={setCurrentNotableCreditsValue}
        inputFieldRef={notableCreditsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Notable credits"
          isRequired={false}
          isReadOnly={false}
          value={currentNotableCreditsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.notableCredits?.hasError) {
              runValidationTasks("notableCredits", value);
            }
            setCurrentNotableCreditsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("notableCredits", currentNotableCreditsValue)
          }
          errorMessage={errors.notableCredits?.errorMessage}
          hasError={errors.notableCredits?.hasError}
          ref={notableCreditsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "notableCredits")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards: values,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            values = result?.awards ?? values;
          }
          setAwards(values);
          setCurrentAwardsValue("");
        }}
        currentFieldValue={currentAwardsValue}
        label={"Awards"}
        items={awards}
        hasError={errors?.awards?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("awards", currentAwardsValue)
        }
        errorMessage={errors?.awards?.errorMessage}
        setFieldValue={setCurrentAwardsValue}
        inputFieldRef={awardsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Awards"
          isRequired={false}
          isReadOnly={false}
          value={currentAwardsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.awards?.hasError) {
              runValidationTasks("awards", value);
            }
            setCurrentAwardsValue(value);
          }}
          onBlur={() => runValidationTasks("awards", currentAwardsValue)}
          errorMessage={errors.awards?.errorMessage}
          hasError={errors.awards?.hasError}
          ref={awardsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "awards")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Press kit url"
        isRequired={false}
        isReadOnly={false}
        value={pressKitUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl: value,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.pressKitUrl ?? value;
          }
          if (errors.pressKitUrl?.hasError) {
            runValidationTasks("pressKitUrl", value);
          }
          setPressKitUrl(value);
        }}
        onBlur={() => runValidationTasks("pressKitUrl", pressKitUrl)}
        errorMessage={errors.pressKitUrl?.errorMessage}
        hasError={errors.pressKitUrl?.hasError}
        {...getOverrideProps(overrides, "pressKitUrl")}
      ></TextField>
      <TextField
        label="Video sample url"
        isRequired={false}
        isReadOnly={false}
        value={videoSampleUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl: value,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.videoSampleUrl ?? value;
          }
          if (errors.videoSampleUrl?.hasError) {
            runValidationTasks("videoSampleUrl", value);
          }
          setVideoSampleUrl(value);
        }}
        onBlur={() => runValidationTasks("videoSampleUrl", videoSampleUrl)}
        errorMessage={errors.videoSampleUrl?.errorMessage}
        hasError={errors.videoSampleUrl?.hasError}
        {...getOverrideProps(overrides, "videoSampleUrl")}
      ></TextField>
      <TextField
        label="User profile id"
        isRequired={false}
        isReadOnly={false}
        value={userProfileId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId: value,
              isVerified,
              isFeatured,
              status,
              createdBy,
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
      <SwitchField
        label="Is verified"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isVerified}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified: value,
              isFeatured,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.isVerified ?? value;
          }
          if (errors.isVerified?.hasError) {
            runValidationTasks("isVerified", value);
          }
          setIsVerified(value);
        }}
        onBlur={() => runValidationTasks("isVerified", isVerified)}
        errorMessage={errors.isVerified?.errorMessage}
        hasError={errors.isVerified?.hasError}
        {...getOverrideProps(overrides, "isVerified")}
      ></SwitchField>
      <SwitchField
        label="Is featured"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isFeatured}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured: value,
              status,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.isFeatured ?? value;
          }
          if (errors.isFeatured?.hasError) {
            runValidationTasks("isFeatured", value);
          }
          setIsFeatured(value);
        }}
        onBlur={() => runValidationTasks("isFeatured", isFeatured)}
        errorMessage={errors.isFeatured?.errorMessage}
        hasError={errors.isFeatured?.hasError}
        {...getOverrideProps(overrides, "isFeatured")}
      ></SwitchField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status: value,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextField
        label="Created by"
        isRequired={false}
        isReadOnly={false}
        value={createdBy}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              stageName,
              bio,
              profileImageKey,
              firstName,
              lastName,
              pronouns,
              basedIn,
              isActive,
              availability,
              comedyStyles,
              performanceTypes,
              contentRating,
              performingSince,
              headline,
              website,
              instagram,
              twitter,
              tiktok,
              youtube,
              facebook,
              businessEmail,
              businessPhone,
              notableCredits,
              awards,
              pressKitUrl,
              videoSampleUrl,
              userProfileId,
              isVerified,
              isFeatured,
              status,
              createdBy: value,
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
          isDisabled={!(idProp || comedianModelProp)}
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
              !(idProp || comedianModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
