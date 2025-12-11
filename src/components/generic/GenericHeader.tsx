import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { ToastContext } from '../../context/ToastContext';

interface ColumnOption {
    label: string;
    value: string;
}

interface GenericHeaderProps {
    tableName: string;
    onNew: () => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    disabled?: boolean;
    searchableColumns?: string[];
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    // Column visibility props
    columnOptions?: ColumnOption[];
    visibleColumns?: string[];
    onVisibleColumnsChange?: (columns: string[]) => void;
    // Filter availability
    hasFilterableColumns?: boolean;
}

const GenericHeader: React.FC<GenericHeaderProps> = ({
    tableName,
    onNew,
    showFilters,
    setShowFilters,
    disabled = false,
    searchableColumns = [],
    searchQuery = '',
    onSearchChange,
    columnOptions = [],
    visibleColumns = [],
    onVisibleColumnsChange,
    hasFilterableColumns = false,
}) => {
    const { showToast } = useContext(ToastContext);

    // Generate search placeholder
    const searchPlaceholder = searchableColumns.length > 0
        ? `Search by ${searchableColumns.join(' or ')}`
        : 'Search...';

    return (
        <Card className="mb-3">
            {/* Single Row: Title on Left, All Controls on Right */}
            <div className="flex justify-content-between align-items-center gap-3">
                {/* Left: Title and Description */}
                <div style={{ minWidth: 'fit-content' }}>
                    <h2 style={{ margin: 0, marginBottom: '0.25rem' }}>
                        {tableName.charAt(0).toUpperCase() + tableName.slice(1)}
                    </h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        Manage {tableName} records
                    </p>
                </div>

                {/* Right: Column Visibility, Search, and Buttons - All in One Line */}
                <div className="flex gap-2 align-items-center" style={{ flexWrap: 'nowrap' }}>
                    {/* Search Input */}
                    {searchableColumns.length > 0 && onSearchChange && (
                        <InputText
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            style={{ width: '300px' }}
                        />
                    )}

                    {/* Column Visibility Selector */}
                    {columnOptions.length > 0 && onVisibleColumnsChange && (
                        <MultiSelect
                            value={visibleColumns}
                            options={columnOptions}
                            onChange={(e) => {
                                // Prevent deselecting all columns
                                if (e.value && e.value.length > 0) {
                                    onVisibleColumnsChange(e.value);
                                } else {
                                    // Show warning toast
                                    showToast('warn', 'Warning', 'At least one column must be selected');
                                }
                            }}
                            placeholder="Columns"
                            display="chip"
                            maxSelectedLabels={2}
                            style={{
                                width: '200px',
                                minHeight: '40px'
                            }}
                            panelStyle={{ minWidth: '250px' }}
                        />
                    )}

                    {/* Filters Button - Only show if there are filterable columns */}
                    {hasFilterableColumns && (
                        <Button
                            label="Filters"
                            icon={showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'}
                            className="p-button-outlined p-button-secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            tooltip={showFilters ? 'Hide Filters' : 'Show Filters'}
                        />
                    )}

                    {/* New Button */}
                    <Button
                        label="New"
                        icon="pi pi-plus"
                        className="p-button-success"
                        onClick={onNew}
                        disabled={disabled}
                        tooltip="Add New Record"
                    />
                </div>
            </div>
        </Card >
    );
};

export default GenericHeader;
