import prodConfig from './config.prod';
import devConfig from './config.dev';

export default (
  process.env.NODE_ENV === 'production'
    ? prodConfig
    : devConfig
);
