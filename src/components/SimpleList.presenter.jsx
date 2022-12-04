import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import styled, { css } from "styled-components";
import Checkbox from "./Checkbox";
import {
  ITEM_HEIGHT,
  MAX_ITEM_CNT,
  SIZE_FULL,
  SIZE_LARGE,
  SIZE_MEDIUM,
  SIZE_SMALL,
} from "./consts";
import Selector from "./Selector";

/*
Dark blue: 03045e
Navy: 023e8a
0077b6
00b4d8
ade8f4
The lightest blue: #e9fafd
*/

const ListWrapper = styled.div`
  * {
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  ${(props) => {
    switch (props.size) {
      case SIZE_SMALL:
        return css`
          width: 205px;
        `;
      case SIZE_MEDIUM:
        return css`
          width: 405px;
        `;
      case SIZE_LARGE:
        return css`
          width: 605px;
        `;
      case SIZE_FULL:
        return css`
          width: 100%;
        `;
      default:
        return css`
          width: 205px;
        `;
    }
  }}
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
    padding: 4px 8px;
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
    overflow: auto;

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
  size,
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
          <li
            key={item.key}
            className="list-item"
            style={{ top: `${item.height}px` }}
          >
            <Checkbox
              checked={item.checked}
              onChange={(event) =>
                onChangeCheckboxItem({ event, checkedItem: item })
              }
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
    <ListWrapper className="list-wrapper" size={size} ref={refListEl}>
      <div className="list-selector-wrapper">
        <Selector
          isListVisible={isListVisible}
          itemList={itemList}
          selectedList={selectedList}
          size={size}
          refListEl={refListEl}
        />
        <div className="list-selector-allcheck">
          {isListVisible && (
            <ul className="selector-list">
              <li key={"AllCheck"} className="list-item">
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
      <div
        style={isListVisible ? {} : { display: "none" }}
        className="list-virtual-wrapper"
        ref={refVirtualScroll}
      >
        <ul style={{ height: `${calcListHeight()}px` }} className="list">
          {filterTxt ? renderItemList(filteredList) : renderItemList(itemList)}
        </ul>
      </div>
    </ListWrapper>
  );
};

export default SimpleListPresenter;
