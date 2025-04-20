import React, { useState, useEffect } from 'react';
import { View, Button, Text, Card, Skeleton, useTheme, ScrollArea, Select, Badge, Progress, Checkbox, TextField, FileUpload, Alert } from 'reshaped';
import { ArrowLeft, Check, X, FileText, Upload, Download, RefreshCw, File, AlertCircle, Folder as FolderIcon, Search } from 'react-feather';
import * as XLSX from 'xlsx';

interface StudentRecord {
  id: string;
  name: string;
  className: string;
  studentId: string;
  submitted: boolean;
}

interface FileItem {
  id: string;
  name: string;
  path: string;
}

interface ClassInfo {
  className: string;
  total: number;
  submitted: number;
}

const HomeworkCheck: React.FC = () => {
  const { colorMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [nameListFile, setNameListFile] = useState<File | null>(null);
  const [homeworkFolder, setHomeworkFolder] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [submittedFiles, setSubmittedFiles] = useState<FileItem[]>([]);
  const [classStats, setClassStats] = useState<ClassInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [processingError, setProcessingError] = useState<string | null>(null);

  // 模拟加载已提交的作业文件
  const loadSubmittedFiles = (folderPath: string) => {
    // 这里应该是从指定文件夹加载文件列表的实际代码
    // 为了演示，使用模拟数据
    const mockFiles: FileItem[] = [
      { id: '1', name: '小明-期末作业.docx', path: `${folderPath}/小明-期末作业.docx` },
      { id: '2', name: '小红-期末作业.docx', path: `${folderPath}/小红-期末作业.docx` },
      { id: '3', name: '小李-期末作业.docx', path: `${folderPath}/小李-期末作业.docx` },
      { id: '5', name: '小张-期末作业.docx', path: `${folderPath}/小张-期末作业.docx` },
      // 故意不包含小王的作业，模拟未提交情况
    ];

    return mockFiles;
  };

  // 处理名单Excel文件
  const handleNameListUpload = (files: File[]) => {
    if (files.length === 0) return;
    setNameListFile(files[0]);
  };

  // 处理选择作业文件夹
  const handleHomeworkFolderSelect = () => {
    // 在实际应用中，应该使用系统文件选择器
    // 为了演示，我们直接设置一个模拟路径
    const path = window.prompt('请输入系统目录路径', 'C:\\Users\\Documents');
    if (path) {
      setHomeworkFolder(path);
    }
  };

  // 处理扫描作业文件夹
  const handleScanFolder = () => {
    if (!homeworkFolder) {
      alert('请先选择作业提交目录');
      return;
    }

    setScanning(true);

    // 模拟扫描过程
    setTimeout(() => {
      const files = loadSubmittedFiles(homeworkFolder);
      setSubmittedFiles(files);
      setScanning(false);
      alert(`找到 ${files.length} 个文件`);
    }, 1500);
  };

  // 处理开始检查作业
  const handleCheckHomework = async () => {
    if (!nameListFile || !homeworkFolder) {
      setProcessingError('请先上传学生名单Excel文件，并选择作业提交目录');
      return;
    }

    setLoading(true);
    setProcessingError(null);

    try {
      // 读取Excel文件
      const data = await readExcelFile(nameListFile);

      // 加载已提交的作业文件
      const files = loadSubmittedFiles(homeworkFolder);
      setSubmittedFiles(files);

      // 检查哪些学生已提交作业
      const checkedStudents = checkSubmissions(data, files);
      setStudents(checkedStudents);

      // 计算按班级统计的提交情况
      const stats = calculateStats(checkedStudents);
      setClassStats(stats);

      setProcessingComplete(true);
    } catch (error) {
      console.error('检查作业出错:', error);
      setProcessingError('处理失败，请检查文件格式是否正确');
    } finally {
      setLoading(false);
    }
  };

  // 读取Excel文件
  const readExcelFile = (file: File): Promise<StudentRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('无法读取文件'));
            return;
          }

          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // 转换为JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // 处理数据，转换为我们需要的格式
          // 假设Excel格式为: 姓名, 学号, 班级
          const students: StudentRecord[] = jsonData.map((row: any, index) => ({
            id: `student-${index}`,
            name: row['姓名'] || '',
            className: row['班级'] || '',
            studentId: row['学号'] || '',
            submitted: false
          }));

          resolve(students);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // 以二进制方式读取文件
      reader.readAsBinaryString(file);
    });
  };

  // 检查哪些学生已提交作业
  const checkSubmissions = (students: StudentRecord[], files: FileItem[]): StudentRecord[] => {
    return students.map(student => {
      // 简单的匹配逻辑: 文件名包含学生姓名
      const submitted = files.some(file =>
        file.name.includes(student.name)
      );

      return { ...student, submitted };
    });
  };

  // 计算按班级统计的提交情况
  const calculateStats = (students: StudentRecord[]): ClassInfo[] => {
    // 按班级分组
    const classCounts: { [key: string]: { total: number, submitted: number } } = {};

    students.forEach(student => {
      const className = student.className;

      if (!classCounts[className]) {
        classCounts[className] = { total: 0, submitted: 0 };
      }

      classCounts[className].total += 1;
      if (student.submitted) {
        classCounts[className].submitted += 1;
      }
    });

    // 转换为数组
    return Object.entries(classCounts).map(([className, counts]) => ({
      className,
      total: counts.total,
      submitted: counts.submitted
    }));
  };

  // 导出未提交作业的学生名单
  const exportMissingSubmissions = () => {
    // 筛选未提交作业的学生
    const missingStudents = students.filter(student => !student.submitted);

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(missingStudents.map(student => ({
      '姓名': student.name,
      '学号': student.studentId,
      '班级': student.className
    })));

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '未提交作业名单');

    // 导出Excel文件
    XLSX.writeFile(workbook, '未提交作业学生名单.xlsx');
  };

  // 获取班级列表，包括"全部"选项
  const getClassOptions = () => {
    const classNames = [...new Set(students.map(student => student.className))];
    return [
      { value: 'all', label: '全部班级' },
      ...classNames.map(name => ({ value: name, label: name }))
    ];
  };

  // 过滤学生列表
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.includes(searchTerm) ||
      student.studentId.includes(searchTerm) ||
      student.className.includes(searchTerm);

    const matchesClass = selectedClass === 'all' || student.className === selectedClass;

    if (showOnlyMissing) {
      return matchesSearch && !student.submitted && matchesClass;
    }

    return matchesSearch && matchesClass;
  });

  return (
    <View direction="column" gap={4}>
      <View direction="row" justify="space-between" align="center">
        <View direction="row" gap={2} align="center">
          <Button
            color="neutral"
            icon={<ArrowLeft />}
            onClick={() => window.location.hash = '/'}
          />
          <Text weight="medium">作业检查</Text>
        </View>

        {processingComplete && (
          <Button
            color="primary"
            variant="ghost"
            icon={<Download />}
            onClick={exportMissingSubmissions}
          >
            导出未交名单
          </Button>
        )}
      </View>

      <Card>
        <View direction="column" gap={4} padding={4}>
          <Text weight="medium">配置检查参数</Text>

          {processingError && (
            <Alert color="critical" icon={<AlertCircle size={16} />}>
              {processingError}
            </Alert>
          )}

          <View direction="row" gap={4} wrap>
            <View direction="column" gap={2} width="48%">
              <Text>1. 上传学生名单Excel文件</Text>
              <View direction="row" gap={2} align="center">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setNameListFile(files[0]);
                    }
                  }}
                  style={{ display: 'none' }}
                  id="excel-upload"
                />
                <View
                  as="label"
                  grow
                  attributes={{ htmlFor: "excel-upload" }}
                >
                  <Button
                    fullWidth
                    as="span"
                    color="primary"
                    icon={<Upload />}
                  >
                    选择Excel文件
                  </Button>
                </View>
                {nameListFile && (
                  <Badge color="neutral">
                    {nameListFile.name}
                  </Badge>
                )}
              </View>
            </View>

            <View direction="column" gap={2} width="48%">
              <Text>2. 选择作业提交目录</Text>
              <View direction="row" gap={2} align="center">
                <Button
                  fullWidth
                  color="primary"
                  icon={<FolderIcon />}
                  onClick={handleHomeworkFolderSelect}
                >
                  选择系统目录
                </Button>
                {homeworkFolder && (
                  <Badge color="neutral">
                    {homeworkFolder}
                  </Badge>
                )}
              </View>
            </View>
          </View>

          <View direction="row" gap={4} justify="space-between" align="center">
            <View direction="row" gap={2}>
              <Button
                color="primary"
                variant="ghost"
                icon={<Search />}
                onClick={handleScanFolder}
                loading={scanning}
                disabled={!homeworkFolder}
              >
                扫描目录
              </Button>

              <Button
                color="primary"
                icon={<Check />}
                onClick={handleCheckHomework}
                loading={loading}
                disabled={!nameListFile || !homeworkFolder || submittedFiles.length === 0}
              >
                开始检查
              </Button>
            </View>

            {submittedFiles.length > 0 && (
              <Badge color="positive">
                已找到 {submittedFiles.length} 个文件
              </Badge>
            )}
          </View>
        </View>
      </Card>

      {processingComplete && (
        <>
          {/* 班级统计信息 */}
          <Card>
            <View direction="column" gap={3} padding={4}>
              <Text weight="medium">统计信息</Text>

              <ScrollArea height="250px" scrollbarDisplay="hover">
                <View direction="column" gap={2}>
                  {classStats.map((classInfo, index) => (
                    <Card key={index} padding={3}>
                      <View direction="row" justify="space-between" align="center">
                        <View direction="column" gap={1}>
                          <Text weight="medium">{classInfo.className}</Text>
                          <Text color="neutral">
                            已提交: {classInfo.submitted}/{classInfo.total} ({Math.round(classInfo.submitted / classInfo.total * 100)}%)
                          </Text>
                        </View>
                        <View
                          direction="row"
                          align="center"
                        >
                          <Progress
                            value={classInfo.submitted}
                            max={classInfo.total}
                            attributes={{ style: { width: '200px' } }}
                          />
                        </View>
                      </View>
                    </Card>
                  ))}
                </View>
              </ScrollArea>
            </View>
          </Card>

          {/* 学生作业提交情况 */}
          <Card>
            <View direction="column" gap={3} padding={4}>
              <View direction="row" justify="space-between" align="center">
                <Text weight="medium">学生作业提交情况</Text>
                <View direction="row" gap={2} align="center">
                  <View
                    as="label"
                    direction="row"
                    gap={1}
                    align="center"
                    attributes={{
                      htmlFor: "show-missing",
                      style: { cursor: 'pointer' }
                    }}
                  >
                    <Checkbox
                      name="show-missing"
                      checked={showOnlyMissing}
                      onChange={({ checked }) => setShowOnlyMissing(checked)}
                    />
                    <Text>只显示未提交</Text>
                  </View>

                  <Select
                    name="class-select"
                    value={selectedClass}
                    onChange={({ value }) => setSelectedClass(value)}
                    options={getClassOptions()}
                    size="small"
                  />

                  <TextField
                    name="search-students"
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    placeholder="搜索学生..."
                    size="small"
                    icon={<Search size={16} />}
                    attributes={{ style: { width: '200px' } }}
                  />
                </View>
              </View>

              <ScrollArea height="400px" scrollbarDisplay="hover">
                <View direction="column" gap={2}>
                  {filteredStudents.length === 0 ? (
                    <View direction="column" align="center" padding={6} gap={2}>
                      <Text attributes={{ style: { fontSize: '48px', opacity: 0.7 } }}>🔍</Text>
                      <Text>未找到匹配的学生</Text>
                    </View>
                  ) : (
                    filteredStudents.map((student) => (
                      <Card key={student.id} padding={3}>
                        <View direction="row" justify="space-between" align="center">
                          <View direction="row" gap={4} align="center">
                            <View direction="column" gap={1}>
                              <Text weight="medium">{student.name}</Text>
                              <Text color="neutral">{student.studentId}</Text>
                            </View>
                            <Badge color="neutral">{student.className}</Badge>
                          </View>
                          <View direction="row" gap={2} align="center">
                            {student.submitted ? (
                              <Badge color="positive" icon={<Check size={16} />}>已提交</Badge>
                            ) : (
                              <Badge color="critical" icon={<X size={16} />}>未提交</Badge>
                            )}
                          </View>
                        </View>
                      </Card>
                    ))
                  )}
                </View>
              </ScrollArea>
            </View>
          </Card>
        </>
      )}
    </View>
  );
};

// 模拟Folder组件，因为Feather Icons中没有文件夹图标
const Folder = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
};

export default HomeworkCheck; 