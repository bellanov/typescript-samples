import { Car, ElectricCar, Fleet } from "../classes";

beforeEach(() => {
  Fleet.reset();
});

describe("Car", () => {
  it("initialises with correct properties", () => {
    const car = new Car(4, 150, "Toyota", "Corolla");
    expect(car.wheels).toBe(4);
    expect(car.make).toBe("Toyota");
    expect(car.model).toBe("Corolla");
    expect(car.gpsEnabled).toBe(false);
    expect(car.getSpeed()).toBe(0);
  });

  it("accelerates correctly", () => {
    const car = new Car(4, 100, "Ford", "Focus");
    car.accelerate(10);
    expect(car.getSpeed()).toBe(500); // 0.5 * 100 * 10
  });

  it("brakes and does not go below 0", () => {
    const car = new Car(4, 100, "Ford", "Focus");
    car.accelerate(10);
    car.brake(20);
    expect(car.getSpeed()).toBe(0);
  });

  it("enables and disables GPS", () => {
    const car = new Car(4, 150, "Honda", "Civic");
    car.enableGps();
    expect(car.gpsEnabled).toBe(true);
    car.disableGps();
    expect(car.gpsEnabled).toBe(false);
  });

  it("returns a description string", () => {
    const car = new Car(4, 150, "BMW", "M3");
    expect(car.describe()).toBe("BMW M3 — 4 wheels, 150 hp");
  });
});

describe("ElectricCar", () => {
  it("initialises with GPS enabled and full battery by default", () => {
    const ev = new ElectricCar(4, 200, "Tesla", "Model 3");
    expect(ev.gpsEnabled).toBe(true);
    expect(ev.batteryLevel).toBe(100);
  });

  it("charges and caps at 100%", () => {
    const ev = new ElectricCar(4, 200, "Tesla", "Model S", 60);
    ev.charge(30);
    expect(ev.batteryLevel).toBe(90);
    ev.charge(50);
    expect(ev.batteryLevel).toBe(100);
  });

  it("includes battery info in description", () => {
    const ev = new ElectricCar(4, 200, "Rivian", "R1T", 80);
    expect(ev.describe()).toContain("[Electric, battery: 80%]");
  });
});

describe("Fleet (Singleton)", () => {
  it("returns the same instance each time", () => {
    const a = Fleet.getInstance();
    const b = Fleet.getInstance();
    expect(a).toBe(b);
  });

  it("starts empty after reset", () => {
    expect(Fleet.getInstance().count()).toBe(0);
  });

  it("adds vehicles and tracks count", () => {
    const fleet = Fleet.getInstance();
    fleet.add(new Car(4, 150, "Toyota", "Camry"));
    fleet.add(new ElectricCar(4, 200, "Tesla", "Model Y"));
    expect(fleet.count()).toBe(2);
  });

  it("list() returns a copy of the vehicles array", () => {
    const fleet = Fleet.getInstance();
    fleet.add(new Car(4, 150, "Honda", "Accord"));
    const list = fleet.list();
    list.pop(); // mutate the copy
    expect(fleet.count()).toBe(1); // original unaffected
  });
});
