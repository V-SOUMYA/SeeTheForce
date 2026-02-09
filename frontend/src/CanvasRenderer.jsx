import { useEffect, useRef } from "react";

export default function CanvasRenderer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    console.log("Drawing test circle");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(150, 200, 20, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={400}
      style={{
        border: "2px solid red",
        marginTop: 20,
        background: "#fff",
      }}
    />
  );
}
