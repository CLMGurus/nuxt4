import { defineStore } from "pinia";

export const useReportStore = defineStore("reportStore", {
  state: () => ({
    reports: {},
    report: null,
  }),
  actions: {
    setReport(report) {
      const key = report.report_id || report.user_id;
      this.reports[key] = report;
      this.report = report;
    },
    getReportById(id) {
      return this.reports[id] || null;
    },
    clear() {
      this.reports = {};
      this.report = null;
    },
  },
});
