import style from "../formStyle.module.css";
import { useState, useEffect } from "react";
import { ArrowBack } from "@mui/icons-material";
import styled from "styled-components";
import regex from "../../../../util/regex";
import Prompt from "../../Prompt";
import Textbox from "../../../Inputs/Textbox";
import states from "../../../../util/american-states";

const BusinessInformation = (props) => {
  useEffect(() => {}, []);

  const [formIsValid, setFormIsValid] = useState(false);

  const [businessName, setBusinessName] = useState({
    value: props.cred.businessName || "",
    isValid: false,
  });
  const [address, setAddress] = useState({
    value: props.cred.address || "",
    isValid: false,
  });
  const [address2, setAddress2] = useState({
    value: props.cred.address2 || "",
    isValid: false,
  });
  const [phoneNumber, setPhoneNumber] = useState({
    value: props.cred.phoneNumber || "",
    isValid: false,
  });
  const [phoneNumber2, setPhoneNumber2] = useState({
    value: props.cred.phoneNumber2 || "",
    isValid: false,
  });
  const [zipCode, setZipCode] = useState({
    value: props.cred.zipCode || "",
    isValid: false,
  });
  const [countryState, setCountryState] = useState({
    value: props.cred.countryState || "",
    isValid: false,
  });
  const [businessDescription, setBusinessDescription] = useState({
    value: props.cred.businessDescription || "",
    isValid: false,
  });

  const handleBusinessName = (event) => {
    setBusinessName({ ...businessName, value: event.target.value });
  };

  const handleBusinessNameValidation = (event) => {
    if (regex.businessName.test(event.target.value)) {
      setBusinessName({ ...businessName, isValid: false });
    } else {
      setBusinessName({ ...businessName, isValid: true });
    }
  };

  const handleAddress = (event) => {
    setAddress({ ...address, value: event.target.value });
  };

  const handleAddressValidation = (event) => {
    if (regex.address.test(event.target.value)) {
      setAddress({ ...address, isValid: false });
    } else {
      setAddress({ ...address, isValid: true });
    }
  };

  const handleAddress2 = (event) => {
    setAddress2({ ...address2, value: event.target.value });
  };

  const handleAddress2Validation = (event) => {
    if (regex.address.test(event.target.value) || address2.value === "") {
      setAddress2({ ...address2, isValid: false });
    } else {
      setAddress2({ ...address2, isValid: true });
    }
  };

  const handlePhoneNumber = (event) => {
    setPhoneNumber({ ...phoneNumber, value: event.target.value });
  };

  const handlePhoneValidation = (event) => {
    if (regex.phone.test(event.target.value)) {
      setPhoneNumber({ ...phoneNumber, isValid: false });
    } else {
      setPhoneNumber({ ...phoneNumber, isValid: true });
    }
  };

  const handlePhoneNumber2 = (event) => {
    setPhoneNumber2({ ...phoneNumber2, value: event.target.value });
  };

  const handlePhone2Validation = (event) => {
    if (regex.phone.test(event.target.value) || phoneNumber2.value === "") {
      setPhoneNumber2({ ...phoneNumber2, isValid: false });
    } else {
      setPhoneNumber2({ ...phoneNumber2, isValid: true });
    }
  };

  const handleZipCode = (event) => {
    setZipCode({ ...zipCode, value: event.target.value });
  };

  const handleZipCodeValidation = (event) => {
    if (regex.zipCode.test(event.target.value)) {
      setZipCode({ ...zipCode, isValid: false });
    } else {
      setZipCode({ ...zipCode, isValid: true });
    }
  };

  const handleCountryState = (event) => {
    setCountryState({ ...countryState, value: event.target.value });
  };

  const handleBusinessDescription = (event) => {
    setBusinessDescription({
      ...businessDescription,
      value: event.target.value,
    });
  };

  const handleBusinessDescriptionValidation = (event) => {
    if (regex.description.test(event.target.value)) {
      setBusinessDescription({ ...businessDescription, isValid: false });
    } else {
      setBusinessDescription({ ...businessDescription, isValid: true });
    }
  };

  const nextForm = (event) => {
    //trigger the external functions to switch to the next form and then push all the data to the auth object outside of this component
    event.preventDefault();
    //check is address and phone is empty but invalid
    if (address2.value === "") {
    } else if (address2.value.length > 0 && address2.isValid) {
      setFormIsValid(true);
      return;
    }
    if (phoneNumber2.value === "") {
    } else if (phoneNumber2.value.length > 0 && phoneNumber2.isValid) {
      setFormIsValid(true);
      return;
    }

    if (
      businessName.isValid ||
      address.isValid ||
      phoneNumber.isValid ||
      zipCode.isValid ||
      businessDescription.isValid
    ) {
      setFormIsValid(true);
      return;
    }

    setFormIsValid(false);

    props.handleFormData({
      businessName: businessName.value,
      address: address.value,
      address2: address2.value,
      phoneNumber: phoneNumber.value,
      phoneNumber2: phoneNumber2.value,
      zipCode: zipCode.value,
      countryState: countryState.value,
      businessDescription: businessDescription.value,
    });
    props.goToNext();
  };

  const previousForm = (event) => {
    //trigger the external functions to switch to the previous form and then push all the data to the auth object outside of this component
    props.goToPrev();
  };

  return (
    <Grid
      onSubmit={nextForm}
      className={`${style.grid} animate__animated animate__fadeInDown`}
      action=""
    >
      <h2>Business Information</h2>
      <div className={style.inputs}>
        <Textbox
          className={style.textInput}
          value={businessName.value}
          onChange={handleBusinessName}
          onBlur={handleBusinessNameValidation}
          type="text"
          label="Business Name"
          required
        />
        {businessName.isValid && (
          <Prompt>
            Business Name must be between 5 and 100 characters long
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          value={address.value}
          onChange={handleAddress}
          onBlur={handleAddressValidation}
          type="text"
          label="Address 1"
          required
        />
        {address.isValid && <Prompt>Enter a valid address</Prompt>}
        <Textbox
          className={style.textInput}
          value={address2.value}
          onChange={handleAddress2}
          onBlur={handleAddress2Validation}
          type="text"
          label="Address 2 *"
        />
        {address2.isValid && <Prompt>Enter a valid address</Prompt>}
        <Textbox
          className={style.textInput}
          value={phoneNumber.value}
          onChange={handlePhoneNumber}
          onBlur={handlePhoneValidation}
          type="tel"
          label="Phone 1"
          required
        />
        {phoneNumber.isValid && (
          <Prompt>
            Phone number is invalid. Number must be between 10 and 15 characters
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          value={phoneNumber2.value}
          onChange={handlePhoneNumber2}
          onBlur={handlePhone2Validation}
          type="tel"
          label="Phone 2 *"
        />
        {phoneNumber2.isValid && (
          <Prompt>
            Phone number is invalid. Number must be between 10 and 15 characters
          </Prompt>
        )}
        <div className="zipCode">
          <Textbox
            className={style.textInput}
            value={zipCode.value}
            onChange={handleZipCode}
            onBlur={handleZipCodeValidation}
            type="text"
            label="Zip Code"
            required
          />
          <Dropdown
            defaultValue={"Alabama"}
            onChange={handleCountryState}
            // className={style.textInput}
          >
            {states.map((state, index) => (
              <option value={state.name} key={state.abbreviation + index}>
                {state.name}
              </option>
            ))}
          </Dropdown>
        </div>
        {zipCode.isValid && <Prompt>Zip code is invalid.</Prompt>}
        <Textbox
          className={style.textInput}
          value={businessDescription.value}
          onChange={handleBusinessDescription}
          onBlur={handleBusinessDescriptionValidation}
          type="text"
          name="Business Description"
          label="Business Description"
          required
        />
        {businessDescription.isValid && (
          <Prompt>
            Your Business description should be between 10 and 255 characters
          </Prompt>
        )}
        {formIsValid && (
          <Prompt>One or more of your form values is invalid</Prompt>
        )}
      </div>
      <div className={style.links}>
        <div className={style.left}>
          <button className={style.submit} onClick={previousForm}>
            Back
          </button>
        </div>
        <div className={style.right}>
          <button className={style.submit} type="submit">
            Next
          </button>
        </div>
      </div>
    </Grid>
  );
};

export default BusinessInformation;

const Grid = styled.form`
  height: auto;

  .zipCode {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    gap: 20px;

    input {
      margin: 0;
    }

    input:nth-child(1) {
      margin-right: 20px;
      width: 40%;
    }
  }

  @media (max-height: 1024px) {
    position: relative;
    top: 20px;
  }
`;

const Dropdown = styled.select`
  border: solid white 2px;
  color: white;
  option {
    color: black;
  }
  border-radius: 20px;
  background: transparent;
  height: 40px;
  outline: none;
  padding: 0px 10px;
`;
