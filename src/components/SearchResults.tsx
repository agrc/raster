import { useQuery } from '@tanstack/react-query';
import useWizardMachine from './hooks/useWizardMachine';
import search from './services/search';

export default function SearchResults() {
  const { snapshot } = useWizardMachine();

  const { data, error, isLoading } = useQuery({
    queryKey: ['searchResults', snapshot.context.productTypes, snapshot.context.aoi],
    queryFn: () => {
      return search(snapshot.context.productTypes, snapshot.context.aoi as __esri.GeometryUnion);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading search results</div>;

  console.log('SearchResults data:', data);

  return <div>{data?.length}</div>;
}
