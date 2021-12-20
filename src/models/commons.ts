import { Instance, types } from 'mobx-state-tree';

// chưa biết lấy type ra nên đặt tạm
const Unit = types.enumeration('unit', ['px', 'em', '%']);

type TUnit = Instance<typeof Unit>;

export const CommonModel = types
  .model({
    isImportant: types.optional(types.boolean, false),
    // unit: types.union(types.literal('px'), types.literal('%')),
    // cách ngắn hơn:
    unit: types.optional(Unit, 'px'),
  })
  .actions((self) => ({
    changeUnit(unit: TUnit) {
      self.unit = unit;
    },
    setImportant(val: boolean) {
      self.isImportant = val;
    },
  }));
