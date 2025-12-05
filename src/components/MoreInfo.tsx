import { useQuery } from '@tanstack/react-query';
import { Banner, Button, ExternalLink, Link } from '@ugrc/utah-design-system';
import { X } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import config from '../config';
import getMoreInfo from '../services/moreInfo';
import type { ProductTypeKey } from '../types';
import ListLoader from './ListLoader';
import { isUrlLike } from './utils';

const commonTableCellClasses = 'py-2 [tr:not(:last-child)_&]:border-b';

export function turnEmailsIntoLinks(text: string | null | undefined) {
  if (typeof text !== 'string') {
    return text;
  }

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  const parts = text.split(emailRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (emailRegex.test(part)) {
          return (
            <Link key={index} href={`mailto:${part}`}>
              {part}
            </Link>
          );
        } else {
          return part;
        }
      })}
    </>
  );
}

type MoreInfoProps = {
  title: string;
  productType: ProductTypeKey;
  objectId: number;
  getMoreInfoFn?: typeof getMoreInfo; // for storybook tests
};

export default function MoreInfo({ title, productType, objectId, getMoreInfoFn = getMoreInfo }: MoreInfoProps) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['moreInfo', productType, objectId],
    queryFn: () => getMoreInfoFn(productType, objectId),
  });

  return (
    <>
      <div slot="title" className="flex items-start justify-between">
        <span className="text-xl font-bold">{title}</span>
        <Button slot="close" variant="icon" size="small" aria-label="Close">
          <X />
        </Button>
      </div>
      {isLoading ? (
        <ListLoader />
      ) : error || !data ? (
        <Banner className="w-96">
          <div className="flex flex-col gap-1">
            Error loading more information
            <Button className="self-end" variant="destructive" size="extraSmall" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Banner>
      ) : (
        <table className="mt-2">
          <tbody>
            {Object.entries(data).map(([fieldName, fieldValue]) => (
              <tr key={fieldName}>
                <td className={twJoin(commonTableCellClasses, 'font-semibold')}>
                  {config.MORE_INFO_FIELD_INFOS[productType][fieldName]}
                </td>
                <td className={twJoin(commonTableCellClasses, 'pl-2')}>
                  {isUrlLike(fieldValue) ? (
                    <ExternalLink href={fieldValue}>{fieldValue}</ExternalLink>
                  ) : (
                    turnEmailsIntoLinks(fieldValue)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
