import React, { useState } from 'react';
import { View, Button, Text, useTheme, Badge } from 'reshaped';
import { X, FolderPlus, AlertCircle } from 'react-feather';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
  existingFolders?: string[]; // 用于检查名称是否重复
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  existingFolders = []
}) => {
  const { colorMode } = useTheme();
  const [folderName, setFolderName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateFolder = () => {
    if (folderName.trim() === '') {
      setErrorMessage('文件夹名称不能为空');
      return;
    }

    // 检查文件夹名称是否已存在
    if (existingFolders.includes(folderName.trim())) {
      setErrorMessage('文件夹名称已存在');
      return;
    }

    onCreateFolder(folderName.trim());
    setFolderName('');
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
        width="400px"
        attributes={{
          style: {
            backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <View direction="row" justify="space-between" align="center">
          <View direction="row" gap={2} align="center">
            <FolderPlus size={20} color={colorMode === 'light' ? '#1890ff' : '#4da6ff'} />
            <Text weight="bold">新建文件夹</Text>
          </View>
          <Button
            variant="ghost"
            size="small"
            icon={<X />}
            color="neutral"
            onClick={onClose}
          />
        </View>

        {errorMessage && (
          <View
            direction="row"
            gap={2}
            align="center"
            padding={3}
            attributes={{
              style: {
                backgroundColor: colorMode === 'light' ? '#fff1f0' : '#2a1215',
                border: '1px solid',
                borderColor: colorMode === 'light' ? '#ffccc7' : '#5c2223',
                borderRadius: '4px'
              }
            }}
          >
            <AlertCircle size={16} color="#ff4d4f" />
            <Text color="critical">{errorMessage}</Text>
          </View>
        )}

        <View direction="column" gap={2}>
          <Text>文件夹名称</Text>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="请输入文件夹名称"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: colorMode === 'light' ? '#ddd' : '#444',
              backgroundColor: colorMode === 'light' ? '#fff' : '#333',
              color: colorMode === 'light' ? '#333' : '#fff',
              width: '100%'
            }}
            autoFocus
          />
        </View>

        <View direction="row" gap={2} justify="end">
          <Button
            color="neutral"
            onClick={() => {
              setFolderName('');
              setErrorMessage(null);
              onClose();
            }}
          >
            取消
          </Button>
          <Button
            color="primary"
            onClick={handleCreateFolder}
          >
            创建
          </Button>
        </View>
      </View>
    </div>
  );
};

export default NewFolderModal; 