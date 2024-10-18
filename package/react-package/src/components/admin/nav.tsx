import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { getToken } from "@/api/service/localStorageServices";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavProps {
  isCollapsed: boolean
  className?: string
  side?:any
  links: {
    title: string
    label?: string
    icon: LucideIcon
    href?: string
    variant: "default" | "ghost"
    prefetch?: boolean;
    auth: ("admin" | "superadmin" | "member")[]
    className?: string
  }[]
}

export function Nav({ links, side="right", isCollapsed, className }: NavProps) {
  const { user_role } = getToken();

  const filteredLinks = links.filter(link => {
    if (!user_role) return link.auth.includes("member");
    return link.auth.includes(user_role as "admin" | "superadmin" | "member");
  });

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn("group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2")}
    >
      <nav className={cn("grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2", className)}>
        {filteredLinks.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={link.href || "#"}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side={side} className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to={link.href || "#"}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <link.icon className={cn("mr-2 h-4 w-4", link.className)} />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}