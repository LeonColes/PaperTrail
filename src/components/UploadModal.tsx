import React, { useRef, useState, useEffect } from 'react';
import { View, Button, Text, Modal, useTheme, Badge, Select } from 'reshaped';
import { X, Upload, Check, AlertCircle, Folder, ChevronDown } from 'react-feather';

interface FolderOption {
  id: string;
  name: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
  folderOptions?: FolderOption[];
}

interface UploadedFile {
  name: string;
  size: number;
  status: 'success' | 'error' | 'uploading';
  progress: number;
  folderId?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadComplete, folderOptions = [] }) => {
  const { colorMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [selectedFolderName, setSelectedFolderName] = useState<string>("默认位置");

  // 当上传组件关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setUploadedFiles([]);
      setUploading(false);
      setDragActive(false);
    }
  }, [isOpen]);

  // 当uploadedFiles更新时，保存到localStorage
  useEffect(() => {
    // 只有当有文件且不是全都在上传中时才保存
    if (uploadedFiles.length > 0 && uploadedFiles.some(file => file.status !== 'uploading')) {
      // 读取之前保存的文件
      const previousFiles = localStorage.getItem('uploadedFiles');
      let newFilesList = [...uploadedFiles];

      if (previousFiles) {
        try {
          const parsedFiles = JSON.parse(previousFiles);

          // 过滤掉当前上传列表中的文件，避免重复
          const existingFileNames = uploadedFiles.map(f => f.name);
          const uniquePreviousFiles = parsedFiles.filter(
            (file: any) => !existingFileNames.includes(file.name)
          );

          // 合并之前保存的文件（排除当前上传的）和新上传的文件
          newFilesList = [...uniquePreviousFiles, ...uploadedFiles
            .filter(f => f.status === 'success')
            .map(f => ({
              ...f,
              folderId: selectedFolder || undefined
            }))
          ];
        } catch (error) {
          console.error('解析之前保存的文件失败', error);
        }
      }

      localStorage.setItem('uploadedFiles', JSON.stringify(newFilesList));

      // 如果所有文件都已上传完成，通知父组件
      if (uploadedFiles.every(f => f.status !== 'uploading') && onUploadComplete) {
        onUploadComplete();
      }
    }
  }, [uploadedFiles, onUploadComplete, selectedFolder]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      handleFiles(filesArray);
    }
  };

  const handleFiles = (files: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newUploadFiles: UploadedFile[] = files.map(file => ({
      name: file.name,
      size: file.size,
      status: 'uploading' as const,
      progress: 0,
      folderId: selectedFolder || undefined
    }));

    setUploadedFiles(prev => [...prev, ...newUploadFiles]);

    // 模拟自动开始上传
    simulateUpload(newUploadFiles);
  };

  const simulateUpload = (filesToUpload: typeof uploadedFiles) => {
    setUploading(true);

    // 为每个文件创建一个模拟上传进度
    filesToUpload.forEach((file, index) => {
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => {
          const updated = [...prev];
          const fileIndex = prev.findIndex(f => f.name === file.name && f.progress === updated[prev.length - filesToUpload.length + index].progress);

          if (fileIndex !== -1) {
            if (updated[fileIndex].progress >= 100) {
              clearInterval(uploadInterval);
              updated[fileIndex].status = Math.random() > 0.9 ? 'error' : 'success';
              updated[fileIndex].progress = 100;

              // 如果所有文件都上传完成，设置uploading为false
              if (updated.every(f => f.progress === 100)) {
                setUploading(false);
              }
            } else {
              updated[fileIndex].progress += Math.floor(Math.random() * 10) + 1;
              if (updated[fileIndex].progress > 100) updated[fileIndex].progress = 100;
            }
          }
          return updated;
        });
      }, 300 + Math.random() * 300);
    });
  };

  const handleRetry = (fileName: string) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      const fileIndex = prev.findIndex(f => f.name === fileName);

      if (fileIndex !== -1) {
        updated[fileIndex].status = 'uploading';
        updated[fileIndex].progress = 0;

        // 模拟重新上传
        const fileToRetry = [updated[fileIndex]];
        simulateUpload(fileToRetry);
      }
      return updated;
    });
  };

  const handleRemove = (fileName: string) => {
    // 从当前上传列表中移除
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.name !== fileName);
      return newFiles;
    });
    setSelectedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 修改文件夹选择处理函数
  const handleFolderChange = ({ value }: { value: string }) => {
    setSelectedFolder(value);

    // 更新选中的文件夹名称显示
    if (!value) {
      setSelectedFolderName("默认位置");
    } else {
      const folder = folderOptions.find(f => f.id === value);
      if (folder) {
        setSelectedFolderName(folder.name);
      }
    }
  };

  // 将文件夹选项转换为Select组件可用的格式
  const getFolderSelectOptions = () => {
    const options = [
      { value: "", label: "默认位置" },
      ...folderOptions.map(folder => ({
        value: folder.id,
        label: folder.name
      }))
    ];
    return options;
  };

  // 文件夹选择部分
  const renderFolderSelect = () => {
    if (folderOptions.length === 0) return null;

    return (
      <View direction="column" gap={2}>
        <Text>选择目标文件夹</Text>
        <Select
          name="folderSelect"
          placeholder="选择目标文件夹"
          value={selectedFolder}
          onChange={handleFolderChange}
          options={getFolderSelectOptions()}
          icon={<Folder size={16} />}
        />
      </View>
    );
  };

  return isOpen ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <View
        direction="column"
        gap={4}
        padding={4}
        width="600px"
        attributes={{
          style: {
            backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <View direction="row" justify="space-between" align="center">
          <Text weight="bold">上传文件</Text>
          <Button
            variant="ghost"
            size="small"
            icon={<X />}
            color="neutral"
            onClick={onClose}
          />
        </View>

        {renderFolderSelect()}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive
              ? colorMode === 'light' ? '#1890ff' : '#4da6ff'
              : colorMode === 'light' ? '#d9d9d9' : '#444'}`,
            borderRadius: '8px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            cursor: 'pointer',
            backgroundColor: dragActive
              ? colorMode === 'light' ? 'rgba(24, 144, 255, 0.05)' : 'rgba(77, 166, 255, 0.05)'
              : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFileSelect}
          />
          <Upload size={48} color={colorMode === 'light' ? '#1890ff' : '#4da6ff'} />
          <View direction="column" gap={1} attributes={{ style: { marginTop: '12px' } }}>
            <Text weight="medium">拖拽文件至此或点击上传</Text>
            <Text color="neutral" attributes={{ style: { fontSize: '0.875rem' } }}>支持单个或多个文件</Text>
          </View>
        </div>

        {uploadedFiles.length > 0 && (
          <View direction="column" gap={2}>
            <Text weight="medium">上传列表</Text>
            {uploadedFiles.map((file, index) => (
              <View
                key={file.name}
                direction="row"
                gap={2}
                align="center"
                justify="space-between"
                padding={3}
                attributes={{
                  style: {
                    border: `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`,
                    borderRadius: '8px',
                    backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
                  }
                }}
              >
                <View direction="row" gap={2} align="center" grow>
                  <View attributes={{
                    style: {
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }}>
                    {file.status === 'uploading' ? (
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: `2px solid ${colorMode === 'light' ? '#1890ff' : '#4da6ff'}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                    ) : file.status === 'success' ? (
                      <Check size={18} color="#52c41a" />
                    ) : (
                      <AlertCircle size={18} color="#ff4d4f" />
                    )}
                  </View>

                  <View direction="column" gap={1} grow>
                    <Text>{file.name}</Text>
                    <View direction="row" gap={2} align="center">
                      <Text color="neutral" attributes={{ style: { fontSize: '0.75rem' } }}>{formatFileSize(file.size)}</Text>
                      {file.status === 'uploading' && (
                        <Text color="neutral" attributes={{ style: { fontSize: '0.75rem' } }}>{file.progress}%</Text>
                      )}
                    </View>
                  </View>

                  {file.status === 'uploading' ? (
                    <div
                      style={{
                        height: '4px',
                        backgroundColor: colorMode === 'light' ? '#f0f0f0' : '#333',
                        borderRadius: '2px',
                        width: '60px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${file.progress}%`,
                          backgroundColor: '#1890ff',
                          borderRadius: '2px'
                        }}
                      />
                    </div>
                  ) : file.status === 'error' ? (
                    <Button
                      variant="ghost"
                      size="small"
                      color="primary"
                      onClick={() => handleRetry(file.name)}
                    >
                      重试
                    </Button>
                  ) : (
                    <Badge color="positive">已完成</Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="small"
                    color="neutral"
                    icon={<X size={16} />}
                    onClick={() => handleRemove(file.name)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        <View direction="row" gap={2} justify="end">
          <Button color="neutral" onClick={onClose}>
            取消
          </Button>
          <Button
            color="primary"
            disabled={uploading || uploadedFiles.length === 0}
            onClick={onClose}
          >
            完成
          </Button>
        </View>
      </View>
    </div>
  ) : null;
};

export default UploadModal; 