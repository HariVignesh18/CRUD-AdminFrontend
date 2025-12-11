import React from 'react';
import { Button } from 'primereact/button';

interface GenericActionsProps {
    rowData: any;
    onEdit: (rowData: any) => void;
    onDelete: (rowData: any) => void;
}

const GenericActions: React.FC<GenericActionsProps> = ({ rowData, onEdit, onDelete }) => {
    return (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-button-sm"
                onClick={() => onEdit(rowData)}
                tooltip="Edit"
                tooltipOptions={{ position: 'top' }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-sm"
                onClick={() => onDelete(rowData)}
                tooltip="Delete"
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    );
};

export default GenericActions;
