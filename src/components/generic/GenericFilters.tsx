import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

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

interface GenericFiltersProps {
    metadata: ColumnMeta[];
    filters: { [key: string]: any };
    onFilterChange: (filters: { [key: string]: any }) => void;
    showFilters: boolean;
    filterableColumns?: string[]; // Column names that are filterable
}

const GenericFilters: React.FC<GenericFiltersProps> = ({
    metadata,
    filters,
    onFilterChange,
    showFilters,
    filterableColumns = [],
}) => {
    const [localFilters, setLocalFilters] = useState(filters);

    if (!showFilters) return null;

    const handleFilterChange = (field: string, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
    };

    const handleClearFilters = () => {
        setLocalFilters({});
        onFilterChange({});
    };

    // Only show filters for filterable columns
    const filterableMetadata = metadata.filter(col =>
        filterableColumns.includes(col.name)
    );

    const renderFilterInput = (col: ColumnMeta) => {
        const value = localFilters[col.name] || '';

        switch (col.ui.widget) {
            case 'switch':
                return (
                    <Dropdown
                        id={col.name}
                        value={value}
                        options={[
                            { label: 'All', value: '' },
                            { label: 'Yes', value: '1' },
                            { label: 'No', value: '0' },
                        ]}
                        onChange={(e) => handleFilterChange(col.name, e.value)}
                        placeholder="All"
                        className="w-full"
                    />
                );
            default:
                return (
                    <InputText
                        id={col.name}
                        value={value}
                        onChange={(e) => handleFilterChange(col.name, e.target.value)}
                        placeholder={`Filter by ${col.ui.label}`}
                        className="w-full"
                    />
                );
        }
    };

    return (
        <Card className="mb-3">
            <div className="grid">
                {filterableMetadata.map((col) => (
                    <div key={col.name} className="col-12 md:col-6 lg:col-4">
                        <div className="field">
                            <label htmlFor={col.name} style={{ display: 'block', marginBottom: '0.5rem' }}>
                                {col.ui.label}
                            </label>
                            {renderFilterInput(col)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-content-end gap-2 mt-3">
                <Button
                    label="Clear"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-secondary"
                    onClick={handleClearFilters}
                />
                <Button
                    label="Apply Filters"
                    icon="pi pi-check"
                    className="p-button-primary"
                    onClick={handleApplyFilters}
                />
            </div>
        </Card>
    );
};

export default GenericFilters;
