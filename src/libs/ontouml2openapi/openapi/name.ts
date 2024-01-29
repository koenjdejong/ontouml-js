export class Name {
  _single: string;
  _multiple: string;

  constructor(single: string, multiple?: string) {
    this._single = single.toLowerCase()
    this._multiple = multiple?.toLowerCase() || `${this._single}s`;
  }

  get single() {
    return this._single;
  }

  get multiple() {
    return this._multiple;
  }
}
