import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold font-inter whitespace-nowrap transition-all outline-none select-none focus-visible:border-primary-3 focus-visible:ring-3 focus-visible:ring-primary-3/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:     "bg-primary-3 text-neutral hover:opacity-90",
        outline:     "border-primary-3 text-primary-3 bg-transparent hover:bg-primary-3 hover:text-neutral",
        secondary:   "bg-neutral-bg text-neutral-teks hover:bg-neutral-border",
        ghost:       "text-neutral-teks hover:bg-neutral-bg hover:text-primary-2",
        destructive: "bg-secondary/10 text-secondary hover:bg-secondary/20",
        link:        "text-primary-3 underline-offset-4 hover:underline",
        gradient:    "bg-gradient-primary text-neutral hover:opacity-90",
      },
      size: {
        default: "h-8 gap-1.5 px-4",
        xs:      "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-7 gap-1 rounded-xl px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg:      "h-11 gap-1.5 px-6 text-base",
        icon:    "size-8",
        "icon-xs":  "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":  "size-7 rounded-xl",
        "icon-lg":  "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
