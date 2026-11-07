import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(viteConfig) {
    const base = process.env.STORYBOOK_BASE_PATH || '/'
    const plugins = (viteConfig.plugins || []).flat().filter((plugin) => {
      if (!plugin || typeof plugin !== 'object') return true
      return !('name' in plugin) || plugin.name !== 'vite:dts'
    })

    return mergeConfig(
      { ...viteConfig, plugins },
      {
        base,
        build: {
          lib: undefined,
        },
        define: {
          __ADMIN_KIT_VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0'),
        },
      },
    )
  },
}

export default config
