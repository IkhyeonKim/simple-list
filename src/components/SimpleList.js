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
  Today: 
  Filtering logic
  issue case 1: check status during filtering
  - scenario: Click all check button -> input filter text -> click all check
  - expected output: uncheck current filtered list items
  - acutal output: check all of current filterd list items and uncheck checked items which wasn't filtered and all check status doesn't change
  issue case 2: During filtering the all check button effects not only filtered list but also unfiltered list
  - scenario: Click all check button -> input filter text -> Click all check button
  - expected output: Uncheck only filtered list
  - acutal output: Uncheck filtered list and unfiltered list as well
  issue case 3: All check button status
  - scenario: Click all check button -> input filter text -> click all check button -> delete filter text
  - expected output: indetermined check status for the all check button
  - actual output: unchecked status for the all check button
*/

const SimpleList = ({ itemList, onItemSelected }) => {
  const [_list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [filterTxt, setFilterTxt] = useState("");
  const refListEl = useRef();
  const refSelectedList = useRef([]);
  const refFirstInit = useRef(true);

  useOnClickOutside(refListEl, () => setIsListVisible(false));

  useEffect(() => {
    // NOTE: Initial Set Up
    console.log("initial");
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

  const addAllSelectedList = useCallback((items) => {
    refSelectedList.current = [...items];
  }, []);

  const addToSelectedList = useCallback((item) => {
    refSelectedList.current.push(item);
  }, []);

  const addItemsToSelectedList = useCallback((items) => {
    // add items to itemList
    // if it's not
  }, []);

  const removeItemFromSelectedList = useCallback((item) => {
    const _selectedList = refSelectedList.current.filter(
      (selectedItem) => selectedItem.key !== item.key
    );
    refSelectedList.current = _selectedList;
  }, []);

  const removeAllSelectedList = useCallback(() => {
    refSelectedList.current = [];
  }, []);

  const removeItemsFromSelectedList = useCallback((items) => {
    const _selectedList = differenceBy(refSelectedList.current, items, "key");
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
      console.log("onChangeAllChecked", { filterTxt });
      setIsAllChecked(checked);
      setIsIndeterminate(false);

      let tempArr = [];

      if (filterTxt) {
        const copiedList = [..._list];
        tempArr = filteredList.map((item) => {
          const targetItem = { ...item, checked };
          const target = copiedList.find((copiedItem) => copiedItem.key === targetItem.key);
          if (target) {
          }
          return { ...item, checked };
        });
        setFilteredList(tempArr);

        // const temp = _list.map((item) => {
        //   const targetItem = { ...item, checked };
        //   if (targetItem.key === item.key) return targetItem;
        //   return { ...item };
        // });
        // setList(temp);
      } else {
        tempArr = _list.map((item) => {
          return { ...item, checked };
        });
        setList(tempArr);
      }
      console.log({ tempArr });
      if (checked) {
        if (filterTxt) {
          addAllSelectedList(tempArr);
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
        const tempArr = _list.filter((item) =>
          item.value.toLowerCase().includes(value.toLowerCase())
        );
        console.log({ tempArr });
        setFilteredList(tempArr);
      } else {
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

  // NOTE: Change all check status when filter text has changed
  useEffect(() => {
    if (refFirstInit.current) {
      refFirstInit.current = false;
      return;
    }

    if (filterTxt === "") {
      // determinate if there's a checked item in itemList
      console.log("Hello ");
      if (refSelectedList.current.length > 0) {
        setIsIndeterminate(true);
      }
    } else {
      // determinate if there's a checked item in filterList
    }
  }, [filterTxt]);

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
    />
  );
};

export default SimpleList;
