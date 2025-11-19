declare module "svg-path-parser" {
  export interface SVGCommand {
    code: string;
    command: string;
    relative?: boolean;
    x?: number;
    y?: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    largeArc?: boolean;
    sweep?: boolean;
    rx?: number;
    ry?: number;
  }

  export function parseSVG(d: string): SVGCommand[];
  export function makeAbsolute(commands: SVGCommand[]): SVGCommand[];
}
