import { canNavigate } from '@layouts/plugins/casl'

export const setupGuards = router => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(to => {
    /*
         * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
         * Examples of public routes are, 404, under maintenance, etc.
         */
    if (to.meta.public)
      return

    const diferencia = Math.floor((new Date().getTime() - useCookie('inicioSesion').value) / 3600000);

    console.log(to, diferencia);
    /**
         * Check if user is logged in by checking if token & user data exists in local storage
         * Feel free to update this logic to suit your needs
         */
    const isLoggedIn = !!(useCookie('userId').value && useCookie('accessToken').value && useCookie('userName').value)

    /*
          If user is logged in and is trying to access login like page, redirect to home
          else allow visiting the page
          (WARN: Don't allow executing further by return statement because next code will check for permissions)
         */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/'
      else
        return undefined
    }
    if (diferencia >= 11) {
      const userData = useCookie("userData");

      useCookie('inicioSesion').value = null
      useCookie("accessToken").value = null;
      useCookie("userName").value = null;
      useCookie("userId").value = null;
      useCookie("permisos").value = null;
      useCookie('nombreOficina').value = null
      useCookie('tipoUsuario').value = null
      useCookie('idOficina').value = null
      useCookie('idTipoPermiso').value = null
      userData.value = null;

      return '/login'
    }
    if (!isLoggedIn) {
      return '/login'
    }

    const RutaAdicional = to.meta.permiso;
    // // Obtener los permisos almacenados en el localStorage
    const permisosUsuario = JSON.parse(localStorage.getItem('menu'))
    // Verificar si la ruta 'to' existe en los datos de localStorage
    let rutaLocalStorage = false;

    // Verificar en el menú principal
    if (permisosUsuario.some(permisos => permisos.to === to.name || permisos.to === RutaAdicional)) {
      rutaLocalStorage = true;

    } else {
      // Verificar en los submenús
      permisosUsuario.forEach(permisos => {
        if (permisos.children && permisos.children.length > 0) {
          if (permisos.children.some(child => child.to === to.name || child.to === RutaAdicional)) {
            rutaLocalStorage = true;
          }
        }
      });
    }

    // Si la ruta 'to' existe en los datos de localStorage, permite la navegación
    if (rutaLocalStorage) {
      return
    } else {

      return { name: 'not-authorized' } // Cambiar por otra 
    }
    // if (!canNavigate(to)) {
    //   /* eslint-disable indent */
    //         return isLoggedIn
    //             ? { name: 'not-authorized' }
    //             : {
    //                 name: 'login',
    //                 query: {
    //                     ...to.query,
    //                     to: to.fullPath !== '/' ? to.path : undefined,
    //                 },
    //             }
    //         /* eslint-enable indent */
    // }
  })
}
