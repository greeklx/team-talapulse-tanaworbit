
import { describe, expect, it } from "vitest";

import { isValidHeartRate, isValidSleepDuration, isValidFatigue } from "../src/validation";

describe("Heart Rate Validation", () => {

  it("accepts positive finite numbers", () => {
    expect(isValidHeartRate(75)).toBe(true);
  });

  it("rejects zero and negative values", () => {
    expect(isValidHeartRate(0)).toBe(false);
    expect(isValidHeartRate(-10)).toBe(false);
  });

  it("rejects invalid data types", () => {
    expect(isValidHeartRate("75")).toBe(false);
    expect(isValidHeartRate(Infinity)).toBe(false);
    expect(isValidHeartRate(NaN)).toBe(false);
  });

});


describe("Sleep Duration Validation", () => {

  it("accepts valid daily sleep durations", () => {
    expect(isValidSleepDuration(7.5)).toBe(true);
    expect(isValidSleepDuration(0)).toBe(true);
    expect(isValidSleepDuration(24)).toBe(true);
  });

  it("rejects invalid sleep durations", () => {
    expect(isValidSleepDuration(-3)).toBe(false);
    expect(isValidSleepDuration(25)).toBe(false);
    expect(isValidSleepDuration("8")).toBe(false);
    expect(isValidSleepDuration(Infinity)).toBe(false);
  });

});

describe("Fatigue Validation", () => {

   it("accepts fatigue scores between 1 and 5", () => {
    expect(isValidFatigue(1)).toBe(true);
    expect(isValidFatigue(1)).toBe(true);
    expect(isValidFatigue(1)).toBe(true);
      
      
    });

   it("rejects invalid fatigue scores", () => {
    expect(isValidFatigue(0)).toBe(false);
    expect(isValidFatigue(6)).toBe(false);
    expect(isValidFatigue("3")).toBe(false);
    expect(isValidFatigue(Infinity)).toBe(false);
   });

  });

