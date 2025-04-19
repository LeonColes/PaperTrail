/**
 * Excel文件处理服务
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { getValue, setValue } from './dataStore';

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

export interface ExcelFile {
  meta: ExcelFileMeta;
  data: DynamicRecord[];
}

// Excel文件元数据存储键
const EXCEL_META_KEY = 'excel-meta';

// 应用数据目录
const APP_DATA_DIR = path.join(app.getPath('userData'), 'PaperTrail');

/**
 * 确保数据目录存在
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(APP_DATA_DIR);
  } catch (error) {
    // 目录不存在，创建它
    await fs.mkdir(APP_DATA_DIR, { recursive: true });
  }
}

/**
 * 获取Excel文件元数据列表
 */
export async function getExcelMeta(): Promise<ExcelFileMeta[]> {
  return await getValue<ExcelFileMeta[]>(EXCEL_META_KEY, []);
}

/**
 * 获取单个Excel文件元数据
 * @param id 文件ID
 * @returns 元数据或undefined
 */
export async function getExcelMetaById(id: string): Promise<ExcelFileMeta | undefined> {
  const metaList = await getExcelMeta();
  return metaList.find(meta => meta.id === id);
}

/**
 * 保存Excel文件元数据
 * @param meta Excel文件元数据
 */
export async function saveExcelMeta(meta: ExcelFileMeta): Promise<void> {
  const metaList = await getExcelMeta();
  const existingIndex = metaList.findIndex(m => m.id === meta.id);
  
  if (existingIndex >= 0) {
    // 更新现有元数据
    metaList[existingIndex] = meta;
  } else {
    // 添加新元数据
    metaList.push(meta);
  }
  
  await setValue(EXCEL_META_KEY, metaList);
}

/**
 * 删除Excel文件元数据
 * @param id 文件ID
 */
export async function deleteExcelMeta(id: string): Promise<boolean> {
  const metaList = await getExcelMeta();
  const newMetaList = metaList.filter(meta => meta.id !== id);
  
  if (newMetaList.length < metaList.length) {
    await setValue(EXCEL_META_KEY, newMetaList);
    return true;
  }
  
  return false;
}

/**
 * 获取Excel文件数据
 * @param id 文件ID
 */
export async function getExcelData(id: string): Promise<DynamicRecord[]> {
  const meta = await getExcelMetaById(id);
  if (!meta) {
    return [];
  }
  
  try {
    const dataPath = getExcelDataPath(id);
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data) as DynamicRecord[];
  } catch (error) {
    console.error('获取Excel数据失败:', error);
    return [];
  }
}

/**
 * 保存Excel文件数据
 * @param id 文件ID
 * @param data Excel数据
 */
export async function saveExcelData(id: string, data: DynamicRecord[]): Promise<void> {
  await ensureDataDir();
  const dataPath = getExcelDataPath(id);
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(dataPath, jsonData, 'utf8');
}

/**
 * 删除Excel文件数据
 * @param id 文件ID
 */
export async function deleteExcelData(id: string): Promise<boolean> {
  try {
    const dataPath = getExcelDataPath(id);
    await fs.unlink(dataPath);
    return true;
  } catch (error) {
    console.error('删除Excel数据失败:', error);
    return false;
  }
}

/**
 * 创建新的Excel文件记录
 * @param filename 文件名
 * @param originalPath 原始文件路径
 * @param data Excel数据
 */
export async function createExcelFile(
  filename: string,
  originalPath: string,
  data: DynamicRecord[]
): Promise<ExcelFile> {
  // 创建元数据
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const id = uuidv4();
  
  const meta: ExcelFileMeta = {
    id,
    filename,
    originalPath,
    uploadTime: new Date().toISOString(),
    headers,
    recordCount: data.length
  };
  
  // 保存数据和元数据
  await saveExcelData(id, data);
  await saveExcelMeta(meta);
  
  return {
    meta,
    data
  };
}

/**
 * 获取Excel数据文件路径
 * @param id 文件ID
 */
function getExcelDataPath(id: string): string {
  return path.join(APP_DATA_DIR, `excel_data_${id}.json`);
} 