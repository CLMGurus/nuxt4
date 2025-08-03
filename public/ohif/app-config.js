window.config = {
  routerBasename: "/ohif",
  extensions: [],
  modes: [],
  showStudyList: false,
  maxNumberOfWebWorkers: 3,
  showLoadingIndicator: !0,
  showWarningMessageForCrossOrigin: !0,
  showCPUFallbackMessage: !0,
  strictZSpacingForVolumeViewport: !0,
  defaultDataSourceName: "orthanc",
  dataSources: [
    {
      namespace: "@ohif/extension-default.dataSourcesModule.dicomweb",
      sourceName: "orthanc",
      configuration: {
        friendlyName: "local Orthanc DICOMWeb Server",
        name: "DCM4CHEE",
        wadoUriRoot:
          "https://hurad-be-dev.calmcliff-dbc4d523.centralindia.azurecontainerapps.io/dicom-web",
        qidoRoot:
          "https://hurad-be-dev.calmcliff-dbc4d523.centralindia.azurecontainerapps.io/dicom-web",
        wadoRoot:
          "https://hurad-be-dev.calmcliff-dbc4d523.centralindia.azurecontainerapps.io/dicom-web",
        qidoSupportsIncludeField: !0,
        supportsReject: !0,
        dicomUploadEnabled: !0,
        imageRendering: "wadors",
        thumbnailRendering: "wadors",
        enableStudyLazyLoad: !0,
        supportsFuzzyMatching: !0,
        supportsWildcard: !0,
        omitQuotationForMultipartRequest: !0,
        bulkDataURI: { enabled: !0 },
      },
    },
    {
      namespace: "@ohif/extension-default.dataSourcesModule.dicomjson",
      sourceName: "dicomjson",
      configuration: { friendlyName: "dicom json", name: "json" },
    },
    {
      namespace: "@ohif/extension-default.dataSourcesModule.dicomlocal",
      sourceName: "dicomlocal",
      configuration: { friendlyName: "dicom local" },
    },
  ],
  httpErrorHandler: (e) => {
    console.warn(e.status), console.warn("test, navigate to https://ohif.org/");
  },
};
