import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@mui/material';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { storage } from './firebase'; // Adjust import path if needed

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    if (imageSrc) {
      const storageRef = ref(storage, `images/${new Date().toISOString()}.jpg`);
      uploadString(storageRef, imageSrc, 'data_url').then((snapshot) => {
        console.log('Uploaded a data_url string!');
      }).catch((error) => {
        console.error('Upload failed:', error);
      });
    }
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <Button variant="contained" color="primary" onClick={capture}>
        Capture photo
      </Button>
      {image && <img src={image} alt="captured" />}
    </div>
  );
};

export default WebcamCapture;
