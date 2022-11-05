import differenceBy from "lodash.differenceby";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "./Clickoutside";
import SimpleListPresenter from "./SimpleList.presenter";

/*
  TODO: 
  1. Basic style
    - visible
    - selector area count
    - selector area item names
  2. Basic logic

  3. Issues
    - Can't open on Safari broswer
    - What if the item names are so long?
    - Think about reducing rendering when filter changes...
      -> Should I split the component?
*/

const SimpleList = ({ itemList, onItemSelected, size }) => {
  // const [_list, setList] = useState([]);
  const [_list, setList] = useState(new Map());
  const [filteredList, setFilteredList] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [filterTxt, setFilterTxt] = useState("");
  const refListEl = useRef();
  const refSelectedList = useRef(new Map());

  useOnClickOutside(refListEl, () => setIsListVisible(false));

  useEffect(() => {
    // NOTE: Initial Set Up
    if (Array.isArray(itemList)) {
      // const temp = itemList.map((item, index) => {
      //   let _item = undefined;
      //   if (typeof item === "object") {
      //     _item = {
      //       key: item.key || `${item.value}_${index}`,
      //       value: item.value,
      //       index,
      //       checked: false,
      //     };
      //   } else {
      //     _item = { key: `${item}_${index}`, value: item, index, checked: false };
      //   }
      //   return _item;
      // });

      const tempMap = new Map();
      itemList.forEach((item, index) => {
        let _item = { key: undefined, value: undefined, index: undefined, checked: false };
        if (typeof item === "object") {
          _item.key = item.key || `${item.value}_${index}`;
          _item.value = item.value;
          _item.index = index;
        } else {
          _item.key = `${item}_${index}`;
          _item.value = item;
          _item.index = index;
        }

        tempMap.set(_item.index, _item);
      });

      setList(tempMap);
      // setList([...temp]);
    }
  }, [itemList]);

  /**
   * Add all items to refSelectedList
   * @param {  } item
   */
  const addAllSelectedList = useCallback((items) => {
    refSelectedList.current = [...items];
  }, []);

  /**
   * Add a single item to refSelectedList
   * @param { Object } item
   */
  const addToSelectedList = useCallback((item) => {
    // refSelectedList.current.push(item);
    refSelectedList.current.set(item.index, item);
  }, []);

  const removeItemFromSelectedList = useCallback((item) => {
    // const _selectedList = refSelectedList.current.filter(
    //   (selectedItem) => selectedItem.key !== item.key
    // );
    // refSelectedList.current = _selectedList;

    refSelectedList.current.delete(item.index);
  }, []);

  const removeAllSelectedList = useCallback(() => {
    refSelectedList.current = new Map();
  }, []);

  const removeItemsFromSelectedList = useCallback((items) => {
    const _selectedList = differenceBy(refSelectedList.current, items, "key");
    refSelectedList.current = _selectedList;
  }, []);

  const returnSelectedList = useCallback(() => {
    console.log("returnSelectedList", refSelectedList.current);
    // onItemSelected([...refSelectedList.current]);
    const temp = [];
    for (const [, v] of refSelectedList.current) {
      temp.push({
        value: v.value,
        key: v.key,
      });
    }
    onItemSelected(temp);
  }, [onItemSelected]);

  const onChangeCheckboxItem = useCallback(
    ({ event, checkedItem }) => {
      let checked = event.target.checked;
      console.log({ event, checkedItem, checked });
      // let targetItem = _list.find((listItem) => listItem.key === checkedItem.key);
      let targetItem = _list.get(checkedItem.index);

      if (targetItem) {
        targetItem = { ...targetItem, checked };
        // const temp = _list.map((item) => {
        //   if (targetItem.key === item.key) return targetItem;
        //   return { ...item };
        // });
        // setList(temp);

        const tempMap = new Map([..._list]);
        tempMap.set(targetItem.index, { ...targetItem });
        setList(tempMap);

        //TODO: Is this the best..?
        if (filterTxt) {
          const temp = filteredList.map((item) => {
            if (targetItem.key === item.key) return targetItem;
            return { ...item };
          });
          setFilteredList(temp);
        }

        if (checked) {
          addToSelectedList(targetItem);
        } else {
          removeItemFromSelectedList(targetItem);
        }

        // Check is Allcheck
        if (refSelectedList.current.size === 0) {
          setIsAllChecked(false);
          setIsIndeterminate(false);
        } else if (refSelectedList.current.size === _list.size) {
          setIsAllChecked(true);
          setIsIndeterminate(false);
        } else {
          setIsAllChecked(false);
          setIsIndeterminate(true);
        }

        returnSelectedList();
      }
    },
    [
      _list,
      addToSelectedList,
      filterTxt,
      filteredList,
      removeItemFromSelectedList,
      returnSelectedList,
    ]
  );

  const onChangeAllChecked = useCallback(
    (checked) => {
      setIsAllChecked(checked);
      setIsIndeterminate(false);

      const copiedSelectedList = [...refSelectedList.current];
      const copiedList = [..._list];
      let tempArr = [];

      if (filterTxt) {
        tempArr = filteredList.map((item) => {
          const targetItem = { ...item, checked };

          const targetIndex = copiedSelectedList.findIndex((item) => item.key === targetItem.key);
          const targetSelectedIndex = copiedList.findIndex((item) => item.key === targetItem.key);

          if (targetIndex !== -1) {
            copiedSelectedList[targetIndex] = { ...copiedSelectedList[targetIndex], checked };
          } else {
            copiedSelectedList.push({ ...targetItem });
          }

          if (targetSelectedIndex !== -1) {
            copiedList[targetSelectedIndex] = { ...copiedList[targetSelectedIndex], checked };
          }
          return { ...item, checked };
        });

        setFilteredList(tempArr);
        setList(copiedList);
      } else {
        tempArr = _list.map((item) => {
          return { ...item, checked };
        });
        setList(tempArr);
      }

      if (checked) {
        if (filterTxt) {
          addAllSelectedList(copiedSelectedList);
        } else {
          addAllSelectedList(tempArr);
        }
      } else {
        if (filterTxt) {
          // removeAllSelectedList();
          removeItemsFromSelectedList(tempArr);
        } else {
          removeAllSelectedList();
        }
      }
      returnSelectedList();
    },
    [
      _list,
      addAllSelectedList,
      filterTxt,
      filteredList,
      removeAllSelectedList,
      removeItemsFromSelectedList,
      returnSelectedList,
    ]
  );

  const onChangeFilter = useCallback(
    (value) => {
      console.log({ filterTextValue: value });
      setFilterTxt(value);
      if (value) {
        let checkedCnt = 0;
        const tempArr = _list.filter((item) => {
          if (item.value.toLowerCase().includes(value.toLowerCase())) {
            if (item.checked) checkedCnt++;
            return true;
          } else {
            return false;
          }
        });

        if (checkedCnt === 0) {
          setIsAllChecked(false);
          setIsIndeterminate(false);
        } else if (checkedCnt === tempArr.length) {
          setIsAllChecked(true);
          setIsIndeterminate(false);
        } else {
          setIsAllChecked(false);
          setIsIndeterminate(true);
        }

        setFilteredList(tempArr);
      } else {
        if (refSelectedList.current.length === 0) {
          setIsAllChecked(false);
          setIsIndeterminate(false);
        } else if (refSelectedList.current.length === _list.length) {
          setIsAllChecked(true);
          setIsIndeterminate(false);
        } else {
          setIsAllChecked(false);
          setIsIndeterminate(true);
        }

        setFilteredList([]);
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
          if (element.classList.contains("list")) break;
          if (element.classList.contains("list-selector-filter")) break;
          if (element.classList.contains("list-selector-allcheck")) break;

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
      itemList={_list}
      isListVisible={isListVisible}
      refListEl={refListEl}
      onChangeCheckboxItem={onChangeCheckboxItem}
      selectedList={refSelectedList.current}
      filterTxt={filterTxt}
      setFilterTxt={onChangeFilter}
      isAllChecked={isAllChecked}
      setIsAllChecked={onChangeAllChecked}
      filteredList={filteredList}
      isIndeterminate={isIndeterminate}
      size={size}
    />
  );
};

export default SimpleList;
