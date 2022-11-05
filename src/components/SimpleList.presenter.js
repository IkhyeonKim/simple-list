import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import styled, { css } from "styled-components";
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

const SIZE_SMALL = "small";
const SIZE_MEDIUM = "medium";
const SIZE_LARGE = "large";
const SIZE_FULL = "full";

const ITEM_HEIGHT = 30;
const MAX_ITEM_CNT = 12;
const MAX_ITEM_CHAR_CNT = 13;
const MEDIUM_MAX_ITEM_CHAR_CNT = 34;

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

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;

  .selected-items {
    margin-right: 4px;
    background-color: #e6e6e6;
    padding: 2px 4px;
  }

  .selected-item-count {
    background-color: #00b4d8;
    color: white;
    padding: 2px 4px;
    font-weight: bold;

    &.no-selected-item {
      color: #bfbfbf;
      background-color: white;
    }
  }

  .no-items {
    background-color: #00b4d8;
    color: white;
    padding: 2px 4px;
    font-weight: bold;
  }
`;

const getCharCnt = (size) => {
  switch (size) {
    case SIZE_SMALL:
      return MAX_ITEM_CHAR_CNT;
    case SIZE_MEDIUM:
      return MEDIUM_MAX_ITEM_CHAR_CNT;
    default:
      return MAX_ITEM_CHAR_CNT;
  }
};

const renderSelectorItems = (list, size) => {
  let charCnt = 0;
  let maxCharCnt = getCharCnt(size);
  const renderItems = [];
  for (let i = 0; i < list.length; i++) {
    if (list.length < 1) break;
    const item = list[i];
    charCnt += item.value.length;
    if (charCnt < maxCharCnt) {
      renderItems.push(
        <span key={item.value} className="selected-items">
          {item.value}
        </span>
      );
    } else {
      renderItems.push(
        <span key={"dots"} className="selected-items">
          ...
        </span>
      );
      break;
    }
  }
  return renderItems;
};

const renderSelector = (list, size) => {
  return (
    <SelectorWrapper>
      {/* {(() => {
      let charCnt = 0;
      const renderItems = [];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          charCnt += item.value.length;
          if (charCnt < MAX_ITEM_CHAR_CNT) {
            renderItems.push(
              <span key={item.value} className="selected-items">
                {item.value}
              </span>
            );
          } else {
            renderItems.push(
              <span key={"dots"} className="selected-items">
                ...
              </span>
            );
            break;
          }
        }
        return renderItems;
      })()} */}
      {renderSelectorItems(list, size)}
      {list.length === 0 ? (
        <span className="selected-item-count no-selected-item">Select item</span>
      ) : (
        <span className="selected-item-count">{list.length}</span>
      )}
    </SelectorWrapper>
  );
};

const renderNoDataSelector = () => {
  return (
    <SelectorWrapper>
      <span className="no-items">NO DATA</span>
    </SelectorWrapper>
  );
};

const isItemExists = (list) => {
  if (!list) return false;
  if (list.size < 1) return false;
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
        visibleIndex + MAX_ITEM_CNT > itemList.size ? itemList.size - 1 : startIdx + MAX_ITEM_CNT;
      const targetList = [];

      // TODO: find a way to render through Map
      const tempArray = [...itemList].map((item) => item[1]);
      for (let i = startIdx; i <= endIdx; i++) {
        // const element = itemList[i];
        // targetList.push({ ...element, height: i * ITEM_HEIGHT });
        const element = tempArray[i];
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
      listHeight = filteredList.size * ITEM_HEIGHT;
    } else {
      listHeight = itemList.size * ITEM_HEIGHT;
    }

    return listHeight + topBottomBorder;
  }, [filterTxt, filteredList.size, itemList.size]);

  return (
    <ListWrapper className="list-wrapper" size={size} ref={refListEl}>
      <div className="list-selector-wrapper">
        <div
          className={`${isListVisible ? "list-selector list-selector-focused" : "list-selector"}`}
        >
          {isItemExists(itemList) ? renderSelector(selectedList, size) : renderNoDataSelector()}
          <ArrowIcon />
        </div>
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
