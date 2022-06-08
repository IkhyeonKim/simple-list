import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "./Clickoutside";
import SimpleListPresenter from "./SimpleList.presenter";

/*
  TODO: 
  1. Basic style
    - visible
  2. Basic logic
    - Default value
    - Return selected list
    - Click outside

*/

const SimpleList = ({ itemList }) => {
  const [_list, setList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const refListEl = useRef();

  useOnClickOutside(refListEl, () => setIsListVisible(false));

  useEffect(() => {
    if (Array.isArray(itemList)) {
      const temp = itemList.map((item, index) => {
        let _item = undefined;
        if (typeof item === "object") {
          _item = { key: item.key || `${item.value}_${index}`, value: item.value };
        } else {
          _item = item;
        }
        return _item;
      });

      setList([...temp]);
    }
  }, [itemList]);

  const onChangeCheckboxItem = useCallback(
    ({ event, checkedItem }) => {
      let checked = event.target.checked;
      console.log({ event, checkedItem, checked });
      const targetItem = _list.find((listItem) => listItem.key === checkedItem.key);

      if (targetItem) {
        targetItem = { ...targetItem, checked };
      }
    },
    [_list]
  );

  useEffect(() => {
    const onClick = (e) => {
      if (e?.path && e.path.length > 0) {
        for (let i = 0; i < e.path.length; i++) {
          const element = e.path[i];
          // TODO: think about better way to find the element
          if (!element) return;
          if (element.classList === undefined) return;
          if (element.classList.contains("list")) {
            break;
          }

          if (element.classList.contains("list-wrapper")) {
            setIsListVisible((v) => !v);
            break;
          }
        }
      }
    };
    window.addEventListener("click", onClick);

    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <SimpleListPresenter
      renderList={_list}
      isListVisible={isListVisible}
      refListEl={refListEl}
      onChangeCheckboxItem={onChangeCheckboxItem}
    />
  );
};

export default SimpleList;
