/**
 * IPC处理器注册
 */
import { BrowserWindow } from 'electron';
import { registerThemeHandlers } from './theme';
import { registerFileHandlers } from './file';
import { registerExcelHandlers } from './excel';
// 未来可以在这里引入更多的IPC处理器

/**
 * 注册所有IPC处理器
 * @param mainWindow 主窗口实例
 */
export function registerIpcHandlers(mainWindow: BrowserWindow | null): void {
  // 注册主题处理器
  registerThemeHandlers();
  
  // 注册文件处理器
  registerFileHandlers();
  
  // 注册Excel处理器
  registerExcelHandlers();
  
  // 未来可以在这里注册更多的处理器
} 