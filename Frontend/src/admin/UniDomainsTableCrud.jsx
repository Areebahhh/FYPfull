import React, { useEffect, useState } from 'react';

function UniDomainsTableCrud() {
    const initialRows = [];

    const [rows, setRows] = useState(initialRows);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newRow, setNewRow] = useState({ uniEmail: '', uniPass: '', uniName: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleAddRow = () => {
        setNewRow({ uniEmail: '', uniPass: '', uniName: '' });
        setIsAdding(true);
        setEditingIndex(rows.length);
    };

    const handleCancelAddRow = () => {
        setNewRow({ uniEmail: '', uniPass: '', uniName: '' });
        setIsAdding(false);
        setEditingIndex(-1);
    };

    const handleSaveRow = () => {
        if (isAdding) {
            const newUniDomain = { ...newRow };

            fetch('http://localhost:8800/api/adminwork/addUniDomain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUniDomain),
            })
                .then(response => response.json())
                .then(data => {
                    if (data === "UniDomain added successfully!") {
                        fetch('http://localhost:8800/api/adminwork/getAllUniDomains')
                            .then(response => response.json())
                            .then(data => {
                                setRows(data);
                                setNewRow({ uniEmail: '', uniPass: '', uniName: '' });
                                setEditingIndex(-1);
                                setIsAdding(false);
                            })
                            .catch(error => console.error('Error fetching data:', error));
                    } else {
                        console.error('Error adding unidomain:', data);
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
        const updatedUniDomain = { idunidomains: rows[index].idunidomains, ...newRow };

        fetch('http://localhost:8800/api/adminwork/updateUniDomain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUniDomain),
        })
            .then(response => response.json())
            .then(data => {
                if (data === "UniDomain updated successfully!") {
                    fetch('http://localhost:8800/api/adminwork/getAllUniDomains')
                        .then(response => response.json())
                        .then(data => {
                            setRows(data);
                            setNewRow({ uniEmail: '', uniPass: '', uniName: '' });
                            setEditingIndex(-1);
                        })
                        .catch(error => console.error('Error fetching data:', error));
                } else {
                    console.error('Error updating unidomain:', data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleDeleteRow = (index) => {
        const idunidomains = rows[index].idunidomains;

        fetch('http://localhost:8800/api/adminwork/deleteUniDomain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idunidomains }),
        })
            .then(response => response.json())
            .then(data => {
                if (data === "UniDomain deleted successfully!") {
                    const updatedRows = [...rows];
                    updatedRows.splice(index, 1);
                    setRows(updatedRows);
                } else {
                    console.error('Error deleting unidomain:', data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetch('http://localhost:8800/api/adminwork/getAllUniDomains')
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

                .table td.email {
                    max-width: 150px; /* Adjust the maximum width as needed */
                    word-wrap: break-word;
                }
                
            ` }} />
            <div className="container-lg">
                <div className="table-responsive">
                    <div className="table-wrapper">
                        <div className="table-title">
                            <div className="row">
                                <div className="col-sm-8"><h2><b>HEC Universities Table</b></h2></div>
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
                                    <th style={{ width: '25%' }}>ID</th>
                                    <th style={{ width: '60%' }}>EMAIL</th>
                                    <th style={{ width: '25%' }}>PASSWORD</th>
                                    <th style={{ width: '25%' }}>NAME</th>
                                    <th style={{ width: '25%' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td className="email">{row.idunidomains}</td>
                                        <td>{editingIndex === index ? <input type="text" defaultValue={row.uniEmail} onChange={(e) => setNewRow({ ...newRow, uniEmail: e.target.value })} /> : row.uniEmail}</td>
                                        <td>{editingIndex === index ? <input type="password" defaultValue={row.uniPass} onChange={(e) => setNewRow({ ...newRow, uniPass: e.target.value })} /> : '******'}</td>
                                        <td>{editingIndex === index ? <input type="text" defaultValue={row.uniName} onChange={(e) => setNewRow({ ...newRow, uniName: e.target.value })} /> : row.uniName}</td>
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
                                                value={newRow.uniEmail}
                                                onChange={(e) => setNewRow({ ...newRow, uniEmail: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                value={newRow.uniPass}
                                                onChange={(e) => setNewRow({ ...newRow, uniPass: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={newRow.uniName}
                                                onChange={(e) => setNewRow({ ...newRow, uniName: e.target.value })}
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

export default UniDomainsTableCrud;
