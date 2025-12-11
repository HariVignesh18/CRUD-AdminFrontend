import React from 'react';

/**
 * Common template functions for DataTable columns
 * Matches the patterns used in admin-frontend
 */

// Status Badge Template (Active/Inactive)
export const statusBodyTemplate = (rowData: any, field: string = 'isActive') => {
    const isActive = rowData[field];
    return (
        <span className={`customer-badge status-${isActive ? '1' : '0'}`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
};

// Boolean Badge Template (Yes/No)
export const booleanBodyTemplate = (rowData: any, field: string) => {
    const value = rowData[field];
    return (
        <span className={`customer-badge status-${value ? '1' : '0'}`}>
            {value ? 'Yes' : 'No'}
        </span>
    );
};

// Date Template
export const dateBodyTemplate = (rowData: any, field: string) => {
    const date = rowData[field];
    if (!date) return '-';

    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// DateTime Template
export const dateTimeBodyTemplate = (rowData: any, field: string) => {
    const date = rowData[field];
    if (!date) return '-';

    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Number with Comma Separator Template
export const numberBodyTemplate = (rowData: any, field: string) => {
    const value = rowData[field];
    if (value === null || value === undefined) return '-';
    return value.toLocaleString();
};

// Currency Template
export const currencyBodyTemplate = (rowData: any, field: string, currency: string = 'USD') => {
    const value = rowData[field];
    if (value === null || value === undefined) return '-';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);
};

// Truncate Text Template
export const truncateTextBodyTemplate = (rowData: any, field: string, maxLength: number = 50) => {
    const text = rowData[field];
    if (!text) return '-';

    if (text.length <= maxLength) return text;
    return (
        <span title={text}>
            {text.substring(0, maxLength)}...
        </span>
    );
};

// Email Template (with mailto link)
export const emailBodyTemplate = (rowData: any, field: string = 'email') => {
    const email = rowData[field];
    if (!email) return '-';

    return (
        <a href={`mailto:${email}`} className="text-primary">
            {email}
        </a>
    );
};

// URL Template (with link)
export const urlBodyTemplate = (rowData: any, field: string) => {
    const url = rowData[field];
    if (!url) return '-';

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary">
            {url}
        </a>
    );
};

// Empty/Null Safe Template
export const safeTextBodyTemplate = (rowData: any, field: string, defaultValue: string = '-') => {
    const value = rowData[field];
    return value || defaultValue;
};

// Badge with custom color
export const customBadgeTemplate = (
    rowData: any,
    field: string,
    colorMap: { [key: string]: string }
) => {
    const value = rowData[field];
    const color = colorMap[value] || '#ccc';

    return (
        <span
            style={{
                backgroundColor: color,
                padding: '0.25em 0.5rem',
                borderRadius: '2px',
                color: 'white',
                fontWeight: 700,
                fontSize: '12px'
            }}
        >
            {value}
        </span>
    );
};

// Index Column Template (for row numbers)
export const indexBodyTemplate = (rowData: any, options: any) => {
    return options.rowIndex + 1;
};

// Actions Template Factory
export const createActionsTemplate = (
    onEdit?: (rowData: any) => void,
    onDelete?: (rowData: any) => void,
    onView?: (rowData: any) => void
) => {
    return (rowData: any) => (
        <div className="flex gap-2">
            {onView && (
                <button
                    className="p-button p-button-rounded p-button-info p-button-sm"
                    onClick={() => onView(rowData)}
                    title="View"
                >
                    <i className="pi pi-eye"></i>
                </button>
            )}
            {onEdit && (
                <button
                    className="p-button p-button-rounded p-button-success p-button-sm"
                    onClick={() => onEdit(rowData)}
                    title="Edit"
                >
                    <i className="pi pi-pencil"></i>
                </button>
            )}
            {onDelete && (
                <button
                    className="p-button p-button-rounded p-button-danger p-button-sm"
                    onClick={() => onDelete(rowData)}
                    title="Delete"
                >
                    <i className="pi pi-trash"></i>
                </button>
            )}
        </div>
    );
};
