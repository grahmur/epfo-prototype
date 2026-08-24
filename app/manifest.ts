import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EPFO service experience prototype',
    short_name: 'EPFO prototype',
    description: 'Task-first EPFO service discovery using synthetic data only.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf4',
    theme_color: '#101b2d',
  };
}
