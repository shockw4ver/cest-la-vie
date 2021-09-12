import "./styles.css";
import { reactivity, watchEffect, myRender } from "./cases/reactivity";

const state = reactivity({
  name: "Weird Mental Model",
  count: 0
});

watchEffect(() => {
  console.log(state.name);
});

myRender(() => {
  let targetEl = document.getElementById("render");
  if (targetEl) {
    targetEl.innerText = state.name + state.count;
  } else {
    targetEl = document.createElement("div");
    targetEl.id = "render";
    targetEl.innerText = state.name + state.count;
    document.body.appendChild(targetEl);
  }
});

export default function App() {
  function update() {
    state.count++;
    state.name = "Weird Mental Model";
  }

  return (
    <div className="App">
      <h1>It's funny.</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={update}>update</button>
    </div>
  );
}
