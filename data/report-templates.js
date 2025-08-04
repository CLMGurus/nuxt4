export const chestXrayTemplates = [
  {
    name: "Normal Chest X-ray",
    modality: "CR",
    body_part: "Chest",
    template: {
      EXAMINATION: "Chest radiograph (PA and Lateral views)",
      TECHNIQUE:
        "PA and lateral chest X-rays obtained. Adequate inspiration and no motion artifact.",
      FINDINGS: {
        Cardiomediastinal:
          "Heart size is normal. Mediastinal contours are within normal limits.",
        Lungs:
          "Lungs are clear bilaterally. No consolidation, nodules, or masses.",
        Pleura: "No pleural effusion or pneumothorax.",
        Diaphragm: "Diaphragm appears normal. Costophrenic angles are sharp.",
        Bones: "No acute bony abnormalities noted.",
      },
      IMPRESSION: "Normal chest X-ray.",
    },
  },
  {
    name: "Pulmonary Tuberculosis",
    modality: "CR",
    body_part: "Chest",
    template: {
      EXAMINATION: "Chest radiograph (PA view)",
      TECHNIQUE: "PA view of chest. Adequate exposure and inspiration.",
      FINDINGS: {
        Cardiomediastinal: "Normal heart size and mediastinal silhouette.",
        Lungs:
          "Right upper zone fibronodular opacities and cavitation with volume loss.",
        Pleura: "Mild pleural thickening in right apex.",
        Diaphragm: "Normal contour.",
        Bones: "No rib fractures or bony lesions.",
      },
      IMPRESSION:
        "Findings suggestive of post-primary tuberculosis. Recommend HRCT for further evaluation.",
    },
  },
  {
    name: "Chronic Obstructive Pulmonary Disease (COPD)",
    modality: "CR",
    body_part: "Chest",
    template: {
      EXAMINATION: "Chest radiograph (PA and lateral views)",
      TECHNIQUE: "PA and lateral views obtained with adequate inspiration.",
      FINDINGS: {
        Cardiomediastinal:
          "Heart is mildly elongated, consistent with cor pulmonale.",
        Lungs:
          "Hyperinflated lung fields with flattened diaphragms. No consolidation or focal opacity.",
        Pleura: "No pleural effusion or pneumothorax.",
        Diaphragm: "Flattened bilaterally.",
        Bones: "No acute osseous abnormality.",
      },
      IMPRESSION:
        "Radiographic features consistent with chronic obstructive pulmonary disease (COPD).",
    },
  },
  {
    name: "Pleural Effusion",
    modality: "CR",
    body_part: "Chest",
    template: {
      EXAMINATION: "Chest radiograph (PA and lateral views)",
      TECHNIQUE: "PA and lateral views. Slight under-inflation noted.",
      FINDINGS: {
        Cardiomediastinal: "Cardiac silhouette is mildly enlarged.",
        Lungs:
          "Left lower lung zone obscured by homogeneous opacity with meniscus sign.",
        Pleura: "Large left-sided pleural effusion. No pneumothorax.",
        Diaphragm: "Left diaphragm not clearly visualized.",
        Bones: "No rib fractures or lesions seen.",
      },
      IMPRESSION:
        "Large left pleural effusion with underlying lung collapse. Recommend ultrasound or CT for further evaluation.",
    },
  },
];
