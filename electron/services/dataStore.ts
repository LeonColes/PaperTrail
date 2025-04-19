/**
 * 数据存储服务
 * 提供简单的键值存储功能，替代electron-store
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from 'electron';

// 应用数据目录
const APP_DATA_DIR = path.join(app.getPath('userData'), 'PaperTrail');

/**
 * 确保数据目录存在
 */
export async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(APP_DATA_DIR);
  } catch (error) {
    // 目录不存在，创建它
    await fs.mkdir(APP_DATA_DIR, { recursive: true });
  }
}

/**
 * 获取存储文件的路径
 * @param key 存储键名
 * @returns 文件路径
 */
export function getStorePath(key: string): string {
  return path.join(APP_DATA_DIR, `${key}.json`);
}

/**
 * 获取存储的值
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 存储的值，或者默认值
 */
export async function getValue<T>(key: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir();
    const filePath = getStorePath(key);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    // 读取失败，返回默认值
    return defaultValue;
  }
}

/**
 * 设置存储的值
 * @param key 存储键名
 * @param value 要存储的值
 */
export async function setValue<T>(key: string, value: T): Promise<void> {
  await ensureDataDir();
  const filePath = getStorePath(key);
  const data = JSON.stringify(value, null, 2);
  await fs.writeFile(filePath, data, 'utf8');
} 