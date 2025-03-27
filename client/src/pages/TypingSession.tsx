import { useState, useEffect, useCallback } from "react";
import TextBox from "../components/TextBox";
import CounterStatistic from "../components/CounterStatistic";
import GraphStatistic from "../components/GraphStatistic";
import StatisticsContainer from "../components/StatisticsContainer";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";
import { TypingResult } from "../interfaces/TypingResult";
import NamePrompt from "../components/NamePrompt";
import TextSettings from "../interfaces/TextSettings";

const TypingSession: React.FC = () => {
  const [referenceText, setReferenceText] = useState<string>("");
  const [textSettings, setTextSettings] = useState<TextSettings>();
  const [backspaceCounter, setBackspaceCounter] = useState<number>(0);
  const [mistakesCounter, setMistakesCounter] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [wpmData, setWpmData] = useState<{ time: number; value: number }[]>([]);
  const [accData, setAccData] = useState<{ time: number; value: number }[]>([]);
  const navigate = useNavigate();
  const time_limit = 20;
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingStats, setPendingStats] = useState<{
    wpm: number;
    accuracy: number;
    text_length: number;
    time_taken: number;
  } | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      const response = await fetch("http://localhost:5000/api/start-test");
      const data = await response.json();
      setReferenceText(data.text);
      setTextSettings(data.textSettings);
    };
    fetchTestData();
  }, []);

  const handleBackspace = useCallback(() => {
    setBackspaceCounter((prev) => prev + 1);
  }, []);
  const handleMistake = (worstTypoSpiral: number) => {
    setMistakesCounter((prev) => Math.max(prev, worstTypoSpiral));
  };

  const handleStartTyping = () => {
    setStartTime(Date.now());
    setIsRunning(true);
    setWpmData([]);
    setAccData([]);
  };

  const handleChange = (typed: string) => {
    if (startTime) {
      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === referenceText[i]) {
          correct++;
        }
      }
      const timeElapsed = (Date.now() - startTime) / 60000;

      const newAccuracy = (correct / Math.max(typed.length, 1)) * 100;
      setAccuracy(Math.round(newAccuracy));
      setAccData((prev) => [
        ...prev,
        { time: timeElapsed * 60, value: newAccuracy },
      ]);

      const words = typed.length / 5;
      const currentWPM = Math.round(words / timeElapsed);
      setWpmData((prev) => [
        ...prev,
        { time: timeElapsed * 60, value: currentWPM },
      ]);
    }
  };

  const handleFinish = useCallback(
    (remainingTime?: number) => {
      if (isFinished) return; // Prevent multiple executions
      setIsRunning(false);
      setIsFinished(true);
      console.log("Finished in", time_limit - (remainingTime ?? 0), "seconds");

      // Calculate final stats
      const lastWpmDataPoint = wpmData[wpmData.length - 1];
      if (lastWpmDataPoint) {
        const time_taken = time_limit - (remainingTime ?? 0);
        const text_length_words = referenceText.split(" ").length;
        // Split spaces
        setPendingStats({
          wpm: lastWpmDataPoint.value,
          accuracy: accuracy,
          text_length: text_length_words,
          time_taken: time_taken,
        });
        setShowNamePrompt(true);
      }
    },
    [wpmData, accuracy, referenceText, time_limit, isFinished]
  );

  const submitResults = async (stats: {
    wpm: number;
    accuracy: number;
    text_length: number;
    user_id: string;
    time_taken: number;
  }) => {
    try {
      const resultData: TypingResult = {
        user_id: stats.user_id,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        text_length: stats.text_length,
        time_taken: stats.time_taken,
        key_data: wpmData,
      };

      const response = await fetch("http://localhost:5000/api/typing-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit results");
      }

      const data = await response.json();
      console.log("Navigating to results with id:", data.id);

      // Use replace instead of push to prevent going back to the test
      navigate(`/results/${data.id}`, { replace: true });
    } catch (error) {
      console.error("Error submitting results:", error);
      navigate("/results", { replace: true });
    }
  };

  const handleNameSubmit = (name: string) => {
    if (pendingStats) {
      // Make sure state updates are complete before navigation
      setShowNamePrompt(false);
      submitResults({
        ...pendingStats,
        user_id: name,
      });
    }
  };

  const handleNameCancel = () => {
    if (pendingStats) {
      // Make sure state updates are complete before navigation
      setShowNamePrompt(false);
      submitResults({
        ...pendingStats,
        user_id: "anonymous",
      });
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 100,
        }}
      >
        <Timer
          duration={time_limit}
          isRunning={isRunning}
          startTime={startTime ?? undefined}
          onComplete={(remainingTime) => handleFinish(remainingTime)}
        />
      </div>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: "1",
            flexGrow: "1",
          }}
        >
          <StatisticsContainer>
            <GraphStatistic
              label="WPM"
              data={wpmData}
              expected_value={50}
              color="#22c55e"
              time_limit={time_limit}
            />
            <GraphStatistic
              label="Accuracy"
              data={accData}
              expected_value={100}
              color="#22c55e"
              time_limit={time_limit}
            />
          </StatisticsContainer>
        </div>

        <div
          style={{
            width: "50%",
            minWidth: "600px",
            maxWidth: "800px",
          }}
        >
          <TextBox
            textSettings={textSettings ?? null}
            onStartTyping={handleStartTyping}
            onChange={handleChange}
            onFinish={() => {
              setIsRunning(false); // This will trigger Timer's useEffect to call onComplete with remaining time
            }}
            onBackspace={handleBackspace}
            onMistake={handleMistake}
            disabled={isFinished}
          >
            {referenceText}
          </TextBox>
        </div>

        <div
          style={{
            flex: "1",
            flexGrow: "1",
          }}
        >
          <StatisticsContainer>
            <CounterStatistic
              label="Accuracy"
              value={accuracy}
              unit="%"
              color="#3b82f6"
            />
            <CounterStatistic
              label="Backspace counter"
              value={backspaceCounter}
              unit="times"
              color="#cdccc8"
            />
            <CounterStatistic
              label="Worst typo spiral"
              value={mistakesCounter}
              unit="times"
              color="#cd1c18"
            />
          </StatisticsContainer>
        </div>
      </div>
      {showNamePrompt && (
        <NamePrompt onSubmit={handleNameSubmit} onCancel={handleNameCancel} />
      )}
    </>
  );
};

export default TypingSession;
