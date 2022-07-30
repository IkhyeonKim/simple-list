import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
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

const ITEM_HEIGHT = 30;
const MAX_ITEM_CNT = 12;

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
    /* height: ${ITEM_HEIGHT}px; */
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
    .selector-list {
      width: 100%;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      line-height: 1;
    }
    .list-item {
      position: relative;
    }
  }

  .list-selector-filter {
    & > input {
      width: 100%;
      margin-top: -1px;
      padding: 8px;
      border: 1px solid #d9d9d9;
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    list-style: none;

    &:hover,
    &:focus {
      background-color: #e9fafd;
    }
  }

  .list-virtual-wrapper {
    overflow: scroll;
    max-height: 242px;
    width: 100%;
    position: relative;
    margin-top: 2px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    line-height: 1;

    .list {
      width: 100%;
    }
    .list-item {
      position: absolute;
    }
  }

  svg {
    line-height: 1;
  }
`;

const SelectorWrapper = styled.div`
  display: flex;
  .selected-items {
    margin-right: 8px;
  }
`;

const renderSelector = (list) => {
  return (
    <SelectorWrapper>
      <span className="selected-items">{list[0].value}</span>
      <span>{list.length} selected</span>
    </SelectorWrapper>
  );
};

const isArrayItemExists = (list) => {
  if (!Array.isArray(list)) return false;
  if (list.length < 1) return false;
  return true;
};

const getFirstItemIdx = (scrollHeight) => {
  if (scrollHeight < 1) return 0;

  let startIdx = 0;
  startIdx = Math.round(scrollHeight / ITEM_HEIGHT);

  return startIdx;
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
  const refVirtualScroll = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const handleScroll = (e) => {
      setScrollHeight(e.target.scrollTop);
    };
    const element = refVirtualScroll.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isListVisible]);

  const renderItemList = useCallback(
    (itemList) => {
      let visibleIndex = getFirstItemIdx(scrollHeight);
      let startIdx = visibleIndex - 3 < 0 ? 0 : visibleIndex - 3;
      let endIdx =
        visibleIndex + MAX_ITEM_CNT > itemList.length
          ? itemList.length - 1
          : startIdx + MAX_ITEM_CNT;
      const targetList = [];

      for (let i = startIdx; i <= endIdx; i++) {
        const element = itemList[i];
        targetList.push({ ...element, height: i * ITEM_HEIGHT });
      }

      return targetList.map((item) => {
        return (
          <li key={item.key} className="list-item" style={{ top: `${item.height}px` }}>
            <Checkbox
              checked={item.checked}
              onChange={(event) => onChangeCheckboxItem({ event, checkedItem: item })}
            >
              {item.value}
            </Checkbox>
          </li>
        );
      });
    },
    [onChangeCheckboxItem, scrollHeight]
  );

  const calcListHeight = useCallback(() => {
    const topBottomBorder = 2;

    let listHeight = 0;

    if (filterTxt) {
      listHeight = filteredList.length * ITEM_HEIGHT;
    } else {
      listHeight = itemList.length * ITEM_HEIGHT;
    }

    return listHeight + topBottomBorder;
  }, [filterTxt, filteredList.length, itemList.length]);

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
            <ul className="selector-list">
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
        <div className="list-virtual-wrapper" ref={refVirtualScroll}>
          <ul style={{ height: `${calcListHeight()}px` }} className="list">
            {filterTxt ? renderItemList(filteredList) : renderItemList(itemList)}
          </ul>
        </div>
      )}
    </ListWrapper>
  );
};

export default SimpleListPresenter;
