const menuOption = [
	//   {
	// 	 heading: 'Catalogos inbox',
	//   },
	{ heading: 'Apps & Pages' },
	{
		title: 'Email',
		icon: { icon: 'tabler-mail' },
		to: 'apps-email',
	},
	// {
	// 	title: 'Reportes',
	// 	icon:
	// 	{
	// 		icon: 'tabler-mailbox',
	// 	},
	// 	to: 'apps-email-reportes'
	// },
	{
		title: 'Historia',
		icon:
		{
			icon: 'tabler-history',
		},
		to: 'apps-email-historia'
	},
	{
		title: 'Catalogos inbox',
		icon:
		{
			icon: 'tabler-mailbox',
		},
		children: [
			{
				title: 'Grupos recibir',
				to: 'catalogos-inbox-grupos',
				icon: {
					icon: 'tabler-users-group',
					style: {
						width: '22px',
						height: '22px',
					},
				},
			},
			{
				title: 'Grupos enviar',
				to: 'catalogos-inbox-grupos-enviar',
				icon: {
					icon: 'tabler-users-group',
					style: {
						width: '22px',
						height: '22px',
					},
				}
			},
			{
				title: 'Tipos acontecimientos',
				to: 'catalogos-inbox-tipo-acontecimiento',
				icon: {
					icon: 'tabler-timeline-event-text',
					style: {
						width: '22px',
						height: '22px',
					},
				},
			},
			{
				title: "Estados acontecimientos",
				to: "catalogos-inbox-estados-acontecimientos",
				icon: {
					icon: 'tabler-category',
					style: {
						width: '22px',
						height: '22px',
					},
				}
			},
			{
				title: "Temas",
				to: "catalogos-inbox-temas",
				icon: {
					icon: "tabler-category",
					style: {
						width: '22px',
						height: '22px',
					}
				}
			},
			{
				title: 'Informantes',
				to: 'catalogos-inbox-informantes',
				icon: {
					icon: 'tabler-user-up',
					style: {
						width: '22px',
						height: '22px',
					},
				},
			},
			{
				title: 'Palabras vinculadas',
				to: 'catalogos-inbox-palabras-vinculadas',
				icon: {
					icon: 'tabler-list-search',
					style: {
						width: '22px',
						height: '22px',
					},
				},

			},
			{
				title: 'Municipios',
				to: 'catalogos-inbox-municipios',
				icon: {
					icon: 'tabler-building-community',
					style: {
						width: '22px',
						height: '22px',
					},
				},

			},
		],
	},
	{
		title: 'Reuniones',
		icon: {
			icon: 'custom-wizard-social-link',
		},
		to: 'reunion-reuniones',
	},
	{
		title: 'Minutas',
		icon: { icon: 'tabler-table-minus' },
		to: 'reunion-minutas'
	},
	{
		title: 'Tablero',
		icon: { icon: 'tabler-brand-trello' },
		to: 'reunion-tablero-minutas'
	},
	{
		title: 'Usuarios',
		icon: { icon: 'tabler-user' },
		to: 'usuario-usuarios'
	},
	{
		title: 'Oficinas',
		icon: { icon: 'tabler-building' },
		to: 'oficinas-oficinas'
	},
	{
		title: 'Directorio actores',
		icon: { icon: 'tabler-building' },
		to: 'apps-actores-directorio-actores'
	},
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
			}, {
				title: 'Lugares de reunión',
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
				title: 'CheckList reunión',
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
			{
				title: 'Tema reunión',
				icon: {
					icon: 'tabler-address-book',
					style: {
						width: '22px',
						height: '22px',
					},
				},
				to: 'catalogos-minutas-tema-reunion',
			},
		]
	},
]


export default menuOption;