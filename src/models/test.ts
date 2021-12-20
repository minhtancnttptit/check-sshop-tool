import { types } from 'mobx-state-tree';
import { TextShadowModel, TextShadowModel2 } from './account';
const TestModel = types.model({
  arr: types.array(TextShadowModel),
  arr2: types.array(TextShadowModel2),
});

export default TestModel;
