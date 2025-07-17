import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';
import { usePermission } from '../../rbac/userPermissions';
import { useNavigate } from 'react-router-dom';

function LinksDashboard() {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const permission = usePermission();

  const [formData, setFormData] = useState({
    campaignTitle: "",
    originalUrl: "",
    category: "",
    id: null
  });

  const handleShowDeleteModal = (linkId) => {
    setFormData((prev) => ({ ...prev, id: linkId }));
    setShowDeleteModal(true);
    setErrors({}); // Clear errors when opening delete modal
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, { withCredentials: true });
      await fetchLinks();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Delete Link Error:", error); // Improved logging
      setErrors({ message: error.response?.data?.message || 'Unable to delete the link, please try again' }); // More specific error message
    }
  };

  const handleOpenModal = (isEdit, data = {}) => {
    setIsEdit(isEdit);
    if (isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category
      });
    } else {
      setFormData({ campaignTitle: "", originalUrl: "", category: "" });
    }
    setShowModal(true);
    setErrors({}); // Clear errors when opening modal
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.campaignTitle.trim()) {
      newErrors.campaignTitle = "Campaign Title is mandatory";
      isValid = false;
    }
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "URL is mandatory";
      isValid = false;
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const body = {
        campaign_title: formData.campaignTitle,
        original_url: formData.originalUrl,
        category: formData.category
      };

      try {
        if (isEdit) {
          await axios.put(`${serverEndpoint}/links/${formData.id}`, body, { withCredentials: true });
        } else {
          await axios.post(`${serverEndpoint}/links`, body, { withCredentials: true });
        }

        await fetchLinks();
        handleCloseModal();
      } catch (error) {
        console.error("Submit Link Error:", error); // Improved logging
        setErrors({ message: error.response?.data?.message || 'Unable to add/update the link, please try again' }); // More specific error message
      }
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${serverEndpoint}/links`, { withCredentials: true });
      setLinksData(res.data.data);
    } catch (error) {
      console.error("Fetch Links Error:", error); // Improved logging
      setErrors({ message: error.response?.data?.message || 'Unable to fetch links at the moment. Please try again' }); // More specific error message
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
    {
      field: 'originalUrl',
      headerName: 'URL',
      flex: 3,
      renderCell: (params) => (
        <a
          href={`${serverEndpoint}/links/r/${params.row._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {params.row.originalUrl}
        </a>
      )
    },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Clicks', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div className="flex space-x-1">
          {permission.canEditLink && (
            <IconButton onClick={() => handleOpenModal(true, params.row)}>
              <EditIcon />
            </IconButton>
          )}
          {permission.canDeleteLink && (
            <IconButton onClick={() => handleShowDeleteModal(params.row._id)}>
              <DeleteIcon />
            </IconButton>
          )}
          {permission.canViewLink && (
            <IconButton onClick={() => navigate(`/analytics/${params.row._id}`)}>
              <AssessmentIcon />
            </IconButton>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Affiliate Links</h2>
        {permission.canCreateLink && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handleOpenModal(false)}
          >
            Add
          </button>
        )}
      </div>

      {errors.message && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.message}
        </div>
      )}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linksData}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 20, page: 0 } }
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          density="compact"
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEdit ? "Update Link" : "Add Link"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-500">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Campaign Title</label>
                <input
                  type="text"
                  name="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded ${errors.campaignTitle ? 'border-red-500' : ''}`}
                />
                {errors.campaignTitle && (
                  <p className="text-red-500 text-sm">{errors.campaignTitle}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">URL</label>
                <input
                  type="text"
                  name="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded ${errors.originalUrl ? 'border-red-500' : ''}`}
                />
                {errors.originalUrl && (
                  <p className="text-red-500 text-sm">{errors.originalUrl}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded ${errors.category ? 'border-red-500' : ''}`}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              <div>
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete the link?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinksDashboard;