import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isArrayItemExists } from "./utils";
import ArrowIcon from "./ArrowIcon";
import {
  ARROW_WIDTH,
  LARGE_MAX_ITEM_CHAR_CNT,
  MAX_ITEM_CHAR_CNT,
  MEDIUM_MAX_ITEM_CHAR_CNT,
  SIZE_FULL,
  SIZE_LARGE,
  SIZE_MEDIUM,
  SIZE_SMALL,
  TEXT_OVERFLOW,
} from "./consts";

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;

  .selected-items {
    height: 100%;
    margin-right: 4px;
    background-color: #e6e6e6;
    padding: 2px 4px;

    &.text-overflow {
      width: 20px;
    }
  }

  .selected-item-count {
    height: 100%;
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

const getCharCnt = (size, width) => {
  const small = 205;
  const medium = 405;
  const large = 605;

  if (size === SIZE_SMALL) return MAX_ITEM_CHAR_CNT;
  if (size === SIZE_MEDIUM) return MEDIUM_MAX_ITEM_CHAR_CNT;
  if (size === SIZE_LARGE) return LARGE_MAX_ITEM_CHAR_CNT;
  if (size === SIZE_FULL) {
    if (width > small && width < medium) {
      let _width = width - ARROW_WIDTH - TEXT_OVERFLOW;
      let cnt = Math.round(_width / 11);
      return cnt;
    }
    if (width > medium && width < large) return 55;
  }

  return MAX_ITEM_CHAR_CNT;
};

const renderSelectorItems = (list, size, listWidth) => {
  let charCnt = 0;
  let maxCharCnt = getCharCnt(size, listWidth);
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
        <span key={"dots"} className="selected-items text-overflow">
          ...
        </span>
      );
      break;
    }
  }
  return renderItems;
};

const renderSelector = (list, size, listWidth) => {
  return (
    <SelectorWrapper>
      {renderSelectorItems(list, size, listWidth)}
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

const Selector = ({ isListVisible, itemList, selectedList, size }) => {
  const [listWidth, setListWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setListWidth(event[0].contentBoxSize[0].inlineSize);
    });

    resizeObserver.observe(document.getElementById("list-selector"));

    return () => resizeObserver.unobserve();
  }, []);

  return (
    <div
      id="list-selector"
      className={`${isListVisible ? "list-selector list-selector-focused" : "list-selector"}`}
    >
      {isArrayItemExists(itemList)
        ? renderSelector(selectedList, size, listWidth)
        : renderNoDataSelector()}
      <ArrowIcon />
    </div>
  );
};

export default Selector;
