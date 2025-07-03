"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table"
import { Input } from "@workspace/ui/components/input"


import { Search } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string,
  projects?: { id: string; name: string }[];
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title = "Data Table",
  projects,
  selectedProjectId,
  onProjectChange,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
    }
  })

  const selectedProject = projects?.find(p => p.id === selectedProjectId);
  const selectedProjectName = selectedProject ? selectedProject.name : "Select Project";

  return (
    <div className="container mx-auto px-8 py-10 max-w-7xl">
      <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden w-full">
        {/* Header Section */}
        <div className="bg-gray-50 border-b border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Filter title..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-base h-12"
              />
            </div>

            {/* select button */}
            {projects && projects.length > 0 && (
              <Select
                value={selectedProjectId}
                onValueChange={(selectedProjectId) => {
                  console.log("Project selected:", selectedProjectId);
                  if (onProjectChange) {
                    onProjectChange(selectedProjectId);
                  }
                }}
              >
                <SelectTrigger className="w-[220px] h-12 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                  <SelectValue placeholder={selectedProjectName} />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg bg-white border border-gray-200">
                  {projects.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto px-8 py-6">
          <div className="rounded-lg border border-gray-200">
            <Table className="w-full text-base table-fixed">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b-2 border-gray-200 bg-gray-50"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="py-4 px-6 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="min-h-[400px] transition-all duration-300 ease-in-out">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 h-[72px] ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-4 px-6 text-gray-900 text-sm align-middle transition-all duration-200"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="h-[400px]">
                    <TableCell
                      colSpan={columns.length}
                      className="h-full text-center text-gray-500 text-lg align-middle"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p>No results found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info */}
            <div className="text-sm text-gray-600">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
            </div>

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}