/**
 * find parent component by name
 */
/* eslint-disable */
export default {
  data() {
    return {
      parent: null
    };
  },

  methods: {
    findParent(name) {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name === name) {
          this.parent = parent;
          break;
        }
        parent = parent.$parent;
      }
    }
  }
};
