import { useGetCurrentTab } from "../utils/ReactUtils";
import EyeDropperButton from "./components/EyeDropperButton";
import "./index.css";

function App() {
  const { tab } = useGetCurrentTab();

  if (!tab) {
    return null;
  }
  return (
    <div className="h-full py-2 px-1">
      <EyeDropperButton tab={tab} />
    </div>
  );
}

export default App;
