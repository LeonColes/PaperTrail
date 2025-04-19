/**
 * 主题相关的IPC处理器
 */
import { ipcMain } from 'electron';
import { getValue, setValue } from '../services/dataStore';

// 主题配置键名
const THEME_CONFIG_KEY = 'theme-config';

// 默认主题配置
const DEFAULT_THEME_CONFIG = {
  colorMode: 'light'
};

/**
 * 注册主题相关的IPC处理器
 */
export function registerThemeHandlers(): void {
  // 获取颜色模式
  ipcMain.handle('get-color-mode', async () => {
    const config = await getValue(THEME_CONFIG_KEY, DEFAULT_THEME_CONFIG);
    return config.colorMode;
  });

  // 保存颜色模式
  ipcMain.handle('save-color-mode', async (_event, mode: 'light' | 'dark') => {
    const config = await getValue(THEME_CONFIG_KEY, DEFAULT_THEME_CONFIG);
    config.colorMode = mode;
    await setValue(THEME_CONFIG_KEY, config);
    return true;
  });
} 