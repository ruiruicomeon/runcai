<template>
  <div>
    <vue-svg-tree :treeData="treeData" svgId="svg" ref="svgTree" :curveness="false" direction="col"></vue-svg-tree>
  </div>
</template>

<script>
import VueSvgTree from './svgtree';
import { list } from './list';

export default {
  components: {
    VueSvgTree,
  },
  data() {
    return {
      treeData: list,
    };
  },
};
</script>
