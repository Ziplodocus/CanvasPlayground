import { defineConfig } from 'vite';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig( ( { command, node } ) => {
	if ( command === "dev" ) {
		return {
			mode: "development",
			base: "./",
			build: {
				sourcemap: true
			}
		}
	} else {
		return {
			mode: 'production',
			base: "./",
			build: {
				sourcemap: true
			}
		}
	}
} )