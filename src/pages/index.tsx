import { View, Button } from 'reshaped'
import { useTheme } from "reshaped";

const Index = () => {
const { setColorMode, invertColorMode, colorMode } = useTheme();

  return (
  // <View h-100vh w-100vw bg-background>
  
  <div style={{ backgroundColor: 'skyblue', width: '100vw', height: '95vh' }}>
    <View direction="row" align="center" gap={3}>
      {/* <View.Item>Mode: {colorMode}</View.Item> */}
      <Button onClick={invertColorMode}>Invert mode</Button>
      <Button onClick={() => setColorMode("dark")}>Switch to dark mode</Button>
    </View>
  </div>
  // </View>
)}

export default Index