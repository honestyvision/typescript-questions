import {
  Reading,
  ReadingsSummary,
  checkUpperThresholds,
  findById,
  findByIdPromise,
  getLatestReadings,
} from "../src/index";

describe("Sensor readings", () => {
  const readings: Reading[] = [
    {
      sensorId: 1,
      timestamp: "2023-08-20T12:52:48.775Z",
      sensorType: "air",
      sensorValue: 5,
    },
    {
      sensorId: 2,
      timestamp: "2023-08-20T12:52:46.442Z",
      sensorType: "humidity",
      sensorValue: 2,
    },
    {
      sensorId: 1,
      timestamp: "2023-08-20T12:52:48.775Z",
      sensorType: "temperature",
      sensorValue: 5,
    },
  ];
  test("1.a, findById should return all the readings matching the given ID", () => {
    const expectedReadings: Reading[] = [
      {
        sensorId: 2,
        timestamp: "2023-08-20T12:52:46.442Z",
        sensorType: "humidity",
        sensorValue: 2,
      },
    ];

    const result = findById(2, readings);
    expect(result).toStrictEqual(expectedReadings);
  });

  test("1.b. findByIdPromise should return all the readings matching the given ID", async () => {
    const readingsPromise: Promise<Reading[]> = new Promise((resolve, reject) =>
      resolve(readings)
    );
    const expectedReadings: Reading[] = [
      {
        sensorId: 2,
        timestamp: "2023-08-20T12:52:46.442Z",
        sensorType: "humidity",
        sensorValue: 2,
      },
    ];

    const result = await findByIdPromise(2, readingsPromise);
    expect(result).toStrictEqual(expectedReadings);
  });

  test("1.b. findByIdPromise should return empty array when given promise is rejected", async () => {
    const readingsPromise: Promise<Reading[]> = new Promise((resolve, reject) =>
      reject()
    );

    const result = await findByIdPromise(2, readingsPromise);
    expect(result).toStrictEqual([]);
  });

  test("2. getLatestReadings should return the latest readings for each sensor id", () => {
    const readings: Reading[] = [
      {
        sensorId: 1,
        timestamp: "2023-08-20T12:52:48.775Z",
        sensorType: "air",
        sensorValue: 5,
      },
      {
        sensorId: 1,
        timestamp: "2023-09-20T12:52:48.775Z",
        sensorType: "temperature",
        sensorValue: 5,
      },
      {
        sensorId: 2,
        timestamp: "2023-10-20T12:52:46.442Z",
        sensorType: "humidity",
        sensorValue: 2,
      },
      {
        sensorId: 2,
        timestamp: "2023-08-20T12:52:46.442Z",
        sensorType: "humidity",
        sensorValue: 2,
      },
    ];

    const expectedReadings: ReadingsSummary = {
      1: {
        sensorId: 1,
        timestamp: "2023-09-20T12:52:48.775Z",
        sensorType: "temperature",
        sensorValue: 5,
      },
      2: {
        sensorId: 2,
        timestamp: "2023-10-20T12:52:46.442Z",
        sensorType: "humidity",
        sensorValue: 2,
      },
    };

    const result = getLatestReadings(readings);
    expect(result).toStrictEqual(expectedReadings);
  });

  test("3. checkUpperThresholds should return expected error", async () => {
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await checkUpperThresholds();
    expect(mockConsoleError).toBeCalledWith("Air value has exceeded threshold");
  });
});
