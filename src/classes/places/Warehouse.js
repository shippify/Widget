import errors, { generateError } from './../../errors'

class Warehouse {
  constructor(warehouseId) {
    if (typeof warehouseId === 'string' && warehouseId) {
      this.warehouseId = warehouseId
    } else {
      throw generateError(errors.invalidValue('warehouseId', warehouseId))
    }
  }

  getLocation(options = {}, cb) {
    const { warehouseId } = this
    cb(null, { warehouseId })
  }
}

export default Warehouse
