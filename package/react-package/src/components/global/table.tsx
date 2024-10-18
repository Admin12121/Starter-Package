import React, { useEffect } from "react";
import {
  DropdownMenu as DropdownMenuNext,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  SortDescriptor,
  Selection,
} from "@nextui-org/table";
import { Badge as Chip } from "@/components/ui/badge";
import { User } from "@nextui-org/user";
import { Pagination } from "@nextui-org/pagination";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { RefreshCcw as IoReload } from "lucide-react";
import { ChevronDown as ChevronDownIcon} from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { PlusCircledIcon } from "@radix-ui/react-icons";

interface ApiResponse<T> {
  next: string | null;
  previous: string | null;
  count: number;
  results: T[];
}

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface StatusOption {
  name: string;
  uid: string;
}

interface ActionButton<T> {
  label: string;
  onClick: (item: T) => void;
}

interface CustomRenderers<T> {
  [key: string]: (item: T, columnKey: React.Key) => React.ReactNode;
}

interface AdvancedTableProps<T> {
  columns: Column[];
  data: ApiResponse<T>;
  statusOptions: StatusOption[];
  actionButtons: ActionButton<T>[];
  SetExcludeBy: (exclude: string[]) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  dataperpage: React.Dispatch<React.SetStateAction<number | null>>;
  refetch: () => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  exclude_by: string;
  initialVisibleColumns?: string[];
  customRenderers?: CustomRenderers<T>;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function AdvancedTable<T>({
  columns,
  data,
  statusOptions,
  actionButtons,
  SetExcludeBy,
  setSearch,
  isLoading,
  dataperpage,
  refetch,
  page,
  setPage,
  exclude_by,
  initialVisibleColumns = [],
  customRenderers = {},
}: AdvancedTableProps<T>) {
  const router = useNavigate();
  const [filterValue, setFilterValue] = React.useState("");
  const [searchValue, setsearchValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(initialVisibleColumns));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({ column: "id", direction: "ascending" });
  const [items, setItems] = React.useState<T[]>([]);
  const [totalItems, setTotalItems] = React.useState<number>(0);
  const pages = Math.ceil(totalItems / rowsPerPage);

  useEffect(() => {
    if (data) {
      setItems(data.results);
      setTotalItems(data.count);
    }
  }, [data, page, exclude_by]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...items];
    if (statusFilter !== "all") {
      const selectedStatuses = Array.from(statusFilter);

      const excludedStatuses = statusOptions
        .map((option) => option.uid)
        .filter((status) => !selectedStatuses.includes(status));

      const oppositeStatuses = excludedStatuses.map((status) => {
        return status;
      });

      SetExcludeBy(oppositeStatuses);
    }

    return filteredData;
  }, [items, page, filterValue, statusFilter, SetExcludeBy, statusOptions]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T] as unknown as number;
      const second = b[sortDescriptor.column as keyof T] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const defaultRenderCell = (item: T, columnKey: React.Key): React.ReactNode => {
    const cellValue = item[columnKey as keyof T];

    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{
              radius: "full",
              size: "sm",
              src: (item as any)?.profile as string,
              name: `${(item as any)?.first_name?.slice(0, 1).toUpperCase()}${(item as any)?.last_name?.slice(0, 1).toUpperCase()}`,
              classNames: {
                base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B] cursor-pointer",
                icon: "text-black/80",
              },
            }}
            classNames={{
              description: "text-default-500",
              name: "cursor-pointer",
            }}
            description={(item as any)?.email}
            name={`${(item as any)?.user_name}`}
          >
            {(item as any)?.email}
          </User>
        );
      case "ORGANIZATION":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{(item as any).organization}</p>
          </div>
        );
      case "SUBDOMAIN":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{(item as any)?.subdomain}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className={`capitalize border-none gap-1 text-default-600`}
            variant={(item as any).domain_status == "active" ? "secondary" : "outline"}
          >
            {(item as any).domain_status}
          </Chip>
        );
      case "date_joined":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{new Date((item as any).date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <DropdownMenuNext>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {actionButtons.map((button) => (
                  <DropdownMenuItem key={button.label} className="cursor-pointer" onClick={() => button.onClick(item)}>
                    {button.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuNext>
          </div>
        );
      default:
        return cellValue as React.ReactNode;
    }
  };

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dataperpage(Number(e.target.value));
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value?: string) => {
    if (value) {
      setsearchValue(value);
      setSearch(value);
      setPage(1);
    } else {
      setFilterValue("");
      setsearchValue("");
      setSearch("");
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1 border-default-100",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={searchValue}
            variant="bordered"
            onClear={() => setsearchValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="secondary"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="secondary"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              variant="default"
              onClick={() => router("/courses/add-course")}
              className="h-8 px-2 lg:px-3 border-dashed font-normal text-xs gap-2"
            >
              <PlusCircledIcon className="h-4 w-4" />
              Domain
            </Button>
            <Button
              size="sm"
              variant="secondary"
              color="default"
              onClick={() => {
                refetch();
              }}
            >
              <IoReload className="text-small" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalItems} items
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small cursor-pointer"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    items.length,
    hasSearchFilter,
    statusOptions,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{ cursor: "bg-foreground text-background" }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No items found"}
          items={sortedItems}
          isLoading={isLoading}
          loadingContent={
            <span className="h-[50vh] flex items-center justify-center">
              <Spinner color="default" />
            </span>
          }
        >
          {(item: T) => (
            <TableRow key={(item as any).id}>
              {(columnKey: any) => (
                <TableCell>
                  {customRenderers[columnKey]
                    ? customRenderers[columnKey](item, columnKey)
                    : defaultRenderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}