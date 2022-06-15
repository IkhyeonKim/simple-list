import React, { useEffect } from "react";
import styled from "styled-components";
import ArrowIcon from "./ArrowIcon";

/*
Dark blue: 03045e
Navy: 023e8a
0077b6
00b4d8
ade8f4
The lightest blue: #e9fafd
*/

const ListWrapper = styled.div`
  width: 200px;
  /* height: 30px; */
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;

  .list-selector {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;

    &:hover {
      border: 1px solid #00b4d8;
    }

    &.list-selector-focused {
      border: 1px solid #00b4d8;
      box-shadow: 0 0 0 2px #e9fafd;
    }
  }

  ul.list {
    width: 100%;
    /* padding: 12px; */
    margin-top: 2px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  li.list-item {
    position: relative;
    list-style: none;
    height: 30px;
    display: flex;
    align-items: center;

    & > input {
      position: absolute;
      left: 12px;
      cursor: pointer;
    }

    & > label {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding-left: 30px;
      cursor: pointer;
    }
    &:hover,
    &:focus {
      background-color: #e9fafd;
    }
  }

  svg {
    line-height: 1;
  }
`;
const renderSelector = (list) => {
  return <div>{list[0].value}</div>;
};

const isArrayItemExists = (list) => {
  if (!Array.isArray(list)) return false;
  if (list.length < 1) return false;
  return true;
};

const SimpleListPresenter = ({
  itemList,
  isListVisible,
  refListEl,
  onChangeCheckboxItem,
  selectedList,
}) => {
  useEffect(() => {
    console.log("Presenter", { selectedList });
  }, [selectedList]);
  return (
    <ListWrapper className="list-wrapper" ref={refListEl}>
      <div className={`${isListVisible ? "list-selector list-selector-focused" : "list-selector"}`}>
        {isArrayItemExists(selectedList) && renderSelector(selectedList)}
        <ArrowIcon />
      </div>
      {isListVisible && (
        <ul className="list">
          {itemList.map((item) => {
            return (
              <li key={item.key} className="list-item">
                <input
                  type="checkbox"
                  id={item.key}
                  name={item.key}
                  checked={item.checked}
                  onChange={(event) => onChangeCheckboxItem({ event, checkedItem: item })}
                />
                <label htmlFor={item.key}>{item.value}</label>
              </li>
            );
          })}
        </ul>
      )}
    </ListWrapper>
  );
};

export default SimpleListPresenter;
