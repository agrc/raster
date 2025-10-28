import { useQuery } from '@tanstack/react-query';
import { Banner, Button, ExternalLink, Link } from '@ugrc/utah-design-system';
import { X } from 'lucide-react';
import { BulletList } from 'react-content-loader';
import { twJoin } from 'tailwind-merge';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useDarkMode } from 'usehooks-ts';
import tailwindConfig from '../../tailwind.config';
import config from '../config';
import getMoreInfo from '../services/moreInfo';
import type { ProductTypeKey } from '../types';
import { isUrlLike } from './utils';

const fullConfig = resolveConfig(tailwindConfig);
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
  const { data, error, isLoading } = useQuery({
    queryKey: ['moreInfo', productType, objectId],
    queryFn: () => getMoreInfoFn(productType, objectId),
  });
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <div slot="title" className="flex items-start justify-between">
        <span className="text-xl font-bold">{title}</span>
        <Button slot="close" variant="icon" size="small" aria-label="Close">
          <X />
        </Button>
      </div>
      {isLoading ? (
        <BulletList
          backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]}
          foregroundColor="#FFFFFF"
        />
      ) : error || !data ? (
        <Banner>Error loading more information</Banner>
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
