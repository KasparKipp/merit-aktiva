import type { UUID } from "@/aktiva/types";
export type Dimension = {
    DimID: string;
    DimValueId: UUID;
    DimCode: string;
  };

export type Dimensions = Dimension[]