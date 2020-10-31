<template>
  <div id="PerfilId">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h4>Información de Contacto</h4>
        </v-flex>
        <v-flex lg8 sm12>
          <perfil></perfil>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Perfil from "@/components/Perfil";
export default {
  layout: "dashboard",
  components: {
    Perfil,
  },
};
</script>