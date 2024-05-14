import { useCookie } from '@/@core/composable/useCookie'

const emailRouteComponent = () => import('@/pages/apps/email/index.vue')
const validar = () => import('@/pages/apps/email/validar.vue')
const mensaje = () => import('@/pages/apps/email/mensaje.vue')
const EmailView = ()=> import('@/views/apps/email/EmailView.vue')
const email = () => import ('@/pages/apps/email/index.vue')
const crearReunion = () => import ('@/pages/reunion/crear-reunion.vue')
const editarReunion = () => import ('@/pages/reunion/asistencia-pdf.vue')
const reunionPdf = ()=> import ('@/pages/reunion/reunion-pdf.vue')
const crearMinuta = () => import ('@/pages/reunion/crear-minuta.vue')
const actaMinuta = () => import ('@/pages/reunion/acta-minuta.vue')
const editarUsuario = () => import("@/pages/usuario/alt-mod-usuario.vue")

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      if (useCookie('userName').value != undefined) {
        // Obtener los permisos almacenado en el localStorage
        const permisoStorage = JSON.parse(localStorage.getItem('menu'));
        if (permisoStorage && permisoStorage.length > 0 && permisoStorage[0].children) {
          // Obtener la ruta  del permisos almacenado
          const ruta = permisoStorage[0].children[0].to;
          if (ruta) {
            return { name: ruta};
          }
        }else if(permisoStorage && permisoStorage.length > 0){
          const ruta = permisoStorage[0].to;
          if (ruta) {
            return { name: ruta};
          }
        }
        // Si no hay una ruta almacenada, redirigir a la ruta predeterminada (apps-email)
        return { name: 'apps-email' };
      }
      // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
      return { name: 'login', query: to.query };
    },
  },
  {
    path: '/login',
    name: 'login',
    redirect: to => {
      if (useCookie('userName').value != undefined) {
        // Obtener el objeto de permisos almacenado en el localStorage
        const permisoStorage = JSON.parse(localStorage.getItem('menu'));
        if (permisoStorage && permisoStorage.length > 0 && permisoStorage[0].children) {
          // Obtener la ruta especificada en el objeto de permisos almacenado
          const ruta = permisoStorage[0].children[0].to;
          if (ruta) {
            return { name: ruta};
          }
        }else if(permisoStorage && permisoStorage.length > 0){
          const ruta = permisoStorage[0].to;
          if (ruta) {
            return { name: ruta};
          }
        }
        // Si no hay una ruta almacenada, redirigir a la ruta predeterminada (apps-email)
        return { name: 'apps-email' };
      }
      // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
      return { name: 'login', query: to.query };
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]
export const routes = [
  // Email filter
  {
    path: '/apps/email/filter/:filter',
    name: 'apps-email-filter',
    component: emailRouteComponent,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso : 'apps-email'
    },
  },

  {
    path: '/apps/email/validar/:id/:tipo',
    name: 'apps/email/validar',
    component: validar,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'apps-email'
    },
  },

  {
    path: '/apps/email/mensaje/:id/:tipo',
    name: 'apps/email/mensaje',
    component: mensaje,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'apps-email'
    },
  },
  {
    path: '/apps/email/:id',
    name: 'email',
    component: email,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'apps-email'
    },
  },
  {
    path: '/reunion/crear-reunion/:id',
    name: 'reunion-crear-reunion',
    component: crearReunion,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'reunion-reuniones'
    },
  },

  {
    path: '/reunion/asistencia-pdf/:idReunion',  //icono pdf reuniones 
    name: 'reunion-asistencia-pdf',
    component: editarReunion,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'reunion-reuniones'
    },
  },
  {
    path: '/reunion/reunion-pdf/:idReunion', //icono de impresora reuniones
    name: 'reunion-reunion-pdf',
    component: reunionPdf,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'reunion-reuniones'
    },
  },
  {
    path: '/reunion/crear-minuta/:idReunion/:idMinuta',
    name: 'reunion-crear-minuta',
    component: crearMinuta,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'reunion-minutas'
    },
  },
  {
    path: '/reunion/acta-minuta/:idReunion/:idMinuta',
    name: 'reunion-acta-minuta',
    component: actaMinuta,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
      permiso:'reunion-minutas'
    },
  },

  // Email label
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },
  {
    path: '/dashboards/logistics',
    name: 'dashboards-logistics',
    component: () => import('@/pages/apps/logistics/dashboard.vue'),
  },
  {
    path: '/dashboards/academy',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
  },
  {
    path: '/apps/ecommerce/dashboard',
    name: 'apps-ecommerce-dashboard',
    component: () => import('@/pages/dashboards/ecommerce.vue'),
  },


  // / ----------Editar usuarios------------ */,
  {
    path: '/usuario-alt-mod-usuario/editar/:id',
    name: 'usuario-alt-mod-usuario/editar',
    component: editarUsuario,
  },
]
