export type Reading = {
  timestamp: string;
  sensorId: number;
  sensorType: "air" | "humidity" | "temperature";
  sensorValue: number;
};

export type ReadingsSummary = {
  [key: string]: Reading;
};

export const findById = (sensorId: number, readings: Reading[]): Reading[] =>
  readings.filter((reading) => reading.sensorId === sensorId);

export const findByIdPromise = async (
  sensorId: number,
  readingsPromise: Promise<Reading[]>
): Promise<Reading[]> => {
  try {
    const readings = await readingsPromise;
    return findById(sensorId, readings);
  } catch {
    return [];
  }
};

export const getLatestReadings = (readings: Reading[]): ReadingsSummary => {
  return readings.reduce((summary: ReadingsSummary, reading: Reading) => {
    const summaryEntry = summary[reading.sensorId];
    if (!summaryEntry || isMoreRecent(reading, summaryEntry)) {
      return { ...summary, [reading.sensorId]: reading };
    }
    return summary;
  }, {});
};

const isMoreRecent = (reading1: Reading, reading2: Reading): Boolean => {
  return new Date(reading1.timestamp) > new Date(reading2.timestamp);
};

// Answer to question 3.a
// The for loop is executed outside of the .then() of getMockReadings()
// which means it is actually executed before the sensor readings are retrieved

const getMockReadings = async (): Promise<Reading[]> => {
  await new Promise((res) => setTimeout(res, 500));

  return [
    {
      sensorId: 1,
      sensorType: "air",
      sensorValue: 14,
      timestamp: "2023-08-20T12:52:48.775Z",
    },
    {
      sensorId: 2,
      sensorType: "humidity",
      sensorValue: 0.8,
      timestamp: "2023-08-22T12:52:48.775Z",
    },
    {
      sensorId: 3,
      sensorType: "temperature",
      sensorValue: 21,
      timestamp: "2023-08-23T12:52:48.775Z",
    },
  ];
};

export const checkUpperThresholds = async () => {
  const readings = await getMockReadings();
  readings.forEach(checkThreshold);
};

const checkThreshold = (reading: Reading) => {
  const errorMessage = `${capitaliseFirstLetter(
    reading.sensorType
  )} value has exceeded threshold`;
  if (reading.sensorValue > getThreshold(reading)) console.error(errorMessage);
};

const getThreshold = (reading: Reading) => {
  switch (reading.sensorType) {
    case "air":
      return 12;
    case "humidity":
      return 1;
    case "temperature":
      return 25;
  }
};

const capitaliseFirstLetter = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);
