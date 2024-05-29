import React, { useEffect, useState } from 'react';

function UniCoordinatorsTableCrud() {
    const initialRows = [];
    const uniNamedropdownOptions = ['AUMC', 'COMSATS', 'NUST', 'GIKI', 'BZU', 'FAST']; // Hardcoded dropdown values

    const [rows, setRows] = useState(initialRows);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newRow, setNewRow] = useState({ coordinatorName: '', coordinatorUniName: '', coordinatorEmail: '', coordinatorPass: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleAddRow = () => {
        setNewRow({ coordinatorName: '', coordinatorUniName: '', coordinatorEmail: '', coordinatorPass: '' });
        setIsAdding(true);
        setEditingIndex(rows.length); // Set the editingIndex to the index of the newly added row
    };

    const handleCancelAddRow = () => {
        setNewRow({ coordinatorName: '', coordinatorUniName: '', coordinatorEmail: '', coordinatorPass: '' });
        setIsAdding(false);
        setEditingIndex(-1);
    };

    
    
    const handleSaveRow = () => {
        if (isAdding)  {
            if (!newRow.coordinatorUniName) {
                alert('Please select an coordinatorUniName from the dropdown.');
                return;
            }
            const newCoordinator = { ...newRow };

            // Make POST request to addCoordinator API
            fetch('http://localhost:8800/api/adminwork/addCoordinator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCoordinator),
            })
                .then(response => response.json())
                .then(data => {
                    if (data === "Coordinator added successfully!") {
                        // Fetch the updated list of coordinators
                        fetch('http://localhost:8800/api/adminwork/getAllCoordinators')
                            .then(response => response.json())
                            .then(data => {
                                setRows(data);
                                setNewRow({ coordinatorName: '', coordinatorUniName: '', coordinatorEmail: '', coordinatorPass: '' });
                                setEditingIndex(-1);
                                setIsAdding(false);
                            })
                            .catch(error => console.error('Error fetching data:', error));
                    } else {
                        console.error('Error adding coordinator:', data);
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
        const updatedCoordinator = { idunicoordinators: rows[index].idunicoordinators, ...newRow };

        // Make POST request to updateCoordinator API
        fetch('http://localhost:8800/api/adminwork/updateCoordinator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCoordinator),
        })
            .then(response => response.json())
            .then(data => {
                if (data === "Coordinator updated successfully!") {
                    // Fetch the updated list of coordinators
                    fetch('http://localhost:8800/api/adminwork/getAllCoordinators')
                        .then(response => response.json())
                        .then(data => {
                            setRows(data);
                            setNewRow({ coordinatorName: '', coordinatorUniName: '', coordinatorEmail: '', coordinatorPass: '' });
                            setEditingIndex(-1);
                        })
                        .catch(error => console.error('Error fetching data:', error));
                } else {
                    console.error('Error updating coordinator:', data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleDeleteRow = (index) => {
        const idunicoordinators = rows[index].idunicoordinators;

        // Make POST request to deleteCoordinator API
        fetch('http://localhost:8800/api/adminwork/deleteCoordinator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idunicoordinators }),
        })
            .then(response => response.json())
            .then(data => {
                if (data === "Coordinator deleted successfully!") {
                    // Remove the row from the state
                    const updatedRows = [...rows];
                    updatedRows.splice(index, 1);
                    setRows(updatedRows);
                } else {
                    console.error('Error deleting coordinator:', data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetch('http://localhost:8800/api/adminwork/getAllCoordinators')
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
                    padding: 10px;
                    box-shadow: 0 1px 1px rgba(0,0,0,.05);
                    margin-left: 70px;
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


                th, td {
                    padding: 5px;
                    text-align: left;
                    vertical-align: top;
                    border: 1px solid #ddd;
                    overflow: hidden;
                    white-space: nowrap;
                    
                  }
        

            ` }} />

            <div className="container-lg">
                <div className="table-responsive">
                    <div className="table-wrapper">
                        <div className="table-title">
                            <div className="row">
                                <div className="col-sm-8"><h2>Coordinator <b>Details</b></h2></div>
                                <div className="col-sm-4">
                                    <button type="button" className="btn btn-info add-new" onClick={handleAddRow}>
                                        <i className="fa fa-plus" /> Add New
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '370px', overflow: 'auto', width: '930px'}}>
                        <table className="table table-bordered" style={{tableLayout: 'fixed', height: "200px"}}>
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>ID</th>
                                    <th style={{ width: '180px' }}>Coordinator Name</th>
                                    <th style={{ width: '180px' }}>Coordinator's UniName</th>
                                    <th style={{ width: '180px' }}>Coordinator Email</th>
                                    <th style={{ width: '180px' }}>Coordinator Password</th>
                                    <th style={{ width: '140px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.idunicoordinators}</td>
                                        <td style={{textOverflow: "ellipsis"}}>{editingIndex === index ? <input type="text" defaultValue={row.coordinatorName} onChange={(e) => setNewRow({ ...newRow, coordinatorName: e.target.value })} /> : row.coordinatorName}</td>
                                        {/* <td style={{textOverflow: "ellipsis"}}>{editingIndex === index ? <input type="text" defaultValue={row.coordinatorUniName} onChange={(e) => setNewRow({ ...newRow, coordinatorUniName: e.target.value })} /> : row.coordinatorUniName}</td> */}
                                        <td style={{textOverflow: "ellipsis"}}>
                                                {editingIndex === index ? (
                                                    <select value={newRow.coordinatorUniName} onChange={(e) => setNewRow({ ...newRow, coordinatorUniName: e.target.value })}>
                                                        <option value="">Select Name</option>
                                                        {uniNamedropdownOptions.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : row.coordinatorUniName}
                                            </td>
                                        <td style={{textOverflow: "ellipsis"}}>{editingIndex === index ? <input type="text" defaultValue={row.coordinatorEmail} onChange={(e) => setNewRow({ ...newRow, coordinatorEmail: e.target.value })} /> : row.coordinatorEmail}</td>
                                        <td style={{textOverflow: "ellipsis"}}>{editingIndex === index ? <input type="password" defaultValue={row.coordinatorPass} onChange={(e) => setNewRow({ ...newRow, coordinatorPass: e.target.value })} /> : '******'}</td>
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
                                                value={newRow.coordinatorName}
                                                onChange={(e) => setNewRow({ ...newRow, coordinatorName: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                                <select
                                                    value={newRow.coordinatorUniName}
                                                    onChange={(e) => setNewRow({ ...newRow, coordinatorUniName: e.target.value })}
                                                    style={{ width: '100%' }}
                                                >
                                                    <option value="">Select coordinatorUniName</option>
                                                    {uniNamedropdownOptions.map((option, index) => (
                                                        <option key={index} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={newRow.coordinatorEmail}
                                                onChange={(e) => setNewRow({ ...newRow, coordinatorEmail: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                value={newRow.coordinatorPass}
                                                onChange={(e) => setNewRow({ ...newRow, coordinatorPass: e.target.value })}
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
        </div>
    );
}

export default UniCoordinatorsTableCrud;
