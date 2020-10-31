<template>
  <div id="appRoot">
    <template>
      <v-app id="inspire" class="app">
        <app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>
        <v-content>
          <page-header></page-header>
          <div class="page-wrapper">
            <nuxt />
          </div>
          <v-footer height="auto" class="white pa-3 app--footer">
            <span class="caption"
              >&copy; {{ new Date().getFullYear() }} Proyecto de Programación
              Gráfica</span
            >
            <v-spacer></v-spacer>
            <span class="caption mr-1"> Claudia Barrios </span>
            <v-icon color="pink" small>favorite</v-icon>
          </v-footer>
        </v-content>
        <!-- <app-fab></app-fab> -->
      </v-app>
    </template>

    <v-snackbar
      :timeout="3000"
      bottom
      right
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import AppDrawer from "@/components/AppDrawer";
import AppToolbar from "@/components/AppToolbar";
import PageHeader from "@/components/PageHeader";

export default {
  components: {
    AppDrawer,
    AppToolbar,
    PageHeader
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    snackbar: {
      show: false,
      text: "",
      color: "",
    },
  }),
  mounted() {
    if (localStorage.ValidoDashboard === "false") {
      this.$router.push("/login");
    }
  },
};
</script>

<style lang="stylus" scoped>
.setting-fab {
  top: 50% !important;
  right: 0;
  border-radius: 0;
}

.page-wrapper {
  min-height: calc(100vh - 64px - 50px - 81px);
  margin-bottom: 50px;
}

.app--footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>