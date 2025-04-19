// src/store/themeStore.ts
export const getColorMode = async (): Promise<'light' | 'dark'> => {
  try {
    // 使用已存在的 ipcRenderer API
    return await window.ipcRenderer.invoke('get-color-mode') || 'light';
  } catch (error) {
    console.error('获取颜色模式失败:', error);
    return 'light';
  }
};

export const saveColorMode = async (mode: 'light' | 'dark'): Promise<void> => {
  try {
    await window.ipcRenderer.invoke('save-color-mode', mode);
  } catch (error) {
    console.error('保存颜色模式失败:', error);
  }
};