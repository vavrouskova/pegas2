export interface ImageNode {
  sourceUrl: string;
  altText: string;
}

export interface ConsultantACF {
  profileImage?: {
    node: ImageNode;
  };
  positionDescription?: string;
}

export interface Consultant {
  title?: string;
  zamestnanciACF?: ConsultantACF;
}

export interface PobockyACF {
  city?: string;
  phoneNumber?: string;
  email?: string;
  openDaysWorking?: string;
  openDaysWeekend?: string;
  parking?: string;
  visitUs?: string;
  wheelchairAccess?: boolean;
  internalImage?: {
    node: ImageNode;
  };
  consultant?: {
    nodes?: Consultant[];
  };
}

export interface BranchData {
  title: string;
  pobockyACF?: PobockyACF;
  featuredImage?: {
    node: ImageNode;
  };
}
