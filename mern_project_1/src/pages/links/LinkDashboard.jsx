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
  const [formData, setFormData] = useState({
    campaignTitle: "",
    originalUrl: "",
    category: ""
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
        await axios.post(`${serverEndpoint}/links`, body, { withCredentials: true });
        await fetchLinks();
        setFormData({
          campaignTitle: "",
          originalUrl: "",
          category: ""
        });
        handleCloseModal();
      } catch (error) {
        setErrors({ message: "Unable to add the Link, please try again" });
      }
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });
      setLinksData(response.data.data);
    } catch (error) {
      console.error(error);
      setErrors({ message: 'Unable to fetch links at the moment. Please try again.' });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
    { field: 'originalUrl', headerName: 'URL', flex: 3 },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Clicks', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      renderCell: () => (
        <>
          <IconButton aria-label="edit" size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="delete" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Affiliate Links</h2>
        <button
          onClick={handleOpenModal}
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
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-xl"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            outline: 'none',
          }}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            Add Link
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="campaignTitle">
                Campaign Title
              </label>
              <input
                type="text"
                name="campaignTitle"
                id="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.campaignTitle ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.campaignTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.campaignTitle}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="originalUrl">
                URL
              </label>
              <input
                type="text"
                name="originalUrl"
                id="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.originalUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.originalUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.originalUrl}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="category">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default LinksDashboard;
