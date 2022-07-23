import React from "react";
import styled from "styled-components";

const CheckboxStyle = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-left: 20px;
  position: relative;
  cursor: pointer;

  .checkbox-inner {
    position: relative;
    top: 0;
    left: -8px;
    display: block;
    width: 16px;
    height: 16px;
    direction: ltr;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-collapse: separate;
    transition: all 0.3s;

    &:after {
      position: absolute;
      top: 50%;
      left: 27.5%;
      display: table;
      width: 3.714286px;
      height: 6.142857px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) scale(0) translate(-50%, -50%);
      opacity: 0;
      transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
      content: " ";
    }

    &.checked {
      background-color: #00b4d8;
      border: none;
      &:after {
        position: absolute;
        display: table;
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
        transform: rotate(45deg) scale(1) translate(-50%, -50%);
        opacity: 1;
        transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
        content: " ";
      }
    }

    &.indeterminate {
      background-color: #00b4d8;
      border: none;
      &:after {
        top: 50%;
        left: 50%;
        width: 10px;
        height: 2px;
        background-color: white;
        border: 0;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        content: " ";
      }
    }
  }

  input {
    position: absolute;
    left: 12px;
    cursor: pointer;
  }
`;

const Checkbox = ({ onChange, checked, children, indeterminate }) => {
  return (
    <CheckboxStyle>
      <input
        style={{ display: "none" }}
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event);
        }}
      />
      <span
        className={`checkbox-inner ${indeterminate ? "indeterminate" : checked ? "checked" : ""}`}
      ></span>
      <span>{children}</span>
    </CheckboxStyle>
  );
};

export default Checkbox;
