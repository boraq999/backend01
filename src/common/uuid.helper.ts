import { v7 as uuidv7 } from 'uuid';

export class UuidHelper {
  static generate(): string {
    return uuidv7();
  }

  static toBinary(uuid: string): Buffer {
    return Buffer.from(uuid.replace(/-/g, ''), 'hex');
  }

  static fromBinary(buffer: Buffer): string {
    const hex = buffer.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
}
