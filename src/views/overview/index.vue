<template>
  <div class="overview">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from './server';

const server = new Server();
export default {
  name: 'overview',
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      server,
      isRouterAlive: true,
    };
  },

  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  destroyed() {
    sessionStorage.removeItem('selectPer');
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },

  },
  watch: {
    '$route.query.id': {
      handler() {
        this.reload();
      },
    },
  },
};
</script>