import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Mic, MicOff, UploadCloud } from "lucide-react";

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

  useEffect(() => {
    if (!recording) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
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
      mediaRecorderRef.current?.stop();
    }
    setRecording(!recording);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    setUploading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/file/upload/single`,
        formData
      );
      const url = response.data?.url;
      setPreviewUrl(url);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Audio upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-gray-400 p-4 rounded-md text-center space-y-2">
      <button
        onClick={toggleRecording}
        disabled={disabled}
        className={`flex items-center gap-2 justify-center mx-auto px-4 py-2 rounded ${
          recording ? "bg-red-600" : "bg-blue-600"
        } text-white`}
      >
        {recording ? <MicOff size={16} /> : <Mic size={16} />}
        {recording ? "Stop Recording" : "Record Audio"}
      </button>

      {audioBlob && (
        <>
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="mx-auto"
          />
          <button
            onClick={uploadAudio}
            disabled={uploading}
            className="mt-2 flex items-center gap-2 mx-auto bg-green-600 text-white px-3 py-1 rounded"
          >
            <UploadCloud size={16} />
            Upload Audio
          </button>
        </>
      )}

      {previewUrl && (
        <div className="text-green-500 text-xs mt-1 break-words">
          Uploaded ✔
        </div>
      )}
    </div>
  );
}
