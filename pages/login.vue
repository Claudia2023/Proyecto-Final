<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img
                    src="../static/logo.png"
                    alt="Logo de Claudia Barrios"
                    width="200"
                    height="200"
                  />
                  <h1 class="flex my-4 primary--text">
                    Recopilación de Proyectos
                  </h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="person"
                    name="login"
                    label="Login"
                    type="email"
                    v-model="model.username"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    name="password"
                    label="Password"
                    id="password"
                    type="password"
                    v-model="model.password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="login" :loading="loading">
                  Aceptar &nbsp;
                  <v-icon>fa fa-sign-in fa-lg</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  layout: "default",
  data: () => ({
    loading: false,
    model: {
      username: "",
      password: "",
    },
  }),
  beforeCreate() {
    localStorage.ValidoDashboard = false;
  },
  methods: {
    login() {
      this.loading = true;
      setTimeout(() => {
        this.$router.push("/dashboard");
      }, 1000);
      localStorage.ValidoDashboard = true;
    },
  },
};
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
h1 {
  font-size: 40px;
}
</style>
