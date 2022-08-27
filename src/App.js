import React, { useState } from "react";
import SimpleList from "./components/SimpleList";

const makeDummyData = (cnt) => {
  const arr = [];

  for (let i = 0; i < cnt; i++) {
    const value = (Math.random() + 1).toString(36);
    const element = {
      key: i + 1,
      value: `TEST_${i + 1}`,
    };
    arr.push(element);
  }
  return arr;
};

const myArr = makeDummyData(200);
function App() {
  const [myList, setMyList] = useState([]);
  return (
    <div style={{ padding: "1rem" }}>
      <SimpleList itemList={myArr} onItemSelected={(list) => setMyList(list)} />
      <ul>
        {myList.map((item) => (
          <li key={item.key}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
