export default [
    {
        title: 'Catalogos',
        icon: { icon: 'tabler-list-details' },
        children: [
            {
                title: 'Dependencias',
                to: 'catalogos-minutas-lista-dependencias',
                icon: {
                    icon: 'tabler-user-hexagon',
                    style: {
                        width: '22px',
                        height: '22px',
                    },
                },
            },
            {
                title: 'Directorio',
                to: 'catalogos-minutas-directorio',
                icon: {
                    icon: 'tabler-address-book',
                    style: {
                        width: '22px',
                        height: '22px',
                    },
                },
            },
            {
                title: 'Configuraciones',
                icon: {
                    icon: 'tabler-file-settings',
                    style: {
                        width: '22px',
                        height: '22px',
                    },
                },
                to: 'catalogos-minutas-configuraciones',
            },{
                title: 'Lugares de Reunión',
                icon: {
                    icon: 'tabler-address-book',
                    style: {
                        width: '22px',
                        height: '22px',
                    },
                },
                to: 'catalogos-minutas-lugar-reunion',
            },
            {
                title: 'CheckList Reunion',
                icon: {
                    icon: 'tabler-check',
                    style: {
                        width: '22px',
                        height: '22px',
                    },
                },
                to: 'catalogos-minutas-checklist-reunion',
            },
            {
                title: 'Grado',
                icon: {
                    icon: 'tabler-address-book',
                    style: {
                        width: '22px',
                        height: '22px',
                    },
                },
                to: 'catalogos-minutas-grado',

            },
            // {
            //     title: 'Tema reunión',
            //     icon: {
            //         icon: 'tabler-address-book',
            //         style: {
            //             width: '22px',
            //             height: '22px',
            //         },
            //     },
            //     to: 'catalogos-minutas-tema-reunion',
            // },
        ]
    },

]