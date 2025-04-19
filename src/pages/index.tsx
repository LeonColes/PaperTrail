import React, { useState, useEffect } from 'react';
import { View, Button, Text, Container, useTheme, Card, Modal } from 'reshaped';
import {
  FileText, Upload, Folder, Clipboard, Settings,
  Search, Star, Clock, Plus, Filter, Trash2, Download, Edit2
} from 'react-feather';

const Index: React.FC = () => {
  const { colorMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  // 获取上传的文件
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载文件数据
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // 从localStorage获取上传的文件
      const savedFiles = localStorage.getItem('uploadedFiles');
      let initialFiles: any[] = [];

      if (savedFiles) {
        try {
          const parsedFiles = JSON.parse(savedFiles);
          // 转换格式
          initialFiles = parsedFiles.filter((file: any) => file.status === 'success').map((file: any) => ({
            id: file.name + Date.now().toString(),
            name: file.name,
            size: file.size,
            formattedSize: formatFileSize(file.size),
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
          { id: '1', name: '公司培训材料.pptx', size: 2.8 * 1024 * 1024, formattedSize: '2.8 MB', modifiedDate: '2023-11-22', type: 'presentation' },
          { id: '2', name: '项目进度报告.xlsx', size: 1.4 * 1024 * 1024, formattedSize: '1.4 MB', modifiedDate: '2023-11-20', type: 'spreadsheet' },
          { id: '3', name: '会议纪要.docx', size: 0.9 * 1024 * 1024, formattedSize: '0.9 MB', modifiedDate: '2023-11-18', type: 'document' }
        ];
      }

      setFiles(initialFiles);
      setLoading(false);
    }, 800);
  }, []);

  // 文档分类
  const categories = [
    { name: '全部文档', icon: <Clipboard size={20} />, count: files.length },
    { name: '已收藏', icon: <Star size={20} />, count: 2 },
    { name: '最近查看', icon: <Clock size={20} />, count: 4 },
  ];

  // 处理文件删除
  const handleDelete = (fileId: string) => {
    setFileToDelete(fileId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      const newFiles = files.filter(file => file.id !== fileToDelete);
      setFiles(newFiles);

      // 更新localStorage
      const updatedFiles = newFiles.map(file => ({
        name: file.name,
        size: file.size,
        status: 'success'
      }));
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));

      setShowDeleteDialog(false);
      setFileToDelete(null);
    }
  };

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
    <View height="100%">
      <div style={{ display: 'flex', height: '100%' }}>
        {/* 左侧导航栏 */}
        <div style={{
          width: '240px',
          padding: '16px 8px',
          borderRight: `1px solid ${colorMode === 'light' ? '#eaeaea' : '#333'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ fontWeight: 'bold' }}>我的文档</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {categories.map((category, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: index === activeCategory
                    ? colorMode === 'light' ? '#e6f7ff' : '#133152'
                    : 'transparent',
                  color: index === activeCategory
                    ? colorMode === 'light' ? '#1890ff' : '#4da6ff'
                    : colorMode === 'light' ? '#333' : '#f5f5f5'
                }}
                onClick={() => setActiveCategory(index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {React.cloneElement(category.icon, {
                    color: index === activeCategory
                      ? colorMode === 'light' ? '#1890ff' : '#4da6ff'
                      : colorMode === 'light' ? '#666' : '#aaa'
                  })}
                  <div>{category.name}</div>
                </div>
                <div style={{ color: colorMode === 'light' ? '#8c8c8c' : '#aaa' }}>
                  {category.count}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', fontWeight: 'bold' }}>快速访问</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button
              color="primary"
              icon={<FileText />}
              onClick={() => window.location.hash = '/files'}
              fullWidth
              className="text-left"
            >
              文件列表
            </Button>

            <Button
              color="primary"
              icon={<Upload />}
              onClick={() => window.location.hash = '/upload'}
              fullWidth
              className="text-left"
            >
              上传文件
            </Button>

            <Button
              color="neutral"
              icon={<Folder />}
              onClick={() => window.location.hash = '/folders'}
              fullWidth
              className="text-left"
            >
              文件夹管理
            </Button>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div style={{
          flex: 1,
          padding: '16px 24px',
          overflowY: 'auto'
        }}>
          {/* 操作栏 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              {categories[activeCategory].name}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              {/* 搜索框 */}
              <div style={{
                position: 'relative',
                width: '240px'
              }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
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

              <Button
                color="neutral"
                variant="ghost"
                icon={<Filter />}
              />

              <Button
                color="primary"
                icon={<Upload />}
                onClick={() => window.location.hash = '/upload'}
              >
                上传
              </Button>

              <Button
                color="primary"
                variant="ghost"
                icon={<Plus />}
                onClick={() => alert("创建新文件夹")}
              >
                新建
              </Button>
            </div>
          </div>

          {/* 文件列表 */}
          <Card padding={0}>
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`
            }}>
              <Text weight="medium">所有文件 ({filteredFiles.length})</Text>
            </div>

            {loading ? (
              <View direction="column" gap={3} padding={4}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View key={i} direction="row" gap={2} align="center">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      backgroundColor: colorMode === 'light' ? '#f0f0f0' : '#333',
                    }} />
                    <View direction="column" gap={1} grow>
                      <div style={{
                        height: '16px',
                        width: '60%',
                        borderRadius: '4px',
                        backgroundColor: colorMode === 'light' ? '#f0f0f0' : '#333',
                      }} />
                      <div style={{
                        height: '12px',
                        width: '30%',
                        borderRadius: '4px',
                        backgroundColor: colorMode === 'light' ? '#f0f0f0' : '#333',
                      }} />
                    </View>
                    <div style={{
                      height: '32px',
                      width: '80px',
                      borderRadius: '4px',
                      backgroundColor: colorMode === 'light' ? '#f0f0f0' : '#333',
                    }} />
                  </View>
                ))}
              </View>
            ) : filteredFiles.length === 0 ? (
              <div style={{
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
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
              </div>
            ) : (
              <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
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
                      backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
                      transition: 'background-color 0.2s',
                      cursor: 'pointer'
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
                        <div style={{
                          fontSize: '12px',
                          color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9'
                        }}>
                          {file.formattedSize}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9'
                        }}>
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
                        onClick={() => handleDelete(file.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 文件夹部分 */}
          <div style={{ marginTop: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                我的文件夹
              </div>
              <Button
                color="primary"
                variant="ghost"
                size="small"
                icon={<Plus />}
                onClick={() => alert("创建新文件夹")}
              >
                新建文件夹
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {['文档', '照片', '项目'].map((name, index) => (
                <Card
                  key={index}
                  padding={4}
                  onClick={() => window.location.hash = '/folders'}
                >
                  <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Folder size={24} color={
                        index === 0
                          ? '#1890ff'
                          : index === 1
                            ? '#52c41a'
                            : '#faad14'
                      } />
                      <div style={{ fontWeight: 'bold' }}>{name}</div>
                    </div>
                    <div style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9'
                      }}>
                        {index === 0 ? '12个文件' : index === 1 ? '35个文件' : '8个文件'}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9'
                      }}>
                        {index === 0 ? '2天前' : index === 1 ? '1周前' : '3天前'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteDialog && (
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
          <div
            style={{
              width: '400px',
              backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            }}
          >
            <View direction="column" gap={4} padding={4}>
              <Text weight="bold">确认删除</Text>
              <Text>您确定要删除这个文件吗？此操作无法撤销。</Text>

              <View direction="row" gap={2} justify="end">
                <Button onClick={() => setShowDeleteDialog(false)} color="neutral">
                  取消
                </Button>
                <Button onClick={confirmDelete} color="critical">
                  删除
                </Button>
              </View>
            </View>
          </div>
        </div>
      )}
    </View>
  );
};

export default Index;