import { cn } from "@/utils/cn";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
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
        "flex flex-col gap-5",
        isCenter ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <div data-stage="frame">
          <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <div data-stage="heading">
        <SplitText
          text={title}
          as="h2"
          className={cn(
            "max-w-[18ch] text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg sm:text-4xl md:text-5xl",
            isCenter ? "justify-center" : "justify-start",
            titleClassName
          )}
        />
      </div>
      {sub ? (
        <Reveal as="p" delay={120} data-stage="body">
          <span
            className={cn(
              "max-w-[52ch] text-balance text-base text-fg-3 sm:text-lg",
              isCenter ? "mx-auto" : ""
            )}
          >
            {sub}
          </span>
        </Reveal>
      ) : null}
    </header>
  );
}
