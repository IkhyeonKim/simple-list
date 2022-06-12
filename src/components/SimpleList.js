import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "./Clickoutside";
import SimpleListPresenter from "./SimpleList.presenter";

/*
  TODO: 
  1. Basic style
    - visible
    - Clickable area
  2. Basic logic
    - Default value
    - Return selected list
    - Click outside
  3. Issues
    - Can't open on Safari broswer
*/

const SimpleList = ({ itemList, onItemSelected }) => {
  const [_list, setList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const refListEl = useRef();
  const refSelectedList = useRef([]);

  useOnClickOutside(refListEl, () => setIsListVisible(false));

  useEffect(() => {
    console.log("Initial Set Up");
    if (Array.isArray(itemList)) {
      const temp = itemList.map((item, index) => {
        let _item = undefined;
        if (typeof item === "object") {
          _item = {
            key: item.key || `${item.value}_${index}`,
            value: item.value,
            index,
            checked: false,
          };
        } else {
          _item = { key: `${item}_${index}`, value: item, index, checked: false };
        }
        return _item;
      });
      setList([...temp]);
    }
  }, [itemList]);

  const addToSelectedList = useCallback((item) => {
    refSelectedList.current.push(item);
  }, []);

  const removeFromSelectedList = useCallback((item) => {
    const _selectedList = refSelectedList.current.filter(
      (selectedItem) => selectedItem.key !== item.key
    );
    refSelectedList.current = _selectedList;
  }, []);

  const returnSelectedList = useCallback(() => {
    console.log("returnSelectedList", refSelectedList.current);
    onItemSelected([...refSelectedList.current]);
  }, [onItemSelected]);

  const onChangeCheckboxItem = useCallback(
    ({ event, checkedItem }) => {
      console.log("onChangeCheckboxItem");
      let checked = event.target.checked;
      console.log({ event, checkedItem, checked });
      let targetItem = _list.find((listItem) => listItem.key === checkedItem.key);

      if (targetItem) {
        targetItem = { ...targetItem, checked };
        const temp = _list.map((item) => {
          if (targetItem.key === item.key) return targetItem;
          return { ...item };
        });
        setList(temp);

        if (checked) {
          addToSelectedList(targetItem);
        } else {
          removeFromSelectedList(targetItem);
        }

        returnSelectedList();
      }
    },
    [_list, addToSelectedList, removeFromSelectedList, returnSelectedList]
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

  useEffect(() => {
    console.log("!!!!!", _list);
  }, [_list]);

  return (
    <SimpleListPresenter
      itemList={_list}
      isListVisible={isListVisible}
      refListEl={refListEl}
      onChangeCheckboxItem={onChangeCheckboxItem}
      selectedList={refSelectedList.current}
    />
  );
};

export default SimpleList;
