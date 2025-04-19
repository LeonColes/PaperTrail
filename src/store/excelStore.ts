/**
 * Excel数据存储
 */

// 定义类型
export interface DynamicRecord {
  [key: string]: string | number | boolean | Date | null;
}

export interface ExcelFileMeta {
  id: string;
  filename: string;
  originalPath: string;
  uploadTime: string;
  headers: string[];
  recordCount: number;
}

/**
 * 获取所有Excel文件元数据
 */
export const getExcelFiles = async (): Promise<ExcelFileMeta[]> => {
  try {
    return await window.ipcRenderer.invoke('get-excel-files') || [];
  } catch (error) {
    console.error('获取Excel文件列表失败:', error);
    return [];
  }
};

/**
 * 获取Excel文件数据
 * @param id 文件ID
 */
export const getExcelData = async (id: string): Promise<DynamicRecord[]> => {
  try {
    return await window.ipcRenderer.invoke('get-excel-data', id) || [];
  } catch (error) {
    console.error('获取Excel数据失败:', error);
    return [];
  }
};

/**
 * 上传Excel文件
 * @param filePath 文件路径
 */
export const uploadExcel = async (filePath: string): Promise<{meta: ExcelFileMeta; data: DynamicRecord[]} | null> => {
  try {
    return await window.ipcRenderer.invoke('upload-excel', filePath);
  } catch (error) {
    console.error('上传Excel文件失败:', error);
    return null;
  }
};

/**
 * 删除Excel文件
 * @param id 文件ID
 */
export const deleteExcel = async (id: string): Promise<boolean> => {
  try {
    return await window.ipcRenderer.invoke('delete-excel', id);
  } catch (error) {
    console.error('删除Excel文件失败:', error);
    return false;
  }
};

/**
 * 导出Excel数据
 * @param data 要导出的数据
 * @param filename 默认文件名
 */
export const exportExcel = async (data: DynamicRecord[], filename: string): Promise<{success: boolean; filePath?: string; message?: string}> => {
  try {
    return await window.ipcRenderer.invoke('export-excel', { data, filename });
  } catch (error) {
    console.error('导出Excel数据失败:', error);
    return { success: false, message: String(error) };
  }
};

/**
 * 选择并上传Excel文件
 */
export const selectAndUploadExcel = async (): Promise<{meta: ExcelFileMeta; data: DynamicRecord[]} | null> => {
  try {
    // 选择文件
    const filePaths = await window.ipcRenderer.invoke('select-files');
    if (!filePaths || filePaths.length === 0) {
      return null;
    }
    
    // 上传第一个选择的文件
    return await uploadExcel(filePaths[0]);
  } catch (error) {
    console.error('选择并上传Excel文件失败:', error);
    return null;
  }
}; 