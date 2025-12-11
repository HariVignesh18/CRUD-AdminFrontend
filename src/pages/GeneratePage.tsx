import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Steps } from 'primereact/steps';
import { genericApi } from '../api/genericApi';
import { ToastContext } from '../context/ToastContext';
import axios from 'axios';

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

const GeneratePage: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [tableName, setTableName] = useState('');
    const [metadata, setMetadata] = useState<ColumnMeta[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [uniqueConstraints, setUniqueConstraints] = useState<string[]>([]);
    const [sortableColumns, setSortableColumns] = useState<string[]>([]);
    const [searchableColumns, setSearchableColumns] = useState<string[]>([]);
    const [filterableColumns, setFilterableColumns] = useState<string[]>([]);
    const navigate = useNavigate();
    const { showToast } = useContext(ToastContext);

    const steps = [
        { label: 'Table Name' },
        { label: 'Column Order' },
        { label: 'Constraints' },
        { label: 'Review' }
    ];

    // Load metadata when table name is entered
    const loadTableMetadata = async () => {
        if (!tableName.trim()) {
            showToast('warn', 'Warning', 'Please enter a table name');
            return;
        }

        try {
            // First check if table already exists in configurations (and is NOT soft-deleted)
            const existingConfig = await genericApi.getTableConfig(tableName.trim());
            if (existingConfig && existingConfig.data && !existingConfig.data.deleted_at) {
                showToast('error', 'Table Already Exists',
                    `The table "${tableName.trim()}" is already configured in the admin panel. Please use a different table or edit the existing configuration.`);
                return;
            }
        } catch (error: any) {
            // 404 is expected if table doesn't exist in configs, that's fine
            if (!error.response || error.response.status !== 404) {
                console.error('Error checking existing config:', error);
            }
        }

        try {
            const res = await genericApi.getMetadata(tableName.trim());
            setMetadata(res.columns);

            // Initialize column order with default (current order from DB)
            const defaultOrder = res.columns.map((col: ColumnMeta) => col.name);
            setColumnOrder(defaultOrder);

            // Initialize sortable columns (all except auto-increment)
            const defaultSortable = res.columns
                .filter((col: ColumnMeta) => !col.isAutoIncrement)
                .map((col: ColumnMeta) => col.name);
            setSortableColumns(defaultSortable);

            // Initialize searchable columns (text fields, excluding PK/auto-increment)
            const defaultSearchable = res.columns
                .filter((col: ColumnMeta) =>
                    !col.isPrimaryKey &&
                    !col.isAutoIncrement &&
                    (col.type.includes('varchar') ||
                        col.type.includes('text') ||
                        col.type.includes('char'))
                )
                .map((col: ColumnMeta) => col.name);
            setSearchableColumns(defaultSearchable);

            // Initialize filterable columns (excluding PK/auto-increment)
            const defaultFilterable = res.columns
                .filter((col: ColumnMeta) => !col.isPrimaryKey && !col.isAutoIncrement)
                .map((col: ColumnMeta) => col.name);
            setFilterableColumns(defaultFilterable);

            setActiveStep(1);
        } catch (error) {
            showToast('error', 'Error', 'Table not found. Please check the table name.');
        }
    };

    // Move column up in order
    const moveColumnUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...columnOrder];
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        setColumnOrder(newOrder);
    };

    // Move column down in order
    const moveColumnDown = (index: number) => {
        if (index === columnOrder.length - 1) return;
        const newOrder = [...columnOrder];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        setColumnOrder(newOrder);
    };

    // Toggle unique constraint
    const toggleUniqueConstraint = (columnName: string) => {
        setUniqueConstraints(prev =>
            prev.includes(columnName)
                ? prev.filter(c => c !== columnName)
                : [...prev, columnName]
        );
    };

    // Toggle sortable
    const toggleSortable = (columnName: string) => {
        setSortableColumns(prev =>
            prev.includes(columnName)
                ? prev.filter(c => c !== columnName)
                : [...prev, columnName]
        );
    };

    // Toggle searchable
    const toggleSearchable = (columnName: string) => {
        setSearchableColumns(prev =>
            prev.includes(columnName)
                ? prev.filter(c => c !== columnName)
                : [...prev, columnName]
        );
    };

    // Toggle filterable
    const toggleFilterable = (columnName: string) => {
        setFilterableColumns(prev =>
            prev.includes(columnName)
                ? prev.filter(c => c !== columnName)
                : [...prev, columnName]
        );
    };

    // Save configuration and navigate to table
    const saveConfiguration = async () => {
        try {
            await axios.post('http://localhost:5081/api/table_configurations', {
                table_name: tableName,
                column_order: columnOrder,
                unique_constraints: uniqueConstraints,
                sortable_columns: sortableColumns,
                searchable_columns: searchableColumns,
                filterable_columns: filterableColumns
            });

            showToast('success', 'Success', 'Table configuration saved successfully');
            navigate(`/generic/${tableName}`);
        } catch (error) {
            showToast('error', 'Error', 'Failed to save configuration');
        }
    };

    // Render step content
    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="field">
                        <label htmlFor="tableName" className="font-bold">Table Name</label>
                        <InputText
                            id="tableName"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="e.g. countries"
                            autoFocus
                            className="w-full"
                        />
                        <small className="block mt-2">Enter an existing MySQL table name to configure.</small>
                    </div>
                );

            case 1:
                return (
                    <div>
                        {/* Column Order */}
                        <div>
                            <h3>Configure Column Display Order</h3>
                            <small className="block mb-3">Use the arrows to reorder how columns appear in the table.</small>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {columnOrder.map((colName, index) => {
                                    const col = metadata.find(c => c.name === colName);
                                    return (
                                        <div key={colName} className="flex align-items-center gap-2 mb-2 p-2 border-1 surface-border border-round">
                                            <div className="flex flex-column gap-1">
                                                <Button
                                                    icon="pi pi-chevron-up"
                                                    className="p-button-sm p-button-text"
                                                    onClick={() => moveColumnUp(columnOrder.indexOf(colName))}
                                                    disabled={index === 0}
                                                />
                                                <Button
                                                    icon="pi pi-chevron-down"
                                                    className="p-button-sm p-button-text"
                                                    onClick={() => moveColumnDown(columnOrder.indexOf(colName))}
                                                    disabled={index === columnOrder.length - 1}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <strong>{col?.ui.label || colName}</strong>
                                                <div className="text-sm text-color-secondary">{col?.type}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h3>Configure Column Constraints</h3>

                        <div className="mb-4">
                            <h4>Unique Constraints</h4>
                            <small className="block mb-2">Select columns that should have unique values (no duplicates).</small>
                            {metadata.filter(col => !col.isPrimaryKey && !col.isAutoIncrement).map(col => (
                                <div key={col.name} className="field-checkbox mb-2">
                                    <Checkbox
                                        inputId={`unique_${col.name}`}
                                        checked={uniqueConstraints.includes(col.name)}
                                        onChange={() => toggleUniqueConstraint(col.name)}
                                    />
                                    <label htmlFor={`unique_${col.name}`} className="ml-2">
                                        {col.ui.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <h4>Sortable Columns</h4>
                            <small className="block mb-2">Select columns that can be sorted in the table view.</small>
                            {metadata.filter(col => !col.isPrimaryKey && !col.isAutoIncrement).map(col => (
                                <div key={col.name} className="field-checkbox mb-2">
                                    <Checkbox
                                        inputId={`sortable_${col.name}`}
                                        checked={sortableColumns.includes(col.name)}
                                        onChange={() => toggleSortable(col.name)}
                                    />
                                    <label htmlFor={`sortable_${col.name}`} className="ml-2">
                                        {col.ui.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h4>Searchable Columns</h4>
                            <small className="block mb-2">Select columns that can be searched (e.g. "Search by name or code").</small>
                            {metadata.filter(col => !col.isPrimaryKey && !col.isAutoIncrement).map(col => (
                                <div key={col.name} className="field-checkbox mb-2">
                                    <Checkbox
                                        inputId={`searchable_${col.name}`}
                                        checked={searchableColumns.includes(col.name)}
                                        onChange={() => toggleSearchable(col.name)}
                                    />
                                    <label htmlFor={`searchable_${col.name}`} className="ml-2">
                                        {col.ui.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Filterable Columns */}
                        <div className="mb-4">
                            <h4 className="mb-2">Filterable Columns</h4>
                            <small className="block mb-2">Select which columns can be used for filtering.</small>
                            <div className="grid grid-cols-3 gap-2">
                                {metadata.filter(col => !col.isPrimaryKey && !col.isAutoIncrement).map((col) => (
                                    <div key={col.name} className="flex align-items-center">
                                        <Checkbox
                                            inputId={`filterable_${col.name}`}
                                            checked={filterableColumns.includes(col.name)}
                                            onChange={() => toggleFilterable(col.name)}
                                        />
                                        <label htmlFor={`filterable_${col.name}`} className="ml-2">
                                            {col.ui.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h3>Review Configuration</h3>

                        <div className="mb-3">
                            <strong>Table:</strong> {tableName}
                        </div>

                        <div className="mb-3">
                            <strong>Column Order:</strong>
                            <ol className="pl-4">
                                {columnOrder.map(colName => {
                                    const col = metadata.find(c => c.name === colName);
                                    return <li key={colName}>{col?.ui.label || colName}</li>;
                                })}
                            </ol>
                        </div>

                        <div className="mb-3">
                            <strong>Unique Constraints:</strong> {uniqueConstraints.length > 0 ? (
                                <ul className="pl-4">
                                    {uniqueConstraints.map(colName => {
                                        const col = metadata.find(c => c.name === colName);
                                        return <li key={colName}>{col?.ui.label || colName}</li>;
                                    })}
                                </ul>
                            ) : (
                                <span className="text-color-secondary"> None</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <strong>Sortable Columns:</strong>
                            <ul className="pl-4">
                                {sortableColumns.map(colName => {
                                    const col = metadata.find(c => c.name === colName);
                                    return <li key={colName}>{col?.ui.label || colName}</li>;
                                })}
                            </ul>
                        </div>

                        <div className="mb-3">
                            <strong>Searchable Columns:</strong> {searchableColumns.length > 0 ? (
                                <ul className="pl-4">
                                    {searchableColumns.map(colName => {
                                        const col = metadata.find(c => c.name === colName);
                                        return <li key={colName}>{col?.ui.label || colName}</li>;
                                    })}
                                </ul>
                            ) : (
                                <span className="text-color-secondary"> None (search disabled)</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <strong>Filterable Columns:</strong> {filterableColumns.length > 0 ? (
                                <ul className="pl-4">
                                    {filterableColumns.map(colName => {
                                        const col = metadata.find(c => c.name === colName);
                                        return <li key={colName}>{col?.ui.label || colName}</li>;
                                    })}
                                </ul>
                            ) : (
                                <span className="text-color-secondary"> None (filters disabled)</span>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <Card className="mb-4">
                <h2 style={{ margin: 0, marginBottom: '1rem' }}>Table Configuration Wizard</h2>
                <Steps model={steps} activeIndex={activeStep} readOnly={true} />
            </Card>

            <Card>
                <div className="p-fluid">
                    {renderStepContent()}
                </div>

                <div className="flex justify-content-between mt-4">
                    <Button
                        label="Back"
                        icon="pi pi-chevron-left"
                        className="p-button-text"
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                    />
                    <div className="flex gap-2">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-outlined p-button-secondary"
                            onClick={() => navigate('/')}
                        />
                        {activeStep < steps.length - 1 ? (
                            <Button
                                label="Next"
                                icon="pi pi-chevron-right"
                                iconPos="right"
                                onClick={() => {
                                    if (activeStep === 0) {
                                        loadTableMetadata();
                                    } else {
                                        setActiveStep(prev => prev + 1);
                                    }
                                }}
                            />
                        ) : (
                            <Button
                                label="Save & View Table"
                                icon="pi pi-check"
                                onClick={saveConfiguration}
                            />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default GeneratePage;
