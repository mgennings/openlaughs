import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n';
import { DropdownCard1 } from '@/partials/dropdowns/general';

interface IHighlightsRow {
  icon: string;
  text: string;
  total: number;
  stats: number;
  increase: boolean;
}
interface IHighlightsRows extends Array<IHighlightsRow> {}

interface IHighlightsItem {
  badgeColor: string;
  lebel: string;
}
interface IHighlightsItems extends Array<IHighlightsItem> {}

interface IHighlightsProps {
  limit?: number;
}

const Highlights = ({ limit }: IHighlightsProps) => {
  const { isRTL } = useLanguage();
  const [btcUsd, setBtcUsd] = useState<number | null>(null);
  const [btcError, setBtcError] = useState<string | null>(null);
  const CACHE_KEY = 'openlaughs-btc-usd-v1';
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const abort = new AbortController();

    const fetchBtc = async () => {
      try {
        setBtcError(null);

        // Cache-first
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as {
              price: number;
              ts: number;
            };
            if (
              cached &&
              typeof cached.price === 'number' &&
              Date.now() - cached.ts < CACHE_TTL_MS
            ) {
              setBtcUsd(cached.price);
              return;
            }
          }
        } catch {
          console.error('Error parsing BTC price from cache');
        }
        const res = await fetch(
          'https://api.coinpaprika.com/v1/tickers?quotes=USD',
          {
            signal: abort.signal,
            headers: { accept: 'application/json' },
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const btc = Array.isArray(data)
          ? data.find(
              (c: any) => c?.id === 'btc-bitcoin' || c?.symbol === 'BTC',
            )
          : undefined;
        const price = btc?.quotes?.USD?.price;
        if (typeof price === 'number') {
          setBtcUsd(price);
          // Save to cache
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ price, ts: Date.now() }),
            );
          } catch {
            console.error('Error saving BTC price to cache');
          }
        } else {
          throw new Error('BTC price not found');
        }
      } catch (err: any) {
        if (abort.signal.aborted) return;
        setBtcError(err?.message || 'Failed to load BTC price');
        // Try stale cache as a fallback
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as { price: number };
            if (cached && typeof cached.price === 'number') {
              setBtcUsd(cached.price);
              return;
            }
          }
        } catch {
          console.error('Error parsing BTC price from cache');
        }
        setBtcUsd(null);
      }
    };

    fetchBtc();
    return () => abort.abort();
  }, []);

  const formatUsd = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);

  const rows: IHighlightsRows = [
    {
      icon: 'shop',
      text: 'Online Store',
      total: 172,
      stats: 3.9,
      increase: true,
    },
    {
      icon: 'facebook',
      text: 'Facebook',
      total: 85,
      stats: 0.7,
      increase: false,
    },
    {
      icon: 'instagram',
      text: 'Instagram',
      total: 36,
      stats: 8.2,
      increase: true,
    },
    { icon: 'google', text: 'Google', total: 26, stats: 8.2, increase: true },
    { icon: 'shop', text: 'Retail', total: 7, stats: 0.7, increase: false },
  ];

  const items: IHighlightsItems = [
    { badgeColor: 'badge-success', lebel: 'Metronic' },
    { badgeColor: 'badge-danger', lebel: 'Bundle' },
    { badgeColor: 'badge-info', lebel: 'MetronicNest' },
  ];

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5">
          <KeenIcon icon={row.icon} className="text-base text-gray-500" />
          <span className="text-sm font-normal text-gray-900">{row.text}</span>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
          <span className="lg:text-right">${row.total}k</span>
          <span className="lg:text-right">
            {row.increase ? (
              <KeenIcon icon="arrow-up" className="text-success" />
            ) : (
              <KeenIcon icon="arrow-down" className="text-danger" />
            )}
            &nbsp;{row.stats}%
          </span>
        </div>
      </div>
    );
  };

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <span className={`badge badge-dot size-2 ${item.badgeColor}`}></span>
        <span className="text-sm font-normal text-gray-800">{item.lebel}</span>
      </div>
    );
  };

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Highlights</h3>

        <Menu>
          <MenuItem
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [0, -10] : [0, 10], // [skid, distance]
                  },
                },
              ],
            }}
          >
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <KeenIcon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCard1()}
          </MenuItem>
        </Menu>
      </div>

      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-gray-700">
            Bitcoin (BTC) Price
          </span>

          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-semibold text-gray-900">
              {btcUsd !== null ? formatUsd(btcUsd) : '$295.7k'}
            </span>
            <span className="badge badge-outline badge-success badge-sm">
              {btcError ? 'API' : 'Live'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-1.5">
          <div className="bg-success h-2 w-full max-w-[60%] rounded-sm"></div>
          <div className="bg-brand h-2 w-full max-w-[25%] rounded-sm"></div>
          <div className="bg-info h-2 w-full max-w-[15%] rounded-sm"></div>
        </div>

        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>

        <div className="border-b border-gray-300"></div>

        <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
      </div>
    </div>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps,
};
