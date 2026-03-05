export function HintButton({ hint, hintUsed, onUseHint, showHint }) {
  return (
    <div className="hint-section">
      <button
        className="hint-btn"
        onClick={onUseHint}
        disabled={hintUsed}
      >
        💡 {hintUsed ? 'Hint Used' : 'Get Hint'}
      </button>
      {showHint && (
        <div className="hint-box">
          <p className="hint-text">{hint}</p>
        </div>
      )}
    </div>
  );
}
