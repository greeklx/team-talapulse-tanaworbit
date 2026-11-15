
export function isValidHeartRate(bpm: unknown): boolean {

  if (typeof bpm !== "number") {
    return false;
  }

  if (!Number.isFinite(bpm)) {
    return false;
  }

  if (bpm <= 0) {
    return false;
  }

  return true;
}



export function isValidSleepDuration(hours: unknown): boolean {

  

  if (typeof hours !== "number") {
    return false;

  }

  if (!Number.isFinite(hours)) {
    return false;
  }

  if (hours < 0 || hours > 24) {
    return false;
  }

  return true;


}


export function isValidFatigue(value: unknown): boolean {

  if (typeof value !== "number") {
    return false;
  }

  if (!Number.isFinite(value)) {
    return false;
  }

  if (value < 1 || value > 5) {
    return false;
  }

  return true;


}

