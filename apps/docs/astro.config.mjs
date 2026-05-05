import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'InheronMUD - Códice del Mundo',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/kazlan/inheronMUD' },
			],
			sidebar: [
				{
					label: 'Empezando',
					items: [
						{ label: 'Bienvenido', slug: 'index' },
						{ label: 'Roadmap', slug: 'project/roadmap' },
					],
				},
				{
					label: 'Lore y Mundo',
					autogenerate: { directory: 'project/lore' },
				},
				{
					label: 'Manuales y Guías',
					items: [
						{ label: 'Guía YAML', slug: 'project/inheron-engine/guia-yaml' },
						{
							label: 'Mecánicas',
							autogenerate: { directory: 'project/sistemas' },
						},
						{
							label: 'Habilidades',
							autogenerate: { directory: 'project/skills' },
						},
					],
				},
				{
					label: 'Referencia Técnica (API)',
					autogenerate: { directory: 'api' },
				},
				{
					label: 'Meta y Reportes',
					items: [
						{ label: 'Estado del Motor', autogenerate: { directory: 'project/inheron-engine' } },
						{ label: 'Changelogs', autogenerate: { directory: 'project/changelogs' } },
						{ label: 'Reportes de Testers', slug: 'project/reporte-testers' },
					],
				},
			],
		}),
	],
});
