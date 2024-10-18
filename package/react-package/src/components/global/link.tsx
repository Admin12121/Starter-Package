import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom"; // Import Link from next/link

const DURATION = 0.25;
const STAGGER = 0.025;

export const FlipLink = ({ children, to, className }: { children: string; to: string, className?: string }) => {
  return (
    <Link to={to} className="flex items-center justify-center">
      <motion.div
        initial="initial"
        whileHover="hovered"
        className={cn("relative flex overflow-hidden whitespace-nowrap font-black", className)}
        style={{
          lineHeight: 1,
        }}
      >
        <div className="flex items-center justify-center">
          {children.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-1  flex items-center justify-center">
          {children.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
};