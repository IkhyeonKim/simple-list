import React, { useEffect, useState } from "react";
import SimpleListPresenter from "./SimpleList.presenter";

/*
  TODO: 
  1. Basic style
    - visible
  2. Basic logic
    - Default value
    - Return selected list
    - 

*/

const SimpleList = ({ itemList }) => {
  const [_list, setList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

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

  return <SimpleListPresenter renderList={_list} isListVisible={isListVisible} />;
};

export default SimpleList;
