
export function calculateMean(
  values: number[]
): number | null {

  if (values.length === 0) {
    return null;
  }
  
  let total = 0;

  for (const value of values) {
    if (!Number.isFinite(value)) {
        return null;
    }

    total += value;


   }

   const mean = total / values.length;
   return Math.round(mean * 10) / 10;
    


}
