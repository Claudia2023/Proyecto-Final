<template>
  <div id="pageConsulta">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-widget title="Filtros de registros por páginas DataTable">
            <div slot="widget-content">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex lg12 style="padding: 0px">
                    <v-btn-toggle v-model="toggle_exclusive">
                      <v-btn
                        flat
                        v-for="b in Botones"
                        :key="b.Id"
                        @click="GuardarFiltros(b.Id)"
                      >
                        {{ b.Tipo }}
                      </v-btn>
                    </v-btn-toggle>
                  </v-flex>
                </v-layout>
              </v-container>
            </div>
          </v-widget>
        </v-flex>

        <v-flex lg12>
          <h4>Proyecto Inactivos</h4>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="Buscar"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="tab.Cab"
                :search="search"
                :items="tab.Items"
                :rows-per-page-items="[5, 10, 20]"
                class="elevation-1"
                item-key="name"
                v-model="tab.selected"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.Id }}</td>
                  <td>{{ props.item.Nombre }}</td>
                  <td>{{ props.item.Categoria }}</td>
                  <td>{{ props.item.Autor }}</td>
                  <td>
                    <v-avatar size="32">
                      <img :src="Imagen(props.item.Avatar)" alt="" />
                    </v-avatar>
                  </td>
                  <td>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="success"
                      small
                      @click="ActivarRegistro(props.item.Id)"
                    >
                      <v-icon>done_outline</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import VWidget from "@/components/VWidget";
import axios from "axios";

export default {
  layout: "dashboard",
  components: {
    VWidget,
  },
  mounted() {
    var $this = this;
    axios.get("http://localhost:5000/ConfProyectos").then((response) => {
      $this.Botones = response.data.Config;
      for (let i = 0; i < response.data.Config.length; i++) {
        if (response.data.Config[i].Activo) $this.toggle_exclusive = i;
      }
      $this.tab.Items = response.data.Proyectos;
      $this.VectLic = response.data.Licencias;
    });
  },
  data() {
    return {
      search: "",
      tab: {
        Cab: [
          {
            text: "#",
            value: "Id",
          },
          {
            text: "Proyecto",
            value: "Nombre",
          },
          {
            text: "Categoria",
            value: "Categoria",
          },
          {
            text: "Autor",
            value: "Autor",
          },
          {
            text: "Avatar",
            value: "Avatar",
          },
          {
            text: "Opciones",
            value: "",
          },
        ],
        Items: [],
      },

      toggle_exclusive: null,
      Botones: [],
    };
  },
  methods: {
    Filtrar() {
      var $this = this;
      axios.get("http://localhost:5000/ConfProyectos").then((response) => {
        $this.tab.Items = response.data.Proyectos;
      });
    },
    GuardarFiltros(Id) {
      var $this = this;
      axios
        .post("http://localhost:5000/GuardarConf", { Id: Id })
        .then((response) => {
          if (!response.data.Exito) {
            alert(response.data.Mensaje);
          }
        });
    },
    Imagen(Im) {
      return require("@/static/avatar/" + Im);
    },
    ActivarRegistro(Id) {
      if (confirm("Desea Activar el Proyecto?")) {
        var $this = this;
        axios
          .post("http://localhost:5000/ActivarProyecto", { Id: Id })
          .then((response) => {
            if (response.data.Exito) {
              $this.Filtrar();
            } else {
              alert(response.data.Mensaje);
            }
          })
          .catch((e) => {
            alert("Error guardando los datos");
          });
      }
    },
  },
  computed: {},
};
</script>