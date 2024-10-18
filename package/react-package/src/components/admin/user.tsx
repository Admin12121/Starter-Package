"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LogOut, UserRound, Settings } from "lucide-react";
import { ModeToggle } from "@/components/admin/mode";
import { useHandleLogout } from "@/lib/actions";

interface AccountSwitcherProps {
  isCollapsed?: boolean;
  data:any
  left?:boolean
}

export function UserNav({ isCollapsed , left=true, data}: AccountSwitcherProps) {
  const handleLogout = useHandleLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "relative h-11 w-full p-1 rounded-md flex items-center justify-start",
            isCollapsed && "h-9 w-9 p-0 justify-center"
          )}
        >
          <div className="flex items-center space-x-4">
            <Avatar
              className={cn(
                "h-9 w-9 rounded-md bg-blue-500",
                isCollapsed && "h-8 w-8 p-0"
              )}
            >
              <AvatarImage src="/logo.png" />
              <AvatarFallback className="bg-transparent">OM</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex items-start justify-start flex-col",
                isCollapsed && "hidden"
              )}
            >
              <p className="text-sm font-medium text-muted-foreground leading-none">
                {data?.user_name}
              </p>
              <p className="text-xs text-zinc-600">{data?.email}</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "w-56 dark:bg-muted border-0 outline-0",
          isCollapsed && "relative", left ? "left-4" : "-top-2"
        )}
        align="end"
        forceMount
      >
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 hover:dark:!bg-neutral-900">
            <UserRound className="w-4 h-4" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 hover:dark:!bg-neutral-900">
            <Settings className="w-4 h-4" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <ModeToggle/>
          <DropdownMenuItem className="gap-2 hover:!bg-destructive/15 hover:!text-red-500 cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
