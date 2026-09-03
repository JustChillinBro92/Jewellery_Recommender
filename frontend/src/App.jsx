import { useState } from "react";
import Header from "./components/Header";
import SelectionScreen from "./components/SelectionScreen";
import StylistScreen from "./components/StylistScreen";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [screen, setScreen] = useState("selection");
  return (
    <>
      <Header
        onCollection={() => setScreen("selection")}
        activeSection={screen === "selection" ? "collection" : "stylist"}
      />
      {screen === "selection" ? (
        <SelectionScreen
          selected={selected}
          onSelect={setSelected}
          onContinue={() => setScreen("stylist")}
        />
      ) : (
        <StylistScreen
          necklace={selected}
          onBack={() => setScreen("selection")}
        />
      )}
    </>
  );
}
