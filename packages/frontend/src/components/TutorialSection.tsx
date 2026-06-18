import { useState } from 'react';

interface Step {
  title: string;
  body: string;
}

interface TutorialSectionProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  steps: Step[];
  defaultOpen?: boolean;
}

export function TutorialSection({
  eyebrow = 'Field guide',
  title,
  intro,
  steps,
  defaultOpen = false,
}: TutorialSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="it-tutorial">
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="it-eyebrow" style={{ color: 'var(--brass-deep)' }}>
            § {eyebrow}
          </div>
          <h3
            className="it-display"
            style={{
              fontSize: 26,
              margin: '6px 0 0',
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            {title.split('*').map((part, i) =>
              i % 2 === 1 ? (
                <em
                  key={i}
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--brass-deep)',
                    fontVariationSettings: "'SOFT' 100, 'opsz' 144",
                  }}
                >
                  {part}
                </em>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h3>
          {intro && (
            <p
              style={{
                margin: '10px 0 0',
                color: 'var(--ink-soft)',
                fontSize: 14,
                maxWidth: 620,
                lineHeight: 1.6,
              }}
            >
              {intro}
            </p>
          )}
        </div>
        <button
          type="button"
          className="it-help-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? '— Hide guide' : '+ Show guide'}
        </button>
      </div>

      {open && (
        <div
          className="it-tutorial-steps it-stagger"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            marginTop: 20,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {steps.map((step, i) => (
            <div key={i} className="it-step">
              <div className="it-step-num">{i + 1}</div>
              <div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
