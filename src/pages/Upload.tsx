import React, { useRef, useState, useEffect } from 'react';
import { View, Button, Text, Skeleton, useTheme } from 'reshaped';
import { ArrowLeft, Upload, FileText, X, Check, AlertCircle, Info } from 'react-feather';

const UploadPage: React.FC = () => {
  const { colorMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, size: number, status: 'success' | 'error' | 'uploading', progress: number }[]>([]);
  const [dragActive, setDragActive] = useState(false);

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
          newFilesList = [...uniquePreviousFiles, ...uploadedFiles];
        } catch (error) {
          console.error('解析之前保存的文件失败', error);
        }
      }

      localStorage.setItem('uploadedFiles', JSON.stringify(newFilesList));
    }
  }, [uploadedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      handleFiles(filesArray);
    }
  };

  const handleFiles = (files: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newUploadFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      status: 'uploading' as const,
      progress: 0
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

    // 同时从localStorage中移除
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        const updatedFiles = parsedFiles.filter((file: any) => file.name !== fileName);
        localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      } catch (error) {
        console.error('从localStorage中移除文件失败', error);
      }
    }
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return '📷';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return '📄';
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return '📊';
    } else if (['ppt', 'pptx'].includes(extension || '')) {
      return '📑';
    } else if (['pdf'].includes(extension || '')) {
      return '📕';
    } else if (['zip', 'rar', '7z'].includes(extension || '')) {
      return '📦';
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return '🎵';
    } else if (['mp4', 'mov', 'avi'].includes(extension || '')) {
      return '🎬';
    }

    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 添加CSS到document.head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const goToFiles = () => {
    window.location.hash = '/files';
  };

  return (
    <View direction="column" gap={4}>
      <View direction="row" justify="space-between" align="center">
        <View direction="row" gap={2} align="center">
          <Button
            color="neutral"
            icon={<ArrowLeft />}
            onClick={() => window.location.hash = '/'}
          />
          <Text>上传文件</Text>
        </View>
        {uploadedFiles.some(file => file.status === 'success') && (
          <Button
            color="primary"
            variant="ghost"
            onClick={goToFiles}
          >
            查看已上传文件
          </Button>
        )}
      </View>

      <div
        style={{
          backgroundColor: dragActive
            ? colorMode === 'light' ? '#e6f7ff' : '#133152'
            : colorMode === 'light' ? '#f9f9f9' : '#2a2a2a',
          borderRadius: '8px',
          border: `2px dashed ${dragActive
            ? '#1890ff'
            : colorMode === 'light' ? '#d9d9d9' : '#444'}`,
          transition: 'all 0.3s',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={handleFileSelect}
        />

        <View direction="column" gap={2} align="center">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: colorMode === 'light' ? '#f0f5ff' : '#15395b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Upload size={32} color={colorMode === 'light' ? '#1890ff' : '#4da6ff'} />
          </div>

          <div>
            <Text>点击或拖放文件至此处</Text>
          </div>

          <div style={{ marginTop: '8px' }}>
            <Text color="neutral-faded">支持所有常见文件格式</Text>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Button color="primary">
              选择文件
            </Button>
          </div>
        </View>
      </div>

      {uploadedFiles.length > 0 && (
        <div style={{
          backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
          borderRadius: '8px',
          border: `1px solid ${colorMode === 'light' ? '#eaeaea' : '#333'}`,
          boxShadow: colorMode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.05)'
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <Text>上传列表 ({uploadedFiles.length}个文件)</Text>
            </div>
            {uploading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: colorMode === 'light' ? '#1890ff' : '#4da6ff'
              }}>
                <div className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid currentColor',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '14px' }}>正在上传...</span>
              </div>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 20px',
                  borderBottom: index < uploadedFiles.length - 1
                    ? `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '24px', width: '24px', textAlign: 'center' }}>
                  {getFileIcon(file.name)}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <div>
                      <Text>{file.name}</Text>
                    </div>
                    <div style={{
                      color: file.status === 'success'
                        ? '#52c41a'
                        : file.status === 'error'
                          ? '#ff4d4f'
                          : colorMode === 'light' ? '#8c8c8c' : '#d9d9d9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px'
                    }}>
                      {file.status === 'success' && (
                        <>
                          <Check size={14} />
                          <span>已完成</span>
                        </>
                      )}
                      {file.status === 'error' && (
                        <>
                          <AlertCircle size={14} />
                          <span>上传失败</span>
                        </>
                      )}
                      {file.status === 'uploading' && (
                        <>
                          <span>{file.progress}%</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9' }}>
                      {formatFileSize(file.size)}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {file.status === 'error' && (
                        <Button
                          variant="ghost"
                          size="small"
                          color="primary"
                          onClick={() => handleRetry(file.name)}
                        >
                          重试
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="small"
                        color="critical"
                        icon={<X size={14} />}
                        onClick={() => handleRemove(file.name)}
                      />
                    </div>
                  </div>

                  {file.status === 'uploading' && (
                    <div style={{
                      height: '4px',
                      backgroundColor: colorMode === 'light' ? '#f5f5f5' : '#333',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${file.progress}%`,
                        height: '100%',
                        backgroundColor: '#1890ff',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '16px 20px',
            borderTop: `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`,
            backgroundColor: colorMode === 'light' ? '#fafafa' : '#252525',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={16} color={colorMode === 'light' ? '#8c8c8c' : '#d9d9d9'} />
            <div>
              <Text color="neutral-faded">上传完成后，文件将自动显示在文件列表中</Text>
            </div>
          </div>
        </div>
      )}
    </View>
  );
};

export default UploadPage; 