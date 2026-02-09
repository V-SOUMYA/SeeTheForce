
export type Category = "motion_1d" | "motion_2d" | "free_fall" | "inclined_plane" | "circular_motion" | "graph_only" | "wave" | "optics";

export type VisualizationMode = "space_motion" | "space_and_graph" | "graph_only";

export interface MotionPoint {
  time: number;
  x: number;
  y: number;
}

export interface GraphPoint {
  time: number;
  value: number;
}

export interface PhysicsData {
  concept: string;
  category: Category;
  visualization_mode: VisualizationMode;
  assumptions: string[];
  space_motion?: {
    object: string;
    unit: string;
    motion: MotionPoint[];
  };
  graph?: {
    type: "position_vs_time" | "velocity_vs_time";
    x_label: string;
    y_label: string;
    ticks: {
      x: number[];
      y: number[];
    };
    points: GraphPoint[];
  };
  final_answer: string;
  teaching_note: string;
}
