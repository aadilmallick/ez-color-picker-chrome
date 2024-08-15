import { useGetCurrentTab } from "../utils/ReactUtils";
import ColorList from "./components/ColorList";
import EyeDropperButton from "./components/EyeDropperButton";
import "./index.scss";

function App() {
  const { tab } = useGetCurrentTab();

  if (!tab) {
    return null;
  }
  return (
    <div className="h-full py-2 px-1">
      <EyeDropperButton tab={tab} />
      <ColorList />
    </div>
  );
}

export default App;
