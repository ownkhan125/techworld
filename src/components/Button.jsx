import Link from "next/link";
import { cn } from "@/utils/cn";

export default function Button({
  href,
  children,
  variant = "primary",
  className,
  trailingIcon,
  leadingIcon,
  ...rest
}) {
  const base = variant === "primary" ? "btn-key" : "btn-ghost";
  const inner = (
    <>
      {leadingIcon ? <span className="-ml-1 inline-flex">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="-mr-1 inline-flex">{trailingIcon}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, className)} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cn(base, className)} {...rest}>
      {inner}
    </button>
  );
}
