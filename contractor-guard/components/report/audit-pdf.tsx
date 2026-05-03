import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  score: { fontSize: 36, fontWeight: "bold", color: "#2563EB", textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", borderBottom: "1px solid #e5e7eb", paddingVertical: 8 },
  req: { width: "70%", paddingRight: 10 },
  status: { width: "15%" },
  finding: { width: "15%", color: "#6b7280" },
});

export function AuditPDF({ audit, results }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Отчёт аудита технического задания</Text>
        <Text style={styles.subtitle}>Оценка качества</Text>
        <Text style={styles.score}>{audit.score}%</Text>
        <View>
          <View style={[styles.row, { backgroundColor: "#f9fafb" }]}>
            <Text style={[styles.req, { fontWeight: "bold" }]}>Требование</Text>
            <Text style={[styles.status, { fontWeight: "bold" }]}>Статус</Text>
            <Text style={[styles.finding, { fontWeight: "bold" }]}>Замечание</Text>
          </View>
          {results.map((r: any, i: number) => (
            <View style={styles.row} key={i}>
              <Text style={styles.req}>{r.requirement}</Text>
              <Text style={styles.status}>
                {r.status === "ok" ? "✅" : r.status === "partial" ? "⚠️" : "❌"}
              </Text>
              <Text style={styles.finding}>{r.finding ?? ""}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}