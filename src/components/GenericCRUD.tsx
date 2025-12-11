import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { genericApi } from '../api/genericApi';

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

const GenericCRUD: React.FC = () => {
    const { table } = useParams<{ table: string }>();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const [data, setData] = useState<any[]>([]);
    const [metadata, setMetadata] = useState<ColumnMeta[]>([]);
    const [primaryKey, setPrimaryKey] = useState('id');
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);

    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (table) {
            loadMetadata();
        }
    }, [table]);

    useEffect(() => {
        if (table) {
            loadData();
        }
    }, [table, page, rows]);

    const loadMetadata = async () => {
        try {
            const res = await genericApi.getMetadata(table!);
            setMetadata(res.columns);
            setPrimaryKey(res.primaryKey);
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load metadata. Table might not exist.' });
            setMetadata([]); // Clear metadata on error
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await genericApi.list(table!, page, rows);
            setData(res.items);
            setTotalRecords(res.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await genericApi.update(table!, formData[primaryKey], formData);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Updated successfully' });
            } else {
                await genericApi.create(table!, formData);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Created successfully' });
            }
            setShowDialog(false);
            loadData();
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Operation failed' });
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            try {
                await genericApi.delete(table!, id);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Deleted successfully' });
                loadData();
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
            }
        }
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

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => handleDelete(rowData[primaryKey])} />
            </React.Fragment>
        );
    };

    const renderInput = (col: ColumnMeta) => {
        const value = formData[col.name];

        switch (col.ui.widget) {
            case 'number':
                return (
                    <InputNumber
                        id={col.name}
                        value={value}
                        onValueChange={(e) => setFormData({ ...formData, [col.name]: e.value })}
                        useGrouping={false}
                        style={{ width: '100%' }}
                    />
                );
            case 'textarea':
                return (
                    <InputTextarea
                        id={col.name}
                        value={value || ''}
                        onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
                        rows={3}
                        style={{ width: '100%' }}
                    />
                );
            case 'switch':
                return (
                    <div className="flex align-items-center">
                        <InputSwitch
                            id={col.name}
                            checked={!!value}
                            onChange={(e) => setFormData({ ...formData, [col.name]: e.value })}
                        />
                    </div>
                );
            case 'date':
                return (
                    <Calendar
                        id={col.name}
                        value={value ? new Date(value) : null}
                        onChange={(e) => setFormData({ ...formData, [col.name]: e.value })}
                        showIcon
                        style={{ width: '100%' }}
                    />
                );
            default: // text
                return (
                    <InputText
                        id={col.name}
                        value={value || ''}
                        onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
                        style={{ width: '100%' }}
                    />
                );
        }
    };

    const renderFormFields = () => {
        return metadata.map((col) => {
            // Skip auto-increment PKs and timestamp fields in form
            if (col.isAutoIncrement || col.name === 'created_at' || col.name === 'updated_at') return null;

            return (
                <div className="field" key={col.name} style={{ marginBottom: '1rem' }}>
                    <label htmlFor={col.name} style={{ display: 'block', marginBottom: '0.5rem' }}>
                        {col.ui.label} {col.nullable ? '' : '*'}
                    </label>
                    {renderInput(col)}
                </div>
            );
        });
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <div className="flex justify-content-between align-items-center mb-4">
                <h2>Managing Table: {table}</h2>
                <div>
                    <Button label="Home" icon="pi pi-home" className="p-button-secondary mr-2" onClick={() => navigate('/')} />
                    <Button label="Generator" icon="pi pi-cog" className="p-button-info mr-2" onClick={() => navigate('/generate')} />
                    <Button label="New" icon="pi pi-plus" className="p-button-success" onClick={openNew} disabled={metadata.length === 0} />
                </div>
            </div>

            {metadata.length === 0 ? (
                <div className="text-center p-5">
                    <h3>Table not found or error loading metadata.</h3>
                    <Button label="Go to Generator" onClick={() => navigate('/generate')} />
                </div>
            ) : (
                <DataTable
                    value={data}
                    loading={loading}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    lazy
                    first={(page - 1) * rows}
                    onPage={(e) => {
                        setPage((e.page || 0) + 1);
                        setRows(e.rows);
                    }}
                >
                    {metadata.map((col) => (
                        <Column key={col.name} field={col.name} header={col.ui.label} sortable />
                    ))}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            )}

            <Dialog
                visible={showDialog}
                style={{ width: '450px' }}
                header={isEdit ? 'Edit Record' : 'New Record'}
                modal
                className="p-fluid"
                onHide={() => setShowDialog(false)}
                footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowDialog(false)} />
                        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSave} />
                    </div>
                }
            >
                {renderFormFields()}
            </Dialog>
        </div>
    );
};

export default GenericCRUD;
