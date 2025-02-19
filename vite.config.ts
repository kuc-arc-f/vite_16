import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [react()], 
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      build: {
        lib: {
          entry: [
            './src/entry-client.tsx',
          ],
          formats: ['es'],
          fileName: '[name]',
        },
        rollupOptions: {
          output: {
            dir: './public/assets'
          }
        },
        emptyOutDir: false,
        copyPublicDir: false
      }
    }
  }else{
    return {
      plugins: [react()]    
    }
  }  
})

/*
export default defineConfig({
  plugins: [react()]
})
  */
