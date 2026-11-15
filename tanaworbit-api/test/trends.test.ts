
import { describe, expect, it } from "vitest";
import {
  baselineFor,
  judgeReading
} from "../src/accuracy";

import { monitoringRules } from "../src/fixtures";

describe("Health Change Detection", () => {

  it("detects a heart rate above the comparison threshold", () => {

    const baseline = baselineFor("crew-ef");

    const reading = {
      heart: baseline.heart +
        monitoringRules.heartDifferenceBpm + 1,

      systolic: baseline.systolic,
      diastolic: baseline.diastolic,
      sleep: baseline.sleep,
      fatigue: baseline.fatigue
    };

    const result = judgeReading("crew-ef", reading);

    expect(result?.flags.heart).toBe(true);
    expect(result?.flags.pressure).toBe(false);
    expect(result?.flags.sleep).toBe(false);
    expect(result?.flags.fatigue).toBe(false);

  });

});
