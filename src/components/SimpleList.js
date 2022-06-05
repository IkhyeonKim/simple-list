import React, { useEffect, useRef, useState } from "react";
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
  const refListEl = useRef();

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

  useEffect(() => {
    const onClick = (e) => {
      if (e?.path && e.path.length > 0) {
        for (let i = 0; i < e.path.length; i++) {
          const element = e.path[i];

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

  return <SimpleListPresenter renderList={_list} isListVisible={isListVisible} refListEl={refListEl} />;
};

export default SimpleList;
