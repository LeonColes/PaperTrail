/**
 * 文件操作相关的IPC处理器
 */
import { ipcMain, dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 注册文件操作相关的IPC处理器
 */
export function registerFileHandlers(): void {
  // 选择文件
  ipcMain.handle('select-files', async (event, options) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Excel文件', extensions: ['xlsx', 'xls'] },
        { name: '所有文件', extensions: ['*'] }
      ],
      ...options
    });
    
    return filePaths;
  });

  // 选择目录
  ipcMain.handle('select-directory', async (event, options) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      ...options
    });
    
    return filePaths.length ? filePaths[0] : null;
  });

  // 列出目录内容
  ipcMain.handle('list-directory', async (event, directoryPath) => {
    try {
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      
      const result = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(directoryPath, entry.name);
          const stats = await fs.stat(entryPath);
          
          return {
            name: entry.name,
            path: entryPath,
            isDirectory: entry.isDirectory(),
            size: stats.size,
            modifiedTime: stats.mtime.toISOString()
          };
        })
      );
      
      return result;
    } catch (error) {
      console.error('读取目录失败:', error);
      throw error;
    }
  });

  // 重命名文件
  ipcMain.handle('rename-file', async (event, oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      return true;
    } catch (error) {
      console.error('重命名文件失败:', error);
      throw error;
    }
  });

  // 批量重命名文件
  ipcMain.handle('batch-rename', async (event, operations) => {
    const results = [];
    
    for (const op of operations) {
      try {
        await fs.rename(op.oldPath, op.newPath);
        results.push({
          success: true,
          oldPath: op.oldPath,
          newPath: op.newPath
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({
          success: false,
          oldPath: op.oldPath,
          newPath: op.newPath,
          error: errorMessage
        });
      }
    }
    
    return results;
  });
} 