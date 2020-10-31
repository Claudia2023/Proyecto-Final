<template>
  <div id="pageConsulta">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-widget title="Categorias">
            <div slot="widget-content">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex lg12 style="padding: 0px">
                    <v-btn-toggle v-model="toggle_exclusive">
                      <v-btn
                        flat
                        v-for="b in Botones"
                        :key="b.Id"
                        @click="FiltrarCategoria(b.Id)"
                      >
                        {{ b.Nombre }}
                      </v-btn>
                    </v-btn-toggle>
                    <div style="float: right">
                      <v-dialog v-model="ModalAdd" persistent max-width="500px">
                        <v-btn color="success" dark fab slot="activator">
                          <v-icon dark>add</v-icon>
                        </v-btn>
                        <v-card>
                          <v-card-title>
                            <span class="headline">Agregar Proyecto</span>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-text>
                            <v-container grid-list-md>
                              <v-form v-model="Valido"
                                ><v-layout wrap>
                                  <v-flex xs12 sm6 md6>
                                    <v-text-field
                                      label="Nombre"
                                      required
                                      v-model="Nombre"
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 sm6 md6>
                                    <v-menu
                                      class="pr-2"
                                      ref="statDate"
                                      lazy
                                      :close-on-content-click="false"
                                      v-model="startDateMenu"
                                      transition="scale-transition"
                                      offset-y
                                      full-width
                                      :nudge-bottom="-22"
                                      max-width="290px"
                                      :return-value.sync="startDate"
                                    >
                                      <v-text-field
                                        slot="activator"
                                        label="Fecha"
                                        v-model="startDate"
                                        append-icon="event"
                                        readonly
                                      ></v-text-field>
                                      <v-date-picker
                                        v-model="startDate"
                                        no-title
                                        scrollable
                                      >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          flat
                                          color="primary"
                                          @click="startDateMenu = false"
                                          >Cancelar</v-btn
                                        >
                                        <v-btn
                                          flat
                                          color="primary"
                                          @click="
                                            $refs.statDate.save(startDate)
                                          "
                                          >OK</v-btn
                                        >
                                      </v-date-picker>
                                    </v-menu>
                                  </v-flex>
                                  <v-flex xs12 sm6 md6>
                                    <v-text-field
                                      label="Descripción"
                                      v-model="Descripcion"
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 sm6 md6>
                                    <v-select
                                      label="Categoria"
                                      required
                                      :items="Botones"
                                      item-text="Nombre"
                                      item-value="Id"
                                      v-model="Categoria"
                                    ></v-select>
                                  </v-flex>
                                  <v-flex xs12 sm6 md6>
                                    <v-select
                                      label="Licencia"
                                      required
                                      v-model="Licencia"
                                      :items="VectLic"
                                      item-text="Nombre"
                                      item-value="Id"
                                    ></v-select>
                                  </v-flex>
                                  <v-flex xs12 sm6 md6>
                                    <v-text-field
                                      label="Autor"
                                      v-model="Autor"
                                      required
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field
                                      label="Link"
                                      hint="Link Web o Repositorio"
                                      required
                                      v-model="Link"
                                    ></v-text-field>
                                  </v-flex>

                                  <v-flex xs12 sm6 md6>
                                    <input type="file" />
                                  </v-flex>
                                </v-layout>
                              </v-form>
                            </v-container>
                            <small>*Campos requeridos</small>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="red darken-1"
                              flat
                              @click.native="ModalAdd = false"
                              >Cerrar</v-btn
                            >
                            <v-btn
                              color="success darken-1"
                              flat
                              @click="Guardar"
                              >Guardar</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </div>
          </v-widget>
        </v-flex>

        <v-flex lg12>
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
                :headers="complex.headers"
                :search="search"
                :items="complex.items"
                :rows-per-page-items="VectRows"
                :pagination.sync="paginationSync"
                class="elevation-1"
                item-key="name"
                v-model="complex.selected"
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
                    <v-btn depressed outline icon fab dark color="orange" small>
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="pink"
                      small
                      @click="Eliminar(props.item.Id)"
                    >
                      <v-icon>delete</v-icon>
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
    axios.get("http://localhost:5000/InfoProyectos").then((response) => {
      $this.Botones = response.data.Categorias;
      $this.complex.items = response.data.Proyectos;
      $this.VectLic = response.data.Licencias;
      $this.VectRows = response.data.RowsPage.split(",");
      $this.paginationSync.rowsPerPage = response.data.RowsPage.split(",")[0];
    });
  },
  data() {
    return {
      search: "",
      complex: {
        headers: [
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
        items: [],
      },
      toggle_exclusive: null,
      Botones: [],
      VectLic: [],
      VectRows: [5, 50, 500],
      paginationSync: { rowsPerPage: 60 },
      Anterior: -1,
      ModalAdd: false,
      startDate: null,
      startDateMenu: false,
      Valido: true,
      Nombre: "",
      Descripcion: "",
      Categoria: "",
      Licencia: "",
      Autor: "",
      Link: "",
    };
  },
  methods: {
    FiltrarCategoria(Id) {
      var $this = this;
      var ruta = "";
      if (Id === this.Anterior) {
        ruta = "http://localhost:5000/FilterProyectos?data=";
      } else {
        ruta = "http://localhost:5000/FilterProyectos?data=" + Id;
      }
      this.Anterior = Id;
      axios.get(ruta).then((response) => {
        $this.complex.items = response.data.Proyectos;
      });
    },
    Imagen(Im) {
      return require("@/static/avatar/" + Im);
    },
    Guardar() {
      if (
        this.Nombre !== "" &&
        this.startDate !== "" &&
        this.startDate !== null &&
        this.Descripcion !== "" &&
        this.Categoria !== "" &&
        this.Licencia !== "" &&
        this.Autor !== "" &&
        this.Link !== ""
      ) {
        var $this = this;
        var SendD = {
          Nombre: this.Nombre,
          Fecha: this.startDate,
          Descripcion: this.Descripcion,
          Categoria: this.Categoria,
          Licencia: this.Licencia,
          Autor: this.Autor,
          Link: this.Link,
          Imagen: "P1.png",
        };
        axios
          .post("http://localhost:5000/GuardarProyecto", { Input: SendD })
          .then((response) => {
            if (response.data.Exito) {
              $this.ModalAdd = false;
              $this.Nombre = "";
              $this.startDate = "";
              $this.startDate = "";
              $this.Descripcion = "";
              $this.Categoria = "";
              $this.Licencia = "";
              $this.Autor = "";
              $this.Link = "";
              $this.FiltrarCategoria($this.Anterior);
            } else {
              alert(response.data.Mensaje);
            }
          })
          .catch((e) => {
            alert("Error guardando los datos");
          });
      } else {
        alert("Todos los Campos son Requeridos");
      }
    },
    Eliminar(Id) {
      if (confirm("Desea Eliminar el Proyecto?")) {
        var $this = this;
        axios
          .post("http://localhost:5000/EliminarProyecto", { Id: Id })
          .then((response) => {
            if (response.data.Exito) {
              $this.FiltrarCategoria($this.Anterior);
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
