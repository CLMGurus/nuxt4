import type {
  DicomStudy,
  DicomMetadata,
  StudyReport,
  DicomFile,
  SharedStudyInfo,
} from "~/types/dicom";

export const mockStudies: DicomStudy[] = [
  {
    id: "1",
    studyDescription: "Chest CT",
    patientName: "Jane Smith",
    patientId: "P005678",
    studyDate: "2024-01-14",
    studyTime: "10:15:00",
    modality: "CT",
    numberOfImages: 245,
    numberOfSeries: 4,
    fileSize: 189440000,
    status: "completed",
    accessionNumber: "ACC789012",
    uploadDate: "2024-01-14T10:30:00Z",
  },
];

export const mockMetadata: Record<string, DicomMetadata> = {
  "1": {
    studyInstanceUID: "1.2.840.113619.2.176.2025.1828736.1",
    seriesInstanceUID: "1.2.840.113619.2.176.2025.1828736.1.1",
    patientBirthDate: "1985-06-15",
    patientSex: "M",
    institutionName: "Central Medical Center",
    rows: 512,
    columns: 512,
    sliceThickness: 1.5,
    pixelSpacing: "0.5x0.5",
    windowCenter: 50,
    windowWidth: 400,
    photometricInterpretation: "MONOCHROME2",
  },
};

export const mockReports: Record<string, StudyReport[]> = {
  "1": [
    {
      id: "R002",
      reportType: "preliminary",
      status: "draft",
      radiologist: "Dr. Michael Chen",
      reportDate: "2024-01-14",
      findings:
        "Clear lung fields bilaterally. No evidence of pulmonary nodules or consolidation. Heart size within normal limits.",
      impression: "Normal chest CT scan.",
    },
    {
      id: "R003",
      reportType: "addendum",
      status: "rejected",
      radiologist: "Dr. Michael Chen",
      reportDate: "2024-01-14",
      findings: "No evidence of pulmonary nodules or consolidation",
      impression: "Normal chest CT scan.",
    },
    {
      id: "R003",
      reportType: "final",
      status: "approved",
      radiologist: "Dr. Michael Chen",
      reportDate: "2024-01-14",
      findings:
        "Clear lung fields bilaterally. No evidence of pulmonary nodules or consolidation. Heart size within normal limits.",
      impression: "Normal chest CT scan.",
    },
  ],
};

export const mockFiles: Record<string, DicomFile[]> = {
  "1": [
    {
      id: "F004",
      fileName: "CT-0001-0001.dcm",
      seriesNumber: 1,
      instanceNumber: 1,
      fileSize: 524288,
      imageType: "Axial",
    },
    {
      id: "F005",
      fileName: "CT-0001-0002.dcm",
      seriesNumber: 1,
      instanceNumber: 2,
      fileSize: 524288,
      imageType: "Axial",
    },
  ],
};

export const mockSharedInfo: Record<string, SharedStudyInfo[]> = {
  "1": [
    {
      id: "S002",
      sharedBy: "Dr. Johnson",
      sharedWith: ["Dr. Wilson", "Dr. Davis"],
      shareDate: "2024-01-15T16:30:00Z",
      accessLevel: "view",
      message: "Please review",
      expiryDate: "2024-02-15T16:30:00Z",
    },
    {
      id: "S003",
      sharedBy: "Dr. Johnson",
      sharedWith: ["Dr. Shan"],
      shareDate: "2024-01-15T18:30:00Z",
      accessLevel: "download",
      message: "Please review the effusion",
      expiryDate: "2024-02-16T18:30:00Z",
    },
  ],
};
