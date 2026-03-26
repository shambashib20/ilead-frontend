// AudioRecorderUploader.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Mic, MicOff, UploadCloud, CheckCircle } from "lucide-react";

interface AudioUploaderProps {
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
}

export function AudioRecorderUploader({
  onUploadSuccess,
  disabled,
}: AudioUploaderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const BASE_URL = `https://crm-server-tsnj.onrender.com/api`;

  useEffect(() => {
    if (!recording) return; // 👈 false pe kuch mat karo

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data); // 👈 empty chunks ignore
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(blob);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
      })
      .catch((err) => {
        console.error("Microphone permission denied", err);
        setRecording(false);
      });
  }, [recording]);

  const toggleRecording = () => {
    if (recording) {
      // 👈 pehle stop karo
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setRecording(false); // 👈 phir state
    } else {
      setAudioBlob(null); // 👈 purana blob clear karo
      setPreviewUrl(null);
      setRecording(true);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    setUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/file/upload`, formData);
      const url = response.data?.data.file_url;
      setPreviewUrl(url);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Audio upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-gray-400 rounded-md p-3 w-full">
      {/* Record button — full width, chota height */}
      <button
        onClick={toggleRecording}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded text-white text-sm ${
          recording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {recording ? <MicOff size={14} /> : <Mic size={14} />}
        {recording ? "Stop Recording" : "Record Audio"}
      </button>

      {/* Audio preview + upload */}
      {audioBlob && (
        <div className="mt-2 space-y-2">
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="w-full h-8"
          />
          {!previewUrl && (
            <button
              onClick={uploadAudio}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm"
            >
              <UploadCloud size={14} />
              {uploading ? "Uploading..." : "Upload Audio"}
            </button>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="mt-2 flex items-center justify-center text-green-500 text-sm gap-1">
          <CheckCircle size={14} />
          Uploaded Successfully
        </div>
      )}
    </div>
  );
}
