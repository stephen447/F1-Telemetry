import { makeAutoObservable } from "mobx";

class TelemetryStore {
  loading = false;
  error = null;
  laps = {};
  sessionStatus = null;
  sessionType = null;
  sessionName = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  addLap(lap) {
    if (!lap.driver) {
      console.error("Function addLap: Invalid driver:", lap);
      return;
    }

    this.laps[lap.driver] = this.laps[lap.driver] || [];
    this.laps[lap.driver].push(lap);
  }

  setSessionStatus(status) {
    this.sessionStatus = status;
  }

  setSessionType(type) {
    this.sessionType = type;
  }

  setSessionName(name) {
    this.sessionName = name;
  }

  reset() {
    this.laps = [];
    this.loading = false;
    this.error = null;
    this.selectedDriver = null;
    this.selectedLap = null;
  }
}

const telemetryStore = new TelemetryStore();
export default telemetryStore;
