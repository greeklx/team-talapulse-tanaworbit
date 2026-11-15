
import { describe, expect, it } from "vitest";
import { calculateMean } from "../src/baseline";

describe("Personal Baseline Calculations", () => {

  it("calculates the historical average", () => {
    expect(calculateMean([7.5, 8, 7, 7.5])).toBe(7.5);
  });

  it("handles empty history", () => {
    expect(calculateMean([])).toBe(null);
  });

  it("rejects invalid historical values", () => {
    expect(calculateMean([7, NaN, 8])).toBe(null);
    expect(calculateMean([7, Infinity, 8])).toBe(null);
  });

});



import { baselineFor } from "../src/accuracy";
import {
  healthRecords,
  mission,
  monitoringRules
} from "../src/fixtures";

it("calculates sleep baseline from the correct historical records", () => {

  const crewId = "crew-ef";

  const history = healthRecords.filter(
    (record) =>
      record.crewId === crewId &&
      record.missionId === mission.id &&
      record.missionDay < mission.day &&
      record.missionDay >=
        mission.day - monitoringRules.baselineWindowDays
  );

  const sleepValues = history.map(
    (record) => record.reading.sleep
  );

  const expectedMean = calculateMean(sleepValues);

  const actualBaseline = baselineFor(crewId);

  expect(actualBaseline.sampleCount).toBe(history.length);
  expect(actualBaseline.sleep).toBe(expectedMean);

});
