import { useState, useEffect } from 'react'
import { View, Avatar, Button, useTheme } from 'reshaped'
import { X, Square, Minus, Settings, Smile, Sun, Moon } from 'react-feather'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './routes'

import 'reshaped/themes/figma/theme.css'
import 'reshaped/themes/reshaped/theme.css'
import 'reshaped/themes/fragments/twitter/theme.css'
import 'reshaped/themes/slate/theme.css'

// 导入主题存储函数
import { getColorMode, saveColorMode } from './store/themeStore';

// 定义可用的主题列表
// const themeList = ['figma', 'reshaped', 'twitter', 'slate']

const App = () => {
  // 黑白模式
  // const [colorMode] = useState('light')
  const { setColorMode, invertColorMode, colorMode } = useTheme();


  // 当前主题
  // const [theme, setTheme] = useState('figma')

  // 在组件挂载时，读取保存的颜色模式
  useEffect(() => {
    getColorMode().then(savedMode => {
      if (savedMode) {
        setColorMode(savedMode);
      }
    });
  }, []);

  // 当颜色模式变化时，保存
  useEffect(() => {
    if (colorMode) {
      saveColorMode(colorMode as 'light' | 'dark');
    }
  }, [colorMode]);

  const updateColorMode = () => {
    invertColorMode();
  };

  return (
    <>
      <nav>
        <View direction='row' justify='space-between'>
          <View direction='row'>
            <Button color='primary' icon={<Smile />} />
            {/* 页面栈位置 */}
          </View>
          {/* 用户和设置 */}
          <View direction='row' gap={3}>
            <View direction='row' gap={1}>
              <Button color='primary' variant='ghost' icon={colorMode == 'light' ? <Sun /> : <Moon />} onClick={updateColorMode} />
              <Button color='primary' variant='ghost' icon={<Settings />} />
              <Button color='primary' variant='ghost' icon={<Avatar size={5.5} src='https://avatars.githubusercontent.com/u/133302251?v=4' />} />
            </View>
            {/* 右上角三按钮 */}
            <View direction='row' gap={1}>
              <Button color='primary' variant='ghost' icon={<Minus />} onClick={() =>window.ipcRenderer.send('window-minimize')} />
              <Button color='primary' variant='ghost' icon={<Square />} onClick={() =>window.ipcRenderer.send('window-maximize')} />
              <Button color='primary' variant='ghost' icon={<X />} onClick={() =>window.ipcRenderer.send('window-close')} />
            </View>
          </View>
        </View>
      </nav>
      <main w-full h-full>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </main>
    </>
  )
}

export default App