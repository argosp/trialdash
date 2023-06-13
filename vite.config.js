import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  // console.log('mode:', mode, 'cwd:', process.cwd(), 'env:', env);
  
  return {
    plugins: [react(), svgr()],
    envPrefix: 'REACT_APP_',
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      port: parseInt(env.REACT_APP_PORT), // REACT_APP_PORT on trialdash/.env need to sync with DASHBOARD_PORT on argos/.env
    },
    build: {
      outDir: './build'
    }
  };
})
