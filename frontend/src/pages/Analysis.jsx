import { useState } from "react";
import { analyzeWater } from "../api/api";
import { useAnalysisHistory } from "../context/AnalysisHistory";
import { friendlyError } from "../utils/format";
import PageHeader from "../components/PageHeader";
import WaterInput from "../components/WaterInput";
import AnalysisResult from "../components/AnalysisResult";
import ChatAssistant from "../components/ChatAssistant";

export default function Analysis() {
  const { record } = useAnalysisHistory();
  const [result, setResult] = useState(null);
  const [values, setValues] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (payload, rawValues) => {
    setError("");
    try {
      const data = await analyzeWater(payload);
      setResult(data);
      setValues(rawValues);
      record(payload, data);
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Analysis"
        description="Enter a reading to check it for unusual patterns, then ask the assistant what to verify next."
      />

      <div className="container page-body">
        {error && <div className="error-box page-error" role="alert">{error}</div>}

        <section className="workspace">
          <div className="workspace-col">
            <WaterInput onAnalyze={handleAnalyze} />
            <ChatAssistant />
          </div>
          <div className="workspace-col">
            <AnalysisResult result={result} values={values} />
          </div>
        </section>
      </div>
    </>
  );
}
