import {
  method,
  ParamsContext,
  RecorderState,
  ServiceContext,
  Service,
} from '@vtex/api'

import { Clients } from './clients'
import { totalItemsAvailable } from './middlewares/totalItemsAvailable'

const MEDIUM_TIMEOUT_MS = 2 * 1000

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: MEDIUM_TIMEOUT_MS,
      },
    },
  },
  routes: {
    totalItemsAvailable: method({
      GET: [totalItemsAvailable],
    }),
  },
})
