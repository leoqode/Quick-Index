import React from "react";

interface KeyboardDiagramProps {
  mistypedKeyLabels: Set<string>;
}

const KeyboardDiagram: React.FC<KeyboardDiagramProps> = ({
  mistypedKeyLabels,
}) => {
  const keyboardRows = [
    [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "Backspace",
    ],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    [
      "CapsLock",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      ";",
      "'",
      "Enter",
    ],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Control", "Meta", "Alt", "Space", "Alt", "Meta", "Menu", "Control"],
  ];

  return (
    <div className='keyboard-diagram mt-8'>
      {keyboardRows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className='keyboard-row flex justify-center mb-1'
        >
          {row.map((key, keyIndex) => {
            const keyLabel = key.length === 1 ? key.toUpperCase() : key;
            const isMistyped = mistypedKeyLabels.has(keyLabel);

            const keyClassName = `keyboard-key ${
              isMistyped ? "bg-red-500 text-white" : "bg-gray-700 text-white"
            } rounded p-2 m-0.5 text-center`;

            return (
              <div key={`key-${keyIndex}`} className={keyClassName}>
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default KeyboardDiagram;
