# React simple filter list

This is a simple filter list with virtual scrolling

## How to use

```Javascript
import { SimpleList } from "react-simple-filter-list";


function App() {
  const [myList, setMyList] = useState([]);
  return (
    <div className="App">
      <SimpleList itemList={myArr} onItemSelected={(list) => setMyList(list)} />
      <ul>
        {myList.map((item) => (
          <li key={item.key}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
}
```

## API

### props
|Property|Description|Type|Default|     
|----|-----|-------|-------|    
|size|Set select size|`small` `medium` `large`|`small`
|itemList|A list that you'd like to render|array|[]
|onItemSelected|Returns currently selected items|function|

### 