import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from "../../config/config";
import { Modal } from 'react-bootstrap';

const USER_ROLES = ['viewer', 'developer'];

function ManageUsers() {
    const [errors, setErrors] = useState({});
    const [usersData, setUsersData] = useState([]);
    const [formData, setFormData] = useState({ email: '', name: '', role: '' });
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleModalShow = (editMode, data = {}) => {
        if (editMode) {
            setFormData({
                id: data._id,
                email: data.email,
                role: data.role,
                name: data.name
            });
        } else {
            setFormData({ email: '', role: '', name: '' });
        }
        setIsEdit(editMode);
        setShowModal(true);
    };

    const handleModalClose = () => setShowModal(false);

    const handleDeleteModalShow = (userId) => {
        setFormData({ id: userId });
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => setShowDeleteModal(false);

    const handleDeleteSubmit = async () => {
        try {
            setFormLoading(true);
            await axios.delete(`${serverEndpoint}/users/${formData.id}`, { withCredentials: true });
            setFormData({ email: '', role: '', name: '' });
            fetchUsers();
        } catch {
            setErrors({ message: 'Something went wrong, please try again' });
        } finally {
            handleDeleteModalClose();
            setFormLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.email) {
            newErrors.email = "Email is mandatory";
            isValid = false;
        }
        if (!formData.name) {
            newErrors.name = "Name is mandatory";
            isValid = false;
        }
        if (!formData.role) {
            newErrors.role = "Role is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setFormLoading(true);
        const body = {
            email: formData.email,
            name: formData.name,
            role: formData.role
        };

        try {
            if (isEdit) {
                await axios.put(`${serverEndpoint}/users/${formData.id}`, body, { withCredentials: true });
            } else {
                await axios.post(`${serverEndpoint}/users`, body, { withCredentials: true });
            }

            setFormData({ email: '', name: '', role: '' });
            fetchUsers();
        } catch {
            setErrors({ message: 'Something went wrong, please try again' });
        } finally {
            handleModalClose();
            setFormLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${serverEndpoint}/users`, { withCredentials: true });
            setUsersData(data);
        } catch {
            setErrors({ message: 'Unable to fetch users at the moment, please try again' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'role', headerName: 'Role', flex: 2 },
        {
            field: 'action', headerName: 'Action', flex: 1, renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleModalShow(true, params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteModalShow(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Manage Users</h2>
                <button className='btn btn-primary btn-sm' onClick={() => handleModalShow(false)}>Add</button>
            </div>

            {errors.message && (
                <div className="alert alert-danger" role="alert">{errors.message}</div>
            )}

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={usersData}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 20, page: 0 } }
                    }}
                    pageSizeOptions={[20, 50, 100]}
                    disableRowSelectionOnClick
                    sx={{ fontFamily: 'inherit' }}
                    loading={loading}
                />
            </div>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="text"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                            >
                                <option value="">Select</option>
                                {USER_ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                        </div>

                        <div className="d-grid">
                            {formLoading ? (
                                <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                                    <span className="visually-hidden">Loading...</span>
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary">Submit</button>
                            )}
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleDeleteModalClose}>Cancel</button>
                    {formLoading ? (
                        <button className="btn btn-danger" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                            <span className="visually-hidden">Loading...</span>
                        </button>
                    ) : (
                        <button className="btn btn-danger" onClick={handleDeleteSubmit}>Delete</button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ManageUsers;
