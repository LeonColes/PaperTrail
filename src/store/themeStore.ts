/**
 * 主题操作存储
 */

// 定义颜色模式类型
export type ColorMode = 'light' | 'dark';

// localStorage中存储主题偏好的键名
export const THEME_STORAGE_KEY = 'papertrail-theme';

/**
 * 从localStorage获取保存的颜色模式
 * 如果没有保存的颜色模式，则返回'light'
 */
export const getColorMode = (): ColorMode => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch (error) {
    console.error('获取主题偏好失败:', error);
  }
  
  // 如果没有保存或出错，返回默认颜色模式
  return 'light';
};

/**
 * 将颜色模式保存到localStorage
 */
export const saveColorMode = (mode: ColorMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.error('保存主题偏好失败:', error);
  }
}; 