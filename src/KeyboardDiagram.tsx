const Keyboard = ({ mistypedKeys = new Set() }) => {
  const keyboardLayout = [
    // Row 1
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE'],
    // Row 2
    ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    // Row 3
    ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
    // Row 4
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
    // Row 5
    ['CTRL', 'FN', 'WIN', 'ALT', 'SPACE', 'ALT', 'CTRL', '←', '↑', '↓', '→']
  ];

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'BACKSPACE':
        return 'w-24';
      case 'TAB':
      case 'CAPS':
      case 'ENTER':
        return 'w-20';
      case 'SHIFT':
        return 'w-[88px]';
      case 'SPACE':
        return 'w-64';
      case 'CTRL':
      case 'ALT':
      case 'FN':
      case 'WIN':
        return 'w-16';
      default:
        return 'w-12';
    }
  };

  const getKeyHeight = () => {
    return 'h-12';
  };

  const Key = ({ label }: { label: string }) => {
    const isMistyped = mistypedKeys.has(label);
    const width = getKeyWidth(label);
    const height = getKeyHeight();

    return (
      <div
        className={`
          ${width} ${height}
          relative group
          flex items-center justify-center
          bg-gray-800 rounded-lg
          m-0.5
          transition-all duration-200
          ${isMistyped ? 'bg-red-900/50' : 'hover:bg-gray-700'}
        `}
      >
        <div 
          className={`
            absolute -inset-0.5 
            rounded-lg opacity-50 
            transition-opacity
            ${isMistyped 
              ? 'bg-gradient-to-r from-red-500 to-red-700 opacity-100' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:opacity-100'
            }
            blur-[1px]
          `}
        />

        <div className={`
          relative 
          w-full h-full 
          flex items-center justify-center
          bg-gray-900 rounded-md
          font-medium
          ${isMistyped ? 'text-red-400' : 'text-gray-400'}
          group-hover:text-white
          transition-colors
          text-sm
        `}>
          {label}
        </div>

        {isMistyped && (
          <div className="absolute inset-0 rounded-lg bg-red-500/50 bold-sm" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-800/50 rounded-xl p-6 shadow-2xl">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-75 blur"></div>
          <div className="relative bg-gray-900 rounded-lg p-4">
            {keyboardLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-1 last:mb-0">
                {row.map((key, keyIndex) => (
                  <Key key={`${rowIndex}-${keyIndex}`} label={key} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
