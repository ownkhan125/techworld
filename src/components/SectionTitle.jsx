import { cn } from "@/utils/cn";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import ScrollTextReveal from "./ScrollTextReveal";
import Eyebrow from "./Eyebrow";

export default function SectionTitle({
  eyebrow,
  eyebrowTone = "cyan",
  title,
  sub,
  align = "center",
  className,
  titleClassName,
}) {
  const isCenter = align === "center";
  return (
    <header
      className={cn(
        // Tighter gap ladder — was gap-5, gave section titles too much air
        // between the eyebrow, heading and sub. gap-3 sm:gap-4 lets titles
        // read as one composed block.
        "flex flex-col gap-3 sm:gap-4",
        isCenter ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <div data-stage="frame">
          <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <div data-stage="heading" className={cn(isCenter ? "w-full" : "")}>
        {/* Explicit text-center at the h2 level: text-align inherits from
            the header, but inline-block .split-word children of SplitText
            can still read left-flushed inside a max-width block if a parent
            resets alignment. Setting text-center here guarantees the words
            centre-flow every time. */}
        <SplitText
          text={title}
          as="h2"
          className={cn(
            "text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg sm:text-4xl md:text-5xl",
            isCenter
              ? "mx-auto max-w-[20ch] text-center"
              : "max-w-[20ch] text-left",
            titleClassName
          )}
        />
      </div>
      {sub ? (
        // Scroll-tied word-by-word reveal (reverses on scroll up). Sits
        // outside data-stage="body" so it owns its own scrub timeline
        // rather than double-animating with CinematicSection's body stage.
        typeof sub === "string" ? (
          <ScrollTextReveal
            as="p"
            className={cn(
              "max-w-[54ch] text-balance text-[15px] leading-[1.55] text-fg-2 sm:text-base",
              isCenter ? "mx-auto text-center" : "text-left"
            )}
          >
            {sub}
          </ScrollTextReveal>
        ) : (
          <Reveal as="p" delay={120} data-stage="body">
            <span
              className={cn(
                "max-w-[54ch] text-balance text-[15px] leading-[1.55] text-fg-2 sm:text-base",
                isCenter ? "mx-auto text-center" : "text-left"
              )}
            >
              {sub}
            </span>
          </Reveal>
        )
      ) : null}
    </header>
  );
}
