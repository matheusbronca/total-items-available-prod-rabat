interface ITotalItemsAvailable {
  skuId: string
  balance: Array<{
    warehouseId: string
    warehouseName: string
    totalQuantity: number
    reservedQuantity: number
    hasUnlimitedQuantity: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timeToRefill: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dateOfSupplyUtc: any
  }>
}

export async function totalItemsAvailable(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const {
    clients: { totalItemsAvailable: TotalItemsAvailableClient },
  } = ctx

  const { skuId } = ctx.vtex.route.params

  try {
    const inventory: Promise<ITotalItemsAvailable> = TotalItemsAvailableClient.getSkuTotalItemsAvailable(
      skuId
    )

    const { balance } = await inventory;

    const availableItems = balance.reduce(
      (previousInventoryCalc: number, { totalQuantity, reservedQuantity }) => {
        return previousInventoryCalc + (totalQuantity - reservedQuantity)
      }, 0)

    ctx.body = availableItems
    await next()
  } catch {
    throw new Error(`Sku ${skuId} not found`)
  }
}
