/**
 * @fileoverview Classes
 * Demonstrates OOP design patterns: classes, access modifiers, inheritance,
 * abstract classes, and interface implementation.
 */

// ── Interface ─────────────────────────────────────────────────────────────────

export interface Drivable {
  accelerate(time: number): void;
  brake(time: number): void;
  getSpeed(): number;
}

// ── Abstract base class ───────────────────────────────────────────────────────

export abstract class Vehicle implements Drivable {
  readonly wheels: number;
  protected readonly power: number;
  private _speed: number = 0;

  constructor(wheels: number, power: number) {
    this.wheels = wheels;
    this.power = power;
  }

  accelerate(time: number): void {
    this._speed = this._speed + 0.5 * this.power * time;
  }

  brake(time: number): void {
    this._speed = Math.max(0, this._speed - 0.5 * this.power * time);
  }

  getSpeed(): number {
    return this._speed;
  }

  abstract describe(): string;
}

// ── Concrete subclass ─────────────────────────────────────────────────────────

export class Car extends Vehicle {
  readonly make: string;
  readonly model: string;
  private _gpsEnabled: boolean;

  constructor(
    wheels: number,
    power: number,
    make: string,
    model: string,
    gpsEnabled = false,
  ) {
    super(wheels, power);
    this.make = make;
    this.model = model;
    this._gpsEnabled = gpsEnabled;
  }

  get gpsEnabled(): boolean {
    return this._gpsEnabled;
  }

  enableGps(): void {
    this._gpsEnabled = true;
  }

  disableGps(): void {
    this._gpsEnabled = false;
  }

  describe(): string {
    return `${this.make} ${this.model} — ${this.wheels} wheels, ${this.power} hp`;
  }
}

export class ElectricCar extends Car {
  private _batteryLevel: number;

  constructor(
    wheels: number,
    power: number,
    make: string,
    model: string,
    batteryLevel = 100,
  ) {
    super(wheels, power, make, model, true);
    this._batteryLevel = batteryLevel;
  }

  get batteryLevel(): number {
    return this._batteryLevel;
  }

  charge(percent: number): void {
    this._batteryLevel = Math.min(100, this._batteryLevel + percent);
  }

  describe(): string {
    return `${super.describe()} [Electric, battery: ${this._batteryLevel}%]`;
  }
}

// ── Singleton pattern ─────────────────────────────────────────────────────────

export class Fleet {
  private static _instance: Fleet | null = null;
  private _vehicles: Vehicle[] = [];

  private constructor() {}

  static getInstance(): Fleet {
    if (Fleet._instance === null) {
      Fleet._instance = new Fleet();
    }
    return Fleet._instance;
  }

  /** Exposed only for testing – resets the singleton state. */
  static reset(): void {
    Fleet._instance = null;
  }

  add(vehicle: Vehicle): void {
    this._vehicles.push(vehicle);
  }

  count(): number {
    return this._vehicles.length;
  }

  list(): Vehicle[] {
    return [...this._vehicles];
  }
}
