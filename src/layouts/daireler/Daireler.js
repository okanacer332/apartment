import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Layout bileşenleri
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// ActionsCell Component with PropTypes
const ActionsCell = ({ row, handleEditOpen, handleDelete }) => (
  <MDBox display="flex" justifyContent="center" alignItems="center">
    <MDButton variant="contained" color="info" onClick={() => handleEditOpen(row.original)}>
      Güncelle
    </MDButton>
    <MDButton
      variant="contained"
      color="error"
      onClick={() => handleDelete(row.original._id)}
      sx={{ ml: 1 }}
    >
      Sil
    </MDButton>
  </MDBox>
);

// Define PropTypes for ActionsCell
ActionsCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      _id: PropTypes.string.isRequired, // _id is required
    }).isRequired,
  }).isRequired,
  handleEditOpen: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

function Daireler() {
  const [daireler, setDaireler] = useState([]);
  const [formData, setFormData] = useState({
    sakinAdi: "",
    kat: "",
    daireNo: "",
    telefonNumarasi: "",
    blok: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDaire, setSelectedDaire] = useState(null);

  useEffect(() => {
    fetchDaireler();
  }, []);

  const fetchDaireler = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/daireler");
      setDaireler(response.data);
    } catch (error) {
      console.error("Daireler alınamadı:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/daireler", formData);
      fetchDaireler();
      setFormData({
        sakinAdi: "",
        kat: "",
        daireNo: "",
        telefonNumarasi: "",
        blok: "",
      });
    } catch (error) {
      console.error("Daire eklenemedi:", error);
    }
  };

  // Silme işlemi, ID'ye göre yapılır
  const handleDelete = async (id) => {
    try {
      console.log("Silme işlemi için ID:", id);  // Hangi ID'nin silindiğini görmek için kontrol edelim
      await axios.delete(`http://localhost:8080/api/daireler/${id}`);
      fetchDaireler(); // Silme işleminden sonra listeyi güncelle
    } catch (error) {
      console.error("Daire silinemedi:", error);
    }
  };

  // Güncelleme işlemi, ID'ye göre yapılır
  const handleEditOpen = (daire) => {
    console.log("Güncellenen daire:", daire);  // Hangi dairenin güncellendiğini görmek için kontrol edelim
    setSelectedDaire(daire);
    setFormData({
      sakinAdi: daire.sakinAdi,
      kat: daire.kat,
      daireNo: daire.daireNo,
      telefonNumarasi: daire.telefonNumarasi,
      blok: daire.blok,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      console.log("Güncelleme işlemi için ID:", selectedDaire._id);  // Güncelleme işleminde ID'yi kontrol edelim
      await axios.put(`http://localhost:8080/api/daireler/${selectedDaire._id}`, formData);
      fetchDaireler(); // Güncelleme işleminden sonra listeyi güncelle
      setEditModalOpen(false);
    } catch (error) {
      console.error("Daire güncellenemedi:", error);
    }
  };

  // DataTable için sütunlar
  const columns = [
    { Header: "Blok", accessor: "blok", align: "left" },
    { Header: "Daire No", accessor: "daireNo", align: "center" },
    { Header: "Kat", accessor: "kat", align: "center" },
    { Header: "Sakin Adı", accessor: "sakinAdi", align: "left" },
    { Header: "Telefon Numarası", accessor: "telefonNumarasi", align: "center" },
    {
      Header: "İşlemler",
      accessor: "actions",
      align: "center",
      Cell: (props) => <ActionsCell {...props} handleEditOpen={handleEditOpen} handleDelete={handleDelete} />,
    },
  ];

  // DataTable için satırlar
  const rows = daireler.map((daire) => ({
    blok: daire.blok,
    daireNo: daire.daireNo.toString(),
    kat: daire.kat.toString(),
    sakinAdi: daire.sakinAdi,
    telefonNumarasi: daire.telefonNumarasi,
    actions: "",
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}>
        {/* Daire Ekleme Formu */}
        <MDBox mb={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h5" mb={3}>
                    Daire Ekle
                  </MDTypography>
                  <MDBox component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* Form alanları */}
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Sakin Adı"
                          name="sakinAdi"
                          value={formData.sakinAdi}
                          onChange={handleInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Kat"
                          name="kat"
                          type="number"
                          value={formData.kat}
                          onChange={handleInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Daire No"
                          name="daireNo"
                          type="number"
                          value={formData.daireNo}
                          onChange={handleInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Blok"
                          name="blok"
                          value={formData.blok}
                          onChange={handleInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Telefon Numarası"
                          name="telefonNumarasi"
                          value={formData.telefonNumarasi}
                          onChange={handleInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      {/* Ekle Butonu */}
                      <Grid item xs={12} md={2}>
                        <MDButton type="submit" variant="gradient" color="info" fullWidth>
                          Ekle
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Daireler Tablosu */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Card>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={true}
                    entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15] }}
                    showTotalEntries={true}
                    canSearch={true}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />

      {/* Güncelleme Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            minWidth: 300,
            maxWidth: '90%',
          }}
        >
          <MDTypography variant="h6" mb={2}>
            Daireyi Güncelle
          </MDTypography>
          <TextField
            label="Sakin Adı"
            name="sakinAdi"
            value={formData.sakinAdi}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Kat"
            name="kat"
            type="number"
            value={formData.kat}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Daire No"
            name="daireNo"
            type="number"
            value={formData.daireNo}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Blok"
            name="blok"
            value={formData.blok}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Telefon Numarası"
            name="telefonNumarasi"
            value={formData.telefonNumarasi}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleEditSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            Güncelle
          </MDButton>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Daireler;
