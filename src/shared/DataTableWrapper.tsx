import React from 'react';
import { Column, ColumnProps } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

interface DataTableWrapperProps {
    columns: Array<ColumnProps>;
    reference?: React.MutableRefObject<any>;
    actionBody?: (rowData: any) => React.ReactNode;
    [key: string]: any; // Allow any other DataTable props
}

const DataTableWrapper: React.FunctionComponent<DataTableWrapperProps> = ({
    columns, reference, actionBody, ...props
}) => (
    <DataTable
        ref={reference}
        {...props}
    >
        {columns.map((column, index) => {
            if (column.field === 'operations' && actionBody) {
                return (
                    <Column
                        {...column}
                        body={actionBody}
                        key={index}
                    />
                );
            }
            return <Column {...column} key={index} />;
        })}
    </DataTable>
);

export default DataTableWrapper;
