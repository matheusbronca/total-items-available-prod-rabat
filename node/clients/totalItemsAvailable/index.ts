import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  getInventoryBySkudId: (skuId: string | string[]) =>
    `/api/logistics/pvt/inventory/skus/${skuId}`,
}

export class TotalItemsAvailableClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `https://${context.account}.vtexcommercestable.com.br`,
      context,
      options
    )
  }

  public getSkuTotalItemsAvailable = (skudId: string | string[]) => {
    try {
      const query = this.http.get(routes.getInventoryBySkudId(skudId), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
          'VtexIdclientAutCookie': this.context.adminUserAuthToken,
          Pragma: 'no-cache',
          Expires: 0,
        },
        metric: 'get-inventory-by-sku-id',
        forceMaxAge: 0,
        cacheable: 0,
        memoizeable: false,
      })

      return query
    } catch {
      throw new Error(
        'Cannot get sku total items available, check your auth credentials'
      )
    }
  }
}
