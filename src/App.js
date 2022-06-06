import React from "react";
import SimpleList from "./components/SimpleList";

const arr = ["aaa", "bbb", "ccc", "ddd", "eee", "fff"];
const arr2 = [
  { key: 1, value: "AAA" },
  { key: 2, value: "BBB" },
  { key: 3, value: "CCC" },
  { key: 4, value: "DDD" },
  { key: 5, value: "EEE" },
];

function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <SimpleList itemList={arr2} />
    </div>
  );
}

export default App;
