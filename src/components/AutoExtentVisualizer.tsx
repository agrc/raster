import Graphic from '@arcgis/core/Graphic';
import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
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
  const graphicsHaveBeenPlaced = useRef(false);

  const categoryFilter = cat || catGroup;

  // Query all extents matching the category filter across all product types
  const { data: extentsData } = useQuery({
    queryKey: ['autoExtents', categoryFilter],
    queryFn: async () => {
      if (!categoryFilter) return null;

      const allProductTypes: ProductTypeKey[] = ['aerialPhotography', 'lidar', 'usgsDem', 'autoDem', 'contours', 'drg'];

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
      // if (graphicsHaveBeenPlaced.current) return;

      graphicsHaveBeenPlaced.current = true;
      const graphics = extentsData.map((feature) => {
        const geometry = fromJSON({
          ...feature.geometry,
          spatialReference: { wkid: 3857 },
        });

        return new Graphic({
          geometry,
          symbol: config.RESULT_SYMBOL,
        });
      });

      placeGraphic(graphics);

      // Zoom to combined extent of all graphics
      if (graphics.length > 0) {
        // Union all extents together
        const extents = graphics.map((g) => g.geometry?.extent).filter((e) => e !== null && e !== undefined);
        if (extents.length > 0) {
          const combinedExtent = extents.reduce((acc, extent) => acc.union(extent!), extents[0]!);
          zoom({ extent: combinedExtent });
        }
      }
    });
  }, [extentsData, mapView, placeGraphic, zoom]);

  return null; // This is an invisible component
}
