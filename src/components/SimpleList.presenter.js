import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import ArrowIcon from "./ArrowIcon";
import Checkbox from "./Checkbox";

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

  .list-selector-allcheck {
  }

  .list-selector-filter {
    & > input {
      width: 100%;
      margin-top: -1px;
      padding: 8px;
      border: 1px solid #d9d9d9;
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
  filteredList,
  filterTxt,
  setFilterTxt,
  isAllChecked,
  setIsAllChecked,
  isIndeterminate,
}) => {
  console.log("SimpleListPresenter", { isAllChecked, isListVisible });
  useEffect(() => {
    console.log("Presenter", { selectedList });
  }, [selectedList]);

  const renderItemList = useCallback(() => {
    return itemList.map((item) => {
      return (
        <li key={item.key} className="list-item">
          <Checkbox
            checked={item.checked}
            onChange={(event) => onChangeCheckboxItem({ event, checkedItem: item })}
          >
            {item.value}
          </Checkbox>
        </li>
      );
    });
  }, [itemList, onChangeCheckboxItem]);

  const renderFilteredItemList = useCallback(() => {
    return filteredList.map((item) => {
      return (
        <li key={item.key} className="list-item">
          <Checkbox
            checked={item.checked}
            onChange={(event) => onChangeCheckboxItem({ event, checkedItem: item })}
          >
            {item.value}
          </Checkbox>
        </li>
      );
    });
  }, [filteredList, onChangeCheckboxItem]);

  return (
    <ListWrapper className="list-wrapper" ref={refListEl}>
      <div className="list-selector-wrapper">
        <div
          className={`${isListVisible ? "list-selector list-selector-focused" : "list-selector"}`}
        >
          {isArrayItemExists(selectedList) && renderSelector(selectedList)} <ArrowIcon />
        </div>
        <div className="list-selector-allcheck">
          {isListVisible && (
            <ul className="list">
              <li className="list-item">
                <Checkbox
                  checked={isAllChecked}
                  indeterminate={isIndeterminate}
                  onChange={(event) => setIsAllChecked(event.target.checked)}
                >
                  ALL
                </Checkbox>
              </li>
            </ul>
          )}
        </div>
        <div className="list-selector-filter">
          {isListVisible && (
            <input
              value={filterTxt}
              onChange={(e) => setFilterTxt(e.target.value)}
              placeholder="Search Filter"
            />
          )}
        </div>
      </div>
      {isListVisible && (
        <ul className="list">{filterTxt ? renderFilteredItemList() : renderItemList()}</ul>
      )}
    </ListWrapper>
  );
};

export default SimpleListPresenter;
