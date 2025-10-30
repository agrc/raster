import Graphic from '@arcgis/core/Graphic';
import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import config from '../config';
import useMap from '../hooks/useMap';
import { useUrlParams } from '../hooks/useUrlParams';
import { queryExtentsByCategoryFilter } from '../services/search';
import type { ProductTypeKey } from '../types';

/**
 * Component that automatically visualizes extents on the map when URL filters are present
 */
export default function AutoExtentVisualizer() {
  const { hasFilters, cat, catGroup } = useUrlParams();
  const { placeGraphic, zoom, mapView } = useMap();

  const categoryFilter = cat || catGroup;

  // Query all extents matching the category filter across all product types
  const { data: extentsData } = useQuery({
    queryKey: ['autoExtents', categoryFilter],
    queryFn: async () => {
      if (!categoryFilter) return null;

      const allProductTypes: ProductTypeKey[] = [
        'aerialPhotography',
        'lidar',
        'usgsDem',
        'autoDem',
        'contours',
        'drg',
      ];

      const allExtents = await Promise.all(
        allProductTypes.map((productType) => queryExtentsByCategoryFilter(productType, categoryFilter)),
      );

      return allExtents.flat();
    },
    enabled: hasFilters && categoryFilter !== null,
    staleTime: Infinity, // Don't refetch, this data is static for the session
  });

  // Place graphics on the map when extents data is available and map is ready
  useEffect(() => {
    if (!extentsData || extentsData.length === 0 || !mapView || !mapView.ready) {
      return;
    }

    // Wait for map to be fully ready before adding graphics
    mapView.when(() => {
      const graphics = extentsData.map((feature) => {
        const geometry = fromJSON(feature.geometry);
        // Ensure geometry has spatial reference set to Web Mercator (3857)
        if (geometry && !geometry.spatialReference) {
          geometry.spatialReference = { wkid: 3857 };
        }
        return new Graphic({
          geometry,
          symbol: config.RESULT_SYMBOL,
        });
      });

      placeGraphic(graphics);

      // Zoom to combined extent of all graphics
      if (graphics.length > 0) {
        // Get the combined extent of all graphics
        const allGeometries = graphics.map((g) => g.geometry).filter((g) => g !== null);
        if (allGeometries.length > 0) {
          zoom({ extent: allGeometries[0]!.extent });
        }
      }
    });
  }, [extentsData, mapView, placeGraphic, zoom]);

  return null; // This is an invisible component
}
