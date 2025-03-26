import { useState, useEffect, useRef } from "react";
import TextSettings from "../interfaces/TextSettings";
interface TextBoxProps {
  children: string;
  textSettings: TextSettings | null;
  onChange?: (typed: string) => void;
  onStartTyping?: () => void;
  onFinish?: () => void;
  onBackspace?: () => void;
  onMistake?: (worstTypoSpiral: number) => void;
  disabled?: boolean;
}

const TextBox = ({
  children,
  textSettings,
  onChange = () => {},
  onStartTyping = () => {},
  onFinish = () => {},
  onBackspace = () => {},
  onMistake = () => {},
  disabled = false,
}: TextBoxProps) => {
  const referenceText = children;
  const [typedChars, setTypedChars] = useState<string[]>(
    Array(referenceText.length).fill("")
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const worstTypoSpiral = useRef(0);
  const currentTypoSpiral = useRef(0);

  // Focus on mount and when disabled changes to false
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  // Detect full completion
  useEffect(() => {
    if (currentIndex === referenceText.length && referenceText.length > 0) {
      onFinish();
    }
  }, [currentIndex, referenceText.length, onFinish]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent default behavior for most keys
    if (e.key.length === 1 || e.key === "Backspace") {
      e.preventDefault();
    }

    if (e.key.length === 1 && currentIndex < referenceText.length) {
      if (!started) {
        setStarted(true);
        onStartTyping();
      }
      if (e.key === referenceText[currentIndex] && e.key === " ") {
        currentTypoSpiral.current = 0;
      } else if (e.key !== referenceText[currentIndex]) {
        currentTypoSpiral.current++;
        console.log(currentTypoSpiral);
        if (currentTypoSpiral.current > worstTypoSpiral.current) {
          worstTypoSpiral.current = currentTypoSpiral.current;
          onMistake(worstTypoSpiral.current);
        }
      }

      const newTypedChars = [...typedChars];
      newTypedChars[currentIndex] = e.key;
      setTypedChars(newTypedChars);
      setCurrentIndex((prev) => prev + 1);
      onChange(newTypedChars.join(""));
    } else if (e.key === "Backspace" && currentIndex > 0) {
      onBackspace();
      const newTypedChars = [...typedChars];
      newTypedChars[currentIndex - 1] = "";
      setTypedChars(newTypedChars);
      setCurrentIndex((prev) => prev - 1);
      onChange(newTypedChars.join(""));
    }
  };

  const opacity = textSettings?.textOpacity || 1;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          fontFamily: textSettings?.fontFamily || "monospace",
          fontSize: textSettings?.fontSize || "16px",
          fontWeight: textSettings?.fontWeight || "normal",
          fontStyle: textSettings?.fontStyle || "normal",

          padding: "0.375rem 0.75rem",
          margin: "0.5rem",
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
          lineHeight: textSettings?.lineHeight ?? 1.5,
          minHeight: "8rem",
          whiteSpace: "pre-wrap",
          color: textSettings?.color || "black",
          backgroundColor: textSettings?.backgroundColor || "white",
          opacity: disabled ? opacity * 0.7 : opacity,
          letterSpacing: textSettings?.letterSpacing || 0,
          wordSpacing: textSettings?.wordSpacing || 0,
          textAlign: (textSettings?.textAlign || "left") as
            | "left"
            | "right"
            | "center"
            | "justify",
        }}
      >
        {referenceText.split("").map((char, index) => {
          const typedChar = typedChars[index];
          let color = "black";
          if (typedChar !== "") {
            color = typedChar === char ? "green" : "red";
          }
          return (
            <span
              key={index}
              style={{
                color,
                backgroundColor:
                  index === currentIndex ? "#e0e0e0" : "transparent",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "default",
        }}
        spellCheck="false"
      />
    </div>
  );
};

export default TextBox;
