import { useState, useCallback, useEffect, useRef } from 'react';
import { useSnackbar } from '@/providers';
import { AudioInput, type TAudioInputFiles } from '@/components/audio-input';
import { KeenIcon } from '@/components';

interface Transcription {
  id: string;
  fileName: string;
  text: string;
  timestamp: number;
  fileSize: number;
  duration?: number;
}

const STORAGE_KEY = 'whisper_transcriptions';

const WhisperTranscriptionContent = () => {
  const { showSnackbar } = useSnackbar();
  const [audioFiles, setAudioFiles] = useState<TAudioInputFiles>([]);
  const [uploading, setUploading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [selectedTranscription, setSelectedTranscription] =
    useState<Transcription | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load transcriptions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Transcription[];
        setTranscriptions(parsed);
      }
    } catch (error) {
      console.error('Failed to load transcriptions from storage:', error);
    }
  }, []);

  // Save transcriptions to localStorage whenever they change
  useEffect(() => {
    if (transcriptions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptions));
      } catch (error) {
        console.error('Failed to save transcriptions to storage:', error);
        showSnackbar(
          'Warning: Failed to save transcription to local storage',
          'warning',
        );
      }
    }
  }, [transcriptions, showSnackbar]);

  const handleAudioChange = useCallback(
    (files: TAudioInputFiles) => {
      if (files.length > 0 && files[0].file) {
        const selectedFile = files[0].file;
        const maxSize = 10 * 1024 * 1024;
        const openaiMaxSize = 25 * 1024 * 1024;
        if (selectedFile.size > openaiMaxSize) {
          showSnackbar(
            'File size exceeds 25MB limit. Please use a smaller file.',
            'error',
          );
          setAudioFiles([]);
          return;
        }
        if (selectedFile.size > maxSize) {
          showSnackbar(
            'File size exceeds 10MB limit for direct upload. For larger files, please use S3 upload (feature coming soon).',
            'warning',
          );
        }
      }
      setAudioFiles(files);
      setTranscription(null);
      setSelectedTranscription(null);
    },
    [showSnackbar],
  );

  const handleUploadAndTranscribe = useCallback(async () => {
    if (!audioFiles.length || !audioFiles[0].file) {
      showSnackbar('Please select a file first', 'error');
      return;
    }

    const file = audioFiles[0].file;
    setUploading(true);
    setTranscribing(true);
    setTranscription(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const apiUrl = import.meta.env.VITE_WHISPER_API_URL;
      if (!apiUrl) {
        showSnackbar(
          'Whisper API URL not configured. Please set VITE_WHISPER_API_URL in your .env file.',
          'error',
        );
        setUploading(false);
        setTranscribing(false);
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {},
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Unknown error' }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.text) {
        const newTranscription: Transcription = {
          id: Date.now().toString(),
          fileName: file.name,
          text: data.text,
          timestamp: Date.now(),
          fileSize: file.size,
          duration: data.duration,
        };

        setTranscription(data.text);
        setTranscriptions(prev => [newTranscription, ...prev]);
        setSelectedTranscription(newTranscription);
        showSnackbar('Transcription completed successfully!', 'success');
      } else {
        throw new Error('No transcription text in response');
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      showSnackbar(
        error.message || 'Failed to transcribe audio. Please try again.',
        'error',
      );
    } finally {
      setUploading(false);
      setTranscribing(false);
    }
  }, [audioFiles, showSnackbar]);

  const handleDeleteTranscription = useCallback(
    (id: string) => {
      setTranscriptions(prev => prev.filter(t => t.id !== id));
      if (selectedTranscription?.id === id) {
        setSelectedTranscription(null);
        setTranscription(null);
      }
      showSnackbar('Transcription deleted', 'success');
    },
    [selectedTranscription, showSnackbar],
  );

  const handleSelectTranscription = useCallback((t: Transcription) => {
    setSelectedTranscription(t);
    setTranscription(t.text);
  }, []);

  const handleCopyTranscription = useCallback(async () => {
    if (transcription) {
      try {
        await navigator.clipboard.writeText(transcription);
        showSnackbar('Copied to clipboard!', 'success');
      } catch {
        showSnackbar('Failed to copy', 'error');
      }
    }
  }, [transcription, showSnackbar]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4',
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        // Create a File from the Blob
        const extension = mediaRecorder.mimeType.includes('webm')
          ? 'webm'
          : 'm4a';
        const fileName = `Recording_${new Date().toLocaleString().replace(/[/:]/g, '-')}.${extension}`;
        const audioFile = new File([audioBlob], fileName, {
          type: mediaRecorder.mimeType,
        });

        // Convert to base64 for the AudioInput format
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioFiles([
            {
              dataURL: reader.result as string,
              file: audioFile,
            },
          ]);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setTranscription(null);
        setSelectedTranscription(null);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      showSnackbar('Recording started...', 'info');
    } catch (error: any) {
      console.error('Recording error:', error);
      if (error.name === 'NotAllowedError') {
        showSnackbar(
          'Microphone access denied. Please allow microphone access.',
          'error',
        );
      } else {
        showSnackbar('Failed to start recording. Please try again.', 'error');
      }
    }
  }, [showSnackbar]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      showSnackbar('Recording stopped', 'success');
    }
  }, [isRecording, showSnackbar]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <>
      {/* Recording animation styles */}
      <style>{`
        @keyframes pulse-recording {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.3);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          75%, 100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {/* Main Content Area */}
        <div className="xl:col-span-2 flex flex-col gap-5 lg:gap-7.5">
          {/* Upload Card */}
          <div className="card shadow-sm">
            <div className="card-header border-b-0 py-5">
              <h3 className="card-title flex items-center gap-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <KeenIcon icon="cloud-add" className="text-xl text-primary" />
                </span>
                <span>Upload Audio</span>
              </h3>
            </div>
            <div className="card-body pt-0">
              <AudioInput
                value={audioFiles}
                onChange={handleAudioChange}
                multiple={false}
                maxNumber={1}
                acceptType={[
                  'audio/mpeg',
                  'audio/wav',
                  'audio/m4a',
                  'audio/mp3',
                  'audio/*',
                ]}
              >
                {({
                  fileList,
                  onAudioUpload,
                  onAudioRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="flex flex-col gap-4">
                    <div
                      {...dragProps}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group ${
                        isDragging
                          ? 'border-primary bg-primary/5 scale-[1.02]'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      onClick={onAudioUpload}
                    >
                      <div
                        className={`flex flex-col items-center transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}
                      >
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
                            isDragging
                              ? 'bg-primary/20'
                              : 'bg-gray-100 group-hover:bg-primary/10'
                          }`}
                        >
                          <KeenIcon
                            icon="cloud-add"
                            className={`text-3xl transition-colors duration-200 ${
                              isDragging
                                ? 'text-primary'
                                : 'text-gray-400 group-hover:text-primary'
                            }`}
                          />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">
                          {isDragging
                            ? 'Drop your file here'
                            : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500">
                          MP3, WAV, M4A or other audio formats • Max 10MB
                        </p>
                      </div>
                    </div>

                    {/* Or Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-sm text-gray-400 font-medium">
                        or record
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Recording Button */}
                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={toggleRecording}
                        disabled={uploading || transcribing}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                          isRecording
                            ? 'bg-red-500 shadow-lg shadow-red-500/50'
                            : 'bg-red-500 hover:bg-red-600 hover:scale-105 shadow-lg shadow-red-500/30'
                        }`}
                        style={{
                          animation: isRecording
                            ? 'pulse-recording 1.5s ease-in-out infinite'
                            : 'none',
                        }}
                      >
                        {/* Pulse rings when recording */}
                        {isRecording && (
                          <>
                            <span
                              className="absolute inset-0 rounded-full bg-red-500 opacity-75"
                              style={{
                                animation:
                                  'ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                              }}
                            />
                            <span
                              className="absolute inset-0 rounded-full bg-red-500 opacity-50"
                              style={{
                                animation:
                                  'ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s',
                              }}
                            />
                          </>
                        )}

                        {/* Button content */}
                        <div
                          className={`relative z-10 transition-all duration-200 ${
                            isRecording
                              ? 'w-6 h-6 bg-white rounded-sm'
                              : 'w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'
                          }`}
                        >
                          {!isRecording && (
                            <div className="w-4 h-4 rounded-full bg-white" />
                          )}
                        </div>
                      </button>

                      {/* Recording status */}
                      <div className="text-center">
                        {isRecording ? (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-600 font-semibold">
                              Recording {formatRecordingTime(recordingTime)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Click to start recording
                          </span>
                        )}
                      </div>
                    </div>

                    {fileList.length > 0 && fileList[0].file && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20">
                          <KeenIcon
                            icon="speaker"
                            className="text-xl text-primary"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {fileList[0].file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(fileList[0].file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onAudioRemove(0)}
                          disabled={uploading || transcribing}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <KeenIcon icon="cross" className="text-sm" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleUploadAndTranscribe}
                      disabled={!audioFiles.length || uploading || transcribing}
                      className="btn btn-primary btn-lg w-full gap-2 shadow-lg shadow-primary/25 disabled:shadow-none"
                    >
                      {uploading || transcribing ? (
                        <>
                          <span className="animate-spin">
                            <KeenIcon icon="arrows-loop" className="text-lg" />
                          </span>
                          {uploading ? 'Uploading...' : 'Transcribing...'}
                        </>
                      ) : (
                        <>
                          <KeenIcon icon="speaker" className="text-lg" />
                          Transcribe Audio
                        </>
                      )}
                    </button>
                  </div>
                )}
              </AudioInput>
            </div>
          </div>

          {/* Transcription Result */}
          {transcription && (
            <div className="card shadow-sm animate-fadeIn">
              <div className="card-header py-5">
                <h3 className="card-title flex items-center gap-2">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
                    <KeenIcon
                      icon="document"
                      className="text-xl text-success"
                    />
                  </span>
                  <span>Transcription Result</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm btn-light gap-1.5"
                    onClick={handleCopyTranscription}
                  >
                    <KeenIcon icon="copy" className="text-sm" />
                    Copy
                  </button>
                  {selectedTranscription && (
                    <button
                      className="btn btn-sm btn-light text-danger hover:bg-danger hover:text-white gap-1.5"
                      onClick={() =>
                        handleDeleteTranscription(selectedTranscription.id)
                      }
                    >
                      <KeenIcon icon="trash" className="text-sm" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="bg-gray-50 rounded-xl p-5 mb-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {transcription}
                  </p>
                </div>
                {selectedTranscription && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <KeenIcon icon="file" className="text-gray-500" />
                      <span className="text-gray-700">
                        {selectedTranscription.fileName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <KeenIcon icon="folder" className="text-gray-500" />
                      <span className="text-gray-700">
                        {formatFileSize(selectedTranscription.fileSize)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <KeenIcon icon="calendar" className="text-gray-500" />
                      <span className="text-gray-700">
                        {formatDate(selectedTranscription.timestamp)}
                      </span>
                    </div>
                    {selectedTranscription.duration && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                        <KeenIcon icon="time" className="text-gray-500" />
                        <span className="text-gray-700">
                          {selectedTranscription.duration.toFixed(1)}s
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State when no transcription */}
          {!transcription && !audioFiles.length && (
            <div className="card shadow-sm bg-gradient-to-br from-gray-50 to-white">
              <div className="card-body py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <KeenIcon icon="notepad" className="text-4xl text-gray-300" />
                </div>
                <h4 className="text-gray-600 font-medium mb-2">
                  No transcription yet
                </h4>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Upload an audio file above to get started. Your transcription
                  will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* History Sidebar - Desktop */}
        <div className="hidden xl:block">
          <div className="card shadow-sm sticky top-5">
            <div className="card-header py-5">
              <h3 className="card-title flex items-center gap-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/10">
                  <KeenIcon icon="time" className="text-xl text-info" />
                </span>
                <span>History</span>
              </h3>
              {transcriptions.length > 0 && (
                <span className="badge badge-sm badge-light">
                  {transcriptions.length}
                </span>
              )}
            </div>
            <div className="card-body">
              {transcriptions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <KeenIcon
                      icon="archive"
                      className="text-xl text-gray-400"
                    />
                  </div>
                  <p className="text-gray-500 text-sm">No history yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
                  {transcriptions.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTranscription(t)}
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTranscription?.id === t.id
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <KeenIcon
                            icon="speaker"
                            className={`text-sm flex-shrink-0 ${
                              selectedTranscription?.id === t.id
                                ? 'text-white/70'
                                : 'text-gray-400'
                            }`}
                          />
                          <span
                            className={`font-medium truncate text-sm ${
                              selectedTranscription?.id === t.id
                                ? 'text-white'
                                : 'text-gray-800'
                            }`}
                          >
                            {t.fileName}
                          </span>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteTranscription(t.id);
                          }}
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            selectedTranscription?.id === t.id
                              ? 'bg-white/20 hover:bg-white/30 text-white'
                              : 'bg-transparent hover:bg-red-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <KeenIcon icon="trash" className="text-xs" />
                        </button>
                      </div>
                      <p
                        className={`text-xs mb-2 ${
                          selectedTranscription?.id === t.id
                            ? 'text-white/70'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatDate(t.timestamp)} • {formatFileSize(t.fileSize)}
                      </p>
                      <p
                        className={`text-sm leading-relaxed line-clamp-3 ${
                          selectedTranscription?.id === t.id
                            ? 'text-white/90'
                            : 'text-gray-600'
                        }`}
                      >
                        {truncateText(t.text)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile History Toggle & Panel */}
        <div className="xl:hidden">
          {transcriptions.length > 0 && (
            <>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full btn btn-light gap-2 justify-between"
              >
                <span className="flex items-center gap-2">
                  <KeenIcon icon="time" />
                  History ({transcriptions.length})
                </span>
                <KeenIcon
                  icon="down"
                  className={`transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`}
                />
              </button>

              {showHistory && (
                <div className="card shadow-sm mt-4 animate-fadeIn">
                  <div className="card-body p-4">
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                      {transcriptions.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            handleSelectTranscription(t);
                            setShowHistory(false);
                          }}
                          className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedTranscription?.id === t.id
                              ? 'bg-primary text-white shadow-lg shadow-primary/25'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <KeenIcon
                                icon="speaker"
                                className={`text-sm flex-shrink-0 ${
                                  selectedTranscription?.id === t.id
                                    ? 'text-white/70'
                                    : 'text-gray-400'
                                }`}
                              />
                              <span
                                className={`font-medium truncate text-sm ${
                                  selectedTranscription?.id === t.id
                                    ? 'text-white'
                                    : 'text-gray-800'
                                }`}
                              >
                                {t.fileName}
                              </span>
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteTranscription(t.id);
                              }}
                              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                selectedTranscription?.id === t.id
                                  ? 'bg-white/20 hover:bg-white/30 text-white'
                                  : 'bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <KeenIcon icon="trash" className="text-xs" />
                            </button>
                          </div>
                          <p
                            className={`text-xs mb-2 ${
                              selectedTranscription?.id === t.id
                                ? 'text-white/70'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatDate(t.timestamp)} •{' '}
                            {formatFileSize(t.fileSize)}
                          </p>
                          <p
                            className={`text-sm leading-relaxed line-clamp-2 ${
                              selectedTranscription?.id === t.id
                                ? 'text-white/90'
                                : 'text-gray-600'
                            }`}
                          >
                            {truncateText(t.text, 80)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { WhisperTranscriptionContent };
