/**
 * List of column names that are auto-managed by the database
 * and should NOT be manually edited or included in create/update operations
 */
export const AUTO_MANAGED_COLUMNS = [
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by',
] as const;

/**
 * Check if a column name is auto-managed
 */
export const isAutoManagedColumn = (columnName: string): boolean => {
    return AUTO_MANAGED_COLUMNS.includes(columnName.toLowerCase() as any);
};

/**
 * Remove auto-managed columns from an object
 * Useful for sanitizing form data before sending to API
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
    const cleaned = { ...data };
    AUTO_MANAGED_COLUMNS.forEach(col => {
        delete cleaned[col];
    });
    return cleaned;
};

/**
 * Filter metadata to exclude auto-managed columns
 */
export const filterEditableColumns = <T extends { name: string; isAutoIncrement?: boolean }>(
    columns: T[]
): T[] => {
    return columns.filter(col => {
        if (col.isAutoIncrement) return false;
        if (isAutoManagedColumn(col.name)) return false;
        return true;
    });
};
