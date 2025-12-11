import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useCreate, useUpdate, useDelete } from "@refinedev/core";
import { Card } from 'primereact/card';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { genericApi } from '../api/genericApi';
import { API_BASE_URL } from '../config/api';
import { ToastContext } from '../context/ToastContext';
import { DataTableWrapper } from '../shared';
import GenericHeader from './generic/GenericHeader';
import GenericFilters from './generic/GenericFilters';
import GenericActions from './generic/GenericActions';
import GenericForm from './generic/GenericForm';
import axios from 'axios';

import { sanitizeFormData } from '../utils/columnFilters';

interface ColumnMeta {
    name: string;
    type: string;
    nullable: boolean;
    isPrimaryKey: boolean;
    isAutoIncrement: boolean;
    ui: {
        widget: string;
        label: string;
    };
}

interface TableConfig {
    column_order?: string[];
    unique_constraints?: string[];
    sortable_columns?: string[];
    searchable_columns?: string[];
    filterable_columns?: string[];
}

const GenericCRUDRefine: React.FC = () => {
    const { table } = useParams<{ table: string }>();
    const { showToast } = useContext(ToastContext);

    // Metadata State
    const [metadata, setMetadata] = useState<ColumnMeta[]>([]);
    const [primaryKey, setPrimaryKey] = useState('id');
    const [tableConfig, setTableConfig] = useState<TableConfig | null>(null);

    // Refine Mutations
    const { mutate: createMutate } = useCreate();
    const { mutate: updateMutate } = useUpdate();
    const { mutate: deleteMutate } = useDelete();

    // UI State
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(30);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [isEdit, setIsEdit] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<1 | -1 | 0 | null | undefined>(undefined);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);



    // Fetch Metadata and Configuration
    useEffect(() => {
        if (table) {
            loadMetadata();
            loadTableConfig();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table]);

    const loadMetadata = async () => {
        try {
            const res = await genericApi.getMetadata(table!);
            setMetadata(res.columns);
            setPrimaryKey(res.primaryKey);
        } catch (error) {
            console.error(error);
            showToast('error', 'Error', 'Failed to load metadata. Table might not exist.');
            setMetadata([]);
        }
    };

    const loadTableConfig = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/table_configurations/${table}`);
            if (res.data.success && res.data.data) {
                setTableConfig(res.data.data);
            }
        } catch (err: any) {
            // No custom configuration found, using defaults
        }
    };

    // Use direct API calls instead of useList for better filter control
    const [items, setItems] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [dynamicLoading, setDynamicLoading] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0); // Increment to trigger refetch

    // Clear data when switching tables
    useEffect(() => {
        setItems([]);
        setTotal(0);
        setPage(1);
        setFilters({});
        setSearchQuery('');
        setVisibleColumns([]); // Reset visible columns when switching tables
    }, [table]);

    // Fetch data when filters/pagination/sort changes
    useEffect(() => {
        const fetchData = async () => {
            if (!table || metadata.length === 0) return;

            setDynamicLoading(true);
            try {
                const params: any = {
                    page,
                    per_page: rows,
                };

                // Add filters
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== '' && value !== null && value !== undefined) {
                        params[`filter[${key}]`] = value;
                    }
                });

                // Add search
                if (searchQuery && tableConfig?.searchable_columns && tableConfig.searchable_columns.length > 0) {
                    params._search = searchQuery;
                }

                // Add sort
                if (sortField && sortOrder) {
                    params.sortBy = sortField;
                    params.sortOrder = sortOrder === 1 ? 'ASC' : 'DESC';
                }

                // Build URL with query parameters
                const queryString = new URLSearchParams(params as any).toString();
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5081';
                const url = `${apiUrl}/api/${table}?${queryString}`;

                const response = await axios.get(url);

                setItems(response.data.data || []);
                setTotal(response.data.total || 0);
            } catch (error: any) {
                console.error('[Direct API] Error fetching data:', error);
                showToast('error', 'Error', 'Failed to fetch data');
                setItems([]);
            } finally {
                setDynamicLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table, page, rows, filters, searchQuery, sortField, sortOrder, metadata.length, tableConfig?.searchable_columns, refetchTrigger]);

    // CRUD Handlers
    const handleSave = async () => {
        try {
            // Remove auto-managed columns from formData
            const sanitizedData = sanitizeFormData(formData);

            if (isEdit) {
                updateMutate({
                    resource: table!,
                    id: formData[primaryKey],
                    values: sanitizedData,
                }, {
                    onSuccess: () => {
                        showToast('success', 'Success', 'Updated successfully');
                        setShowDialog(false);
                        setRefetchTrigger(prev => prev + 1); // Trigger refetch
                    },
                    onError: (error: any) => {
                        showToast('error', 'Error', error.message || 'Update failed');
                    }
                });
            } else {
                createMutate({
                    resource: table!,
                    values: sanitizedData,
                }, {
                    onSuccess: () => {
                        showToast('success', 'Success', 'Created successfully');
                        setShowDialog(false);
                        setRefetchTrigger(prev => prev + 1); // Trigger refetch
                    },
                    onError: (error: any) => {
                        showToast('error', 'Error', error.message || 'Create failed');
                    }
                });
            }
        } catch (error: any) {
            // Error handled in onError callbacks
        }
    };

    const handleDelete = (rowData: any) => {
        confirmDialog({
            message: 'Are you sure you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteMutate({
                    resource: table!,
                    id: rowData[primaryKey],
                }, {
                    onSuccess: () => {
                        showToast('success', 'Success', 'Deleted successfully');
                        setRefetchTrigger(prev => prev + 1); // Trigger refetch
                    },
                    onError: () => {
                        showToast('error', 'Error', 'Delete failed');
                    }
                });
            },
        });
    };

    const openNew = () => {
        setFormData({});
        setIsEdit(false);
        setShowDialog(true);
    };

    const openEdit = (rowData: any) => {
        setFormData({ ...rowData });
        setIsEdit(true);
        setShowDialog(true);
    };

    const handleFilterChange = (newFilters: { [key: string]: any }) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    };

    // Column Definitions with smart sorting or custom order
    const sortedMetadata = (() => {
        // If custom order is configured, use it
        if (tableConfig?.column_order && tableConfig.column_order.length > 0) {
            return tableConfig.column_order
                .map(colName => metadata.find(col => col.name === colName))
                .filter(col => col !== undefined) as ColumnMeta[];
        }

        // Otherwise use default smart sorting
        return [...metadata].sort((a, b) => {
            // Primary key first
            if (a.isPrimaryKey) return -1;
            if (b.isPrimaryKey) return 1;

            // Timestamps last
            const aIsTimestamp = a.name === 'created_at' || a.name === 'updated_at';
            const bIsTimestamp = b.name === 'created_at' || b.name === 'updated_at';

            if (aIsTimestamp && !bIsTimestamp) return 1;
            if (!aIsTimestamp && bIsTimestamp) return -1;

            // created_at before updated_at
            if (a.name === 'created_at' && b.name === 'updated_at') return -1;
            if (a.name === 'updated_at' && b.name === 'created_at') return 1;

            // Everything else alphabetically
            return a.name.localeCompare(b.name);
        });
    })();

    // All available columns (excluding PK/auto-increment)
    const allAvailableColumns = sortedMetadata
        .filter(col => !col.isPrimaryKey && !col.isAutoIncrement);

    // Initialize visible columns when metadata and config are loaded
    useEffect(() => {
        // Only initialize if we have metadata and columns haven't been set yet
        if (allAvailableColumns.length === 0) return;

        // Wait for both metadata and potential config to load
        // Reset columns when table changes (visibleColumns was cleared in table switch effect)
        if (visibleColumns.length === 0) {
            // Use column_order from tableConfig if available
            if (tableConfig?.column_order && Array.isArray(tableConfig.column_order) && tableConfig.column_order.length > 0) {
                // Filter column_order to only include columns that:
                // 1. Exist in the current metadata
                // 2. Are not filtered out (not PK, not auto-increment)
                const orderedColumns = tableConfig.column_order.filter((colName: string) =>
                    allAvailableColumns.some(col => col.name === colName)
                );

                if (orderedColumns.length > 0) {
                    setVisibleColumns(orderedColumns);
                } else {
                    // Config exists but no valid columns, show all
                    setVisibleColumns(allAvailableColumns.map(col => col.name));
                }
            } else {
                // No configuration, show all available columns
                setVisibleColumns(allAvailableColumns.map(col => col.name));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allAvailableColumns.length, tableConfig]);

    // Filter columns based on visibility selection
    const dataColumns = allAvailableColumns
        .filter(col => visibleColumns.includes(col.name))
        .map((col) => ({
            key: col.name,
            field: col.name,
            header: col.ui.label,
            sortable: tableConfig?.sortable_columns?.includes(col.name) || false,
        }));

    // Add S.No column at the beginning
    const serialNumberColumn = {
        key: 's_no',
        field: 's_no',
        header: 'S.No',
        sortable: false,
        style: { textAlign: 'center', whiteSpace: 'nowrap', width: '80px' },
        body: (_row: any, options: any) => {
            // Calculate serial number based on current page
            return (page - 1) * rows + options.rowIndex + 1;
        },
    };

    // Add operations column
    const operationsColumn = {
        field: 'operations',
        header: 'Actions',
        sortable: false,
        style: { minWidth: '8rem' },
    };

    // Combine all columns: S.No + Data Columns + Actions
    const columns = [serialNumberColumn, ...dataColumns];

    return (
        <div className="py-2">
            <ConfirmDialog />

            <GenericHeader
                tableName={table || ''}
                onNew={openNew}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                disabled={metadata.length === 0}
                searchableColumns={tableConfig?.searchable_columns?.map(colName => {
                    const col = metadata.find(c => c.name === colName);
                    return col?.ui.label || colName;
                })}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                columnOptions={allAvailableColumns.map(col => ({
                    label: col.ui.label,
                    value: col.name
                }))}
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={setVisibleColumns}
                hasFilterableColumns={!!(tableConfig?.filterable_columns && tableConfig.filterable_columns.length > 0)}
            />

            <GenericFilters
                metadata={metadata}
                filters={filters}
                onFilterChange={handleFilterChange}
                showFilters={showFilters}
                filterableColumns={tableConfig?.filterable_columns || []}
            />

            {metadata.length === 0 ? (
                <Card>
                    <div className="text-center p-5">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem', color: '#ff9800' }}></i>
                        <h3 className="mt-3">Table not found or error loading metadata</h3>
                        <p style={{ color: '#666' }}>
                            Please check that the table exists and try again.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card>
                    <DataTableWrapper
                        columns={[...columns, operationsColumn]}
                        value={items}
                        loading={dynamicLoading}
                        paginator
                        rows={rows}
                        totalRecords={total}
                        lazy
                        first={(page - 1) * rows}
                        onPage={(e: any) => {
                            setPage((e.page || 0) + 1);
                            setRows(e.rows);
                        }}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={(e: any) => {
                            setSortField(e.sortField);
                            setSortOrder(e.sortOrder);
                        }}
                        actionBody={(rowData: any) => (
                            <GenericActions
                                rowData={rowData}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        )}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                        rowsPerPageOptions={[10, 20, 30, 50]}
                        className="border"
                        stripedRows
                        showGridlines
                        size="small"
                        emptyMessage="No records found"
                    />
                </Card>
            )}

            <GenericForm
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                onSave={handleSave}
                isEdit={isEdit}
                metadata={metadata}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
};

export default GenericCRUDRefine;
