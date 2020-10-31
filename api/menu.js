const Menu = [
  {header: 'Aplicación'},
  {divider: true},
  {
    title: 'Dashboard',
    icon: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    title: 'Proyectos',
    group: 'proyectos',
    component: 'proyectos',
    icon: 'archive',
    items: [
      {name: 'configuracion', title: 'Configuración', href: '/proyectos/configuracion'},
      {name: 'consulta', title: 'Consulta', href: '/proyectos/consulta'},     
    ]
  },
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
});

export default Menu;
