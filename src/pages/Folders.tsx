import React, { useEffect, useState } from 'react';
import { View, Button, Text, Skeleton, useTheme } from 'reshaped';
import { ArrowLeft, Folder, FolderPlus, Edit2, Trash2 } from 'react-feather';

interface FolderData {
  id: string;
  name: string;
  fileCount: number;
  createdDate: string;
}

const Folders: React.FC = () => {
  const { colorMode } = useTheme();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    // 模拟异步加载
    setTimeout(() => {
      setFolders([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleNewFolder = () => {
    if (newFolderName.trim() === '') return;

    const newFolder: FolderData = {
      id: Date.now().toString(),
      name: newFolderName,
      fileCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolder(false);
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
          <Text>文件夹管理</Text>
        </View>
        <Button
          color="primary"
          icon={<FolderPlus />}
          onClick={() => setShowNewFolder(true)}
        >
          新建文件夹
        </Button>
      </View>

      {showNewFolder && (
        <div style={{
          padding: '16px',
          backgroundColor: colorMode === 'light' ? '#f5f5f5' : '#2a2a2a',
          borderRadius: '8px'
        }}>
          <View direction="column" gap={2}>
            <div>
              <Text>新建文件夹</Text>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="文件夹名称"
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: colorMode === 'light' ? '#ddd' : '#444',
                  backgroundColor: colorMode === 'light' ? '#fff' : '#333',
                  color: colorMode === 'light' ? '#333' : '#fff',
                  flex: 1
                }}
              />
              <Button
                color="primary"
                onClick={handleNewFolder}
              >
                创建
              </Button>
              <Button
                color="neutral"
                onClick={() => setShowNewFolder(false)}
              >
                取消
              </Button>
            </div>
          </View>
        </div>
      )}

      <div style={{
        backgroundColor: colorMode === 'light' ? '#f5f5f5' : '#2a2a2a',
        borderRadius: '8px',
        padding: '16px'
      }}>
        {loading ? (
          <View direction="column" gap={2}>
            <Skeleton height={20} width="100%" />
            <View direction="column" gap={1}>
              <Skeleton height={20} width="100%" />
              <Skeleton height={20} width="100%" />
              <Skeleton height={20} width="100%" />
            </View>
          </View>
        ) : folders.length === 0 ? (
          <View direction="column" gap={4} align="center" padding={6}>
            <Text>暂无文件夹</Text>
            <Button
              color="primary"
              icon={<FolderPlus />}
              onClick={() => setShowNewFolder(true)}
            >
              新建文件夹
            </Button>
          </View>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid',
                borderColor: colorMode === 'light' ? '#ddd' : '#444'
              }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>文件夹名</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>文件数量</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>创建日期</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {folders.map(folder => (
                <tr key={folder.id} style={{
                  borderBottom: '1px solid',
                  borderColor: colorMode === 'light' ? '#eee' : '#333'
                }}>
                  <td style={{ padding: '12px' }}>
                    <View direction="row" gap={2} align="center">
                      <Folder size={16} />
                      <div>
                        <Text>{folder.name}</Text>
                      </div>
                    </View>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Text>{folder.fileCount}</Text>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Text>{folder.createdDate}</Text>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <View direction="row" gap={2} justify="end">
                      <Button
                        color="neutral"
                        icon={<Edit2 />}
                        onClick={() => console.log('编辑', folder.id)}
                      />
                      <Button
                        color="critical"
                        icon={<Trash2 />}
                        onClick={() => console.log('删除', folder.id)}
                      />
                    </View>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </View>
  );
};

export default Folders; 