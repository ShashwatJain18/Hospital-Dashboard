"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as faceapi from "face-api.js";

interface FaceCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (faceDescriptor: number[]) => void;
}

export function FaceCaptureDialog({ open, onOpenChange, onCapture }: FaceCaptureDialogProps) {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [capturedFace, setCapturedFace] = useState<string | null>(null);

  // Load face-api models
  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    }
    loadModels();
  }, []);

  // Start camera when modal opens
  useEffect(() => {
    if (!videoRef || !open) return;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.srcObject = stream;
      videoRef.play();
    });
  }, [videoRef, open]);

  // Stop camera when modal closes
  useEffect(() => {
    if (!open && videoRef?.srcObject) {
      const stream = videoRef.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.srcObject = null;
    }
  }, [open]);

  const captureFace = async () => {
    if (!videoRef) return alert("Video not ready");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return alert("Cannot get canvas context");

    ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

    const detection = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return alert("No face detected. Try again.");

    const descriptorArray = Array.from(detection.descriptor);
    setCapturedFace(canvas.toDataURL());

    onCapture(descriptorArray);
    alert("Face captured successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-[90vw] h-[70vh] flex flex-col items-center justify-center gap-4">
        <DialogHeader>
          <DialogTitle>Find Patient by Face</DialogTitle>
        </DialogHeader>

        <video ref={setVideoRef} autoPlay muted width={300} height={250} className="border rounded" />
        <Button onClick={captureFace}>Capture Face</Button>
        {capturedFace && <img src={capturedFace} className="w-32 h-32 rounded border mt-2" />}
      </DialogContent>
    </Dialog>
  );
}
