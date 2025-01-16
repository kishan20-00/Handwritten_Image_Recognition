import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: theme.spacing(4),
  backgroundColor: '#f9f9f9',
  fontFamily: 'Roboto, sans-serif',
}));

const Header = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: '#333',
  textAlign: 'center',
  fontFamily: 'Montserrat, sans-serif',
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 400,
  color: '#666',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontFamily: 'Open Sans, sans-serif',
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #bbb',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#fff',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const ResultBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#e8f5e9',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
}));

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setErrorMessage('');
      setPredictions([]);
    } else {
      setErrorMessage('Please select a valid image file.');
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image. Please try again later.');
      }

      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static" elevation={0} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#000' }}>
            Handwritten Text Recognition
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Header>Post Your Documents</Header>
        <SubHeader>Analyze all the texts and get insights effortlessly</SubHeader>

        {errorMessage && (
          <Alert severity="error" style={{ marginBottom: '20px', width: '100%', textAlign: 'center' }}>
            {errorMessage}
          </Alert>
        )}

        <label htmlFor="file-upload" style={{ width: '100%' }}>
          <UploadBox>
            <Typography variant="body2" color="textSecondary">
              {selectedFile ? selectedFile.name : 'Click to upload or drag and drop an image'}
            </Typography>
          </UploadBox>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          style={{ marginTop: '20px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Upload and Process'}
        </Button>

        {predictions.length > 0 && (
          <ResultBox>
            <Typography variant="h6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Predicted Text:</Typography>
            <ul style={{ paddingLeft: '20px' }}>
              {predictions.map((text, index) => (
                <li key={index} style={{ marginBottom: '5px', fontFamily: 'Open Sans, sans-serif' }}>{text}</li>
              ))}
            </ul>
          </ResultBox>
        )}
      </Container>
    </Box>
  );
}

export default App;
