import React, { useEffect, useState } from 'react';
import { View, Button, Text, Skeleton, useTheme } from 'reshaped';
import { ArrowLeft, Upload, Trash2, Download, Edit2, Filter, Search } from 'react-feather';

interface FileData {
  id: string;
  name: string;
  size: string;
  modifiedDate: string;
  type: string;
}

const Files: React.FC = () => {
  const { colorMode } = useTheme();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    // 模拟异步加载
    setTimeout(() => {
      // 从localStorage获取上传的文件
      const savedFiles = localStorage.getItem('uploadedFiles');
      let initialFiles: FileData[] = [];

      if (savedFiles) {
        try {
          const parsedFiles = JSON.parse(savedFiles);
          // 转换格式
          initialFiles = parsedFiles.filter((file: any) => file.status === 'success').map((file: any) => ({
            id: file.name + Date.now().toString(),
            name: file.name,
            size: formatFileSize(file.size),
            modifiedDate: new Date().toISOString().split('T')[0],
            type: getFileType(file.name)
          }));
        } catch (error) {
          console.error('解析保存的文件失败', error);
        }
      }

      // 添加一些示例文件
      if (initialFiles.length === 0) {
        initialFiles = [
          { id: '1', name: '公司培训材料.pptx', size: '2.8 MB', modifiedDate: '2023-11-22', type: 'presentation' },
          { id: '2', name: '项目进度报告.xlsx', size: '1.4 MB', modifiedDate: '2023-11-20', type: 'spreadsheet' },
          { id: '3', name: '会议纪要.docx', size: '0.9 MB', modifiedDate: '2023-11-18', type: 'document' }
        ];
      }

      setFiles(initialFiles);
      setLoading(false);
    }, 800);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return 'document';
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return 'spreadsheet';
    } else if (['ppt', 'pptx'].includes(extension || '')) {
      return 'presentation';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else if (['zip', 'rar', '7z'].includes(extension || '')) {
      return 'archive';
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return 'audio';
    } else if (['mp4', 'mov', 'avi'].includes(extension || '')) {
      return 'video';
    }

    return 'other';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '📷';
      case 'document':
        return '📄';
      case 'spreadsheet':
        return '📊';
      case 'presentation':
        return '📑';
      case 'pdf':
        return '📕';
      case 'archive':
        return '📦';
      case 'audio':
        return '🎵';
      case 'video':
        return '🎬';
      default:
        return '📎';
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View direction="column" gap={4}>
      <View direction="row" justify="space-between" align="center">
        <View direction="row" gap={2} align="center">
          <Button
            color="neutral"
            icon={<ArrowLeft />}
            onClick={() => window.location.hash = '/'}
          />
          <Text>文件列表</Text>
        </View>
        <Button
          color="primary"
          icon={<Upload />}
          onClick={() => window.location.hash = '/upload'}
        >
          上传文件
        </Button>
      </View>

      {/* 搜索和筛选 */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          position: 'relative'
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            color: colorMode === 'light' ? '#8c8c8c' : '#aaa'
          }} />
          <input
            type="text"
            placeholder="搜索文件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: `1px solid ${colorMode === 'light' ? '#d9d9d9' : '#444'}`,
              backgroundColor: colorMode === 'light' ? '#fff' : '#2c2c2c',
              color: colorMode === 'light' ? '#333' : '#fff',
              width: '100%',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <Button
            color="neutral"
            variant={filterOpen ? "solid" : "ghost"}
            icon={<Filter />}
            onClick={() => setFilterOpen(!filterOpen)}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
        borderRadius: '8px',
        border: `1px solid ${colorMode === 'light' ? '#eaeaea' : '#333'}`,
        boxShadow: colorMode === 'light'
          ? '0 2px 8px rgba(0, 0, 0, 0.05)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <View direction="column" gap={3} padding={4}>
            <Skeleton height={24} width="40%" />
            <Skeleton height={1} width="100%" />

            <View direction="column" gap={3}>
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} direction="row" gap={2} align="center">
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colorMode === 'light' ? '#f0f0f0' : '#333',
                    fontSize: '18px',
                    color: colorMode === 'light' ? '#ccc' : '#555'
                  }}>
                    📄
                  </div>
                  <div style={{ flex: 1 }}>
                    <Skeleton height={16} width={`${Math.floor(40 + Math.random() * 40)}%`} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <Skeleton height={12} width="60px" />
                      <Skeleton height={12} width="80px" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '28px', height: '28px' }}>
                      <Skeleton height={28} width={28} />
                    </div>
                    <div style={{ width: '28px', height: '28px' }}>
                      <Skeleton height={28} width={28} />
                    </div>
                    <div style={{ width: '28px', height: '28px' }}>
                      <Skeleton height={28} width={28} />
                    </div>
                  </div>
                </View>
              ))}
            </View>
          </View>
        ) : filteredFiles.length === 0 ? (
          <View direction="column" gap={4} align="center" padding={6}>
            <div style={{ fontSize: '48px', opacity: 0.7 }}>📂</div>
            {searchTerm ? (
              <Text>未找到匹配的文件</Text>
            ) : (
              <>
                <Text>暂无文件</Text>
                <Button
                  color="primary"
                  icon={<Upload />}
                  onClick={() => window.location.hash = '/upload'}
                >
                  上传文件
                </Button>
              </>
            )}
          </View>
        ) : (
          <>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}` }}>
              <Text>共 {filteredFiles.length} 个文件</Text>
            </div>

            <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
              {filteredFiles.map((file, index) => (
                <div
                  key={file.id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: index < filteredFiles.length - 1
                      ? `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`
                      : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'background-color 0.2s',
                    backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorMode === 'light' ? '#f9f9f9' : '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorMode === 'light' ? '#fff' : '#1f1f1f';
                  }}
                >
                  <div style={{ fontSize: '24px', width: '32px', textAlign: 'center' }}>
                    {getFileIcon(file.type)}
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div>
                      <Text>{file.name}</Text>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '4px' }}>
                      <div style={{ fontSize: '12px', color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9' }}>
                        {file.size}
                      </div>
                      <div style={{ fontSize: '12px', color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9' }}>
                        {file.modifiedDate}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="ghost"
                      size="small"
                      color="primary"
                      icon={<Download />}
                      onClick={() => console.log('下载', file.id)}
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      color="neutral"
                      icon={<Edit2 />}
                      onClick={() => console.log('编辑', file.id)}
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      color="critical"
                      icon={<Trash2 />}
                      onClick={() => console.log('删除', file.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </View>
  );
};

export default Files; 