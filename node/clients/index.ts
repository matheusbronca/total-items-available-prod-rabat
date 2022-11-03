import { IOClients } from '@vtex/api'

import { TotalItemsAvailableClient } from './totalItemsAvailable'

export class Clients extends IOClients {
  public get totalItemsAvailable() {
    return this.getOrSet('totalItemsAvailable', TotalItemsAvailableClient)
  }
}
