import React, { useEffect, useState } from 'react';

function AdminsTableCrud() {
    const initialRows = [];

    const [rows, setRows] = useState(initialRows);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newRow, setNewRow] = useState({ email: '', password: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleAddRow = () => {
        setNewRow({ email: '', password: '' });
        setIsAdding(true);
        setEditingIndex(rows.length); // Set the editingIndex to the index of the newly added row
    };

    const handleCancelAddRow = () => {
        setNewRow({ email: '', password: '' });
        setIsAdding(false);
        setEditingIndex(-1);
    };
    
    const handleSaveRow = () => {
        if (isAdding) {
            const newAdmin = { ...newRow };

            // Make POST request to addAdmin API
            fetch('http://localhost:8800/api/adminwork/addAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            })
                .then(response => response.json())
                .then(data => {
                    if (data === "Admin added successfully!") {
                        // Fetch the updated list of admins
                        fetch('http://localhost:8800/api/adminwork/getAllAdmins')
                            .then(response => response.json())
                            .then(data => {
                                setRows(data);
                                setNewRow({ email: '', password: '' });
                                setEditingIndex(-1);
                                setIsAdding(false);
                            })
                            .catch(error => console.error('Error fetching data:', error));
                    } else {
                        console.error('Error adding admin:', data);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            handleUpdateRow(editingIndex);
        }
    };

    const handleEditRow = (index) => {
        setEditingIndex(index);
        setNewRow(rows[index]);
    };

    const handleUpdateRow = (index) => {
        const updatedAdmin = { idadmins: rows[index].idadmins, ...newRow };

        // Make POST request to updateAdmin API
        fetch('http://localhost:8800/api/adminwork/updateAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAdmin),
        })
            .then(response => response.json())
            .then(data => {
                if (data === "Admin updated successfully!") {
                    // Fetch the updated list of admins
                    fetch('http://localhost:8800/api/adminwork/getAllAdmins')
                        .then(response => response.json())
                        .then(data => {
                            setRows(data);
                            setNewRow({ email: '', password: '' });
                            setEditingIndex(-1);
                        })
                        .catch(error => console.error('Error fetching data:', error));
                } else {
                    console.error('Error updating admin:', data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // const handleDeleteRow = (index) => {
    //     const updatedRows = [...rows];
    //     updatedRows.splice(index, 1);
    //     setRows(updatedRows);
    // };


    const handleDeleteRow = (index) => {
        const idadmins = rows[index].idadmins;

        // Make POST request to deleteAdmin API
        fetch('http://localhost:8800/api/adminwork/deleteAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idadmins }),
        })
            .then(response => response.json())
            .then(data => {
                if (data === "Admin deleted successfully!") {
                    // Remove the row from the state
                    const updatedRows = [...rows];
                    updatedRows.splice(index, 1);
                    setRows(updatedRows);
                } else {
                    console.error('Error deleting admin:', data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


    useEffect(() => {
        fetch('http://localhost:8800/api/adminwork/getAllAdmins')
            .then(response => response.json())
            .then(data => setRows(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>Bootstrap Table with Add and Delete Row Feature</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans" />
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    color: #404E67;
                    background: #F5F7FA;
                    font-family: 'Open Sans', sans-serif;
                }
                .table-wrapper {
                    width: 700px;
                    margin: 30px auto;
                    background: #fff;
                    padding: 20px;
                    box-shadow: 0 1px 1px rgba(0,0,0,.05);
                }
                .table-title {
                    padding-bottom: 10px;
                    margin: 0 0 10px;
                }
                .table-title h2 {
                    margin: 6px 0 0;
                    font-size: 22px;
                }
                .table-title .add-new {
                    float: right;
                    height: 30px;
                    font-weight: bold;
                    font-size: 12px;
                    text-shadow: none;
                    min-width: 100px;
                    border-radius: 50px;
                    line-height: 13px;
                }
                .table-title .add-new i {
                    margin-right: 4px;
                }
                table.table {
                    table-layout: fixed;
                }
                table.table tr th, table.table tr td {
                    border-color: #e9e9e9;
                }
                table.table th i {
                    font-size: 13px;
                    margin: 0 5px;
                    cursor: pointer;
                }
                table.table th:last-child {
                    width: 100px;
                }
                table.table td a {
                    cursor: pointer;
                    display: inline-block;
                    margin: 0 5px;
                    min-width: 24px;
                }
                table.table td a.add {
                    color: #27C46B;
                }
                table.table td a.edit {
                    color: #FFC107;
                }
                table.table td a.delete {
                    color: #E34724;
                }
                table.table td i {
                    font-size: 19px;
                }
                table.table td a.add i {
                    font-size: 24px;
                    margin-right: -1px;
                    position: relative;
                    top: 3px;
                }
                table.table .form-control {
                    height: 32px;
                    line-height: 32px;
                    box-shadow: none;
                    border-radius: 2px;
                }
                table.table .form-control.error {
                    border-color: #f50000;
                }
                table.table td .add {
                    display: none;
                }
            ` }} />


            <div className="container-lg">
                <div className="table-responsive">
                    <div className="table-wrapper">
                        <div className="table-title">
                            <div className="row">
                                <div className="col-sm-8"><h2>Admin <b>Details</b></h2></div>
                                <div className="col-sm-4">
                                    <button type="button" className="btn btn-info add-new" onClick={handleAddRow}>
                                        <i className="fa fa-plus" /> Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>ADMIN ID</th>
                                    <th style={{ width: '25%' }}>EMAIL</th>
                                    <th style={{ width: '25%' }}>PASSWORD</th>
                                    <th style={{ width: '25%' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.idadmins}</td>
                                        <td>{editingIndex === index ? <input type="text" defaultValue={row.email} onChange={(e) => setNewRow({ ...newRow, email: e.target.value })} /> : row.email}</td>
                                        <td>{editingIndex === index ? <input type="text" defaultValue={row.password} onChange={(e) => setNewRow({ ...newRow, password: e.target.value })} /> : '******'}</td>
                                        <td>
                                            {editingIndex === index ? (
                                                <>
                                                    <button className="btn btn-success" onClick={handleSaveRow}>Save</button>
                                                    <button className="btn btn-secondary" onClick={() => setEditingIndex(-1)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <a className="edit" onClick={() => handleEditRow(index)} title="Edit"><i className="material-icons">edit</i></a>
                                                    <a className="delete" onClick={() => handleDeleteRow(index)} title="Delete"><i className="material-icons">delete</i></a>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {isAdding && (
                                    <tr>
                                        <td>New</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={newRow.email}
                                                onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                value={newRow.password}
                                                onChange={(e) => setNewRow({ ...newRow, password: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={handleSaveRow}>Save</button>
                                            <button className="btn btn-secondary" onClick={handleCancelAddRow}>Cancel</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminsTableCrud;



