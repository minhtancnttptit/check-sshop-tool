/* eslint-disable no-param-reassign */
import { types, Instance, cast, SnapshotIn } from 'mobx-state-tree';
import _ from 'lodash';
import { CommonModel } from './commons';



export const TextShadowItemModel = types
  .model({
    type: 'text',
    id: types.string,
    shiftRight: types.optional(types.number, 0),
    shiftDown: types.optional(types.number, 1),
    spread: types.optional(types.number, 0),
    blur: types.optional(types.number, 0),
    color: types.optional(types.string, '#000000'),
    inset: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setShiftRight(val: number) {
      self.shiftRight = val;
    },
    setShiftDown(val: number) {
      self.shiftDown = val;
    },
    setSpread(val: number) {
      self.spread = val;
    },
    setBlur(val: number) {
      self.blur = val;
    },
    setColor(val: string) {
      self.color = val;
    },
    setInset(val: boolean) {
      self.inset = val;
    },
  }))
  .views((self) => ({
    get CSS(): string {
      const {
        color, shiftRight, shiftDown,
        blur,
      } = self;

      const CSS = `${shiftRight}px ${shiftDown}px ${blur}px ${color}`;
      return CSS;
    }
  }));

export interface ITextShadowItemModel extends Instance<typeof TextShadowItemModel> { }
export interface ITextShadowItemModelIn extends SnapshotIn<typeof TextShadowItemModel> { }

export const TextShadowBase = types
  .model({
    layers: types.optional(types.array(TextShadowItemModel), [{ id: _.uniqueId('t') }]),
    activeLayer: types.optional(types.number, 0),
  })
  .actions((self) => ({
    setActiveLayer(index: number) {
      self.activeLayer = index;
    },
    addLayer(layer: ITextShadowItemModelIn) {
      self.layers.push(layer);
    },
    removeLayer(index: number) {
      self.layers.splice(index, 1);
    },
    setLayers(newLayer: ITextShadowItemModelIn[]) {
      self.layers = cast(newLayer);
    }
  }));


export const TextShadowModel = types.compose(CommonModel, TextShadowBase).views((self) => ({
  get CSS(): string {
    const { layers, isImportant } = self;

    let CSS = 'text-shadow: ';
    for (let i = 0; i < layers.length; i += 1) {
      if (i === layers.length - 1) {
        CSS += `${layers[i].CSS};`;
      } else {
        CSS += `${layers[i].CSS}, `;
      }
    }
    return CSS;
  },
  get propertiesCSS() {
    return {
      TextShadow: this.CSS
    };
  }
}));

export type Dir<T> = T;
export interface ITest extends Dir<typeof TextShadowModel> {}

export const TextShadowModel2: ITest = TextShadowModel;

export interface ITextShadowModel extends Instance<typeof TextShadowModel> { }
