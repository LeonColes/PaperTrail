/**
 * Excel文件相关的IPC处理器
 */
import { ipcMain, dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as XLSX from 'xlsx';
import {
  getExcelMeta,
  getExcelData,
  createExcelFile,
  deleteExcelMeta,
  deleteExcelData,
  ExcelFileMeta,
  DynamicRecord
} from '../services/excelService';

/**
 * 注册Excel文件相关的IPC处理器
 */
export function registerExcelHandlers(): void {
  // 获取所有Excel文件元数据
  ipcMain.handle('get-excel-files', async () => {
    return await getExcelMeta();
  });

  // 获取Excel文件数据
  ipcMain.handle('get-excel-data', async (_event, id: string) => {
    return await getExcelData(id);
  });

  // 上传Excel文件
  ipcMain.handle('upload-excel', async (_event, filePath: string) => {
    try {
      // 读取Excel文件
      const buffer = await fs.readFile(filePath);
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet) as DynamicRecord[];
      
      // 获取文件名
      const filename = path.basename(filePath);
      
      // 创建Excel文件记录
      return await createExcelFile(filename, filePath, data);
    } catch (error) {
      console.error('上传Excel文件失败:', error);
      throw error;
    }
  });

  // 导出Excel数据
  ipcMain.handle('export-excel', async (_event, { data, filename }: { data: DynamicRecord[]; filename: string }) => {
    try {
      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
      // 选择保存路径
      const { filePath } = await dialog.showSaveDialog({
        title: '导出Excel',
        defaultPath: filename,
        filters: [
          { name: 'Excel文件', extensions: ['xlsx'] },
          { name: '所有文件', extensions: ['*'] }
        ]
      });
      
      if (!filePath) {
        return { success: false, message: '用户取消了导出' };
      }
      
      // 写入文件
      XLSX.writeFile(workbook, filePath);
      
      return { success: true, filePath };
    } catch (error) {
      console.error('导出Excel文件失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, message };
    }
  });

  // 删除Excel文件
  ipcMain.handle('delete-excel', async (_event, id: string) => {
    try {
      // 删除数据和元数据
      await deleteExcelData(id);
      await deleteExcelMeta(id);
      return true;
    } catch (error) {
      console.error('删除Excel文件失败:', error);
      throw error;
    }
  });
} 