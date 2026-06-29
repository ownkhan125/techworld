import Link from "next/link";
import Reveal from "@/components/Reveal";
import CinematicSection from "@/components/CinematicSection";
import Fig1 from "@/components/dev-figures/Fig1";
import Fig3 from "@/components/dev-figures/Fig3";
import Fig4 from "@/components/dev-figures/Fig4";
import Fig5 from "@/components/dev-figures/Fig5";
import Fig6 from "@/components/dev-figures/Fig6";

const ArrowUR = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M4 10L10 4M10 4H5M10 4v5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function ImageCell({ label, index, children }) {
  return (
    <div className="dev-fig" style={{ "--i": index }}>
      <span className="dev-fig__label">{label}</span>
      <span className="dev-fig__arrow"><ArrowUR /></span>
      <div className="dev-fig__stage">{children}</div>
    </div>
  );
}

function TextCell({ label, index, title, body, link }) {
  return (
    <div className="dev-fig dev-fig--text" style={{ "--i": index }}>
      <span className="dev-fig__label">{label}</span>
      <h3 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-fg sm:text-[32px] lg:text-[36px]">
        {title}
      </h3>
      <p className="mt-5 max-w-[34ch] font-mono text-[12.5px] leading-[1.7] text-fg-3">
        {body}
      </p>
      {link ? (
        <div className="mt-7">
          <Link
            href={link.href}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-fg transition-colors duration-300 hover:text-cyan"
          >
            {link.label}
            <ArrowUR />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default function Developer() {
  return (
    <CinematicSection className="section-pad relative overflow-hidden">
      <div className="container-x">
        <Reveal data-stage="frame">
          <div className="dev-grid">
            {/* Row 1 */}
            <TextCell
              index={0}
              label="FIG_01"
              title={<>Build the<br />perfect tools.</>}
              body="Our extension API is designed to allow anyone with web development skills to unleash the power of Techworld."
              link={{ href: "#", label: "Read the docs" }}
            />
            <ImageCell index={1} label="FIG_01"><Fig1 /></ImageCell>

            {/* Row 2 */}
            <ImageCell index={2} label="FIG_02"><Fig5 /></ImageCell>
            <TextCell
              index={3}
              label="FIG_02"
              title="Native to your stack."
              body="Build rich, native extensions with the technologies you already know: React, TypeScript and Node."
            />

            {/* Row 3 */}
            <TextCell
              index={4}
              label="FIG_03"
              title="Built-in UI."
              body="Our component library lets you focus on the logic while we push the pixels. Everything composes."
            />
            <ImageCell index={5} label="FIG_03"><Fig3 /></ImageCell>

            {/* Row 4 */}
            <ImageCell index={6} label="FIG_04"><Fig4 /></ImageCell>
            <TextCell
              index={7}
              label="FIG_04"
              title="Live indicators."
              body="Surface real-time status — calls in flight, jobs running, active sessions — without writing one line of UI."
            />

            {/* Row 5 */}
            <TextCell
              index={8}
              label="FIG_05"
              title="Publish to the Store."
              body="Submit your extension to the Techworld Store and share it with thousands of users."
              link={{ href: "#", label: "Get started" }}
            />
            <ImageCell index={9} label="FIG_05"><Fig6 /></ImageCell>
          </div>
        </Reveal>
      </div>
    </CinematicSection>
  );
}
