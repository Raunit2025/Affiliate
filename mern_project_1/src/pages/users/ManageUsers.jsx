import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from "../../config/config";

// Added 'admin' to the USER_ROLES array for frontend selection
// Ideally, these roles would be fetched from the backend to ensure consistency.
const USER_ROLES = ['viewer', 'developer', 'admin'];

function ManageUsers() {
  const [errors, setErrors] = useState({});
  const [usersData, setUsersData] = useState([]);
  const [formData, setFormData] = useState({ email: '', name: '', role: '' });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleModalShow = (isEdit, data = {}) => {
    if (isEdit) {
      setFormData({ id: data._id, email: data.email, role: data.role, name: data.name });
    } else {
      setFormData({ email: '', role: '', name: '' });
    }
    setIsEdit(isEdit);
    setShowModal(true);
    setErrors({}); // Clear errors when opening modal
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleDeleteModalShow = (userId) => {
    setFormData({ id: userId });
    setShowDeleteModal(true);
    setErrors({}); // Clear errors when opening delete modal
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSubmit = async () => {
    try {
      setFormLoading(true);
      await axios.delete(`${serverEndpoint}/users/${formData.id}`, { withCredentials: true });
      setFormData({ email: '', role: '', name: '' });
      fetchUsers();
    } catch (error) {
      console.error("Delete User Error:", error); // Improved logging
      setErrors({ message: error.response?.data?.message || 'Something went wrong, please try again' }); // More specific error message
    } finally {
      handleDeleteModalClose();
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is mandatory";
    if (!formData.role) newErrors.role = "Role is mandatory";
    if (!formData.name) newErrors.name = "Name is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setFormLoading(true);
    const config = { withCredentials: true };
    try {
      if (isEdit) {
        await axios.put(`${serverEndpoint}/users/${formData.id}`, formData, config);
      } else {
        await axios.post(`${serverEndpoint}/users`, formData, config);
      }
      setFormData({ email: '', name: '', role: '' });
      fetchUsers();
    } catch (error) {
      console.error("Submit User Error:", error); // Improved logging
      setErrors({ message: error.response?.data?.message || 'Something went wrong, please try again' }); // More specific error message
    } finally {
      handleModalClose();
      setFormLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverEndpoint}/users`, { withCredentials: true });
      setUsersData(res.data);
    } catch (error) {
      console.error("Fetch Users Error:", error); // Improved logging
      setErrors({ message: error.response?.data?.message || 'Unable to fetch users' }); // More specific error message
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
          <IconButton onClick={() => handleModalShow(true, params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDeleteModalShow(params.row._id)}><DeleteIcon /></IconButton>
        </>
      )
    }
  ];

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm" onClick={() => handleModalShow(false)}>Add</button>
      </div>

      {errors.message && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 mb-4 rounded">{errors.message}</div>
      )}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={usersData}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[20, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 20, page: 0 } } }}
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Tailwind Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isEdit ? "Edit User" : "Add User"}</h3>
              <button onClick={handleModalClose} className="text-gray-400 hover:text-red-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`w-full border px-3 py-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isEdit} // Disable email edit for existing users
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className={`w-full border px-3 py-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  className={`w-full border px-3 py-2 rounded ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  {USER_ROLES.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 w-full text-white py-2 rounded hover:bg-blue-700"
              >
                {formLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-3">
              <button onClick={handleDeleteModalClose} className="px-4 py-2 border rounded text-gray-700">
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDeleteSubmit}
                disabled={formLoading}
              >
                {formLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;