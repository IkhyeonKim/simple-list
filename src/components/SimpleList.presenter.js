import React from "react";
import styled from "styled-components";
import ArrowIcon from "./ArrowIcon";

const ListWrapper = styled.div`
  display: flex;
  width: 200px;
  position: relative;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  cursor: pointer;

  .list-selector {
    display: flex;
  }

  ul.list {
    width: 100%;
  }

  li.list-item {
    list-style: none;
  }

  svg {
    line-height: 1;
  }
`;

const SimpleListPresenter = ({ renderList, isListVisible, refListEl }) => {
  return (
    <ListWrapper className="list-wrapper" ref={refListEl}>
      <div className="list-selector">
        <ArrowIcon />
      </div>
      {isListVisible && (
        <ul className="list">
          {renderList.map((item) => {
            return (
              <li key={item.key} className="list-item">
                <input type="checkbox" id={item.key} name={item.key} onChange={() => {}} />
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
