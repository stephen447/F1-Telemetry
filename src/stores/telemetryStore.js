import { makeAutoObservable } from 'mobx';

class TelemetryStore {
  laps = [];
  loading = false;
  error = null;
  selectedDriver = null;
  selectedLap = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setLaps(laps) {
    this.laps = laps;
  }

  setSelectedDriver(driverNumber) {
    this.selectedDriver = driverNumber;
  }

  setSelectedLap(lapNumber) {
    this.selectedLap = lapNumber;
  }

  async loadLapsData() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const response = await fetch('/sample_single_driver_lap_data.json');
      if (!response.ok) {
        throw new Error('Failed to load lap data');
      }
      const data = await response.json();
      this.setLaps(data);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  get filteredLaps() {
    if (!this.selectedDriver) return this.laps;
    return this.laps.filter(lap => lap.driver_number === this.selectedDriver);
  }

  get fastestLap() {
    const validLaps = this.laps.filter(
      lap => lap.lap_duration !== null && !lap.is_pit_out_lap
    );
    if (validLaps.length === 0) return null;
    return validLaps.reduce((fastest, lap) => 
      lap.lap_duration < fastest.lap_duration ? lap : fastest
    );
  }

  get averageLapTime() {
    const validLaps = this.laps.filter(
      lap => lap.lap_duration !== null && !lap.is_pit_out_lap
    );
    if (validLaps.length === 0) return null;
    const total = validLaps.reduce((sum, lap) => sum + lap.lap_duration, 0);
    return total / validLaps.length;
  }

  get maxSpeed() {
    const allSpeeds = this.laps.flatMap(lap => [
      lap.i1_speed,
      lap.i2_speed,
      lap.st_speed
    ].filter(speed => speed !== null));
    
    if (allSpeeds.length === 0) return null;
    return Math.max(...allSpeeds);
  }

  get pitLaps() {
    return this.laps.filter(lap => lap.is_pit_out_lap);
  }

  get totalLaps() {
    return this.laps.length;
  }

  get validLaps() {
    return this.laps.filter(
      lap => lap.lap_duration !== null && !lap.is_pit_out_lap
    );
  }

  getLapByNumber(lapNumber) {
    return this.laps.find(lap => lap.lap_number === lapNumber);
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
