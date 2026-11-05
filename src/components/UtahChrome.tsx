import { setUtahHeaderSettings } from '@utahdts/utah-design-system-header';
import { useEffect } from 'react';

const version = import.meta.env.PACKAGE_VERSION;

const headerSettings = (title: string) => ({
  applicationType: 'custom application' as const,
  title,
  titleUrl: '/',
  skipLinkUrl: '#main-content',
  showTitle: true,
  size: 'MEDIUM',
  mainMenu: false as const,
  utahId: false as const,
  notifications: false,
  onSearch: false as const,
  domLocationTarget: {
    cssSelector: '#utah-header-target',
  },
  logo: {
    imageUrl: '/ugrc-logo.svg',
  },
  actionItems: [
    {
      actionPopupMenu: {
        title: 'UGRC resources',
        menuItems: [
          {
            title: 'UGRC Homepage',
            actionUrl: { url: 'https://gis.utah.gov', openInNewTab: true },
          },
          {
            title: 'Discover Product Page',
            actionUrl: { url: 'https://gis.utah.gov/products/discover/', openInNewTab: true },
          },
          {
            title: 'UGRC Base Map Information',
            actionUrl: { url: 'https://gis.utah.gov/products/sgid/base-maps/', openInNewTab: true },
          },
          {
            title: 'UGRC Aerial Photography',
            actionUrl: { url: 'https://gis.utah.gov/products/sgid/aerial-photography/', openInNewTab: true },
          },
          {
            title: 'UGRC Lidar',
            actionUrl: { url: 'https://gis.utah.gov/products/sgid/elevation/lidar/', openInNewTab: true },
          },
          {
            title: `Version ${version} changelog`,
            actionUrl: { url: `https://github.com/agrc/raster/releases/v${version}`, openInNewTab: true },
          },
        ],
      },
      showTitle: false,
      title: 'UGRC resources',
      icon: '<span class="utds-icon-before-waffle" aria-hidden="true" />',
    },
  ],
  footer: {
    showHorizontalRule: false,
    domLocationTarget: {
      cssSelector: '#utah-footer-target',
    },
  },
});

export default function UtahChrome({ title }: { title: string }) {
  useEffect(() => {
    setUtahHeaderSettings(headerSettings(title));
  }, [title]);

  return null;
}
