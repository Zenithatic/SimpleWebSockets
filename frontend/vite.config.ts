import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isPreview, isSsrBuild }) => {
    return {
        base: "/"
    }
})