export interface IsoViscosityGrade {
  grade: number;
  midpoint: number;
  min: number;
  max: number;
}

export const ISO_VISCOSITY_GRADES: IsoViscosityGrade[] = [
  { grade: 2, midpoint: 2.2, min: 1.98, max: 2.42 },
  { grade: 3, midpoint: 3.2, min: 2.88, max: 3.52 },
  { grade: 5, midpoint: 4.6, min: 4.14, max: 5.06 },
  { grade: 7, midpoint: 6.8, min: 6.12, max: 7.48 },
  { grade: 10, midpoint: 10, min: 9.0, max: 11.0 },
  { grade: 15, midpoint: 15, min: 13.5, max: 16.5 },
  { grade: 22, midpoint: 22, min: 19.8, max: 24.2 },
  { grade: 32, midpoint: 32, min: 28.8, max: 35.2 },
  { grade: 46, midpoint: 46, min: 41.4, max: 50.6 },
  { grade: 68, midpoint: 68, min: 61.2, max: 74.8 },
  { grade: 100, midpoint: 100, min: 90, max: 110 },
  { grade: 150, midpoint: 150, min: 135, max: 165 },
  { grade: 220, midpoint: 220, min: 198, max: 242 },
  { grade: 320, midpoint: 320, min: 288, max: 352 },
  { grade: 460, midpoint: 460, min: 414, max: 506 },
  { grade: 680, midpoint: 680, min: 612, max: 748 },
  { grade: 1000, midpoint: 1000, min: 900, max: 1100 },
  { grade: 1500, midpoint: 1500, min: 1350, max: 1650 },
];

