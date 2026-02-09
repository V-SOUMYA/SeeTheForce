import CanvasRenderer from "./CanvasRenderer";

function App() {
  console.log("App rendered");

  return (
    <div style={{ padding: 24 }}>
      <h1>SeeTheForce ⚡</h1>

      <CanvasRenderer />
    </div>
  );
}

export default App;
