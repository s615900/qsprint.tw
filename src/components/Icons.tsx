export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="s-lanes" viewBox="0 0 400 300">
          <path d="M-20,300 C100,175 300,175 420,300" fill="none" stroke="currentColor" strokeWidth="12" />
          <path d="M-20,300 C100,210 300,210 420,300" fill="none" stroke="currentColor" strokeWidth="12" opacity=".7" />
          <path d="M-20,300 C100,245 300,245 420,300" fill="none" stroke="currentColor" strokeWidth="12" opacity=".45" />
        </symbol>
        <symbol id="s-hurdle" viewBox="0 0 400 300">
          <g stroke="currentColor" strokeWidth="10" fill="none">
            <path d="M60,300 V170 H150 V300" />
            <path d="M195,300 V170 H285 V300" />
            <path d="M330,300 V170 H400 V300" />
          </g>
        </symbol>
        <symbol id="s-baton" viewBox="0 0 400 300">
          <path d="M10,230 Q200,60 390,230" fill="none" stroke="currentColor" strokeWidth="10" />
          <rect x="185" y="45" width="34" height="12" fill="currentColor" transform="rotate(24 200 51)" />
        </symbol>
        <symbol id="s-tape" viewBox="0 0 400 300">
          <rect x="0" y="135" width="400" height="26" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="6">
            <line x1="30" y1="135" x2="55" y2="161" />
            <line x1="90" y1="135" x2="115" y2="161" />
            <line x1="150" y1="135" x2="175" y2="161" />
            <line x1="210" y1="135" x2="235" y2="161" />
            <line x1="270" y1="135" x2="295" y2="161" />
            <line x1="330" y1="135" x2="355" y2="161" />
          </g>
        </symbol>
        <symbol id="s-podium" viewBox="0 0 400 300">
          <g fill="currentColor">
            <rect x="40" y="185" width="95" height="115" />
            <rect x="152" y="110" width="100" height="190" />
            <rect x="270" y="155" width="95" height="145" />
          </g>
        </symbol>
        <symbol id="s-stopwatch" viewBox="0 0 400 300">
          <circle cx="200" cy="165" r="92" fill="none" stroke="currentColor" strokeWidth="10" />
          <rect x="182" y="48" width="36" height="20" fill="currentColor" />
          <line x1="200" y1="165" x2="200" y2="98" stroke="currentColor" strokeWidth="7" />
          <line x1="200" y1="165" x2="252" y2="165" stroke="currentColor" strokeWidth="7" />
        </symbol>
        <symbol id="s-flags" viewBox="0 0 400 300">
          <line x1="0" y1="255" x2="400" y2="255" stroke="currentColor" strokeWidth="6" />
          <g fill="currentColor">
            <polygon points="25,255 25,190 78,222" />
            <polygon points="150,255 150,200 198,227" />
            <polygon points="270,255 270,185 322,220" />
          </g>
        </symbol>
        <symbol id="s-stands" viewBox="0 0 400 300">
          <g fill="currentColor">
            <rect x="0" y="235" width="400" height="22" />
            <rect x="0" y="203" width="400" height="22" opacity=".78" />
            <rect x="0" y="171" width="400" height="22" opacity=".56" />
            <rect x="0" y="139" width="400" height="22" opacity=".38" />
          </g>
        </symbol>
        <symbol id="s-blocks" viewBox="0 0 400 300">
          <g fill="currentColor">
            <polygon points="40,300 40,235 105,258 105,300" />
            <polygon points="165,300 165,235 230,258 230,300" />
            <polygon points="290,300 290,235 355,258 355,300" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
