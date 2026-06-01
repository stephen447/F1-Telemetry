import "./App.css";
import telemetryStore from "./Stores/telemetryStore";
import { useEffect, useState } from "react";

function App() {
  const [currentLapIndex, setCurrentLapIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let intervalId = null;
    let lapData = [];

    const startSimulation = async () => {
      try {
        const response = await fetch("/sample_single_driver_lap_data.json");
        lapData = await response.json();
        setIsSimulating(true);

        intervalId = setInterval(() => {
          setCurrentLapIndex((prev) => {
            if (prev >= lapData.length) {
              telemetryStore.reset();
              return 0;
            }

            const lap = lapData[prev];

            telemetryStore.addLap({
              ...lap,
              driver: lap.driver_number,
            });

            return prev + 1;
          });
        }, 1000);
      } catch (error) {
        console.error("Error loading data:", error);
        telemetryStore.setError(error.message);
      }
    };

    startSimulation();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>F1 Telemetry - Real-time Simulation</h1>
      <div>
        <p>Status: {isSimulating ? "Simulating..." : "Loading..."}</p>
        <p>Current Lap Index: {currentLapIndex}</p>
        <p>Driver 44 Laps in Store: {telemetryStore.laps[44]?.length || 0}</p>
        {telemetryStore.laps[44]?.length > 0 && (
          <pre>
            {JSON.stringify(
              telemetryStore.laps[44][telemetryStore.laps[44].length - 1],
              null,
              2,
            )}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
