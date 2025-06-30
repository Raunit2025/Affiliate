import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, Box, Typography } from '@mui/material';
import { serverEndpoint } from '../../config/config';

function LinksDashboard() {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    campaignTitle: "",
    originalUrl: "",
    category: ""
  });

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true
      });
      setLinksData(response.data.data);
    } catch (error) {
      setErrors({ message: 'Unable to fetch links at the moment. Please try again.' });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenModal = (edit = false, data = {}) => {
    if (edit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category
      });
    } else {
      setFormData({
        id: null,
        campaignTitle: "",
        originalUrl: "",
        category: ""
      });
    }

    setIsEdit(edit);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleShowDeleteModal = (linkId) => {
    setFormData({ id: linkId });
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
        withCredentials: true
      });
      await fetchLinks();
      handleCloseDeleteModal();
    } catch (error) {
      setErrors({ message: 'Unable to delete the link, please try again' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const body = {
        campaign_title: formData.campaignTitle,
        original_url: formData.originalUrl,
        category: formData.category
      };

      try {
        if (isEdit) {
          await axios.put(`${serverEndpoint}/links/${formData.id}`, body, {
            withCredentials: true
          });
        } else {
          await axios.post(`${serverEndpoint}/links`, body, {
            withCredentials: true
          });
        }

        await fetchLinks();
        handleCloseModal();
        setFormData({
          id: null,
          campaignTitle: "",
          originalUrl: "",
          category: ""
        });
      } catch (error) {
        setErrors({ message: "Unable to submit the form, please try again" });
      }
    }
  };

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
    { field: 'originalUrl', headerName: 'URL', flex: 3 },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Clicks', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(true, params.row)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleShowDeleteModal(params.row._id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Affiliate Links</h2>
        <button
          onClick={() => handleOpenModal(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      {errors.message && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {errors.message}
        </div>
      )}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linksData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 }
            }
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-xl"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            outline: 'none'
          }}
        >
          <Typography variant="h6" className="mb-4">
            {isEdit ? 'Edit Link' : 'Add Link'}
          </Typography>
          <form onSubmit={handleSubmit}>
            {['campaignTitle', 'originalUrl', 'category'].map((field) => (
              <div className="mb-4" key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium mb-1 capitalize"
                >
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    errors[field] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Submit'}
            </button>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={handleCloseDeleteModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-xl"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            outline: 'none'
          }}
        >
          <Typography variant="h6" className="mb-4">
            Confirm Delete
          </Typography>
          <p className="mb-6 text-gray-700">Are you sure you want to delete this link?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCloseDeleteModal}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default LinksDashboard;
