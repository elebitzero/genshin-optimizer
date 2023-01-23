import { WeaponData } from '@genshin-optimizer/pipeline'
import { WeaponKey } from '../../../../Types/consts'
import { dataObjForWeaponSheet } from '../../util'
import WeaponSheet, { IWeaponSheet } from "../../WeaponSheet"
import data_gen_json from './data_gen.json'

const key: WeaponKey = "PocketGrimoire"
const data_gen = data_gen_json as WeaponData
const data = dataObjForWeaponSheet(key, data_gen)

const sheet: IWeaponSheet = {
  document: [],
}
export default new WeaponSheet(key, sheet, data_gen, data)