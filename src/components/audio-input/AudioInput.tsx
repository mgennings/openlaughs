import {
  ChangeEvent,
  DragEvent,
  FC,
  useCallback,
  useRef,
  useState,
} from 'react';
import React from 'react';

interface IAudioInputFile {
  dataURL?: string;
  file?: File;
  [key: string]: any;
}

type TAudioInputFiles = IAudioInputFile[];

interface IAudioInputProps {
  value: TAudioInputFiles;
  onChange: (value: TAudioInputFiles) => void;
  children?: (props: IAudioInputExport) => React.ReactNode;
  multiple?: boolean;
  maxNumber?: number;
  acceptType?: string[];
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

interface IAudioInputExport {
  fileList: TAudioInputFiles;
  onAudioUpload: () => void;
  onAudioRemoveAll: () => void;
  onAudioUpdate: (index: number) => void;
  onAudioRemove: (index: number) => void;
  isDragging: boolean;
  dragProps: {
    onDrop: (e: any) => void;
    onDragEnter: (e: any) => void;
    onDragLeave: (e: any) => void;
    onDragOver: (e: any) => void;
    onDragStart: (e: any) => void;
  };
}

export const DEFAULT_NULL_INDEX = -1;
export const DEFAULT_DATA_URL_KEY = 'dataURL';

const getAcceptTypeString = (acceptType?: string[]) => {
  if (acceptType?.length) return acceptType.join(', ');
  return 'audio/*';
};

const getBase64 = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return await new Promise(resolve => {
    reader.addEventListener('load', () => {
      resolve(String(reader.result));
    });
    reader.readAsDataURL(file);
  });
};

const getListFiles = async (
  files: FileList,
  dataURLKey: string,
): Promise<TAudioInputFiles> => {
  const promiseFiles: Array<Promise<string>> = [];
  for (let i = 0; i < files.length; i += 1) {
    promiseFiles.push(getBase64(files[i]));
  }
  return await Promise.all(promiseFiles).then((fileListBase64: string[]) => {
    const fileList: TAudioInputFiles = fileListBase64.map((base64, index) => ({
      [dataURLKey]: base64,
      file: files[index],
    }));
    return fileList;
  });
};

const openFileDialog = (
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
): void => {
  if (!inputRef.current) {
    return;
  }
  inputRef.current.click();
};

const AudioInput: FC<IAudioInputProps> = ({
  value,
  acceptType,
  inputProps,
  multiple,
  children,
  onChange,
}) => {
  const inValue = value || [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyUpdate, setKeyUpdate] = useState<number>(DEFAULT_NULL_INDEX);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onAudioRemoveAll = useCallback((): void => {
    onChange?.([]);
  }, [onChange]);

  const handleClickInput = useCallback(() => {
    openFileDialog(inputRef);
  }, [inputRef]);

  const onAudioUpload = useCallback((): void => {
    handleClickInput();
  }, [handleClickInput]);

  const onInputChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    await handleChange(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleChange = async (files: FileList | null) => {
    if (!files) return;
    const fileList = await getListFiles(files, DEFAULT_DATA_URL_KEY);
    if (!fileList.length) return;
    let updatedFileList: TAudioInputFiles;
    if (keyUpdate > DEFAULT_NULL_INDEX) {
      const [firstFile] = fileList;
      updatedFileList = [...inValue];
      updatedFileList[keyUpdate] = firstFile;
    } else if (multiple) {
      updatedFileList = [...inValue, ...fileList];
    } else {
      updatedFileList = [fileList[0]];
    }
    onChange?.(updatedFileList);
  };

  const onAudioRemove = (index: number | number[]): void => {
    const updatedList = [...inValue];
    if (Array.isArray(index)) {
      index.forEach(i => {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(index, 1);
    }
    onChange?.(updatedList);
  };

  const onAudioUpdate = (index: number): void => {
    setKeyUpdate(index);
    handleClickInput();
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleChange(e.dataTransfer.files);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.clearData();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptTypeString(acceptType)}
        multiple={multiple}
        onChange={e => {
          onInputChange(e);
        }}
        style={{ display: 'none' }}
        {...inputProps}
      />
      {children?.({
        fileList: inValue,
        onAudioUpload,
        onAudioRemove,
        onAudioUpdate,
        onAudioRemoveAll,
        dragProps: {
          onDrop: handleDrop,
          onDragEnter: handleDragIn,
          onDragLeave: handleDragOut,
          onDragOver: handleDrag,
          onDragStart: handleDragStart,
        },
        isDragging,
      })}
    </>
  );
};

export {
  AudioInput,
  type IAudioInputProps,
  type TAudioInputFiles,
  type IAudioInputFile,
};
