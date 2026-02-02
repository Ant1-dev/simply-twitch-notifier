import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  const isFirefox = env.firefox === 'true';
  
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      background: './src/background/background.ts',
      content: './src/content/content.ts',
      options: './src/options/options.ts',
    },
    output: {
      path: path.resolve(__dirname, isFirefox ? 'dist-firefox' : 'dist-chrome'),
      filename: '[name].js',
      clean: true,
      // Add this for Firefox compatibility:
      ...(isFirefox && {
        iife: true,
        environment: {
          arrowFunction: false,
          const: false,
        }
      })
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { 
            from: isFirefox ? 'manifest-firefox.json' : 'manifest.json', 
            to: 'manifest.json' 
          },
          { from: 'public', to: '.' },
          { from: 'src/options/options.html', to: 'options.html' },
          { from: 'src/options/options.css', to: 'options.css' },
        ],
      }),
    ],
  };
};