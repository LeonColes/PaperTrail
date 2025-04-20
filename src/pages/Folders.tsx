import React, { useEffect, useState } from 'react';
import { View, Button, Text, Skeleton, useTheme, Card, ScrollArea } from 'reshaped';
import { ArrowLeft, Folder, File, Download } from 'react-feather';

interface FolderData {
  id: string;
  name: string;
  fileCount: number;
  createdDate: string;
  files?: FileData[];
}

interface FileData {
  id: string;
  name: string;
  size: string;
  modifiedDate?: string;
  uploadDate?: string;
  type?: string;
}

const Folders: React.FC = () => {
  const { colorMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [folder, setFolder] = useState<FolderData | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    // 检查URL参数，加载特定文件夹内容
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const folderId = urlParams.get('id');

    if (!folderId) {
      // 没有文件夹ID，返回主页
      window.location.hash = '/';
      return;
    }

    setLoading(true);

    // 模拟加载文件夹数据
    setTimeout(() => {
      // 预设的文件夹数据
      const folderData = {
        '1': {
          id: '1',
          name: '数据结构',
          fileCount: 15,
          createdDate: '2025-04-18',
          files: [
            { id: 'f1', name: '排序算法实现.docx', size: '1.2 MB', modifiedDate: '2025-04-18', type: 'document' },
            { id: 'f2', name: '二叉树笔记.pdf', size: '2.4 MB', modifiedDate: '2025-04-16', type: 'pdf' },
            { id: 'f3', name: '图论作业.docx', size: '0.8 MB', modifiedDate: '2025-04-15', type: 'document' },
            { id: 'f4', name: '算法复杂度分析.pptx', size: '3.5 MB', modifiedDate: '2025-04-12', type: 'presentation' },
            { id: 'f5', name: '期中考试复习.docx', size: '1.1 MB', modifiedDate: '2025-04-10', type: 'document' }
          ]
        },
        '2': {
          id: '2',
          name: '操作系统',
          fileCount: 8,
          createdDate: '2025-04-15',
          files: [
            { id: 'f6', name: '进程调度算法.docx', size: '1.3 MB', modifiedDate: '2025-04-15', type: 'document' },
            { id: 'f7', name: '内存管理.pdf', size: '2.2 MB', modifiedDate: '2025-04-14', type: 'pdf' },
            { id: 'f8', name: '线程同步.docx', size: '0.9 MB', modifiedDate: '2025-04-12', type: 'document' }
          ]
        },
        '3': {
          id: '3',
          name: '前端开发',
          fileCount: 12,
          createdDate: '2025-04-10',
          files: [
            { id: 'f9', name: 'React组件设计.docx', size: '1.4 MB', modifiedDate: '2025-04-10', type: 'document' },
            { id: 'f10', name: 'CSS布局技巧.pdf', size: '1.8 MB', modifiedDate: '2025-04-08', type: 'pdf' },
            { id: 'f11', name: 'JavaScript高级特性.pptx', size: '2.7 MB', modifiedDate: '2025-04-05', type: 'presentation' },
            { id: 'f12', name: '响应式设计实践.docx', size: '1.2 MB', modifiedDate: '2025-04-01', type: 'document' }
          ]
        }
      };

      const selectedFolder = folderData[folderId as keyof typeof folderData];

      if (selectedFolder) {
        setFolder(selectedFolder);
        setLoading(false);
        // 模拟文件加载
        if (selectedFolder.files && selectedFolder.files.length > 0) {
          setFileLoading(true);
          setTimeout(() => {
            setFileLoading(false);
          }, 500);
        }
      } else {
        setErrorMessage('找不到指定的文件夹');
        setLoading(false);
      }
    }, 800);
  }, []);

  const handleBack = () => {
    window.location.hash = '/';
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    if (['pdf'].includes(extension || '')) {
      return <File size={16} color="#f40f02" />;
    }
    if (['doc', 'docx'].includes(extension || '')) {
      return <File size={16} color="#295498" />;
    }
    if (['xls', 'xlsx'].includes(extension || '')) {
      return <File size={16} color="#207245" />;
    }
    if (['ppt', 'pptx'].includes(extension || '')) {
      return <File size={16} color="#d24625" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || '')) {
      return <File size={16} color="#36B37E" />;
    }

    return <File size={16} />;
  };

  const handleDownloadFile = (fileId: string) => {
    // 实现文件下载逻辑
    console.log('Downloading file:', fileId);
    alert('开始下载文件...');
  };

  return (
    <View direction="column" gap={4}>
      {/* 顶部导航栏 */}
      <View direction="row" justify="space-between" align="center">
        <View direction="row" gap={3} align="center">
          <Button
            variant="ghost"
            color="neutral"
            icon={<ArrowLeft />}
            onClick={handleBack}
          />
          <View direction="row" align="center" gap={2}>
            <Folder size={20} color={
              folder?.id === '1'
                ? '#1890ff'
                : folder?.id === '2'
                  ? '#52c41a'
                  : '#faad14'
            } />
            <Text weight="bold">{folder ? folder.name : '文件管理'}</Text>
          </View>
          {folder && folder.files && (
            <Text color="neutral">共 {folder.files.length} 个文件</Text>
          )}
        </View>
      </View>

      {/* 内容区域 */}
      {loading ? (
        <Card>
          <View direction="column" gap={3} padding={4}>
            <Skeleton width="100%" height={40} />
            <Skeleton width="100%" height={40} />
            <Skeleton width="100%" height={40} />
            <Skeleton width="100%" height={40} />
          </View>
        </Card>
      ) : errorMessage ? (
        <Card padding={4}>
          <View direction="column" gap={2} align="center">
            <Text color="critical">{errorMessage}</Text>
          </View>
        </Card>
      ) : folder ? (
        fileLoading ? (
          <Card>
            <View direction="column" gap={3} padding={4}>
              <Skeleton width="100%" height={40} />
              <Skeleton width="100%" height={40} />
              <Skeleton width="100%" height={40} />
            </View>
          </Card>
        ) : folder.files && folder.files.length > 0 ? (
          <View direction="column" gap={2}>
            {folder.files.map((file) => (
              <Card key={file.id} padding={3}>
                <View direction="row" align="center" justify="space-between">
                  <View direction="row" gap={2} align="center">
                    {getFileIcon(file.name)}
                    <View direction="column">
                      <Text weight="medium">{file.name}</Text>
                      <Text color="neutral">{file.size} • {file.modifiedDate || file.uploadDate}</Text>
                    </View>
                  </View>
                  <Button
                    variant="ghost"
                    color="neutral"
                    onClick={() => handleDownloadFile(file.id)}
                    icon={<Download />}
                  />
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card>
            <View direction="column" gap={4} align="center" padding={6}>
              <View attributes={{ style: { fontSize: '48px', opacity: 0.7 } }}>📄</View>
              <Text>此文件夹为空</Text>
              <Button color="primary" onClick={() => alert('上传文件功能暂未实现')}>
                上传文件
              </Button>
            </View>
          </Card>
        )
      ) : null}
    </View>
  );
};

export default Folders; 