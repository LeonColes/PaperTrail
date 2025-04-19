/**
 * 文件操作存储
 */

// 文件项类型
export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: string;
}

/**
 * 选择文件
 * @param options 选项
 */
export const selectFiles = async (options?: any): Promise<string[]> => {
  try {
    return await window.ipcRenderer.invoke('select-files', options) || [];
  } catch (error) {
    console.error('选择文件失败:', error);
    return [];
  }
};

/**
 * 选择目录
 * @param options 选项
 */
export const selectDirectory = async (options?: any): Promise<string | null> => {
  try {
    return await window.ipcRenderer.invoke('select-directory', options);
  } catch (error) {
    console.error('选择目录失败:', error);
    return null;
  }
};

/**
 * 列出目录内容
 * @param directoryPath 目录路径
 */
export const listDirectory = async (directoryPath: string): Promise<FileItem[]> => {
  try {
    return await window.ipcRenderer.invoke('list-directory', directoryPath) || [];
  } catch (error) {
    console.error('列出目录内容失败:', error);
    return [];
  }
};

/**
 * 重命名文件
 * @param oldPath 原路径
 * @param newPath 新路径
 */
export const renameFile = async (oldPath: string, newPath: string): Promise<boolean> => {
  try {
    return await window.ipcRenderer.invoke('rename-file', oldPath, newPath);
  } catch (error) {
    console.error('重命名文件失败:', error);
    return false;
  }
};

/**
 * 批量重命名文件
 * @param operations 重命名操作数组
 */
export const batchRename = async (operations: { oldPath: string; newPath: string }[]): Promise<{
  success: boolean;
  oldPath: string;
  newPath: string;
  error?: string;
}[]> => {
  try {
    return await window.ipcRenderer.invoke('batch-rename', operations) || [];
  } catch (error) {
    console.error('批量重命名文件失败:', error);
    return [];
  }
}; 