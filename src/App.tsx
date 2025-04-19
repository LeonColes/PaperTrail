import { useState } from 'react'
import { Reshaped, View, Avatar, Button } from 'reshaped'
import { X, Square, Minus, Settings, Sun, Moon } from 'react-feather'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './routes'

import 'reshaped/themes/figma/theme.css'
import 'reshaped/themes/reshaped/theme.css'
import 'reshaped/themes/fragments/twitter/theme.css'
import 'reshaped/themes/slate/theme.css'

const App = () => {
  const [isDark, setIsDark] = useState(false)

  return (
    <Reshaped>
      <nav>
        <View h-full w-full direction='row' justify='space-between'>
          <View direction='row' padding={1}>
            <Avatar size={7} />
            {/* 页面栈位置 */}
          </View>
          {/* 用户和设置 */}
          <View direction='row' gap={3}>
            <View direction='row' gap={1}>
              <Button color='primary' variant='ghost' icon={<Sun />} />
              <Button color='primary' variant='ghost' icon={<Settings />} />
              <Button color='primary' variant='ghost' icon={<Avatar size={7} src='https://avatars.githubusercontent.com/u/133302251?v=4' />} />
            </View>
            {/* 右上角三按钮 */}
            <View direction='row' gap={1}>
              <Button color='primary' variant='ghost' icon={<Minus />} />
              <Button color='primary' variant='ghost' icon={<Square />} />
              <Button color='primary' variant='ghost' icon={<X />} />
            </View>
          </View>
        </View>
      </nav>
      <main w-full h-full>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </main>
    </Reshaped>
  )
}

export default App