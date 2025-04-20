import React, { useState, useEffect } from 'react';
import { View, Button, Text, Container, useTheme, Card, Modal, ScrollArea, Skeleton } from 'reshaped';
import {
  FileText, Upload, Folder, Clipboard,
  Search, Star, Clock, Plus, Filter, Trash2, Download, Edit2, AlertCircle
} from 'react-feather';
import UploadModal from '../components/UploadModal';
import NewFolderModal from '../components/NewFolderModal';

const Index: React.FC = () => {
  const { colorMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [folders, setFolders] = useState<{ id: string, name: string, fileCount: number, createdDate: string }[]>([]);

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

      // 添加一些示例文件，更新日期到2025年4月
      if (initialFiles.length === 0) {
        initialFiles = [
          { id: '1', name: '毕业设计-最终版.pptx', size: 3.5 * 1024 * 1024, formattedSize: '3.5 MB', modifiedDate: '2025-04-18', type: 'presentation' },
          { id: '2', name: '期末考试安排.xlsx', size: 1.8 * 1024 * 1024, formattedSize: '1.8 MB', modifiedDate: '2025-04-16', type: 'spreadsheet' },
          { id: '3', name: '会议纪要-0415.docx', size: 0.9 * 1024 * 1024, formattedSize: '0.9 MB', modifiedDate: '2025-04-15', type: 'document' },
          { id: '4', name: '课程大纲-2025春季.pdf', size: 2.2 * 1024 * 1024, formattedSize: '2.2 MB', modifiedDate: '2025-04-10', type: 'pdf' },
          { id: '5', name: '实验报告模板.docx', size: 0.7 * 1024 * 1024, formattedSize: '0.7 MB', modifiedDate: '2025-04-05', type: 'document' }
        ];
      }

      setFiles(initialFiles);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Load folders
    setTimeout(() => {
      setFolders([
        { id: '1', name: '数据结构', fileCount: 15, createdDate: '2025-04-18' },
        { id: '2', name: '操作系统', fileCount: 8, createdDate: '2025-04-15' },
        { id: '3', name: '前端开发', fileCount: 12, createdDate: '2025-04-10' }
      ]);
    }, 800);
  }, []);

  // 文档分类
  const categories = [
    { name: '最近文档', icon: <Clock size={20} />, count: files.length },
    { name: '已收藏', icon: <Star size={20} />, count: 2 },
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

  const handleDownload = (fileId: string) => {
    // 查找文件
    const fileToDownload = files.find(file => file.id === fileId);
    if (!fileToDownload) return;

    try {
      // 创建一个Blob对象，模拟文件内容
      const fileContent = `This is a simulation of the file: ${fileToDownload.name}`;
      const blob = new Blob([fileContent], { type: 'text/plain' });

      // 创建下载链接
      const downloadUrl = URL.createObjectURL(blob);

      // 创建一个临时的a标签并触发下载
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = fileToDownload.name;

      // 添加到DOM，触发点击，然后移除
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // 释放URL对象
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('下载失败', error);
      setShowErrorModal(true);
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

  // 获取最近5个文件
  const recentFiles = [...files].sort((a, b) => {
    return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime();
  }).slice(0, 5);

  const handleUploadComplete = () => {
    // 重新加载文件列表
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        // 转换格式
        const newFiles = parsedFiles.filter((file: any) => file.status === 'success').map((file: any) => ({
          id: file.name + Date.now().toString(),
          name: file.name,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          modifiedDate: new Date().toISOString().split('T')[0],
          type: getFileType(file.name)
        }));
        setFiles(newFiles);
      } catch (error) {
        console.error('解析保存的文件失败', error);
      }
    }
  };

  const handleCreateFolder = (folderName: string) => {
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      fileCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setFolders([...folders, newFolder]);
  };

  return (
    <View>
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

          <div style={{ marginTop: '24px', fontWeight: 'bold' }}>功能</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                gap: '12px',
                backgroundColor: 'transparent',
                color: colorMode === 'light' ? '#333' : '#f5f5f5'
              }}
              onClick={() => window.location.hash = '/assignment-manager'}
            >
              <Clipboard size={18} color={colorMode === 'light' ? '#666' : '#aaa'} />
              <div>学生作业管理</div>
            </div>
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
                onClick={() => setShowUploadModal(true)}
              >
                上传
              </Button>
            </div>
          </div>

          {/* 最近上传文件 */}
          <View gap={4}>
            <Card padding={0}>
              <View
                padding={4}
                attributes={{
                  style: {
                    paddingInline: '20px',
                    borderBottom: `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`
                  }
                }}
              >
                <Text weight="medium">最近上传 ({recentFiles.length})</Text>
              </View>

              {loading ? (
                <View direction="column" gap={3} padding={4}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <View key={i} direction="row" gap={2} align="center">
                      <View
                        width="40px"
                        height="40px"
                        attributes={{
                          style: {
                            borderRadius: '50%',
                            overflow: 'hidden'
                          }
                        }}
                      >
                        <Skeleton width="100%" height="100%" />
                      </View>
                      <View direction="column" gap={1} grow>
                        <Skeleton height={16} width="60%" />
                        <View direction="row" gap={3}>
                          <Skeleton height={12} width={60} />
                          <Skeleton height={12} width={80} />
                        </View>
                      </View>
                      <View direction="row" gap={1}>
                        <View
                          width="32px"
                          height="32px"
                          attributes={{
                            style: {
                              borderRadius: '50%',
                              overflow: 'hidden'
                            }
                          }}
                        >
                          <Skeleton width="100%" height="100%" />
                        </View>
                        <View
                          width="32px"
                          height="32px"
                          attributes={{
                            style: {
                              borderRadius: '50%',
                              overflow: 'hidden'
                            }
                          }}
                        >
                          <Skeleton width="100%" height="100%" />
                        </View>
                        <View
                          width="32px"
                          height="32px"
                          attributes={{
                            style: {
                              borderRadius: '50%',
                              overflow: 'hidden'
                            }
                          }}
                        >
                          <Skeleton width="100%" height="100%" />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : recentFiles.length === 0 ? (
                <View
                  direction="column"
                  align="center"
                  padding={6}
                  gap={4}
                >
                  <View attributes={{ style: { fontSize: '48px', opacity: 0.7 } }}>📂</View>
                  <Text>暂无文件</Text>
                  <Button
                    color="primary"
                    icon={<Upload />}
                    onClick={() => setShowUploadModal(true)}
                  >
                    上传文件
                  </Button>
                </View>
              ) : (
                <View attributes={{ style: { maxHeight: 'calc(100vh - 260px)' } }}>
                  <ScrollArea>
                    {recentFiles.map((file, index) => (
                      <View
                        key={file.id}
                        direction="row"
                        align="center"
                        gap={4}
                        padding={3}
                        attributes={{
                          style: {
                            paddingInline: '20px',
                            borderBottom: index < recentFiles.length - 1
                              ? `1px solid ${colorMode === 'light' ? '#f0f0f0' : '#333'}`
                              : 'none',
                            backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer'
                          },
                          onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                            e.currentTarget.style.backgroundColor = colorMode === 'light' ? '#f9f9f9' : '#2a2a2a';
                          },
                          onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                            e.currentTarget.style.backgroundColor = colorMode === 'light' ? '#fff' : '#1f1f1f';
                          }
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file.id);
                            }}
                          >
                            导出
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            color="neutral"
                            icon={<Edit2 />}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('编辑', file.id);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="small"
                            color="critical"
                            icon={<Trash2 />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id);
                            }}
                          />
                        </div>
                      </View>
                    ))}
                  </ScrollArea>
                </View>
              )}
            </Card>
          </View>

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
                onClick={() => setShowNewFolderModal(true)}
              >
                新建文件夹
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {folders.length === 0 ? (
                <Card padding={4}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '48px', opacity: 0.7 }}>📁</div>
                    <Text>暂无文件夹</Text>
                    <Button
                      color="primary"
                      icon={<Plus />}
                      onClick={() => setShowNewFolderModal(true)}
                    >
                      创建文件夹
                    </Button>
                  </div>
                </Card>
              ) : (
                folders.map((folder) => (
                  <Card
                    key={folder.id}
                    padding={4}
                    onClick={() => {
                      // 直接显示文件夹内容，现在直接跳转到特定文件夹
                      window.location.hash = `/folders?id=${folder.id}`;
                    }}
                  >
                    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Folder size={24} color={
                          folder.id === '1'
                            ? '#1890ff'
                            : folder.id === '2'
                              ? '#52c41a'
                              : '#faad14'
                        } />
                        <div style={{ fontWeight: 'bold' }}>{folder.name}</div>
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
                          {folder.fileCount}个文件
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: colorMode === 'light' ? '#8c8c8c' : '#d9d9d9'
                        }}>
                          {folder.createdDate}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 上传文件弹窗 */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
        folderOptions={folders.map(folder => ({ id: folder.id, name: folder.name }))}
      />

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

      {/* 下载错误弹窗 */}
      {showErrorModal && (
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
              backgroundColor: colorMode === 'light' ? '#fff' : '#1f1f1f',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '100%',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle color="#ff4d4f" />
              <Text weight="bold">下载失败</Text>
            </div>
            <Text>无法下载文件，请稍后再试。</Text>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowErrorModal(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}

      {/* 新建文件夹弹窗 */}
      <NewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onCreateFolder={handleCreateFolder}
        existingFolders={folders.map(folder => folder.name)}
      />
    </View>
  );
};

export default Index;