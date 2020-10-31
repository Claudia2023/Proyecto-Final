<template>
  <div id="appRoot">
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    if (localStorage.ValidoDashboard === "false") {
      this.$router.push("/login");
    }
  },
};
</script>
