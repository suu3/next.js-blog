import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: false,
  include: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
});

