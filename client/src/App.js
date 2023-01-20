import Canvas from './components/Canvas';
import './App.css'

const draw = context => {

  // Insert your canvas API code to draw an image
};
function App() {
  return (
    <Canvas draw={draw} height={500} width={500} />
  );
}
export default App;
