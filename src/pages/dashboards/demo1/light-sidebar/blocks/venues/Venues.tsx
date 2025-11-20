import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import {
  DataGrid,
  TDataGridRequestParams,
  KeenIcon,
  DataGridRowSelect,
  DataGridRowSelectAll,
  DataGridColumnHeader,
  useDataGrid,
} from '@/components';
import { listVenues } from '@/graphql/queries';
import { formatIsoDate } from '@/utils/Date';
import { Input } from '@/components/ui/input';
import { Venue } from '@/API';

const client = generateClient({ authMode: 'userPool' });

interface VenuesData {
  data: Venue[];
  totalCount: number;
}

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const Venues = () => {
  const ColumnFilter = <TData, TValue>({
    column,
  }: IColumnFilterProps<TData, TValue>) => {
    const [inputValue, setInputValue] = useState(
      (column.getFilterValue() as string) ?? '',
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        column.setFilterValue(inputValue);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    return (
      <Input
        placeholder="Filter..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<Venue>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: row => row.id,
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0',
        },
      },
      {
        accessorFn: row => row.name,
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Venue"
            filter={<ColumnFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: info => (
          <div className="flex flex-col gap-2">
            <Link
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
              to={`/promoter/venues/${info.row.original.id}`}
            >
              {info.row.original.name}
            </Link>
            {info.row.original.address && (
              <span className="text-2sm text-gray-700 font-normal leading-3">
                {info.row.original.address}
              </span>
            )}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[260px]',
        },
      },
      {
        accessorFn: row => `${row.city}, ${row.state}`,
        id: 'location',
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        enableSorting: true,
        cell: info => {
          const venue = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <KeenIcon icon="geolocation" className="text-gray-500 text-sm" />
              <span className="text-sm text-gray-700">
                {venue.city && venue.state
                  ? `${venue.city}, ${venue.state}`
                  : venue.city || venue.state || '-'}
              </span>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[130px]',
        },
      },
      {
        accessorFn: row => row.openMic,
        id: 'openMic',
        header: ({ column }) => (
          <DataGridColumnHeader title="Open Mic" column={column} />
        ),
        enableSorting: true,
        cell: info => {
          const hasOpenMic = info.row.original.openMic;
          return (
            <div className="flex justify-center">
              <span
                className={`badge badge-sm ${
                  hasOpenMic
                    ? 'badge-success badge-outline'
                    : 'badge-light badge-outline'
                }`}
              >
                {hasOpenMic ? 'Yes' : 'No'}
              </span>
            </div>
          );
        },
        meta: {
          headerClassName: '!px-2 min-w-[100px] max-w-[100px]',
          className: '!px-2 min-w-[100px] max-w-[100px]',
        },
      },
      {
        accessorFn: row => row.updatedAt,
        id: 'updatedAt',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => (
          <DataGridColumnHeader title="Last Modified" column={column} />
        ),
        cell: info => formatIsoDate(info.row.original.updatedAt),
        meta: {
          className: 'min-w-[135px]',
        },
      },
    ],
    [],
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchVenues = async (params: TDataGridRequestParams) => {
    try {
      const result = await client.graphql({
        query: (listVenues as string).replace(/__typename/g, ''),
        variables: {
          limit: params.pageSize || 5,
        },
      });

      const venues =
        'data' in result ? result.data?.listVenues?.items || [] : [];

      // Filter by search query if present
      let filteredVenues = venues.filter(
        (venue: Venue | null) => venue !== null,
      ) as Venue[];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredVenues = filteredVenues.filter(
          venue =>
            venue.name.toLowerCase().includes(query) ||
            venue.city?.toLowerCase().includes(query) ||
            venue.address?.toLowerCase().includes(query),
        );
      }

      // Apply column filters
      if (params.columnFilters) {
        params.columnFilters.forEach(({ id, value }) => {
          if (value && typeof value === 'string') {
            const filterValue = value.toLowerCase();
            filteredVenues = filteredVenues.filter(venue => {
              if (id === 'name') {
                return venue.name.toLowerCase().includes(filterValue);
              }
              if (id === 'location') {
                return (
                  venue.city?.toLowerCase().includes(filterValue) ||
                  venue.state?.toLowerCase().includes(filterValue)
                );
              }
              return true;
            });
          }
        });
      }

      // Apply sorting
      if (params.sorting && params.sorting.length > 0) {
        const { id, desc } = params.sorting[0];
        filteredVenues.sort((a, b) => {
          let aVal: any = a[id as keyof Venue];
          let bVal: any = b[id as keyof Venue];

          if (id === 'location') {
            aVal = `${a.city} ${a.state}`;
            bVal = `${b.city} ${b.state}`;
          }

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          }

          if (aVal < bVal) return desc ? 1 : -1;
          if (aVal > bVal) return desc ? -1 : 1;
          return 0;
        });
      }

      // Pagination
      const startIndex = params.pageIndex * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedVenues = filteredVenues.slice(startIndex, endIndex);

      return {
        data: paginatedVenues,
        totalCount: filteredVenues.length,
      };
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast(`Connection Error`, {
        description: `An error occurred while fetching venues. Please try again later`,
        action: {
          label: 'Ok',
          onClick: () => console.log('Ok'),
        },
      });

      return {
        data: [],
        totalCount: 0,
      };
    }
  };

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }
  };

  const Toolbar = ({
    setSearchQuery,
  }: {
    setSearchQuery: (query: string) => void;
  }) => {
    const [inputValue, setInputValue] = useState(searchQuery);
    const { table } = useDataGrid();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setSearchQuery(inputValue);
        if (inputValue.trim() === '') {
          table.setColumnFilters(
            table
              .getState()
              .columnFilters.filter(filter => filter.id !== 'query'),
          );
        } else {
          table.setColumnFilters([
            ...table
              .getState()
              .columnFilters.filter(filter => filter.id !== 'query'),
            { id: 'query', value: inputValue },
          ]);
        }
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    return (
      <div className="card-header border-b-0 px-5">
        <h3 className="card-title">Venues</h3>
        <div className="input input-sm max-w-48">
          <KeenIcon icon="magnifier" />
          <input
            type="text"
            placeholder="Search Venues"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      serverSide={true}
      onFetchData={fetchVenues}
      rowSelection={true}
      getRowId={(row: any) => row.id}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5 }}
      toolbar={<Toolbar setSearchQuery={setSearchQuery} />}
      layout={{ card: true }}
    />
  );
};

export { Venues };
