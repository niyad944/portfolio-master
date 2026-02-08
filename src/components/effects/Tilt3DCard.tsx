import React from "react";
import { useTilt3D } from "@/hooks/useTilt3D";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  as?: keyof JSX.IntrinsicElements;
}

const Tilt3DCard = ({
  children,
  className = "",
  maxTilt = 6,
  scale = 1.02,
  as: Tag = "div",
}: Tilt3DCardProps) => {
  const tiltRef = useTilt3D<HTMLDivElement>({ maxTilt, scale });

  return (
    <div
      ref={tiltRef}
      className={`tilt-3d-card ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

export default Tilt3DCard;
