import { IMyApp } from '../../app';
const app = getApp<IMyApp>();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    markdown: null,
    // 页面 <my-component unit-id="" />
    unitId: null,
    isDark: {
      type: Boolean,
      optionalTypes: [Boolean],
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    markdownObj: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {},

  observers: {
    markdown: function() {
      const markdownObj = app.towxml.toJson(
        this.properties.markdown,
        'markdown',
      );

      this.setData({
        markdownObj,
      });
    },
  },

  lifetimes: {},
});
