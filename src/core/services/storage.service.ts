import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.storage.create();
  }

  public async createStorage() {
    await this.storage.create();
  }

  public async setStorageKey(key: string, value: any) {
    await this.storage?.set(key, value);
  }

  public async getStorageKey(key: string) {
    return await this.storage?.get(key);
  }

  public async removeStorageKey(key: string) {
    await this.storage?.remove(key);
  }

  public async clearStorageKey() {
    await this.storage?.clear();
  }
}
