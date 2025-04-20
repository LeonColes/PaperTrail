import React, { useState, useEffect } from 'react';
import { View, Button, Text, Card, Skeleton, useTheme, Checkbox } from 'reshaped';
import { ArrowLeft, Folder, RefreshCw, File, Save, Check, Info, X } from 'react-feather';

interface FileItem {
  id: string;
  name: string;
  path: string;
  selected: boolean;
  newName?: string;
}

interface FolderItem {
  id: string;
  name: string;
  path: string;
}

const BatchRename: React.FC = () => {
  const { colorMode } = useTheme();
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formatString, setFormatString] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 可用的格式变量
  const formatVariables = [
    { code: '{class}', description: '班级名称' },
    { code: '{name}', description: '学生姓名' },
    { code: '{id}', description: '学号' },
    { code: '{date}', description: '日期(YYYYMMDD)' },
    { code: '{time}', description: '时间(HHMMSS)' },
    { code: '{original}', description: '原文件名' },
    { code: '{index}', description: '序号' },
  ];

  // 示例数据
  useEffect(() => {
    // 加载文件夹数据
    setFolders([
      { id: '1', name: '计科2206', path: '/计科2206' },
      { id: '2', name: '计科2207', path: '/计科2207' },
      { id: '3', name: '计科2208', path: '/计科2208' },
    ]);
  }, []);

  // 当选择文件夹时加载文件
  const handleSelectFolder = (folder: FolderItem) => {
    setSelectedFolder(folder);
    setLoading(true);
    setFiles([]);
    setSelectAll(false);

    // 模拟加载文件的延迟
    setTimeout(() => {
      // 这里应该是真实的文件加载逻辑
      const sampleFiles: FileItem[] = [
        { id: '1', name: '小明-期末作业.docx', path: `${folder.path}/小明-期末作业.docx`, selected: false },
        { id: '2', name: '小红-期末作业.docx', path: `${folder.path}/小红-期末作业.docx`, selected: false },
        { id: '3', name: '小李-期末作业.docx', path: `${folder.path}/小李-期末作业.docx`, selected: false },
        { id: '4', name: '小王-期末作业.docx', path: `${folder.path}/小王-期末作业.docx`, selected: false },
        { id: '5', name: '小张-期末作业.docx', path: `${folder.path}/小张-期末作业.docx`, selected: false },
      ];
      setFiles(sampleFiles);
      setLoading(false);
    }, 800);
  };

  // 解析文件名中的信息
  const parseFileName = (fileName: string) => {
    // 假设文件名格式为: 姓名-作业.扩展名
    const parts = fileName.split('-');
    if (parts.length >= 2) {
      const name = parts[0];
      // 从当前日期获取日期信息
      const today = new Date();
      const date = today.toISOString().split('T')[0].replace(/-/g, '');
      const time = today.toTimeString().split(' ')[0].replace(/:/g, '');

      return {
        name,
        date,
        time,
        original: fileName,
      };
    }
    return {
      name: '',
      date: '',
      time: '',
      original: fileName,
    };
  };

  // 生成新文件名
  const generateNewName = (file: FileItem, index: number) => {
    const { name, date, time, original } = parseFileName(file.name);
    // 提取文件扩展名
    const extIndex = file.name.lastIndexOf('.');
    const extension = extIndex !== -1 ? file.name.substring(extIndex) : '';

    // 替换格式字符串中的变量
    let newName = formatString
      .replace(/{class}/g, selectedFolder?.name || '')
      .replace(/{name}/g, name)
      .replace(/{id}/g, `学号${index + 1}`) // 模拟学号
      .replace(/{date}/g, date)
      .replace(/{time}/g, time)
      .replace(/{original}/g, original.substring(0, extIndex !== -1 ? extIndex : original.length))
      .replace(/{index}/g, (index + 1).toString());

    // 添加文件扩展名
    return newName + extension;
  };

  // 预览文件名
  const previewFileNames = () => {
    if (!formatString.trim()) {
      alert('请先输入重命名格式');
      return;
    }

    setFiles(files.map((file, index) => ({
      ...file,
      newName: generateNewName(file, index)
    })));

    setPreviewMode(true);
  };

  // 应用重命名
  const applyRename = () => {
    // 这里应该是实际执行重命名操作的代码
    // 由于我们是离线应用，可以使用Electron的File API来实现
    console.log('执行重命名操作');
    console.log(files.filter(f => f.selected).map(f => ({
      oldPath: f.path,
      newName: f.newName
    })));

    // 显示成功信息
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // 切换文件选择状态
  const toggleFileSelection = (fileId: string) => {
    setFiles(files.map(file =>
      file.id === fileId ? { ...file, selected: !file.selected } : file
    ));
  };

  // 切换全选状态
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setFiles(files.map(file => ({ ...file, selected: newSelectAll })));
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
          <Text weight="medium">批量重命名</Text>
        </View>
      </View>

      <Card>
        <View direction="column" gap={3} padding={4}>
          <Text weight="medium">重命名规则设置</Text>

          <View direction="column" gap={2}>
            <Text>选择文件夹</Text>
            <View direction="row" gap={2} wrap>
              {folders.map(folder => (
                <Button
                  key={folder.id}
                  color={selectedFolder?.id === folder.id ? 'primary' : 'neutral'}
                  variant={selectedFolder?.id === folder.id ? 'solid' : 'outline'}
                  icon={<Folder />}
                  onClick={() => handleSelectFolder(folder)}
                >
                  {folder.name}
                </Button>
              ))}
            </View>
          </View>

          <View direction="column" gap={2}>
            <View direction="row" justify="space-between" align="center">
              <Text>命名格式</Text>
              <Button
                size="small"
                variant="ghost"
                icon={<Info />}
                onClick={() => setShowInfo(!showInfo)}
              />
            </View>

            <input
              type="text"
              value={formatString}
              onChange={(e) => setFormatString(e.target.value)}
              placeholder="例如: {class}-{name}-{date}"
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: colorMode === 'light' ? '#ddd' : '#444',
                backgroundColor: colorMode === 'light' ? '#fff' : '#333',
                color: colorMode === 'light' ? '#333' : '#fff',
                width: '100%'
              }}
            />

            {showInfo && (
              <Card>
                <View direction="column" gap={2} padding={3}>
                  <View direction="row" justify="space-between" align="center">
                    <Text weight="medium">可用的格式变量</Text>
                    <Button
                      size="small"
                      variant="ghost"
                      icon={<X />}
                      onClick={() => setShowInfo(false)}
                    />
                  </View>
                  <View direction="column" gap={1}>
                    {formatVariables.map((variable, index) => (
                      <View key={index} direction="row" gap={2}>
                        <Text color="primary" weight="medium">{variable.code}</Text>
                        <Text>{variable.description}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Card>
            )}
          </View>

          <Button
            color="primary"
            icon={<RefreshCw />}
            onClick={previewFileNames}
            disabled={!selectedFolder || !formatString.trim()}
          >
            预览文件名
          </Button>
        </View>
      </Card>

      {selectedFolder && (
        <Card>
          <View direction="column" padding={4} gap={3}>
            <View direction="row" justify="space-between" align="center">
              <Text weight="medium">文件列表 ({selectedFolder.name})</Text>
              {files.length > 0 && !loading && (
                <View direction="row" gap={2} align="center">
                  <Checkbox checked={selectAll} onChange={toggleSelectAll} />
                  <Text>全选</Text>
                  {previewMode && files.some(f => f.selected) && (
                    <Button
                      color="primary"
                      icon={<Save />}
                      onClick={applyRename}
                    >
                      应用重命名
                    </Button>
                  )}
                </View>
              )}
            </View>

            {loading ? (
              <View direction="column" gap={3}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <View key={index} direction="row" gap={2} align="center">
                    <Skeleton height={24} width={24} />
                    <View direction="column" gap={1} grow>
                      <Skeleton height={16} width="60%" />
                    </View>
                  </View>
                ))}
              </View>
            ) : files.length === 0 ? (
              <View direction="column" align="center" padding={6} gap={2}>
                <File size={48} color={colorMode === 'light' ? '#ddd' : '#555'} />
                <Text>当前文件夹为空</Text>
              </View>
            ) : (
              <View direction="column" gap={2}>
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    style={{
                      padding: '12px',
                      borderRadius: '4px',
                      backgroundColor: file.selected
                        ? (colorMode === 'light' ? '#e6f7ff' : '#133152')
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <Checkbox
                      checked={file.selected}
                      onChange={() => toggleFileSelection(file.id)}
                    />

                    <View direction="column" gap={1} grow>
                      <Text color={file.selected ? 'primary' : 'neutral'}>
                        {file.name}
                      </Text>
                      {previewMode && file.newName && (
                        <Text color="primary">
                          → {file.newName}
                        </Text>
                      )}
                    </View>
                  </div>
                ))}
              </View>
            )}
          </View>
        </Card>
      )}

      {/* 成功提示 */}
      {showSuccessMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: colorMode === 'light' ? '#f6ffed' : '#162312',
            border: '1px solid',
            borderColor: colorMode === 'light' ? '#b7eb8f' : '#274916',
            borderRadius: '4px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check color="#52c41a" size={16} />
          <Text>重命名操作成功完成！</Text>
        </div>
      )}
    </View>
  );
};

export default BatchRename; 