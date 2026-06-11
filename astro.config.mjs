import {defineConfig} from 'astro/config'
import netlify from '@astrojs/netlify'

export default defineConfig({
	srcDir: '.',
	output: 'server',
	build: {inlineStylesheets: 'always'},
	adapter: netlify(),
})
