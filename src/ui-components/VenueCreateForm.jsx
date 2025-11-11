/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
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
} from '@aws-amplify/ui-react';
import { fetchByPath, getOverrideProps, validateField } from './utils';
import { generateClient } from 'aws-amplify/api';
import { createVenue } from '../graphql/mutations';
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
  const removeItem = async removeIndex => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== '' &&
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
        <ScrollView height="inherit" width="inherit" maxHeight={'7rem'}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: 'pointer',
                  alignItems: 'center',
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? '#B8CEF9' : '',
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
                    cursor: 'pointer',
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: 'M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z',
                      stroke: 'black',
                    },
                  ]}
                  ariaLabel="button"
                  onClick={event => {
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
            {selectedBadgeIndex !== undefined ? 'Save' : 'Add'}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function VenueCreateForm(props) {
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
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    openMic: false,
    bio: '',
    description: '',
    venueImageKeys: [],
    googleReviewsLink: '',
    website: '',
    phone: '',
    email: '',
  };
  const [name, setName] = React.useState(initialValues.name);
  const [address, setAddress] = React.useState(initialValues.address);
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [postalCode, setPostalCode] = React.useState(initialValues.postalCode);
  const [country, setCountry] = React.useState(initialValues.country);
  const [openMic, setOpenMic] = React.useState(initialValues.openMic);
  const [bio, setBio] = React.useState(initialValues.bio);
  const [description, setDescription] = React.useState(
    initialValues.description,
  );
  const [venueImageKeys, setVenueImageKeys] = React.useState(
    initialValues.venueImageKeys,
  );
  const [googleReviewsLink, setGoogleReviewsLink] = React.useState(
    initialValues.googleReviewsLink,
  );
  const [website, setWebsite] = React.useState(initialValues.website);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [email, setEmail] = React.useState(initialValues.email);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setAddress(initialValues.address);
    setCity(initialValues.city);
    setState(initialValues.state);
    setPostalCode(initialValues.postalCode);
    setCountry(initialValues.country);
    setOpenMic(initialValues.openMic);
    setBio(initialValues.bio);
    setDescription(initialValues.description);
    setVenueImageKeys(initialValues.venueImageKeys);
    setCurrentVenueImageKeysValue('');
    setGoogleReviewsLink(initialValues.googleReviewsLink);
    setWebsite(initialValues.website);
    setPhone(initialValues.phone);
    setEmail(initialValues.email);
    setErrors({});
  };
  const [currentVenueImageKeysValue, setCurrentVenueImageKeysValue] =
    React.useState('');
  const venueImageKeysRef = React.createRef();
  const validations = {
    name: [{ type: 'Required' }],
    address: [],
    city: [],
    state: [],
    postalCode: [],
    country: [],
    openMic: [],
    bio: [],
    description: [],
    venueImageKeys: [{ type: 'Required' }],
    googleReviewsLink: [],
    website: [],
    phone: [],
    email: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue,
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
    setErrors(errors => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async event => {
        event.preventDefault();
        let modelFields = {
          name,
          address,
          city,
          state,
          postalCode,
          country,
          openMic,
          bio,
          description,
          venueImageKeys,
          googleReviewsLink,
          website,
          phone,
          email,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map(item =>
                  runValidationTasks(fieldName, item),
                ),
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName]),
            );
            return promises;
          }, []),
        );
        if (validationResponses.some(r => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === 'string' && value === '') {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createVenue.replaceAll('__typename', ''),
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
            const messages = err.errors.map(e => e.message).join('\n');
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, 'VenueCreateForm')}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks('name', value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks('name', name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, 'name')}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address: value,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks('address', value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks('address', address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, 'address')}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={city}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city: value,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks('city', value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks('city', city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, 'city')}
      ></TextField>
      <TextField
        label="State"
        isRequired={false}
        isReadOnly={false}
        value={state}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state: value,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks('state', value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks('state', state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, 'state')}
      ></TextField>
      <TextField
        label="Postal code"
        isRequired={false}
        isReadOnly={false}
        value={postalCode}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode: value,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.postalCode ?? value;
          }
          if (errors.postalCode?.hasError) {
            runValidationTasks('postalCode', value);
          }
          setPostalCode(value);
        }}
        onBlur={() => runValidationTasks('postalCode', postalCode)}
        errorMessage={errors.postalCode?.errorMessage}
        hasError={errors.postalCode?.hasError}
        {...getOverrideProps(overrides, 'postalCode')}
      ></TextField>
      <TextField
        label="Country"
        isRequired={false}
        isReadOnly={false}
        value={country}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country: value,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.country ?? value;
          }
          if (errors.country?.hasError) {
            runValidationTasks('country', value);
          }
          setCountry(value);
        }}
        onBlur={() => runValidationTasks('country', country)}
        errorMessage={errors.country?.errorMessage}
        hasError={errors.country?.hasError}
        {...getOverrideProps(overrides, 'country')}
      ></TextField>
      <SwitchField
        label="Open mic"
        defaultChecked={false}
        isDisabled={false}
        isChecked={openMic}
        onChange={e => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic: value,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.openMic ?? value;
          }
          if (errors.openMic?.hasError) {
            runValidationTasks('openMic', value);
          }
          setOpenMic(value);
        }}
        onBlur={() => runValidationTasks('openMic', openMic)}
        errorMessage={errors.openMic?.errorMessage}
        hasError={errors.openMic?.hasError}
        {...getOverrideProps(overrides, 'openMic')}
      ></SwitchField>
      <TextField
        label="Bio"
        isRequired={false}
        isReadOnly={false}
        value={bio}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio: value,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.bio ?? value;
          }
          if (errors.bio?.hasError) {
            runValidationTasks('bio', value);
          }
          setBio(value);
        }}
        onBlur={() => runValidationTasks('bio', bio)}
        errorMessage={errors.bio?.errorMessage}
        hasError={errors.bio?.hasError}
        {...getOverrideProps(overrides, 'bio')}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description: value,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks('description', value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks('description', description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, 'description')}
      ></TextField>
      <ArrayField
        onChange={async items => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys: values,
              googleReviewsLink,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            values = result?.venueImageKeys ?? values;
          }
          setVenueImageKeys(values);
          setCurrentVenueImageKeysValue('');
        }}
        currentFieldValue={currentVenueImageKeysValue}
        label={'Venue image keys'}
        items={venueImageKeys}
        hasError={errors?.venueImageKeys?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks('venueImageKeys', currentVenueImageKeysValue)
        }
        errorMessage={errors?.venueImageKeys?.errorMessage}
        setFieldValue={setCurrentVenueImageKeysValue}
        inputFieldRef={venueImageKeysRef}
        defaultFieldValue={''}
      >
        <TextField
          label="Venue image keys"
          isRequired={true}
          isReadOnly={false}
          value={currentVenueImageKeysValue}
          onChange={e => {
            let { value } = e.target;
            if (errors.venueImageKeys?.hasError) {
              runValidationTasks('venueImageKeys', value);
            }
            setCurrentVenueImageKeysValue(value);
          }}
          onBlur={() =>
            runValidationTasks('venueImageKeys', currentVenueImageKeysValue)
          }
          errorMessage={errors.venueImageKeys?.errorMessage}
          hasError={errors.venueImageKeys?.hasError}
          ref={venueImageKeysRef}
          labelHidden={true}
          {...getOverrideProps(overrides, 'venueImageKeys')}
        ></TextField>
      </ArrayField>
      <TextField
        label="Google reviews link"
        isRequired={false}
        isReadOnly={false}
        value={googleReviewsLink}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink: value,
              website,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.googleReviewsLink ?? value;
          }
          if (errors.googleReviewsLink?.hasError) {
            runValidationTasks('googleReviewsLink', value);
          }
          setGoogleReviewsLink(value);
        }}
        onBlur={() =>
          runValidationTasks('googleReviewsLink', googleReviewsLink)
        }
        errorMessage={errors.googleReviewsLink?.errorMessage}
        hasError={errors.googleReviewsLink?.hasError}
        {...getOverrideProps(overrides, 'googleReviewsLink')}
      ></TextField>
      <TextField
        label="Website"
        isRequired={false}
        isReadOnly={false}
        value={website}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website: value,
              phone,
              email,
            };
            const result = onChange(modelFields);
            value = result?.website ?? value;
          }
          if (errors.website?.hasError) {
            runValidationTasks('website', value);
          }
          setWebsite(value);
        }}
        onBlur={() => runValidationTasks('website', website)}
        errorMessage={errors.website?.errorMessage}
        hasError={errors.website?.hasError}
        {...getOverrideProps(overrides, 'website')}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone: value,
              email,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks('phone', value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks('phone', phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, 'phone')}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={e => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              city,
              state,
              postalCode,
              country,
              openMic,
              bio,
              description,
              venueImageKeys,
              googleReviewsLink,
              website,
              phone,
              email: value,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks('email', value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks('email', email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, 'email')}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, 'CTAFlex')}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={event => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, 'ClearButton')}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, 'RightAlignCTASubFlex')}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some(e => e?.hasError)}
            {...getOverrideProps(overrides, 'SubmitButton')}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
