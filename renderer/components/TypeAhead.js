import React from "react";
import FlexContainer from "./FlexContainer";
import styled from "styled-components";
import {
  buttonInfo,
  inputBackground
} from '../layout/colors';
import Input from "./Input";

const TypeAheadContainer = styled(FlexContainer)`
  border-radius: 5px;
  border: solid 3px ${buttonInfo};
  background: ${inputBackground};
  margin-bottom: 16px;
  max-height: 135px;
  overflow-y: auto;
  flex-wrap: wrap;
  overflow-x: hidden;
`;

const TypeAheadInput = styled(Input)`
  border: none !important;
  height: 39px !important;
`; 

const Capsule = styled(FlexContainer)`
  border: 1px solid #606060;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0px 10px;
  flex-grow: 0;
  height: 25px;
  color: #929292;
  align-items: center;
  margin: 5px;
  font-size: 14px;
`;

const CloseIcon = styled.div`
  color: #929292;
  font-size: 20px;
  padding: 4px 0 4px 4px;
  line-height: 14px;
`;

export default ({placeholder, onChange, value, type}) => {

  const [inputValue, setInputValue] = React.useState("");

  const changeHandler = (e) => {
    if(e.target.value.split('').includes(",")) {
      setInputValue("");
      onChange(value);
    } else {
      setInputValue(e.target.value);
      let setValues = value ? value.split(",") : [];
      if(inputValue) {
        setValues.splice(setValues.length-1, 1);
      }
      onChange(setValues.length ? `${setValues.join(',')}${e.target.value ? `,${e.target.value}` : null}` : e.target.value);
    }
  }

  const deleteCapsule = (index) => () => {
    let newValue = value.split(",");
    newValue.splice(index, 1);
    onChange(newValue.join(','))
  }

  const capsuleValues = value ? value.split(",") : null;
  if(inputValue) {
    capsuleValues.splice(capsuleValues.length-1, 1);
  }

  return <TypeAheadContainer flow="row">
    {
      capsuleValues 
        ? capsuleValues.map((val, index) => (
            <Capsule key={`capsule-${index}`} flow="row">
              {val.trim()}<CloseIcon onClick={deleteCapsule(index)}>&times;</CloseIcon>
            </Capsule>
          ))
        : null
    }
    <TypeAheadInput placeholder={placeholder} onChange={changeHandler} value={inputValue} type={type} />
  </TypeAheadContainer>
}