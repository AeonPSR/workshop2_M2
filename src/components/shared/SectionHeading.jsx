import { cn } from "@/lib/utils";

export default function SectionHeading({
  as: Tag = "h2",
  eyebrow,
  titleClassName,
  className,
  children,
}) {
  return (
    <div className={cn("mb-10", className)}>
      {eyebrow && (
        <p className="text-xs tracking-widest text-accent uppercase mb-2">
          {eyebrow}
        </p>
      )}
      <Tag className={titleClassName}>{children}</Tag>
    </div>
  );
}
