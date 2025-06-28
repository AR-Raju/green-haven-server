import type { TShippingMethod, TShippingZone } from "./shipping.interface"
import { ShippingMethod, ShippingZone } from "./shipping.model"

const createShippingZoneIntoDB = async (zoneData: TShippingZone) => {
  const result = await ShippingZone.create(zoneData)
  return result
}

const getAllShippingZonesFromDB = async () => {
  const result = await ShippingZone.find({ isActive: true }).populate("methods").sort({ createdAt: -1 })
  return result
}

const createShippingMethodIntoDB = async (methodData: TShippingMethod) => {
  const result = await ShippingMethod.create(methodData)
  const populatedMethod = await ShippingMethod.findById(result._id).populate("zoneId", "name regions")
  return populatedMethod
}

const getAllShippingMethodsFromDB = async (query: Record<string, unknown>) => {
  const filter: any = { isActive: true }

  if (query.zoneId) {
    filter.zoneId = query.zoneId
  }

  const result = await ShippingMethod.find(filter).populate("zoneId", "name regions").sort({ cost: 1 })

  return result
}

export const ShippingServices = {
  createShippingZoneIntoDB,
  getAllShippingZonesFromDB,
  createShippingMethodIntoDB,
  getAllShippingMethodsFromDB,
}
