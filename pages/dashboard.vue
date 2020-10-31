<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg8 sm12 xs12>
          <v-widget title="Proyectos Por Categorias" content-bg="white">                                 
            <div slot="widget-content">
              <e-chart
                :path-option="[
                  ['dataset.source', DataP],
                  ['color', [color.green.lighten1]],
                  ['legend.show', true],
                  ['xAxis.axisLabel.show', true],
                  ['yAxis.axisLabel.show', true],
                  ['grid.left', '2%'],
                  ['grid.bottom', '5%'],
                  ['grid.right', '3%'],
                  ['series[0].type', 'bar'],
                  ['series[0].areaStyle', {}],
                  ['series[0].smooth', true],
                ]"
                height="400px"
                width="85%"
              >
              </e-chart>
            </div>
          </v-widget>
        </v-flex>
        <v-flex lg4 sm12 xs12>
          <v-widget title="Proyecto por Licencias" content-bg="white">
            <div slot="widget-content">
              <e-chart
                :path-option="[
                  ['dataset.source', DataP2],
                  ['legend.bottom', '0'], 
                  [ 
                    'color', 
                    [ 
                      color.lightBlue.base, 
                      color.indigo.base, 
                      color.pink.base, 
                      color.green.base,
                      color.cyan.base, 
                      color.teal.base, 
                    ], 
                  ], 
                  ['xAxis.show', false], 
                  ['yAxis.show', false],
                  ['series[0].type', 'pie'], 
                  ['series[0].avoidLabelOverlap', true], 
                  ['series[0].radius', ['50%', '70%']], 
                ]" 
                height="400px" 
                width="100%" 
              > 
              </e-chart>
            </div>
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import EChart from "@/components/chart/echart";
import VWidget from "@/components/VWidget";
import Material from "vuetify/es5/util/colors";
import axios from "axios";

export default {
  layout: "dashboard",
  components: {
    VWidget,
    EChart,
  },
  data: () => ({
    color: Material,
    DataP: [{ label: "IA", Proyectos: 7 }],
    DataP2: [{ label: "TEST", Proyectos: 7 }],
  }),
  mounted() {
    var $this = this;
    axios.get("http://localhost:5000/Dashboard")
    .then(response => {      
      if(response.data.Exito){
        this.$root.$emit("Graficas", response.data);
      }else{
        alert(response.data.Mensaje);
      }
    })
    .catch(e => {
      alert("Error Consultando los datos");
    });
  },
};
</script>